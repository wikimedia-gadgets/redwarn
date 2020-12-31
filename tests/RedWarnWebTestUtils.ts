export default class RedWarnWebTests {
    static initialize() {
        global.atob = (s: string) => Buffer.from(s, "base64").toString("utf-8");
        global.btoa = (s: string) => Buffer.from(s, "utf-8").toString("base64");
    }
}
