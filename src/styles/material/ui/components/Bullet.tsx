import { h } from "tsx-dom";
import i18next from "i18next";

export default function (): JSX.Element {
    return <span class="bullet">{`${i18next.t("common:bullet")}`}</span>;
}
