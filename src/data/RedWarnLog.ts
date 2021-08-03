import { RW_LOG_SIGNATURE } from "rww/data/RedWarnConstants";

export enum LogLevel {
    Trace,
    Debug,
    Info,
    Warn,
    Error,
    Fatal,
}

interface LogEntry {
    date: number;
    level: LogLevel;
    message: string;
    data: Record<string, any>;
}

export default class Log {
    private static readonly startTime = Date.now();
    static logs: LogEntry[] = [];
    static logLevel =
        process.env.NODE_ENV === "production" ? LogLevel.Warn : LogLevel.Trace;

    private static log(level: LogLevel, message: string, ...data: any[]) {
        const parts = [];
        if (Log.logLevel === LogLevel.Trace)
            parts.push(`[${Date.now() - Log.startTime}ms] `);
        parts.push(`[${RW_LOG_SIGNATURE}] `);
        parts.push(`[${LogLevel[level].toUpperCase()}] `);
        parts.push(message);

        if (level >= Log.logLevel)
            console[
                level > LogLevel.Warn
                    ? "error"
                    : level == LogLevel.Warn
                    ? "warn"
                    : "log"
            ](
                ...(data.length > 0
                    ? [parts.join(""), ...data]
                    : [parts.join("")])
            );

        Log.logs.push({
            date: Date.now(),
            level: level,
            message: message,
            data: data,
        });
    }

    static trace(message: string | any, data?: Record<string, any>) {
        Log.log(LogLevel.Trace, message, data);
    }

    static debug(message: string | any, data?: Record<string, any>) {
        Log.log(LogLevel.Debug, message, data);
    }

    static info(message: string | any, data?: Record<string, any>) {
        Log.log(LogLevel.Info, message, data);
    }

    static warn(message: string | any, data?: Record<string, any>) {
        Log.log(LogLevel.Warn, message, data);
    }

    static error(message: string | any, data?: Record<string, any>) {
        Log.log(LogLevel.Error, message, data);
    }

    static fatal(message: string | any, data?: Record<string, any>) {
        Log.log(LogLevel.Fatal, message, data);
    }
}
