/*
This directory contains values for each module and what their preference value does and includes
If a preference value isn't here it will be seen as invalid and removed/ignored.

i18n - see pref.json for your localisation, make sure you add values for each one of your keys.

new Setting(key, default, userfacingProps)
*/

import { RW_CONFIG_VERSION, RW_VERSION } from "rww/data/RedWarnConstants";
import { Setting, settingsToObject } from "../Setting";

const CoreSettings: Record<string, any> = settingsToObject([
    /** Last version of RedWarn that was used */
    new Setting("latestVersion", RW_VERSION),

    /** The configuration version, responsible for keeping track of variable renames. */
    new Setting("configVersion", RW_CONFIG_VERSION),
]);

export default CoreSettings;
