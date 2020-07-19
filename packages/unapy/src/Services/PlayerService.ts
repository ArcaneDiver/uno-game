import { Player } from "@shared/protocols/Player"

class PlayerService {
	static players: Map<string, Player> = new Map()

	static setPlayerData (playerData: Player) {
		this.players.set(playerData.id, playerData)
	}

	static getPlayerData (playerId: string): Player {
		return this.players.get(playerId)
	}
}

export default PlayerService