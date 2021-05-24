import RWErrorBase, { RWErrors } from "./RWError";

// this doesn't extend RWErrorBase, because we return an instance of a temporary class
export default class GenericRWError {
    constructor(_code: RWErrors, _message: string) {
        class temp extends RWErrorBase {
            static readonly code = _code;
            static readonly message = _message;
        }
        return new temp();
    }
}
