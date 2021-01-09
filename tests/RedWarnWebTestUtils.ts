const globalAny: any = global;

globalAny.atob = (s: string) => Buffer.from(s, "base64").toString("utf-8");
globalAny.btoa = (s: string) => Buffer.from(s, "utf-8").toString("base64");
globalAny.mw = {
    user: {
        getName() {
            return "RedWarn";
        },
    },
};
