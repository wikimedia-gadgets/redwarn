// Handles connection to Huggle Anti-vandalism network
rw.han = {
    "connected": false,
    "reconnectTries": 0,
    "messageLog" : [],
    "onlineUsers" : [],
    "connect" : (callback)=>{ // connect
        console.log("Connecting to HAN...");
        if (!rw.wikiBase.includes("en.wikipedia.org")) return; // no HAN on this wiki - enwiki only atm
        rw.han.socket = new WebSocket('wss://hangateway.toolforge.org'); // wss://hangateway.toolforge.org - dev ws://localhost:7676

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

                // Get connected users after 250ms
                setTimeout(()=>rw.han.socket.send("GETNAMES"), 250);

                // Set timer to continually get online users
                rw.han.connectedTimer = setInterval(()=>rw.han.socket.send("GETNAMES"), 30000);
            } else if (rw.han.connected) { // when I get a message while connected
                // Convert JSON
                try {
                    let message = JSON.parse(event.data);
                    //console.log(message);
                    if (message.type == "message") { 
                        if (message.content.includes("\u0001\u0001")) { // u00001 - event start, so event message
                            let data = message.content.replace("\u0001\u0001", "").split(" ");
                            //console.log(data);
                            if (data[0] == "WARN") { // Warn given
                                console.log(decodeURIComponent(data[2]) + " given level " + data[1] + " warning by "+ message.from)
                            } else if (data[0] == "ROLLBACK") { // Rollback event
                                console.log(message.from + " reverted "+ data[1])
                            }
                        } else {
                            // Normal message
                            // Check if ping
                            if (message.content.toLowerCase().includes("@"+ rw.info.getUsername().toLowerCase())) {
                                // Is a ping
                                console.log("ping!");
                                // Play sound
                                let src = 'https://redwarn.toolforge.org/cdn/audio/newPing.mp3';
                                let audio = new Audio(src);
                                audio.play();
                            }
                        }
                        
                    } else if (message.type == "online") {
                        // User listing array - save
                        let newOnlineUsers = Object.keys(message.info);
                        // Rm none huggle/redwarn users such as IRC admins and bots
                        newOnlineUsers = newOnlineUsers.filter(e => !([
                            // HIDDEN USERS ARRAY
                            'ChanServ',
                            'petan',
                            'Steinsplitter'
                        ]).includes(e));

                        // Join messages/new users
                        newOnlineUsers.filter(e => !(rw.han.onlineUsers).includes(e)).forEach(user => {
                            // todo
                            console.log(`${user} has joined`);
                        });

                        // Leave messages
                        rw.han.onlineUsers.filter(e => !(newOnlineUsers).includes(e)).forEach(user => {
                            // todo
                            console.log(`${user} has left`);
                        });

                        // Now we're done comparing, add new
                        rw.han.onlineUsers = newOnlineUsers;

                        // Set status text
                        $("#rwHANstatus").html(`
                        ${rw.han.onlineUsers.length} user${rw.han.onlineUsers.length > 1 ? "s" : ""} online<br/>
                        <span style="font-size:x-small">Huggle anti-vandalism network</span>
                        `);
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

            // Remove online users handler
            if (rw.han.connectedTimer != null) clearInterval(rw.han.connectedTimer);

            // Status
            $("#rwHANstatus").html("Reconnecting to HAN...");
            $("#rwHANicon").css("color", "orange"); // try to reconnect
            rw.han.connected = false;
            rw.han.reconnectTries += 1;
            if (rw.han.reconnectTries < 4) {
                // Will only try 3 times
                setTimeout(()=>rw.han.connect(), 1000 * rw.han.reconnectTries); // try again after 1 second * number of tries
            } else {
                // Reconnect failed
                $("#rwHANicon").css("color", "red");
                $("#rwHANstatus").html("Connection issue. Disconnected from HAN.");
                rw.visuals.toast.show("RedWarn is having temporary connection issues and cannot connect to the Huggle anti-vandalism network at this time. Please try again later.", null, null, 7500);
            }
        };

        rw.han.socket.onerror = err=>{ // on error log
            console.log(err);
        };
    },

    "reportRollback" : revid=>{
        if (!rw.han.connected) return; // don't do anything if not connected
        // Send a rollback note
        rw.han.socket.send(`\u0001\u0001ROLLBACK ${revid}`);
    },

    "reportWarn" : (user, level)=>{
        if (!rw.han.connected) return; // don't do anything if not connected
        // Send a warning note
        rw.han.socket.send(`\u0001\u0001WARN ${level} ${encodeURIComponent(user.replace(" ", "_"))}`);
    },

    "ui" : ()=>{
        // HAN icon clicked
        if (!rw.han.connected) {
            // Failed / lost connection - reconnect
            rw.visuals.toast.show("Reconnecting to HAN...");
            rw.han.connect(); // reconnect
        } else {
            // Connected - show UI - todo
        }
    }
};