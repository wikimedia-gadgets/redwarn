/*!
 * This file was modified from Baritone, to make it usable in TypeScript and the web environment.
 * It has been changed from the original, to fit the needs of RedWarn.
 * The original Java source is available at <https://github.com/cabaletta/baritone/blob/72cf9392/src/api/java/baritone/api/Settings.java/>.
 */

export enum uiInputType {
    CheckBox, // will only return true or false
    CheckBoxes, // Will return an array of bools
    RadioButtons,
    DropDown,
    Textbox,
    Number,
    ColourPicker,
}

export interface validOptions {
    readableName: string;
    value: any;
}

// User facing properties
export interface userFacingProps {
    isUserFacing: boolean; // Only required info - if not true the rest of this is ignored
    readableTitle?: string;
    readableDescription?: string;
    uiInputType?: uiInputType;
    validOptions?: validOptions[]; // Only valid for these uiInputTypes: CheckBoxes, RadioButtons, DropDown
}

export class Setting<T> implements PrimitiveSetting<T> {
    value: T;
    readonly defaultValue: T;
    readonly userFacingInfo: userFacingProps;

    constructor(
        private readonly _id: string,
        defaultValue: T,
        userFacingInfo?: userFacingProps
    ) {
        this.defaultValue = this.value = defaultValue;
        this.userFacingInfo = userFacingInfo
            ? userFacingInfo
            : { isUserFacing: false }; // if not set, assume not userfacing
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
        return this.fromPrimitive(obj);
    }

    static fromPrimitive<T>(primitive: PrimitiveSetting<T>): Setting<T> {
        return new this(primitive.id, primitive.value);
    }
}

export interface PrimitiveSetting<T> {
    value: T;
    readonly id: string;
}

// This function converts settings to records, that's basically it.

export function settingArrayToObject(arr: Setting<any>[]): Record<string, any> {
    // eslint-disable-next-line prefer-const
    let finalObj: Record<string, any> = {};
    arr.forEach((set) => {
        finalObj[set.id] = set;
    });
    return finalObj;
}
