/*!
 * This file was modified from Baritone, to make it usable in TypeScript and the web environment.
 * It has been changed from the original, to fit the needs of RedWarn.
 * The original Java source is available at <https://github.com/cabaletta/baritone/blob/72cf9392/src/api/java/baritone/api/Settings.java/>.
 */

export enum UIInputType {
    /** A simple switch that provides a boolean value. */
    Switch,
    /** A set of checkboxes which returns an array containing the value of all checked options. */
    Checkboxes,
    /** A set of radio buttons which returns the value of the selected option. */
    Radio,
    /** A dropdown which returns the value of the selected option. */
    Dropdown,
    /** A textbox which returns a string. */
    Textbox,
    /** A number input field which returns a number. */
    Number,
    /** A color picker which returns a color. */
    ColorPicker,
    /** A dropdown which returns a RedWarnStyle. */
    Style,
    /**
     * A menu which shows all (and allows addition of more) revert options and
     * allows customization of color, order, visibility, or icon.
     */
    RevertOptions,
    /**
     * A menu which shows all page icons and allows customization of order and visibility.
     */
    PageIcons,
}

export interface DisplayInformationOption {
    /**
     * The name of the option.
     */
    name: string;
    /**
     * Its value.
     */
    value: any;
}

/**
 * Information about how UI settings are displayed or not.
 */
interface DisplayInformationBase {
    /**
     * The human-readable title for this setting.
     */
    title: string;
    /**
     * The description for this setting.
     */
    description: string;
    /**
     * The display type for this specific setting.
     */
    uiInputType: UIInputType;
}

/**
 * Certain {@link UIInputType}s, contrary to {@link DisplayInformationRestricted},
 * allow any user-provided value. These are represented here.
 */
interface DisplayInformationPermissive extends DisplayInformationBase {
    /**
     * The display type for this specific setting.
     */
    uiInputType: Exclude<UIInputType, DisplayInformationRestricted["uiInputType"]>;
}

/**
 * Certain {@link UIInputType}s restrict the valid options provided. These
 * are represented here in order to force integration.
 */
interface DisplayInformationRestricted extends DisplayInformationBase {
    /**
     * The display type for this specific setting.
     */
    uiInputType:
        | UIInputType.Checkboxes
        | UIInputType.Radio
        | UIInputType.Dropdown;
    /**
     * Valid options for this setting.
     */
    validOptions: DisplayInformationOption[];
}

export type DisplayInformation =
    | DisplayInformationPermissive
    | DisplayInformationRestricted;

export class Setting<T> implements PrimitiveSetting<T> {
    value: T;
    readonly defaultValue: T;
    readonly displayInfo: DisplayInformation | null;

    /**
     * Creates a new {@link Setting}.
     *
     * @param _id The name of this configuration value to be used in configuration files.
     * @param defaultValue The default value of this setting.
     * @param displayInfo Preferences screen display information for this setting.
     *                    Set this to `null` if it should be hidden from user view.
     */
    constructor(
        private readonly _id: string,
        defaultValue: T,
        displayInfo?: DisplayInformation | null
    ) {
        this.defaultValue = this.value = defaultValue;
        this.displayInfo = displayInfo;
    }

    reset(): void {
        this.value = this.defaultValue;
    }

    get id(): string {
        return this._id;
    }

    toString(): string {
        return JSON.stringify(this.toPrimitive());
    }

    toPrimitive(): PrimitiveSetting<T> {
        return { id: this.id, value: this.value };
    }

    static fromString<T>(str: string): Setting<T> {
        const obj: { id: string; value: T } = JSON.parse(str);
        return Setting.fromPrimitive(obj);
    }

    static fromPrimitive<T>(primitive: PrimitiveSetting<T>): Setting<T> {
        return new Setting(primitive.id, primitive.value, null);
    }
}

export interface PrimitiveSetting<T> {
    value: T;
    readonly id: string;
}
