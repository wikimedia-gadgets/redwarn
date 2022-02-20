import { RW_LOG_SIGNATURE } from "rww/data/RedWarnConstants";
import RedWarnLocalDB from "rww/data/database/RedWarnLocalDB";
import { RWFormattedError } from "rww/errors/RWError";

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
            ? window.rw_debug
                ? LogLevel.Trace
                : LogLevel.Warn
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
                    : level === LogLevel.Info
                    ? "info"
                    : "log"
            ](
                ...(data.length > 0
                    ? [parts.join(""), ...data]
                    : [parts.join("")])
            );

        const logData = {
            tOffset: tOffset,
            level,
            message,
            data: data.map((v) => {
                if (v instanceof Error)
                    return {
                        stack: v.stack,
                        message: v.message,
                        name: v.name,
                    };
                else return v;
            }),
            stack: level > LogLevel.Info ? new Error().stack : undefined,
        };
        Log.entries.push(logData);

        if (logData.level > LogLevel.Warn) {
            // TODO i18n
            Log.info(
                'If you would like to report this to the developers, please run "btoa(JSON.stringify(rw.Log.dump()))" in this console.'
            );

            const now = Date.now();
            RedWarnLocalDB.i.errorLog.add({
                id: `${now}`,
                timestamp: now / 1000,
                code:
                    data.filter((v) => v instanceof RWFormattedError)[0].code ??
                    0,
                data: logData,
            });
        }
    }

    static dump(): LogDump {
        return {
            startTime: Log.startTime,
            entries: Log.entries,
        };
    }

    static trace(message: string, data?: Record<string, any>) {
        Log.log(LogLevel.Trace, message, data);
    }

    static debug(message: string, data?: Record<string, any>) {
        Log.log(LogLevel.Debug, message, data);
    }

    static info(message: string, data?: Record<string, any>) {
        Log.log(LogLevel.Info, message, data);
    }

    static warn(message: string, data?: Record<string, any>) {
        Log.log(LogLevel.Warn, message, data);
    }

    static error(message: string, data?: Record<string, any>) {
        Log.log(LogLevel.Error, message, data);
    }

    static fatal(message: string, data?: Record<string, any>) {
        Log.log(LogLevel.Fatal, message, data);
    }
}
