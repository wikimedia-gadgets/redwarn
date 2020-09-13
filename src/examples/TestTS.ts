import TestHTML from "./TestHTML";

export function initialize() {
    const randomName = "Ed";
    document.body.appendChild(TestHTML(randomName));
}