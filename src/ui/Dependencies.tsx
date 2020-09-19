import { h as TSX } from "tsx-dom";
import RedWarnStore from "../data/RedWarnStore";

export interface Dependency {
    type: "style" | "script";
    id?: string;
    src: string;
}

export default class Dependencies {

    static async resolve() : Promise<void> {
        const headElements = Dependencies.buildDependencyElements(RedWarnStore.dependencies);

        document.head.append(...headElements);
        await Promise.all(headElements.map(e => e.promise));
    }

    static buildDependencyElements(depsList : Dependency[]) : (HTMLElement & {promise: Promise<boolean>})[] {
        const elements : (HTMLElement & {promise: Promise<boolean>})[] = [];
        for (const dependency of depsList) {
            let resolver : (success : boolean) => void;
            const loadPromise = new Promise<boolean>((res) => { resolver = res; });

            let e;
            if (dependency.type === "script") {
                e = <script
                    id={dependency.id ?? `rw_dep-${dependency.id}`}
                    type="application/javascript"
                    onLoad={() => {
                        resolver(true);
                    }}
                    src={dependency.src} /> as HTMLElement & {promise: Promise<boolean>};
                e.promise = loadPromise;
            } else {
                e = <link
                    id={dependency.id ?? `rw_dep-${dependency.id}`}
                    rel="stylesheet"
                    type="text/css"
                    onLoad={() => {
                        resolver(true);
                    }}
                    href={dependency.src} /> as HTMLElement & {promise: Promise<boolean>};
                e.promise = loadPromise;
            }
            elements.push(e);
        }
        return elements;
    }

    static getDependencyElement(dependencyId : string) : HTMLElement {
        return document.getElementById(`rw_dep-${dependencyId}`);
    }

}