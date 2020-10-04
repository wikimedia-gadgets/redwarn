import {Dependency} from "../ui/Dependencies";
import {
    RedWarnHook,
    RedWarnHookEventTypes
} from "../event/RedWarnHookEvent";
import {RWUIElements} from "../ui/RWUIElement";

interface Style {

    name : string;
    version? : string;

    // Mapped by language.
    meta? : {
        [key : string]: {
            displayName? : string;
            description? : string;
            author? : string | string[];

            homepage? : string; // URL

            repository? : string;  // URL
            issues? : string;  // URL

            banner? : string; // URL of Image
        }
    };

    dependencies? : Dependency[];
    storage? : Record<string, any>;

    // Replace with actual UI elements later
    classMap : typeof RWUIElements;

    hooks?: { [key in RedWarnHookEventTypes]? : RedWarnHook[] };

}

export default Style;