import {RedWarnHook, RedWarnHookEventTypes} from "./RedWarnHookEvent";
import StyleManager from "rww/styles/StyleManager";
import Log from "rww/data/RedWarnLog";

declare global {
    // noinspection JSUnusedGlobalSymbols
    interface Window {
        RedWarnHooks: { [K in RedWarnHookEventTypes]?: RedWarnHook[] };
    }
}

/**
 * RedWarn Hooks
 *
 * In order to introduce integrations to RedWarn from the userscripts of other
 * Wikipedia users, RedWarn allows the registration of functions - these so-called
 * "hooks", which are called at specific events in RedWarn's execution.
 */
export default class RedWarnHooks {
    static get hooks(): typeof window.RedWarnHooks {
        return window.RedWarnHooks ?? (window.RedWarnHooks = {});
    }

    static assertHookType(hookType: RedWarnHookEventTypes): void {
        if (RedWarnHooks.hooks[hookType] === undefined) {
            RedWarnHooks.hooks[hookType] = [];
        }
    }

    static addHook<T extends RedWarnHookEventTypes>(
        hookType: T,
        hook: RedWarnHook
    ): void {
        Log.trace(`Added hook: ${hookType}`, hook);
        RedWarnHooks.assertHookType(hookType);
        (RedWarnHooks.hooks[hookType] as RedWarnHook[]).push(hook);
    }

    static removeHook<T extends RedWarnHookEventTypes>(
        hookType: T,
        hook: RedWarnHook
    ): void {
        Log.trace(`Removed hook: ${hookType}`, hook);
        RedWarnHooks.assertHookType(hookType);
        (RedWarnHooks.hooks[hookType] as RedWarnHook[]).filter(
            (h) => h !== hook
        );
    }

    static async executeHooks<T extends RedWarnHookEventTypes>(
        hookType: T,
        payload: Record<string, any> = {}
    ): Promise<void> {
        Log.debug(`Executing hook: ${hookType}`);
        RedWarnHooks.assertHookType(hookType);

        if (StyleManager.activeStyle?.hooks?.[hookType])
            for (const hook of StyleManager.activeStyle.hooks[
                hookType
            ] as RedWarnHook[]) {
                const result = hook(payload);
                if (result instanceof Promise) {
                    try {
                        await result;
                    } catch (e) {
                        Log.error(`Hook failed for style: ${hookType}`, {
                            type: hookType,
                            hook: hook,
                            paylod: payload
                        });
                    }
                }
            }

        for (const hook of RedWarnHooks.hooks[hookType] as RedWarnHook[]) {
            const result = hook(payload);
            if (result instanceof Promise) {
                try {
                    await result;
                } catch (e) {
                    Log.error(`Internal hook failed: ${hookType}`, {
                        type: hookType,
                        hook: hook,
                        paylod: payload
                    });
                }
            }
        }

        document.dispatchEvent(
            new Event(`redwarn:${hookType}`, { payload: payload } as Record<
                string,
                any
            >)
        );
    }
}
