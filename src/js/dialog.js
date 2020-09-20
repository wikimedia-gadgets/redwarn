/**
* dialogEngine creates a single dialog within RedWarn and is the framework for a majority of dialogs.
*
* @class dialogEngine
*/
var dialogEngine = {
    /**
     * Initalises dialogEngine.
     * @method init
     * @extends dialogEngine
     */
    "init" : ()=>{
        $("body").append(`
        <div id="dialogEngineContainer">
        </div>
        `);
        // Add events
        addMessageHandler("closeDialog", ()=>{dialogEngine.closeDialog();}); // closing
    },

    /**
     * Replace/create a new dialogEngine dialog
     * 
     * @param {string} content HTML content, usually mdlContainer iFrame
     * @param {boolean} noPad optional: whether or not the dialog should have paddding, false for padding, true to remove it. Set to true for full-screen dialogs.
     * @returns {object} DOM dialog element (you can also access this via dialogEngine.dialog)
     */
    "create" : (content, noPad)=>{ 
       
        $("#dialogEngineContainer").html(`
        <dialog class="mdl-dialog" id="dialogEngineDialog">
            `+ content +`
        </dialog>
        `);


        dialogEngine.dialog = document.querySelector('#dialogEngineDialog');

        if (noPad) $("#dialogEngineDialog").attr("style", "padding:inherit;"); // if no padding requested

        // Firefox issue fix
        if (! dialogEngine.dialog.showModal) {
            dialogPolyfill.registerDialog(dialogEngine.dialog);
        }
        
        return dialogEngine.dialog;
    },

    /**
     * Closes the currently visible dialogEngine dialog with animation.
     * @method closeDialog
     * @extends dialogEngine
     */
    "closeDialog" : ()=> {
        // Close the dialog (animated)
        $(dialogEngine.dialog)
        .addClass("closeAnimate")
        .on("webkitAnimationEnd", ()=>{
            // Animation finished
            dialogEngine.dialog.close();
        });

        // Make sure to reenable scrolling
        dialogEngine.enableScrolling();
    },

    /**
     * Stops the parent page from scrolling
     *
     * @method freezeScrolling
     * @extends dialogEngine
     */
    "freezeScrolling" : ()=>{// stop the page from scrolling
        $("body").css("overflow", "hidden");
    }, 

    /**
     * Enables the parent page to scroll - ran automatically on dialogEngine.closeDialog()
     *
     * @method enableScrolling
     * @extends dialogEngine
     */
    "enableScrolling" : ()=>{
        $("body").css("overflow", "");
    }
}