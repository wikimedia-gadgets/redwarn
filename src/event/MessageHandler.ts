export default class MessageHandler {
    private handlers: Map<string, MessageHandlerCallback> = new Map();

    public addMessageHandler(
        msg: string,
        callback: MessageHandlerCallback
    ): void {
        this.handlers.set(msg, callback);
    }

    constructor() {
        window.addEventListener("message", (e) => {
            if (this.handlers.has(e.data)) {
                this.handlers.get(e.data)(e.data); // Execute handler if exact
            } else {
                for (const event in this.handlers.keys) {
                    if (
                        event.substr(event.length - 1) == "*" &&
                        e.data.includes(event.substr(0, event.length - 2))
                    ) {
                        // and includes w * chopped off
                        this.handlers.get(event)(e.data);
                        return;
                    } // if contains and ends with wildcard then we do it
                }
            }
        });
    }
}

export type MessageHandlerCallback = (msg: string) => void;
