import WikiConfigurationRaw from "rww/config/wiki/WikiConfigurationRaw";
import WikiConfigurationBase from "rww/config/wiki/WikiConfigurationBase";
import WikiConfiguration from "rww/config/wiki/WikiConfiguration";
import {
    deserializeWarning,
    SerializedWarning,
    SerializedWarningCategories,
    Warning,
    WarningCategory,
} from "rww/mediawiki";
import {
    deserializeRevertOption,
    RevertOption,
} from "rww/mediawiki/revert/RevertOptions";
import {
    deserializeReportVenue,
    SerializableReportVenue,
} from "rww/mediawiki/report/ReportVenue";

// T - Type of root data (original raw configuration as parsed JSON)
// U - Type of the interface which V and W extend from.
// V - Originally from type U, determines. (recursive)
// W - Type of the source object (WikiConfigurationRaw) (recursive)
// X - Type of the target object (WikiConfiguration) (recursive)

type Deserializer<T, U, W, X> = (data: W, root: T, current: U) => X;
type DeserializerChunk<T, U, V, W extends V, X extends V> = Partial<{
    [P in keyof V]: W[P] extends Record<string, any>
        ?
              | (DeserializerChunk<T, U, V[P], W[P], X[P]> & {
                    _self?: Deserializer<T, U, W[P], X[P]>;
                })
              | Deserializer<T, U, W[P], X[P]>
        : Deserializer<T, U, W[P], X[P]>;
}>;
type WikiConfigurationDeserializer = DeserializerChunk<
    WikiConfigurationRaw,
    WikiConfigurationBase,
    WikiConfigurationBase,
    WikiConfigurationRaw,
    WikiConfiguration
>;

/**
 * An object of functions which convert values from {@link WikiConfigurationRaw}
 * to values compatible with those in {@link WikiConfiguration}.
 *
 * Deserializers are parsed with the direct children first (including objects)
 * in order of deserializer appearance, and then proceeds with the children of
 * objects in order of deserializer appearance.
 *
 * Each deserializer function exposes the data being deserialized, the original
 * configuration, and the current modified configuration.
 *
 * This constant follows the structure of {@link WikiConfigurationBase}.
 */
const WikiConfigurationDeserializers: WikiConfigurationDeserializer = {
    warnings: {
        categories: (data: SerializedWarningCategories) => {
            const categoryArray: WarningCategory[] = [];
            // Convert serialized warning categories to warning categories.
            for (const [id, fields] of Object.entries(data)) {
                categoryArray.push({
                    id: id,
                    ...fields,
                });
            }
            return categoryArray;
        },
        warnings: (
            data: Record<string, SerializedWarning>,
            root: WikiConfigurationBase,
            current: WikiConfigurationBase
        ): Record<string, Warning> => {
            // Remap warnings.
            const warnings: Record<string, Warning> = {};

            for (const [id, warning] of Object.entries(data)) {
                warnings[id] = deserializeWarning(
                    warning,
                    <WarningCategory[]>current.warnings.categories
                );
            }

            return warnings;
        },
        vandalismWarning: (
            data: string,
            rootData: WikiConfigurationRaw,
            current
        ): Warning => {
            return <Warning>current.warnings.warnings[data];
        },
    },
    revertOptions: (data) => {
        const deserializedOptions: Record<string, RevertOption> = {};

        for (const [id, option] of Object.entries(data)) {
            deserializedOptions[id] = deserializeRevertOption(id, option);
        }

        return deserializedOptions;
    },
    reporting: (data) => {
        return data.map((venue: SerializableReportVenue) =>
            deserializeReportVenue(venue)
        );
    },
};

export default WikiConfigurationDeserializers;
