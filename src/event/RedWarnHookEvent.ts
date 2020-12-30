export type RedWarnHookEvent =
    | RedWarnPreInitializationEvent
    | RedWarnInitializationEvent
    | RedWarnPostInitializationEvent
    | RedWarnPreUIInjectionEvent
    | RedWarnPostUIInjectionEvent;

interface RedWarnHookEventBase {
    type: string;
    payload?: Record<string, any>;
}

export interface RedWarnPreInitializationEvent extends RedWarnHookEventBase {
    type: "preInit";
    payload: undefined;
}

export interface RedWarnInitializationEvent extends RedWarnHookEventBase {
    type: "init";
    payload: undefined;
}

export interface RedWarnPostInitializationEvent extends RedWarnHookEventBase {
    type: "postInit";
    payload: undefined;
}

export interface RedWarnPreUIInjectionEvent extends RedWarnHookEventBase {
    type: "preUIInject";
    payload: undefined;
}

export interface RedWarnPostUIInjectionEvent extends RedWarnHookEventBase {
    type: "postUIInject";
    payload: undefined;
}

export type RedWarnHookEventTypes = RedWarnHookEvent["type"];
export type RedWarnHook = (
    payload: Record<string, any>
) => Promise<void> | void;
export type RedWarnHookTyped<T extends RedWarnHookEvent> = (
    payload: (RedWarnHook & { payload: T["payload"] })["payload"]
) => Promise<void> | void;
