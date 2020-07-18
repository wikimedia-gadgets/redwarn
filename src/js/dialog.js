var dialogEngine = {
    "init" : ()=>{
        $("body").append(`
        <div id="dialogEngineContainer">
        </div>
        `);
        // Add events
        addMessageHandler("closeDialog", ()=>{dialogEngine.closeDialog();}); // closing
    },
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

    "freezeScrolling" : ()=>{// stop the page from scrolling
        $("body").css("overflow", "hidden");
    }, 

    "enableScrolling" : ()=>{
        $("body").css("overflow", "");
    }
}