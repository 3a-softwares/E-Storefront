/**
 * Server-side Logger with file system support
 * For frontend apps, use logger.client.ts instead
 */

import { LogLevel } from '@3asoftwares/types';

// Lazy-load fs and path to avoid issues in serverless environments
let fs: typeof import('fs') | null = null;
let path: typeof import('path') | null = null;

const getFs = () => {
  if (!fs) {
    try {
      fs = require('fs');
    } catch {
      fs = null;
    }
  }
  return fs;
};

const getPath = () => {
  if (!path) {
    try {
      path = require('path');
    } catch {
      path = null;
    }
  }
  return path;
};

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  data?: any;
  context?: string;
}

// Log level priority for filtering
const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
  [LogLevel.DEBUG]: 0,
  [LogLevel.INFO]: 1,
  [LogLevel.WARN]: 2,
  [LogLevel.ERROR]: 3,
};

export class Logger {
  private static logs: LogEntry[] = [];
  private static maxLogs = 1000;
  private static enableConsole = true;
  private static enableFile = false;
  private static logFilePath = 'logs/app.log';
  private static logLevel: LogLevel = LogLevel.DEBUG;

  private static getLogFilePath(): string {
    const p = getPath();
    return p ? p.join(process.cwd(), this.logFilePath) : this.logFilePath;
  }

  static configure(options: {
    maxLogs?: number;
    enableConsole?: boolean;
    enableFile?: boolean;
    logFilePath?: string;
    logLevel?: LogLevel | string;
  }) {
    if (options.maxLogs !== undefined) this.maxLogs = options.maxLogs;
    if (options.enableConsole !== undefined) this.enableConsole = options.enableConsole;
    if (options.enableFile !== undefined) this.enableFile = options.enableFile;
    if (options.logFilePath) this.logFilePath = options.logFilePath;
    if (options.logLevel) {
      const level =
        typeof options.logLevel === 'string'
          ? (options.logLevel.toUpperCase() as LogLevel)
          : options.logLevel;
      if (Object.values(LogLevel).includes(level)) {
        this.logLevel = level;
      }
    }
  }

  private static shouldLog(level: LogLevel): boolean {
    return LOG_LEVEL_PRIORITY[level] >= LOG_LEVEL_PRIORITY[this.logLevel];
  }

  private static addLog(entry: LogEntry) {
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) this.logs.shift();

    if (this.enableFile) {
      const fsModule = getFs();
      const pathModule = getPath();
      if (fsModule && pathModule) {
        const filePath = this.getLogFilePath();
        fsModule.mkdirSync(pathModule.dirname(filePath), { recursive: true });
        fsModule.appendFileSync(filePath, JSON.stringify(entry) + '\n');
      }
    }
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
    // Check if this log level should be logged based on configured level
    if (!this.shouldLog(level)) return;

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
    const fsModule = getFs();
    const filePath = this.getLogFilePath();
    if (this.enableFile && fsModule && fsModule.existsSync(filePath)) {
      fsModule.unlinkSync(filePath);
    }
  }
}
