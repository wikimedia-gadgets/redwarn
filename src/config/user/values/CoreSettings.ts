/*
 * RedWarn core settings.
 */

import { RW_CONFIG_VERSION, RW_VERSION } from "rww/data/RedWarnConstants";
import { Setting } from "../Setting";

const CoreSettings = {
    /** Last version of RedWarn that was used */
    latestVersion: new Setting("latestVersion", RW_VERSION, null),

    /** The configuration version, responsible for keeping track of configuration schema changes. */
    configVersion: new Setting("configVersion", RW_CONFIG_VERSION, null),

    /** Neopolitan. */
    neopolitan: new Setting("neopolitan", null)
};

export default CoreSettings;
