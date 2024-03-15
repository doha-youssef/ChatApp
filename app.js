//#region Requires
const express = require('express');
const app = express();
const PORT = process.env.PORT || 7020;
const bodyParser = require('body-parser');
const server = app.listen(PORT, () => { console.log("Listening on http://localhost:" + PORT) });
const io = require('socket.io')(server)
//#endregion

//#region MiddleWare
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/Public'));
//#endregion

let socketsConnected = new Set()

io.on('connection', onConnected)

function onConnected(socket) {
    socketsConnected.add(socket.id)

    socket.on('disconnect', () => {
        socketsConnected.delete(socket.id)
    })

    socket.on('message', (data) => {
        socket.broadcast.emit('chat-message', data)
    })

    socket.on('typing', (data) => {
        socket.broadcast.emit('typing', data)
    })
}




