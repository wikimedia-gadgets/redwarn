import { BaseProps, h } from "tsx-dom";
import expandDataAttributes from "rww/styles/material/util/expandDataAttributes";

export interface MaterialIconButtonProperties extends BaseProps {
    icon: string;
    iconColor?: string;
}

export default function (props: MaterialIconButtonProperties): JSX.Element {
    const { icon, iconColor } = props;
    const element = (
        <span
            class="material-icons"
            style={`color:${iconColor ?? "initial"};`}
            {...expandDataAttributes(props)}
        >
            {icon}
        </span>
    );

    return element;
}
