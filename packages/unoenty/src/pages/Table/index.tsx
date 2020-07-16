import React, { useState } from "react"
import { Grid, Button } from "@material-ui/core"
import { useParams } from "react-router-dom"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { TouchBackend } from "react-dnd-touch-backend"

import { useSocketStore } from "../../store/Socket"

import useDidMount from "../../hooks/useDidMount"
import useSocket from "../../hooks/useSocket"

import { DeviceUtil } from "../../utils/Device"

import CardStack from "./CardStack"
import CardDeck from "./CardDeck"

const Table = () => {
	const { gameId } = useParams()

	const socketStore = useSocketStore()
	const socket = useSocket()

	const [loadingStartGame, setLoadingStartGame] = useState(true)

	const buyCard = () => {
		socket.buyCard(gameId)
	}

	const onDrop = (cardId: string) => {
		socket.putCard(gameId, cardId)
	}

	const joinGame = async () => {
		await socket.joinGame(gameId)

		setLoadingStartGame(false)
	}

	useDidMount(() => {
		joinGame()
	})

	if (loadingStartGame) {
		return <h1>Loading Start Game...</h1>
	} else {
		return (
			<DndProvider
				backend={DeviceUtil.isTouchDevice ? (
					TouchBackend
				) : (
					HTML5Backend
				)}
			>
				<Grid container>
					<Grid container>
						<Grid item xs={1}></Grid>
						<Grid item xs={10}>
							<Grid container justify="center" alignItems="center" style={{ backgroundColor: "blue" }}>
								
							</Grid>
						</Grid>
						<Grid item xs={1}></Grid>
					</Grid>
					<Grid container>
						<Grid item xs={1}>
							<Grid container justify="center" alignItems="center" style={{ backgroundColor: "red" }}>
	
							</Grid>
						</Grid>
						<Grid item xs={10}>
							<Grid container justify="center" alignItems="center" style={{ height: "100%" }}>
								<CardStack
									cards={socketStore?.game?.usedCards as any}
									onDrop={onDrop}
								/>
							</Grid>
						</Grid>
						<Grid item xs={1}>
							<Grid container justify="center" alignItems="center" style={{ backgroundColor: "yellow" }}>
								<Button color="primary" variant="contained" onClick={buyCard}>BUY CARD</Button>
							</Grid>
						</Grid>
					</Grid>
					<Grid container>
						<Grid item xs={1}></Grid>
						<Grid item xs={10}>
							<Grid container justify="center" alignItems="center" style={{ backgroundColor: "black" }}>
								<CardDeck
									cards={socket.currentPlayer?.handCards as any}
									player={socket.currentPlayer as any}
								/>
							</Grid>
						</Grid>
						<Grid item xs={1}></Grid>
					</Grid>
				</Grid>
			</DndProvider>
		)
	}
}

export default Table
