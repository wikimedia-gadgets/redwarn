export type RedWarnHookEvent =
    RedWarnPreInitializationEvent |
    RedWarnInitializationEvent |
    RedWarnPostInitializationEvent;

interface RedWarnHookEventBase {
    type: string;
    payload: Record<string, any>;
}

interface RedWarnPreInitializationEvent extends RedWarnHookEventBase {
    type: "preinit",
    payload: { test: string }
}

interface RedWarnInitializationEvent extends RedWarnHookEventBase {
    type: "init",
    payload: { testB: number }
}

interface RedWarnPostInitializationEvent extends RedWarnHookEventBase {
    type: "postinit",
    payload: undefined
}

export type RedWarnHookEventTypes = RedWarnHookEvent["type"];
export type RedWarnHook = (payload : Record<string, any>) => Promise<void> | void;


