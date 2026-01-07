import { LogLevel } from '3a-ecommerce-types';

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  data?: any;
  context?: string;
}

/**
 * Client-safe Logger for frontend applications
 * Uses console only, no file system access
 */
export class Logger {
  private static logs: LogEntry[] = [];
  private static maxLogs = 1000;
  private static enableConsole = true;

  static configure(options: { maxLogs?: number; enableConsole?: boolean }) {
    if (options.maxLogs !== undefined) this.maxLogs = options.maxLogs;
    if (options.enableConsole !== undefined) this.enableConsole = options.enableConsole;
  }

  private static addLog(entry: LogEntry) {
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) this.logs.shift();
  }

  private static format(entry: LogEntry) {
    return `[${entry.timestamp}] [${entry.level}]${entry.context ? ` [${entry.context}]` : ''}: ${
      entry.message
    }`;
  }

  static debug(message: string, data?: any, context?: string) {
    this.log(LogLevel.DEBUG, message, data, context);
  }

  static info(message: string, data?: any, context?: string) {
    this.log(LogLevel.INFO, message, data, context);
  }

  static warn(message: string, data?: any, context?: string) {
    this.log(LogLevel.WARN, message, data, context);
  }

  static error(message: string, error?: any, context?: string) {
    this.log(LogLevel.ERROR, message, error, context);
  }

  private static log(level: LogLevel, message: string, data?: any, context?: string) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      data,
      context,
    };

    this.addLog(entry);

    if (!this.enableConsole) return;

    const formatted = this.format(entry);

    switch (level) {
      case LogLevel.ERROR:
        console.error(formatted, data ?? '');
        break;
      case LogLevel.WARN:
        console.warn(formatted, data ?? '');
        break;
      case LogLevel.INFO:
        console.info(formatted, data ?? '');
        break;
      default:
        console.debug(formatted, data ?? '');
    }
  }

  static getLogs(level?: LogLevel): LogEntry[] {
    return level ? this.logs.filter((l) => l.level === level) : [...this.logs];
  }

  static clearLogs() {
    this.logs = [];
  }
}
