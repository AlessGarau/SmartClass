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

    for (let rowIndex = 1; rowIndex < jsonData.length; rowIndex++) {
      const row = jsonData[rowIndex];

      if (!row || row.length === 0 || row.every(cell => !cell)) {
        continue;
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

        const [day, month, year] = validatedLesson.date.split("/").map(Number);
        const [startHour, startMinute] = validatedLesson.startTime.split(":").map(Number);
        const [endHour, endMinute] = validatedLesson.endTime.split(":").map(Number);

        const startDateTime = new Date(year, month - 1, day, startHour, startMinute, 0);
        const endDateTime = new Date(year, month - 1, day, endHour, endMinute, 0);

        if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
          errors.push({
            row: rowIndex + 1,
            field: "date/time",
            message: "Invalid date or time format",
          });
          continue;
        }

        if (endDateTime <= startDateTime) {
          errors.push({
            row: rowIndex + 1,
            field: "end_time",
            message: "End time must be after start time",
          });
          continue;
        }

        const classEntity = await this.classRepository.getClassByName(validatedLesson.className);
        if (!classEntity) {
          errors.push({
            row: rowIndex + 1,
            field: "class_name",
            message: `Class "${validatedLesson.className}" not found`,
          });
          continue;
        }

        let teacherId: string | null = null;
        if (validatedLesson.teacherName && validatedLesson.teacherName.trim()) {
          const nameParts = validatedLesson.teacherName.trim().split(" ");
          if (nameParts.length >= 2) {
            const firstName = nameParts[0];
            const lastName = nameParts.slice(1).join(" ");
            const teacher = await this.userRepository.findTeacherByName(firstName, lastName);
            if (teacher) {
              teacherId = teacher.id;
            } else {
              errors.push({
                row: rowIndex + 1,
                field: "teacher_name",
                message: `Teacher "${validatedLesson.teacherName}" not found`,
              });
            }
          }
        }

        const overlappingLessons = await this.lessonRepository.findOverlappingLessons(
          classEntity.id,
          startDateTime,
          endDateTime,
        );

        const lessonsToDelete = overlappingLessons.filter(lesson => !lesson.room_id);
        for (const lessonToDelete of lessonsToDelete) {
          await this.lessonRepository.deleteLesson(lessonToDelete.id);
        }

        const lessonsWithRoom = overlappingLessons.filter(lesson => lesson.room_id);
        
        let lessonCreated = false;
        
        if (lessonsWithRoom.length > 0) {
          if (lessonsWithRoom.length > 1) {
            errors.push({
              row: rowIndex + 1,
              field: "time",
              message: "Multiple lessons with rooms overlap this time slot. Using the first one.",
            });
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
            const updateData: any = {};
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
            
            updatedCount++;
            
            if (!earliestDate || startDateTime < earliestDate) {
              earliestDate = startDateTime;
            }
            if (!latestDate || endDateTime > latestDate) {
              latestDate = endDateTime;
            }
          } else {
            skippedCount++;
          }
          
          lessonCreated = true;
        }

        if (!lessonCreated) {
          const newLesson = await this.lessonRepository.createLesson({
            title: validatedLesson.title,
            startTime: startDateTime,
            endTime: endDateTime,
            classId: classEntity.id,
            roomId: null,
          });
          if (teacherId) {
            await this.lessonRepository.updateLessonTeacher(newLesson.id, teacherId);
          }
          importedCount++;
        }

        if (!earliestDate || startDateTime < earliestDate) {
          earliestDate = startDateTime;
        }
        if (!latestDate || endDateTime > latestDate) {
          latestDate = endDateTime;
        }
      } catch (error) {
        if (error instanceof Error) {
          errors.push({
            row: rowIndex + 1,
            message: error.message,
          });
        }
      }
    }

    let optimizationStatus = undefined;
    
    if ((importedCount > 0 || updatedCount > 0) && earliestDate && latestDate) {
      try {
        await this.optimizationService.optimizeDateRange(earliestDate, latestDate);
        optimizationStatus = { status: "success" as const };
      } catch (error) {
        console.error("Failed to optimize date range after lesson import:", error);
        optimizationStatus = {
          status: "failed" as const,
          error: error instanceof Error ? error.message : "Unknown optimization error",
        };
      }
    }

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

  private getBuildingLabel(buildingCode: string): string {
    const buildingMap: Record<string, string> = {
      "batA": "Bâtiment A",
      "batB": "Bâtiment B",
      "batC": "Bâtiment C",
    };

    return buildingMap[buildingCode] || buildingCode;
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
}