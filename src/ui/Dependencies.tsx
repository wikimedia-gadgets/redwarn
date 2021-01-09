import { h } from "tsx-dom";
import RedWarnStore from "rww/data/RedWarnStore";
import StyleManager from "rww/styles/StyleManager";
import { generateId } from "rww/util";

export interface Dependency {
    type: "style" | "script";
    id?: string;
    src: string;
}

export default class Dependencies {
    /**
     * Resolves all dependencies from {@link RedWarnStore}.
     */
    static async resolve(): Promise<void> {
        console.log("Building dependencies...");
        const headElements = [
            ...Dependencies.buildDependencyElements(RedWarnStore.dependencies),
            ...Dependencies.buildDependencyElements(
                StyleManager.activeStyle.dependencies
            ),
        ];

        console.log(`Found ${headElements.length} dependencies.`);

        document.head.append(...headElements);
        await Promise.all(headElements.map((e) => e.promise));
    }

    /**
     * Loads a dependency dynamically.
     * @param dependency The dependency.
     * @returns A boolean Promise, whether the element loaded successfully or not.
     */
    static loadDependency(dependency: Dependency): Promise<boolean> {
        const depElement = this.buildDependency(dependency);
        let oldElement;
        if ((oldElement = document.getElementById(depElement.id)) == null)
            document.head.append(depElement);
        else {
            oldElement.parentElement.replaceChild(depElement, oldElement);
        }
        return depElement.promise;
    }

    static buildDependency(
        dependency: Dependency
    ): HTMLElement & { promise: Promise<boolean> } {
        let resolver: (success: boolean) => void;
        const loadPromise = new Promise<boolean>((res) => {
            resolver = res;
        });

        let e;
        if (dependency.type === "script") {
            e = (
                <script
                    id={`rw_dep-${dependency.id ?? generateId(8)}`}
                    type="application/javascript"
                    onLoad={() => {
                        resolver(true);
                    }}
                    src={dependency.src}
                />
            ) as HTMLElement & { promise: Promise<boolean> };
            e.promise = loadPromise;
        } else {
            e = (
                <link
                    id={`rw_dep-${dependency.id ?? generateId(8)}`}
                    rel="stylesheet"
                    type="text/css"
                    onLoad={() => {
                        resolver(true);
                    }}
                    href={dependency.src}
                />
            ) as HTMLElement & { promise: Promise<boolean> };
            e.promise = loadPromise;
        }
        return e;
    }

    static buildDependencyElements(
        depsList: Dependency[]
    ): (HTMLElement & { promise: Promise<boolean> })[] {
        const elements: (HTMLElement & { promise: Promise<boolean> })[] = [];
        for (const dependency of depsList) {
            console.log(
                `Loading ${dependency.type} dependency: ${dependency.src}`
            );

            elements.push(this.buildDependency(dependency));
        }
        return elements;
    }

    static getDependencyElement(dependencyId: string): HTMLElement {
        return document.getElementById(`rw_dep-${dependencyId}`);
    }
}
