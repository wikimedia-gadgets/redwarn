/*!
 * This file was modified from Baritone, to make it usable in TypeScript and the web environment.
 * It has been changed from the original, to fit the needs of RedWarn.
 * The original Java source is available at <https://github.com/cabaletta/baritone/blob/72cf9392/src/api/java/baritone/api/Settings.java/>.
 */
export class Setting<T> implements PrimitiveSetting<T> {
    value: T;
    readonly defaultValue: T;

    constructor(defaultValue: T, private readonly _id: string) {
        this.defaultValue = this.value = defaultValue;
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
        return new this(primitive.value, primitive.id);
    }
}

export interface PrimitiveSetting<T> {
    value: T;
    readonly id: string;
}
