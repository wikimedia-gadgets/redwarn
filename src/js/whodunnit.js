// Find which editor added something to a page (i.e find when this section first occurs in an edit)
rw.whodunnit = {
    "revs" : [],
    "i": 0,
    "html": "",
    "mouseHighlighter" : () => {
        rw.ui.loadDialog.show("Loading...");
        // Get HTML page content (i.e straight from the parser, so not touched)
        $.getJSON(rw.wikiAPI + "?action=parse&page="+ encodeURIComponent(mw.config.get("wgRelevantPageName")) +"&prop=text&format=json&formatversion=2", r=>{
            $("#mw-content-text").html(r.parse.text); // set content    
            rw.ui.loadDialog.close(); // Close load dialog
            
            // Setup UI
            $("#firstHeading").append(" (Inspector)");
            // Show toast
            rw.visuals.toast.show(`
            Select a highlighted element by clicking it.
            Then, RedWarn will determine when this change was made and which user changed it.
            Push ESC to cancel.`, false, false, 20000000);
            // Add escape handler
            $(document).keyup(function(e) {
                if (e.key === "Escape") { 
                    // refresh the page to exit
                    window.location.reload();
                }
            });
            // Highlights the element the mouse is touching
            $(".mw-parser-output").unbind("mousemove"); // Clear old handlers
            $(".mw-parser-output")[0].style.cursor = "cursor:pointer;"; // Set cursor to pointer
            $(".mw-parser-output").mousemove(e=>{ // On mouse move
                let x = e.pageX - window.pageXOffset;
                let y = e.pageY - window.pageYOffset;
                // Get all current selected and rm 
                $('*[RWWhoDunnitselected="this"]').each((i, el) => {
                    el.style.background = "";
                    $(el).attr("RWWhoDunnitselected", ""); // rm selected
                    $(el).unbind("click"); // unbind onclick
                    $(el).click(function(e) {
                        e.preventDefault();
                    }); // stop links from opening and buttons from submitting, etc.
                });
                let arr = document.elementsFromPoint(x, y);
                // Only continue if more than five elements (works for normal page)
                if (arr.length > 5) {
                    let sel = arr[0];
                    sel.style.background = "#09b4da7d"; // Select lowest and apply hilight
                    $(sel).attr("RWWhoDunnitselected", "this"); // Set element tag
                    $(sel).click(e=>{
                        // On click, select this.
                        $(".mw-parser-output").unbind("mousemove"); 
                        let locateHTML = sel.outerHTML.replace(` rwwhodunnitselected="this" style="background: rgba(9, 180, 218, 0.49);"`, ""); // rm our gubbins
                        rw.whodunnit.locate(locateHTML); // Locate it
                    });
                } 
            });
        });
        
    },

    "locate" : htmlIn=> { // Locate first instance of this html 
        // Show loading dialog
        rw.ui.loadDialog.show("Investigating...");
        rw.whodunnit.html = htmlIn.replace(/[^\w\s!?]/g, ""); // Replace most and just leave as a char only string
        
        let name = mw.config.get("wgRelevantPageName"); 
        $.getJSON(rw.wikiAPI + "?action=query&prop=revisions&titles="+ encodeURIComponent(name) +"&rvlimit=500&rvprop=ids%7Cuser%7Ctimestamp&format=json", r=>{
            
            let cronologicalRevs = r.query.pages[Object.keys(r.query.pages)[0]].revisions;
            // Process to put in time order based on timestamps
            cronologicalRevs.sort((a,b)=>{
                return new Date(b.timestamp) - new Date(a.timestamp);
            });

            rw.whodunnit.revs = cronologicalRevs;
            rw.whodunnit.i = 0;
            rw.whodunnit.processNext(); // start
        });
        
    },

    "processNext" : ()=> {
        // Process the next rev
        let rev = rw.whodunnit.revs[rw.whodunnit.i]; // set rev local
        let revID = rev.revid;
        let html = rw.whodunnit.html;
        // Update loading box
        rw.ui.loadDialog.setText("Investigating rev. "+ revID +"...");

        $.getJSON(rw.wikiAPI + "?action=parse&format=json&oldid="+ revID, r=>{ // Get revision content
            if (!r.parse.text["*"].replace(/[^\w\s!?]/g, "").includes(html)) {
                if (rw.whodunnit.i == 0) {
                    // We can't process this element
                    window.location.hash = "#investigateIncomp";
                    window.location.reload(); // reload page
                } else {
                    rw.ui.loadDialog.setText("Loading diff...");
                    let cprID = rw.whodunnit.revs[rw.whodunnit.i-1].revid;
                    let cpprID = rw.whodunnit.revs[rw.whodunnit.i-1].parentid;
                    redirect(rw.wikiIndex + "?diff="+ cprID +"&oldid="+ cpprID +"&diffmode=source"); // go
                    // we done
                }
            } else {
                // Let's continue
                //Finish by incrementing i by one and calling process next again
                rw.whodunnit.i += 1;
                if (rw.whodunnit.i > (rw.whodunnit.revs.length - 1)) {
                    // We reached the end
                    // Likely not here.
                    window.location.hash = "#investigateFail";
                    window.location.reload(); // reload page
                } else {
                    rw.whodunnit.processNext(); // We can continue
                }
            }
        });
    }
};