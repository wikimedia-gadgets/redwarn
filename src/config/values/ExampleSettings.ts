/*
This directory contains values for each module and what their preference value does and includes
If a preference value isn't here it will be seen as invalid and removed/ignored.

i18n - see pref.json for your localisation, make sure you add values for each one of your keys.

new Setting(key, default, userfacingProps)

!!! THIS IS AN EXAMPLE - DO NOT IMPORT OR USE THIS !!!
YOU MUST ALSO include i18n IDs - these are used instead of strings to save on processing time until they're needed.
*/

import { Setting, UIInputType } from "../Setting";

const ExampleSettings: Setting<any>[] = [
    /** Example non-userfacing setting */
    new Setting("exampleNonUserFacing", true),

    /** Example Checkbox setting - values can be true or false */
    new Setting("exampleCheckboxSetting", false, {
        isUserFacing: true,
        uiInputType: UIInputType.Checkbox,
        readableTitle: "root:blah.blah",
        readableDescription: "root:blah.blah",
    }),
];

export default ExampleSettings;
