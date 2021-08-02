/*!
 * This file was modified from Baritone, to make it usable in TypeScript and the web environment.
 * It has been changed from the original, to fit the needs of RedWarn.
 * The original Java source is available at <https://github.com/cabaletta/baritone/blob/72cf9392/src/api/java/baritone/api/Settings.java/>.
 */

export enum UIInputType {
    Switch,
    Checkboxes,
    Radio,
    Dropdown,
    Textbox,
    Number,
    ColorPicker,
    RevertOptions,
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
    | DisplayInformationBase
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
