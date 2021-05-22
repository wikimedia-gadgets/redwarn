// This is needed since declarations don't load for webpack loaders for some reason
declare module "!webpack-plugin-buildinfo?*" {
    import { BuildInfo } from "webpack-plugin-buildinfo";
    const buildinfo: Readonly<BuildInfo>;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    export default buildinfo;
}
