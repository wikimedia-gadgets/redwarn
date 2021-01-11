// this is needed since declarations don't load for webpack loaders for some reason
declare module "!webpack-plugin-buildinfo?*" {
    import { BuildInfo } from "webpack-plugin-buildinfo";
    const buildinfo: Readonly<BuildInfo>;
    export default buildinfo;
}
