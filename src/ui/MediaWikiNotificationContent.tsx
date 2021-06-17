import { h } from "tsx-dom";

export default (html: string): HTMLElement => {
    const el = <span />;
    el.innerHTML = html;
    return el;
};
