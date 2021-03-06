import io from "socket.io-client"
import MsgPackParser from "socket.io-msgpack-parser"

import serverConfig from "@/config/server"

const client = io(serverConfig.apiUrl, {
	reconnection: true,
	reconnectionAttempts: Infinity,
	reconnectionDelay: 1000,
	reconnectionDelayMax: 5000,
	randomizationFactor: 0.5,
	...({ parser: MsgPackParser })
})

export const connectSocket = async () =>{
	return new Promise<string>(resolve => {
		client.on("PlayerConnected", (playerId: string) => {
			resolve(playerId)
		})
	})
}

export default client
