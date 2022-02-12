import { RW_LOG_SIGNATURE } from "rww/data/RedWarnConstants";

declare global {
    interface Window {
        rw_debug: boolean;
    }
}

export enum LogLevel {
    Trace,
    Debug,
    Info,
    Warn,
    Error,
    Fatal,
}

interface LogEntry {
    tOffset: number;
    level: LogLevel;
    message: string;
    data: Record<string, any>;
    stack?: string;
}

interface LogDump {
    startTime: number;
    entries: LogEntry[];
}

export default class Log {
    private static readonly startTime = Date.now();
    static entries: LogEntry[] = [];
    static logLevel =
        process.env.NODE_ENV === "production"
            ? (window.rw_debug ? LogLevel.Trace : LogLevel.Warn)
            : LogLevel.Trace;

    private static log(level: LogLevel, message: string, ...data: any[]) {
        const tOffset = Date.now() - Log.startTime;
        const parts = [];

        if (Log.logLevel === LogLevel.Trace) parts.push(`[${tOffset}ms] `);
        parts.push(`[${RW_LOG_SIGNATURE}] `);
        parts.push(`[${LogLevel[level].toUpperCase()}] `);
        parts.push(message);

        if (data[0] === undefined) data = [];
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

        Log.entries.push({
            tOffset: tOffset,
            level,
            message,
            data: data.map((v) => {
                if (v instanceof Error)
                    return {
                        stack: v.stack,
                        message: v.message,
                        name: v.name
                    };
                else return v;
            }),
            stack: level > LogLevel.Info ? new Error().stack : undefined
        });
    }

    static dump(): LogDump {
        return {
            startTime: Log.startTime,
            entries: Log.entries
        };
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
