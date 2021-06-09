/*
This directory contains values for each module and what their preference value does and includes
If a preference value isn't here it will be seen as invalid and removed/ignored.

i18n - see pref.json for your localisation, make sure you add values for each one of your keys.
*/

import { RollbackMethod } from "..";
import { Setting, settingArrayToObject } from "../Setting";
// TODO: add user facing info here
const rollbackSettings: Record<string, any> = settingArrayToObject([
    /** Rollback done option that is automatically executed on rollback complete */
    new Setting("rollbackDoneOption", "warnUser"),
    /** Method of rollback */
    new Setting("rollbackMethod", RollbackMethod.Unset),
]);

export default rollbackSettings;
