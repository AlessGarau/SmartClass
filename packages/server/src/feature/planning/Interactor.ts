import { Service } from "typedi";
import type { IPlanningInteractor, WeeklyPlanningFilters } from "./interface/IInteractor";
import { PlanningError } from "./../../middleware/error/planningError";
import { RoomRepository } from "../room/Repository";
import { LessonRepository } from "../lesson/Repository";
import { ClassRepository } from "../class/Repository";
import { UserRepository } from "../user/Repository";
import { RoomError } from "../../middleware/error/roomError";
import { LessonError } from "../../middleware/error/lessonError";
import { WeeklyPlanningData, ImportResult, ImportError, ImportedLesson, ImportedLessonSchema, PlanningFilterOptions } from "./validate";
import { readFileSync } from "fs";
import { join } from "path";
import * as XLSX from "xlsx";
import { OptimizationService } from "../../services/OptimizationService";
import { parseISO, startOfDay, endOfDay } from "date-fns";

interface HeaderIndices {
  title: number;
  date: number;
  startTime: number;
  endTime: number;
  className: number;
  teacherName: number;
}

interface ParsedExcelData {
  headers: string[];
  headerIndices: HeaderIndices;
  rows: (string | number | null)[][];
}

interface LessonUpdateData {
  title?: string;
  startTime?: Date;
  endTime?: Date;
}

@Service()
export class PlanningInteractor implements IPlanningInteractor {
  constructor(
    private roomRepository: RoomRepository,
    private lessonRepository: LessonRepository,
    private classRepository: ClassRepository,
    private userRepository: UserRepository,
    private optimizationService: OptimizationService,
  ) { }

  async getWeeklyPlanning(filters: WeeklyPlanningFilters): Promise<WeeklyPlanningData> {
    const startDate = startOfDay(parseISO(filters.startDate));
    const endDate = endOfDay(parseISO(filters.endDate));

    const rooms = await this.roomRepository.getRooms({
      isEnabled: true,
      building: filters.building,
      floor: filters.floor,
    });

    if (!rooms) {
      throw RoomError.notFound();
    }

    const roomIds = rooms.map(room => room.id);
    const lessons = await this.lessonRepository.getLessonsBetween(
      startDate,
      endDate,
      filters.building || filters.floor !== undefined ? roomIds : undefined,
    );

    if (!lessons) {
      throw LessonError.notFound();
    }

    return {
      lessons,
      rooms,
      startDate,
      endDate,
      year: filters.year,
    };
  }

  async getLessonTemplate(): Promise<Buffer> {
    const templatePath = join(__dirname, "../../templates/lesson_import_template.xlsx");
    const templateContent = readFileSync(templatePath);
    return templateContent;
  }

  async importLessonsFromTemplate(fileBuffer: Buffer): Promise<ImportResult> {
    const errors: ImportError[] = [];
    let importedCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;
    let earliestDate: Date | null = null;
    let latestDate: Date | null = null;

    const { headerIndices, rows } = this.parseExcelFile(fileBuffer);

    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
      const result = await this.processLessonRow(rows[rowIndex], headerIndices, rowIndex);
      
      if (!result.processed) {
        continue;
      }

      if (result.error) {
        errors.push(result.error);
      }

      if (result.imported) {
        importedCount++;
      } else if (result.updated) {
        updatedCount++;
      } else if (result.skipped) {
        skippedCount++;
      }

      if (result.startDateTime && result.endDateTime) {
        const dates = this.updateDateRange(result.startDateTime, result.endDateTime, earliestDate, latestDate);
        earliestDate = dates.earliestDate;
        latestDate = dates.latestDate;
      }
    }

    const optimizationStatus = (importedCount > 0 || updatedCount > 0) 
      ? await this.runOptimization(earliestDate, latestDate)
      : undefined;

    return {
      importedCount,
      updatedCount,
      skippedCount,
      errors,
      optimization: optimizationStatus,
    };
  }

  async getFilterOptions(): Promise<PlanningFilterOptions> {
    const [distinctBuildings, distinctFloors] = await Promise.all([
      this.roomRepository.getDistinctBuildings(),
      this.roomRepository.getDistinctFloors(),
    ]);

    const buildings = distinctBuildings.map(building => ({
      value: building,
      label: this.getBuildingLabel(building),
    }));

    const floors = distinctFloors.map(floor => ({
      value: floor,
      label: `Étage ${floor}`,
    }));

    return {
      buildings,
      floors,
    };
  }

  async deleteLesson(lessonId: string): Promise<void> {
    const lesson = await this.lessonRepository.getLessonById(lessonId);

    if (!lesson) {
      throw LessonError.notFound();
    }

    await this.lessonRepository.deleteLesson(lessonId);

    const startOfWeek = new Date(lesson.start_time);
    startOfWeek.setHours(0, 0, 0, 0);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 4);
    endOfWeek.setHours(23, 59, 59, 999);

    try {
      await this.optimizationService.optimizeDateRange(startOfWeek, endOfWeek);
    } catch (error) {
      console.error("Failed to optimize planning after lesson deletion:", error);
    }
  }

  private parseExcelFile(fileBuffer: Buffer): ParsedExcelData {
    const workbook = XLSX.read(fileBuffer, { type: "buffer" });
    if (workbook.SheetNames.length === 0) {
      throw PlanningError.invalidFileFormat("Workbook contains no worksheets");
    }
    
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    if (!worksheet) {
      throw PlanningError.invalidFileFormat(`Worksheet "${sheetName}" not found`);
    }

    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as (string | number | null)[][];
    if (jsonData.length < 2) {
      throw PlanningError.invalidFileFormat("Excel file is empty or has no data rows");
    }

    const headers = jsonData[0] as string[];
    const expectedHeaders = ["Titre", "Date", "Début", "Fin", "Promotion", "Professeur"];
    const missingHeaders = expectedHeaders.filter(header => !headers.includes(header));
    
    if (missingHeaders.length > 0) {
      throw PlanningError.invalidFileFormat(`Missing required columns: ${missingHeaders.join(", ")}`);
    }

    const headerIndices = {
      title: headers.indexOf("Titre"),
      date: headers.indexOf("Date"),
      startTime: headers.indexOf("Début"),
      endTime: headers.indexOf("Fin"),
      className: headers.indexOf("Promotion"),
      teacherName: headers.indexOf("Professeur"),
    };

    return {
      headers,
      headerIndices,
      rows: jsonData.slice(1),
    };
  }

  private parseLessonDates(validatedLesson: ImportedLesson): { startDateTime: Date; endDateTime: Date } | null {
    const [day, month, year] = validatedLesson.date.split("/").map(Number);
    const [startHour, startMinute] = validatedLesson.startTime.split(":").map(Number);
    const [endHour, endMinute] = validatedLesson.endTime.split(":").map(Number);

    const startDateTime = new Date(year, month - 1, day, startHour, startMinute, 0);
    const endDateTime = new Date(year, month - 1, day, endHour, endMinute, 0);

    if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
      return null;
    }

    return { startDateTime, endDateTime };
  }

  private async findTeacherByName(teacherName: string | null | undefined): Promise<string | null> {
    if (!teacherName?.trim()) {
      return null;
    }

    const nameParts = teacherName.trim().split(" ");
    if (nameParts.length < 2) {
      return null;
    }

    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ");
    const teacher = await this.userRepository.findTeacherByName(firstName, lastName);
    
    return teacher?.id || null;
  }

  private updateDateRange(
    startDateTime: Date,
    endDateTime: Date,
    earliestDate: Date | null,
    latestDate: Date | null,
  ): { earliestDate: Date | null; latestDate: Date | null } {
    return {
      earliestDate: !earliestDate || startDateTime < earliestDate ? startDateTime : earliestDate,
      latestDate: !latestDate || endDateTime > latestDate ? endDateTime : latestDate,
    };
  }

  private async createLesson(
    title: string,
    startDateTime: Date,
    endDateTime: Date,
    classId: string,
    teacherId: string | null,
  ): Promise<void> {
    const newLesson = await this.lessonRepository.createLesson({
      title,
      startTime: startDateTime,
      endTime: endDateTime,
      classId,
      roomId: null,
    });
    
    if (teacherId) {
      await this.lessonRepository.updateLessonTeacher(newLesson.id, teacherId);
    }
  }

  private async runOptimization(
    earliestDate: Date | null,
    latestDate: Date | null,
  ): Promise<{ status: "success" | "failed"; error?: string } | undefined> {
    if (!earliestDate || !latestDate) {
      return undefined;
    }

    try {
      await this.optimizationService.optimizeDateRange(earliestDate, latestDate);
      return { status: "success" };
    } catch (error) {
      console.error("Failed to optimize date range after lesson import:", error);
      return {
        status: "failed",
        error: error instanceof Error ? error.message : "Unknown optimization error",
      };
    }
  }

  private async processLessonRow(
    row: (string | number | null)[],
    headerIndices: HeaderIndices,
    rowIndex: number,
  ): Promise<{
    error?: ImportError;
    processed: boolean;
    imported?: boolean;
    updated?: boolean;
    skipped?: boolean;
    startDateTime?: Date;
    endDateTime?: Date;
  }> {
    if (!row || row.length === 0 || row.every(cell => !cell)) {
      return { processed: false };
    }

    try {
      const lessonData: ImportedLesson = {
        title: row[headerIndices.title]?.toString() || "",
        date: row[headerIndices.date]?.toString() || "",
        startTime: row[headerIndices.startTime]?.toString() || "",
        endTime: row[headerIndices.endTime]?.toString() || "",
        className: row[headerIndices.className]?.toString() || "",
        teacherName: row[headerIndices.teacherName]?.toString() || "",
      };

      const validatedLesson = ImportedLessonSchema.parse(lessonData);

      const dates = this.parseLessonDates(validatedLesson);
      if (!dates) {
        return {
          processed: true,
          error: {
            row: rowIndex + 2,
            field: "date/time",
            message: "Invalid date or time format",
          },
        };
      }

      const { startDateTime, endDateTime } = dates;

      if (endDateTime <= startDateTime) {
        return {
          processed: true,
          error: {
            row: rowIndex + 2,
            field: "end_time",
            message: "End time must be after start time",
          },
        };
      }

      const classEntity = await this.classRepository.getClassByName(validatedLesson.className);
      if (!classEntity) {
        return {
          processed: true,
          error: {
            row: rowIndex + 2,
            field: "class_name",
            message: `Class "${validatedLesson.className}" not found`,
          },
        };
      }

      const teacherId = await this.findTeacherByName(validatedLesson.teacherName);
      let teacherError: ImportError | undefined;
      if (validatedLesson.teacherName?.trim() && !teacherId) {
        teacherError = {
          row: rowIndex + 2,
          field: "teacher_name",
          message: `Teacher "${validatedLesson.teacherName}" not found`,
        };
      }

      const overlappingLessons = await this.lessonRepository.findOverlappingLessons(
        classEntity.id,
        startDateTime,
        endDateTime,
      );

      const overlapResult = await this.handleOverlappingLessons(
        overlappingLessons,
        validatedLesson,
        startDateTime,
        endDateTime,
        teacherId,
        rowIndex,
      );

      if (!overlapResult.lessonHandled) {
        await this.createLesson(
          validatedLesson.title,
          startDateTime,
          endDateTime,
          classEntity.id,
          teacherId,
        );
        
        return {
          processed: true,
          imported: true,
          startDateTime,
          endDateTime,
          error: teacherError || overlapResult.error,
        };
      }

      return {
        processed: true,
        updated: overlapResult.updated,
        skipped: overlapResult.skipped,
        startDateTime: overlapResult.updated ? startDateTime : undefined,
        endDateTime: overlapResult.updated ? endDateTime : undefined,
        error: teacherError || overlapResult.error,
      };
    } catch (error) {
      return {
        processed: true,
        error: {
          row: rowIndex + 2,
          message: error instanceof Error ? error.message : "Unknown error",
        },
      };
    }
  }

  private async handleOverlappingLessons(
    overlappingLessons: Array<{ id: string; room_id: string | null; title: string; start_time: Date; end_time: Date }>,
    validatedLesson: ImportedLesson,
    startDateTime: Date,
    endDateTime: Date,
    teacherId: string | null,
    rowIndex: number,
  ): Promise<{
    lessonHandled: boolean;
    updated: boolean;
    skipped: boolean;
    error?: ImportError;
  }> {
    // Delete lessons without rooms
    const lessonsToDelete = overlappingLessons.filter(lesson => !lesson.room_id);
    for (const lessonToDelete of lessonsToDelete) {
      await this.lessonRepository.deleteLesson(lessonToDelete.id);
    }

    const lessonsWithRoom = overlappingLessons.filter(lesson => lesson.room_id);
    
    if (lessonsWithRoom.length === 0) {
      return { lessonHandled: false, updated: false, skipped: false };
    }

    let error: ImportError | undefined;
    if (lessonsWithRoom.length > 1) {
      error = {
        row: rowIndex + 2,
        field: "time",
        message: "Multiple lessons with rooms overlap this time slot. Using the first one.",
      };
    }
    
    const lessonToUpdate = lessonsWithRoom[0];
    
    // Check if there are actual changes
    const hasTimeChanged = lessonToUpdate.start_time.getTime() !== startDateTime.getTime() || 
                          lessonToUpdate.end_time.getTime() !== endDateTime.getTime();
    const hasTitleChanged = lessonToUpdate.title !== validatedLesson.title;
    
    // Get current teacher to check if it changed
    const lessonWithRelations = await this.lessonRepository.getLessonWithRelations(lessonToUpdate.id);
    const currentTeacherId = lessonWithRelations?.users?.[0]?.id;
    const hasTeacherChanged = teacherId && teacherId !== currentTeacherId;
    
    if (hasTimeChanged || hasTitleChanged || hasTeacherChanged) {
      // There are changes - update the lesson
      const updateData: LessonUpdateData = {};
      if (hasTimeChanged) {
        updateData.startTime = startDateTime;
        updateData.endTime = endDateTime;
      }
      if (hasTitleChanged) {
        updateData.title = validatedLesson.title;
      }
      
      if (Object.keys(updateData).length > 0) {
        await this.lessonRepository.updateLesson(lessonToUpdate.id, updateData);
      }
      
      if (hasTeacherChanged && teacherId) {
        await this.lessonRepository.updateLessonTeacher(lessonToUpdate.id, teacherId);
      }
      
      return { lessonHandled: true, updated: true, skipped: false, error };
    } else {
      return { lessonHandled: true, updated: false, skipped: true, error };
    }
  }

  private getBuildingLabel(buildingCode: string): string {
    const buildingMap: Record<string, string> = {
      "batA": "Bâtiment A",
      "batB": "Bâtiment B",
      "batC": "Bâtiment C",
    };

    return buildingMap[buildingCode] || buildingCode;
  }

}