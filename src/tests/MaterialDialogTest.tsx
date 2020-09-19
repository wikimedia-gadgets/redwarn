import {h as TSX} from "tsx-dom";
import RedWarnStore from "../data/RedWarnStore";
import MaterialDialog, {MaterialDialogActionType} from "../ui/MaterialDialog";

export default class MaterialDialogTest {

    static async execute() : Promise<void> {

        // == Part 1: Standard definitions ==

        /**
         * A standard MaterialDialog with a close button.
         */
        await MaterialDialog.show(
            new MaterialDialog({
                content: [
                    <p>This is a dialog.</p>
                ],
                actions: [{
                    type: MaterialDialogActionType.Close
                }]
            })
        );

        // No new dialogs will appear until the previous is closed.
        // == Part 2: Elevation and Size ==

        let part2done = false;

        /**
         * A MaterialDialog hidden behind another MaterialDialog.
         *
         * This dialog appears behind since it was added before the next one.
         */
        MaterialDialog.show(
            new MaterialDialog({
                content: [
                    <p>This is a test dialog hidden behind the dialog you just closed.</p>
                ],
                actions: [{
                    type: MaterialDialogActionType.Close,
                    action: () => {part2done = true;}
                }]
            })
        );

        /**
         * A MaterialDialog hiding another MaterialDialog.
         */
        MaterialDialog.show(
            new MaterialDialog({
                content: [
                    <p>This dialog hides something behind it.</p>
                ],
                actions: [{
                    type: MaterialDialogActionType.Close
                }],
                width: "40vw"
            })
        );

        await new Promise(res => { setInterval(() => {
            if (part2done) res();
        }, 10); });

        // == Part 3: Actions ==

        /**
         * A color-changing dialog.
         *
         * Actions are displayed right to left.
         */
        await MaterialDialog.show(
            new MaterialDialog({
                content: [
                    <p>This dialog will change color if you press the respective button.</p>
                ],
                actions: [{
                    type: MaterialDialogActionType.Close
                }, {
                    type: MaterialDialogActionType.Execute,
                    text: "Change Color",
                    action: function () { // Using function as `this` is the MaterialDialog.
                        this.element.style.backgroundColor = RedWarnStore.random.color();
                    }
                }]
            })
        );

        // == Part 4: Actions ==

        /**
         * A dialog with many butons.
         */
        await MaterialDialog.show(
            new MaterialDialog({
                content: [
                    <p>All the buttons close the dialog. They just look different.</p>
                ],
                actions: [{
                    type: MaterialDialogActionType.Close,
                    style: "flat",
                    text: "flat"
                }, {
                    type: MaterialDialogActionType.Close,
                    style: "raised",
                    text: "raised"
                }, {
                    type: MaterialDialogActionType.Close,
                    style: "colored",
                    text: "colored"
                }, {
                    type: MaterialDialogActionType.Close,
                    style: "accent",
                    text: "accent"
                }, {
                    type: MaterialDialogActionType.Close,
                    style: "flatcolored",
                    text: "flatcolored"
                }, {
                    type: MaterialDialogActionType.Close,
                    style: "flataccent",
                    text: "flataccent"
                }],
                width: "30vw"
            })
        );

        // == Part 5: Results ==

        /**
         * A yes-or-no prompt.
         */
        const song = await MaterialDialog.show(
            new MaterialDialog({
                content: [
                    <p>Would you like to play a song?</p>
                ],
                // Watch out! Using `MaterialDialogActionType.Close` will close the dialog
                // before executing the action, and this may cause the result to be `undefined`.
                actions: [{
                    type: MaterialDialogActionType.Finish,
                    text: "No",
                    action: () => false
                }, {
                    type: MaterialDialogActionType.Finish,
                    text: "Yes",
                    action: () => {
                        window.open(
                            atob("aHR0cHM6Ly93d3cueW91dHViZS5jb20vd2F0Y2g/dj1LUTZ6cjZrQ1BqOA==")
                        );
                        return true;
                    }
                }]
            })
        );

        /**
         * The text is based on the result of the previous.
         */

        await MaterialDialog.show(
            new MaterialDialog({
                content: [
                    <h2>Song {song ? "Played" : "Not Played"}</h2>,
                    <p>You {song ? "played" : "did not play"} the song.</p>
                ],
                actions: [{
                    type: MaterialDialogActionType.Close,
                    text: "OK"
                }]
            })
        );

        document.write("Test complete.");

    }

}