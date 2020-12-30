import { Warnings } from "rww/wikipedia/Warnings";
import RWUI from "rww/ui/RWUI";
import Rollback from "rww/wikipedia/Rollback";

interface ActionRollback {
    actionType: "rollback";
    promptReason: boolean;
    summary: string;
    ruleIndex?: keyof Warnings;
}

interface ActionFunction {
    actionType: "function";
    action: (rollback: Rollback) => () => any;
}

type RollbackAction = ActionFunction | ActionRollback;

interface RollbackOptionBase {
    enabled: boolean;
    name: string;
    color: string;
    icon: string;
}

export type RollbackOption = RollbackOptionBase & RollbackAction;
export const RollbackOptions: RollbackOption[] = [
    // rev14, icon IDs and everything for current rollback - from left to right - usually loaded from config
    // WARNING: CHANGING ORDER WILL MESS UP CONFIGS.
    // DEFAULT ENABLED ICONS
    {
        enabled: true, // true is a default rollback icon, false can be added via preferences
        name: "Quick rollback vandalism",
        color: "red", // css colour
        icon: "delete_forever",
        actionType: "rollback",
        promptReason: false, // add extra info? false = quick rollback, otherwise not
        summary: "[[WP:VANDAL|Possible vandalism]]", // Set summary
        ruleIndex: "vandalism", // used for autowarn
    },

    {
        enabled: true, // true is a default rollback icon, false can be added via preferences
        name: "Quick rollback unexplained content removal",
        color: "orange", // css colour
        icon: "format_indent_increase",
        actionType: "rollback",
        promptReason: false, // add extra info?
        summary: "[[WP:CRV|Unexplained content removal]]", // Set summary
        ruleIndex: "delete", // used for autowarn
    },

    {
        enabled: true, // true is a default rollback icon, false can be added via preferences
        name: "Quick rollback non-constructive edit",
        color: "gold", // css colour
        icon: "work_outline",
        actionType: "rollback",
        promptReason: false, // add extra info?
        summary: "non-constructive", // Set summary
    },

    {
        enabled: true, // true is a default rollback icon, false can be added via preferences
        name: "Rollback",
        color: "blue", // css colour
        icon: "replay",
        actionType: "rollback",
        promptReason: true, // add extra info?
        summary: "", // Set summary
    },

    {
        enabled: true, // true is a default rollback icon, false can be added via preferences
        name: "Assume Good Faith and Rollback",
        color: "green", // css colour
        icon: "thumb_up",
        actionType: "rollback",
        promptReason: true, // add extra info?
        summary: "Reverting [[WP:AGF|good faith]] edits", // Set summary
    },

    {
        enabled: true, // true is a default rollback icon, false can be added via preferences
        name: "Preview Rollback",
        color: "black", // css colour
        icon: "compare_arrows",
        actionType: "function",
        action: (rollback: Rollback) => () => rollback.preview(), // Callback
    },

    {
        enabled: true, // true is a default rollback icon, false can be added via preferences
        name: "Quick Template",
        color: "black", // css colour
        icon: "library_add",
        actionType: "function",
        action: (rollback: Rollback) => () => rollback.welcomeRevUser(), // Callback
    },

    {
        enabled: true, // true is a default rollback icon, false can be added via preferences
        name: "More Options",
        color: "black", // css colour
        icon: "more_vert",
        actionType: "function",
        action: (rollback: Rollback) => () =>
            RWUI.openExtendedOptionsDialog({ rollback }), // Callback
    },

    // END DEFAULT ENABLED ICONS
    // DEFAULT DISABLED ICONS

    // RED
    {
        enabled: false, // true is a default rollback icon, false can be added via preferences
        name: "Quick rollback 3RR",
        color: "red", // css colour
        icon: "filter_3",
        actionType: "rollback",
        promptReason: false, // add extra info?
        summary: "[[WP:3RR]]", // Set summary
        ruleIndex: "_3rr", // used for autowarn
    },

    {
        enabled: false, // true is a default rollback icon, false can be added via preferences
        name: "Quick rollback personal attacks towards another editor",
        color: "red", // css colour
        icon: "offline_bolt",
        actionType: "rollback",
        promptReason: false, // add extra info?
        summary: "Personal attack towards another editor ([[WP:NPA]])", // Set summary
        ruleIndex: "npa", // used for autowarn
    },

    {
        enabled: false, // true is a default rollback icon, false can be added via preferences
        name: "Quick rollback copyright violation",
        color: "red", // css colour
        icon: "copyright",
        actionType: "rollback",
        promptReason: false, // add extra info?
        summary: "Likely [[WP:COPYVIO|copyright violation]]", // Set summary
        ruleIndex: "copyright", // used for autowarn
    },

    {
        enabled: false, // true is a default rollback icon, false can be added via preferences
        name: "Quick rollback BLP violation",
        color: "red", // css colour
        icon: "face",
        actionType: "rollback",
        promptReason: false, // add extra info?
        summary: "Fails [[WP:BLP]]", // Set summary
        ruleIndex: "biog", // used for autowarn
    },

    {
        enabled: false, // true is a default rollback icon, false can be added via preferences
        name: "Quick rollback advertising/promotional",
        color: "red", // css colour
        icon: "monetization_on",
        actionType: "rollback",
        promptReason: false, // add extra info?
        summary:
            "Using Wikipedia for [[WP:NOTADVERTISING|advertising and/or promotion]] is not permitted.", // Set summary
        ruleIndex: "advert", // used for autowarn
    },

    {
        enabled: false, // true is a default rollback icon, false can be added via preferences
        name: "Quick rollback unnecessary or inappropriate external links",
        color: "red", // css colour
        icon: "link_off",
        actionType: "rollback",
        promptReason: false, // add extra info?
        summary:
            "Addition of unnecessary/inappropriate [[WP:EL|external links]]", // Set summary
        ruleIndex: "spam", // used for autowarn
    },

    // ORANGE
    {
        enabled: false, // true is a default rollback icon, false can be added via preferences
        name: "Quick rollback no reliable source",
        color: "orange", // css colour
        icon: "history_edu",
        actionType: "rollback",
        promptReason: false, // add extra info?
        summary: "[[WP:RS|Not providing a reliable source]]", // Set summary
        ruleIndex: "unsourced", // used for autowarn
    },

    {
        enabled: false, // true is a default rollback icon, false can be added via preferences
        name: "Quick rollback disruptive editing",
        color: "orange", // css colour
        icon: "error",
        actionType: "rollback",
        promptReason: false, // add extra info?
        summary: "Disruptive editing", // Set summary
        ruleIndex: "disruptive", // used for autowarn
    },

    {
        enabled: false, // true is a default rollback icon, false can be added via preferences
        name: "Quick rollback factual errors",
        color: "orange", // css colour
        icon: "menu_book",
        actionType: "rollback",
        promptReason: false, // add extra info?
        summary: "likely [[WP:PROVEIT|factual errors]]", // Set summary
        ruleIndex: "error", // used for autowarn
    },

    {
        enabled: false, // true is a default rollback icon, false can be added via preferences
        name: "Quick rollback joke edit",
        color: "orange", // css colour
        icon: "child_care",
        actionType: "rollback",
        promptReason: false, // add extra info?
        summary: "Joke edit", // Set summary
        ruleIndex: "joke", // used for autowarn
    },

    {
        enabled: false, // true is a default rollback icon, false can be added via preferences
        name: "Quick rollback NPOV issues",
        color: "orange", // css colour
        icon: "campaign",
        actionType: "rollback",
        promptReason: false, // add extra info?
        summary: "per [[WP:NPOV]]", // Set summary
        ruleIndex: "npov", // used for autowarn
    },

    {
        enabled: false, // true is a default rollback icon, false can be added via preferences
        name: "Quick rollback talk in article",
        color: "orange", // css colour
        icon: "announcement",
        actionType: "rollback",
        promptReason: false, // add extra info?
        summary:
            "Please use the article [[WP:TPHELP|talk page]] or [[WP:FIXIT|be bold]] and fix the problem", // Set summary
        ruleIndex: "talkinarticle", // used for autowarn
    },

    // BLUE
    {
        enabled: false, // true is a default rollback icon, false can be added via preferences
        name: "Quick rollback manual of style issues",
        color: "blue", // css colour
        icon: "brush",
        actionType: "rollback",
        promptReason: false, // add extra info?
        summary: "[[WP:MOS|Manual of Style]] issues", // Set summary
        ruleIndex: "mos", // used for autowarn
    },

    {
        enabled: false, // true is a default rollback icon, false can be added via preferences
        name: "Quick rollback test edits",
        color: "blue", // css colour
        icon: "build",
        actionType: "rollback",
        promptReason: false, // add extra info?
        summary: "[[WP:SANDBOX|test edits]]", // Set summary
        ruleIndex: "test", // used for autowarn
    },
];
