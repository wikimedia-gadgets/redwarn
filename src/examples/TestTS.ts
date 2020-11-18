import TestHTML from "./TestHTML";

export function initialize(): void {
    const randomName = "Ed";
    document.body.appendChild(TestHTML(randomName));
}
