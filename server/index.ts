import express from 'express'
import cors from 'cors'
import { createServer } from 'http'
import { Server } from 'colyseus'
import { monitor } from '@colyseus/monitor'
import { TicTacToeRoom } from './rooms/TicTacToeRoom'



const port = Number(process.env.PORT || 2567) + Number(process.env.NODE_APP_INSTANCE || 0)
const app = express()

app.use(cors())
app.use(express.json())

const server = createServer(app)
// Attach WebSocket Server on HTTP Server.
const gameServer = new Server({
    server,
})




gameServer.define('tictactoe', TicTacToeRoom)

// (optional) attach web monitoring panel
app.use('/colyseus', monitor())

gameServer.onShutdown(function () {
    console.log(`game server is going down.`)
})

gameServer.listen(port)


console.log(`Listening on http://localhost:${port}`)
console.log(`Socket on on ws://localhost:${port}`)
console.log(`Monitor on http://localhost:${port}/colyseus`)
