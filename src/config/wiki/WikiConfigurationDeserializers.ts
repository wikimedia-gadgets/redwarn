import WikiConfigurationRaw from "rww/config/wiki/WikiConfigurationRaw";

type Deserializer<T> = (data: T) => any;
type DeserializerChunk<T> = Partial<
    {
        [P in keyof T]: T[P] extends Record<string, any>
            ?
                  | (DeserializerChunk<T[P]> & { _self?: Deserializer<T[P]> })
                  | Deserializer<T[P]>
            : Deserializer<T[P]>;
    }
>;

/**
 * An object of functions which convert values from {@link WikiConfigurationRaw}
 * to values compatible with those in {@link WikiConfiguration}
 */
const WikiConfigurationDeserializers: DeserializerChunk<WikiConfigurationRaw> = {};

export default WikiConfigurationDeserializers;
