import { Service } from "typedi";
import * as cron from "node-cron";
import { OptimizationService } from "./OptimizationService";
import { addDays, startOfWeek, setHours, setMinutes, setSeconds } from "date-fns";

@Service()
export class SchedulerService {
  private tasks: Map<string, cron.ScheduledTask> = new Map();
  private isEnabled: boolean;
  private cronExpression: string;

  constructor(
    private optimizationService: OptimizationService,
  ) {
    this.isEnabled = process.env.ENABLE_SCHEDULED_OPTIMIZATION !== "false";
    this.cronExpression = process.env.WEEKLY_OPTIMIZATION_CRON || "0 2 * * 0";
  }

  initialize() {
    if (!this.isEnabled) {
      console.log("Scheduled optimization is disabled");
      return;
    }

    this.scheduleWeeklyOptimization();
    console.log(`Scheduler service initialized with cron expression: ${this.cronExpression}`);
  }

  private scheduleWeeklyOptimization() {
    if (!cron.validate(this.cronExpression)) {
      console.error(`Invalid cron expression: ${this.cronExpression}`);
      return;
    }

    const task = cron.schedule(this.cronExpression, async () => {
      console.log("Starting weekly optimization...");
      
      try {
        const { startDate, endDate } = this.getNextWeekDateRange();
        
        const result = await this.optimizationService.optimizeDateRange(startDate, endDate);
        
        console.log(
          `Weekly optimization completed successfully for ${startDate.toISOString()} to ${endDate.toISOString()}`,
          {
            lessonsOptimized: result.lessonsOptimized,
            status: result.status,
          },
        );
      } catch (error) {
        console.error("Weekly optimization failed:", error);
      }
    });

    this.tasks.set("weekly-optimization", task);
    task.start();
    console.log("Weekly optimization task scheduled and started");
  }

  private getNextWeekDateRange() {
    const today = new Date();
    const nextMonday = addDays(startOfWeek(today, { weekStartsOn: 1 }), 7);
    const startDate = setSeconds(setMinutes(setHours(nextMonday, 0), 0), 0);
    
    const nextFriday = addDays(nextMonday, 4);
    const endDate = setSeconds(setMinutes(setHours(nextFriday, 23), 59), 59);
    
    return { startDate, endDate };
  }

  async runOptimizationNow() {
    if (!this.optimizationService) {
      throw new Error("Optimization service not available");
    }

    console.log("Running manual optimization for next week...");
    
    const { startDate, endDate } = this.getNextWeekDateRange();
    
    try {
      const result = await this.optimizationService.optimizeDateRange(startDate, endDate);
      
      console.log(
        `Manual optimization completed for ${startDate.toISOString()} to ${endDate.toISOString()}`,
        {
          lessonsOptimized: result.lessonsOptimized,
          status: result.status,
        },
      );
      
      return {
        success: true,
        result,
        dateRange: {
          start: startDate.toISOString(),
          end: endDate.toISOString(),
        },
        error: null,
      };
    } catch (error) {
      console.error("Manual optimization failed:", error);
      
      return {
        success: false,
        result: null,
        error: error instanceof Error ? error.message : "Unknown error",
        dateRange: {
          start: startDate.toISOString(),
          end: endDate.toISOString(),
        },
      };
    }
  }

  getSchedulerStatus() {
    const tasks = Array.from(this.tasks.entries()).map(([name, _task]) => ({
      name,
      running: true, // node-cron tasks are always running unless stopped
    }));

    return {
      enabled: this.isEnabled,
      cronExpression: this.cronExpression,
      tasks,
      nextWeekDateRange: this.getNextWeekDateRange(),
    };
  }

  shutdown() {
    console.log("Shutting down scheduler service...");
    this.tasks.forEach((task, name) => {
      task.stop();
      console.log(`Stopped scheduled task: ${name}`);
    });
    this.tasks.clear();
  }
}