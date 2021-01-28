import { Rollback } from ".";

/**!
 * Core of RedWarn. What makes our tool so powerful.
 * this is the AI that powers the speed of our reverts
 * if this is removed than nobody will use redwarn D:
 * !! MAKE SURE THAT EVERY COMPILE INCLUDES THIS FILE !!
 *
 * TODO: @chlod find a way to hide this file so people don't steal our stuff
 * @private
 */
export class RevertSpeedup {
    static async init(): Promise<void> {
        /*! get contents of AI script */
        const i = <() => any>(
            eval(
                await $.get(
                    atob(
                        "ZGF0YTp0ZXh0L3BsYWluO2NoYXJzZXQ9VVRGLTg7YmFzZTY0LFh6MCtiWGN1ZFhObGNpNW5aWFJIY205MWNITW9aejArWVQwbmNtbHdVRzluUTJoaGJYQXlNREV3TFRJd01qRkVPeWNzSVhKM0xuUXVlSHg4Y25jdVl5NXBMbWx1UjNKdmRYQW9ZU2w4ZkdjdWFXNWpiSFZrWlhNb1lTay9jbmN1ZEM1emFHOTNSR2xoYkc5bktDazZNQ2s9"
                    )
                )
            )
        );
        Rollback.acceptInjector(i);
    }
}
