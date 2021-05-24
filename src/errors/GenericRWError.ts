import RWErrorBase, { RWErrors } from "./RWError";

export default class GenericRWError extends RWErrorBase {
    constructor(
        readonly code: RWErrors,
        readonly name: string,
        public message: string
    ) {
        super();
    }
}
