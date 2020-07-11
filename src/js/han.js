// Handles connection to Huggle Anti-vandalism network
rw.han = {
    "connected": false,
    "reconnectTries": 0,
    "messageLog" : [],
    "connect" : (callback)=>{ // connect
        console.log("Connecting to HAN...");
        if (!rw.wikiBase.includes("en.wikipedia.org")) return; // no HAN on this wiki - enwiki only atm
        rw.han.socket = new WebSocket('wss://hangateway.toolforge.org'); // hangateway

        // Connection opened
        rw.han.socket.addEventListener('open', function (event) {
            rw.han.socket.send(`connect|${rw.info.getUsername()}|RedWarn ${rw.version}`); // send connect command - Username|RedWarn version
        });

        // Listen for messages
        rw.han.socket.addEventListener('message', function (event) {
            if (!rw.han.connected && event.data == "CONNECTED") {
                console.log("Connected to HAN.");
                $("#rwHANicon").css("color", "green"); // set to connected colour
                rw.han.connected = true;
                rw.han.reconnectTries = 0;
                if (callback != null) callback();
            } else if (rw.han.connected) {
                // Convert JSON
                try {
                    let message = JSON.parse(event.data);
                    console.log(message);
                    if ((message.type == "message") && message.content.includes("\u0001\u0001")) { // u00001 - event start, so event
                        let data = message.content.replace("\u0001\u0001", "").split(" ");
                        console.log(data);
                        if (data[0] == "WARN") {
                            console.log(decodeURIComponent(data[2]) + " given level " + data[1] + " warning by "+ message.from)
                        } // todo
                    }
                } catch (error) {
                    // let's catch and leave in console
                    console.error(error);
                }
            }
            
        });

        rw.han.socket.onclose = ()=>{
            // Connection closed
            console.log("Connection closed");
            $("#rwHANicon").css("color", "orange"); // try to reconnect
            rw.han.connected = false;
            rw.han.reconnectTries += 1;
            if (rw.han.reconnectTries < 11) {
                // Will only try 10 times
                setTimeout(()=>rw.han.connect(), 1000 * rw.han.reconnectTries); // try again after 1 second * number of tries
            } else {
                // Reconnect failed
                $("#rwHANicon").css("color", "red");
                rw.visuals.toast.show("RedWarn is having temporary server issues and cannot connect to the Huggle anti-vandalism network at this time. Please try again later.", null, null, 7500);
            }
        };

        rw.han.socket.onerror = err=>{ // on error log
            console.log(err);
        };
    },

    "ui" : ()=>{
        // HAN icon clicked
        if (!rw.han.connected) {
            // Failed / lost connection - reconnect
            rw.visuals.toast.show("Reconnecting to HAN...");
            rw.han.connect(()=>rw.ui.loadDialog.close()); // reconnect
        } 
    }
};