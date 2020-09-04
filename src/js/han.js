// Handles connection to Huggle Anti-vandalism network
rw.han = {
    "connected": false,
    "authRequired": false,
    "reconnectTries": 0,
    "messageLog" : [],
    "onlineUsers" : [],
    "chatLog": [],
    "tokenLocalStorageID" : `RedWarnToolsHANgatewayToken-${rw.info.getUsername()}`, // the value where our connection token is stored in localStorage

    "oauthLogin" : ()=>{ // all the things needed to show login is required
        rw.han.authRequired = true;
        // Alert user to log in
        $("#rwHANicon").css("color", "blue");
        $("#rwHANstatus").html("Click to log in to the Huggle anti-vandalism network.");
        rw.visuals.toast.show("Verify your account identity to access the Huggle anti-vandalism network.", "CONTINUE", ()=>{if (rw.han.authRequired) redirect("https://hangateway.toolforge.org/login", true);}, 15000);
    },

    "saveChatLog" : ()=>{ // save chat log to local storage
        localStorage.setItem("rwHANchatLog", JSON.stringify(rw.han.chatLog));
    },

    "readChatLog" : ()=>{  // Read and set chat log crom local storage
        rw.han.chatLog = JSON.parse(localStorage.getItem("rwHANchatLog"));
        if (rw.han.chatLog == null) rw.han.chatLog = [];
    },

    "connect" : (callback)=>{ // connect
        console.log("Connecting to HAN...");
        if (!(rw.wikiID == "enwiki")) return; // no HAN on this wiki - enwiki only atm
        rw.han.socket = new WebSocket(`wss://hangateway.toolforge.org/gateway?user=${rw.info.getUsername()}`); // wss://hangateway.toolforge.org/gateway - dev ws://localhost:7676

        // Connection opened
        rw.han.socket.addEventListener('open', function (event) {
            console.log("Socket connected");

            // Verify that we have a token stored
            let hanToken = localStorage.getItem(rw.han.tokenLocalStorageID);
            if (hanToken == null) {
                // None stored, auth needed
                rw.han.oauthLogin();
            } else {
                // Let's connect with that token
                rw.han.socket.send(`connect|${hanToken}|RedWarn ${rw.version}`); // send connect command - Username|RedWarn version
            }
        });

        // Listen for messages
        rw.han.socket.addEventListener('message', function (event) {
            // If auth needed and oauth signal sent
            if (rw.han.authRequired && (event.data.split("|")[0] == "TOKEN")) {
                // Save in storage
                localStorage.setItem(rw.han.tokenLocalStorageID, event.data.split("|")[1]);
                // Send connect command
                rw.han.socket.send(`connect|${event.data.split("|")[1]}|RedWarn ${rw.version}`);
            } else if (!rw.han.connected && event.data == "BADREQ") {
                // Likely bad token
                rw.han.oauthLogin();
            } else if (!rw.han.connected && event.data == "CONNECTED") { // on connected signal
                // Set chat log from memory
                rw.han.readChatLog();
                if (rw.han.authRequired) {
                    // Show notice that it's connected
                    rw.ui.confirmDialog(`
                    Welcome back. Your account identity has been confirmed and you can now access the Huggle anti-vandalism network in this browser.
                    To see what other users are doing, and to discuss counter-vandalism efforts, click the chat icon in RedWarn's menu.
                    `, "OKAY", ()=>dialogEngine.closeDialog() , "", ()=>{}, 57);
                }
                rw.han.authRequired = false;
                console.log("Connected to HAN.");
                $("#rwHANicon").css("color", ""); // set to no color so that it doesn't stand out too much
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
                        // Save message in log with timestamp
                        message.timestamp = Date.now();
                        rw.han.chatLog.push(message);
                        rw.han.saveChatLog();

                        // Process

                        // Normal message
                        // Check if ping
                        if (message.content.toLowerCase().includes(rw.info.getUsername().toLowerCase())) {
                            // Is a ping
                            console.log("ping!");
                            // Play sound
                            let src = 'https://redwarn.toolforge.org/cdn/audio/newPing.mp3';
                            let audio = new Audio(src);
                            audio.play();
                            mw.notify("You have a new mention on HAN.");
                        }

                        // Pass to UI
                        dialogEngine.dialog.getElementsByTagName("iframe")[0].contentWindow.postMessage(
                            rw.han.parseMessage(message)
                            , '*');


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
            rw.han.authRequired = false;
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
        if (rw.han.authRequired) {
            // Open oauth page
            redirect("https://hangateway.toolforge.org/login", true);
        } else if (!rw.han.connected) {
            // Failed / lost connection - reconnect
            rw.visuals.toast.show("Reconnecting to HAN...");
            rw.han.connect(); // reconnect
        } else {
            // Connected - show UI - todo
            // Generate list
            let allMessages = "";
            rw.han.chatLog.forEach(message => {
                // Process
                allMessages += rw.han.parseMessage(message);
            });

            addMessageHandler("sendHANMsg`*", m=>{
                rw.han.socket.send(m.split("`")[1]); // send message
            });

            dialogEngine.create(mdlContainers.generateContainer(
                rw.cdn.getHTML("hanUI", {
                    messages: allMessages
                }),
                500,
                600
            )).showModal();
        }
    },

    "parseMessage" : message=>{
        // Converts message to HTML
        if (message.content.includes("\u0001\u0001")) { // u00001 - event start, so event message
            let data = message.content.replace("\u0001\u0001", "").split(" ");
            //console.log(data);
            if (data[0] == "WARN") { // Warn given
                return `
                <a href="https://en.wikipedia.org/wiki/User:${message.from}" target="_blank"><b>${message.from}</b></a>
                Gave a level ${data[1]} warning to <a href="https://en.wikipedia.org/wiki/User_talk:${decodeURIComponent(data[2])}" target="_blank">${decodeURIComponent(data[2])}</a>
                <br/><span style="font-size:x-small;font-style:italic;">${new Date(message.timestamp).toUTCString()}</span>
                <hr/>
                `;
            } else if (data[0] == "ROLLBACK") { // Rollback event
                return `
                <a href="https://en.wikipedia.org/wiki/User:${message.from}" target="_blank"><b>${message.from}</b></a>
                Reverted <a href="https://en.wikipedia.org/w/index.php?diff=${data[1]}" target="_blank">${data[1]}</a>
                <br/><span style="font-size:x-small;font-style:italic;">${new Date(message.timestamp).toUTCString()}</span>
                <hr/>
                `;
            }
        } else {
            // Normal message
            return `
            <a href="https://en.wikipedia.org/wiki/User:${message.from}" target="_blank"><b>${message.from}</b></a>
            ${message.content}
            <br/><span style="font-size:x-small;font-style:italic;">${new Date(message.timestamp).toUTCString()}</span>
            <hr/>
            `;
        }
    }
};