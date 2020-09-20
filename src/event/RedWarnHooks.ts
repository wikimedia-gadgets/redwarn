import {RedWarnHook, RedWarnHookEventTypes} from "./RedWarnHookEvent";

export default class RedWarnHooks {

    static hooks: {
        [K in RedWarnHookEventTypes]? : RedWarnHook[]
    } = {};

    static assertHookType(hookType : RedWarnHookEventTypes) : void {
        if (RedWarnHooks.hooks[hookType] === undefined)
            RedWarnHooks.hooks[hookType] = [];
    }

    static addHook<T extends RedWarnHookEventTypes>(hookType : T, hook : RedWarnHook) : void {
        (RedWarnHooks.hooks[hookType] as RedWarnHook[]).push(hook);
    }

    static removeHook<T extends RedWarnHookEventTypes>(hookType : T, hook : RedWarnHook) : void {
        (RedWarnHooks.hooks[hookType] as RedWarnHook[]).filter(h => h !== hook);
    }

    static async executeHooks<T extends RedWarnHookEventTypes>(
        hookType : T,
        payload : Record<string, any> = {}
    ) : Promise<void> {
        for (const hook of (RedWarnHooks.hooks[hookType] as RedWarnHook[])) {
            const result = hook(payload);
            if (result instanceof Promise) await result;
        }
    }


}