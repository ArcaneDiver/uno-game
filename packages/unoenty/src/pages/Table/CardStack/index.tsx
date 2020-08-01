import React, { useRef, useState } from "react"
import { Container, Menu } from "@material-ui/core"
import { useDrop } from "react-dnd"

import { CardData, CardTypes, CardColors } from "@uno-game/protocols"

import useSocket from "@/hooks/useSocket"
import useDidMount from "@/hooks/useDidMount"

import { CARD_TYPE } from "@/pages/Table/CardDeck"

import useStyles from "@/pages/Table/CardStack/styles"

import { useCardStore } from "@/store/Card"

import { DraggedCardItem } from "@/pages/Table/CardDeck"

import ChangeColorModal from "@/pages/Table/ChangeColorModal"

type Props = {
	cards: CardData[]
	onDrop: (cardIds: string[], selectedColor: CardColors) => void
}

const CardStack = (props: Props) => {
	const [cardStackStateMessage, setCardStackStateMessage] = useState<string>("")

	const socket = useSocket()

	const cardStore = useCardStore()

	const { cards, onDrop } = props

	const classes = useStyles()
	const cardStackRef = useRef()

	const handleDrop = async (card: DraggedCardItem) => {
		let selectedColor = "" as CardColors

		const isColorEffectCard = (cardType: CardTypes) => cardType === "buy-4" || cardType === "change-color"

		const cardComboIds = cardStore?.selectedCards?.reverse().map(card => card.id)

		const isSingleColorEffect = isColorEffectCard(card.cardType)
		const isComboColorEffect = cardComboIds?.length > 1 && cardStore?.selectedCards?.every(card => isColorEffectCard(card.type))

		if (isSingleColorEffect || isComboColorEffect) {
			selectedColor = await ChangeColorModal.open()

			if (!selectedColor) {
				return
			}
		}

		if (cardComboIds?.length > 1) {
			onDrop(cardComboIds, selectedColor)
		} else {
			onDrop([card.id], selectedColor)
		}
	}

	const [{ isHovering }, drop] = useDrop({
    accept: CARD_TYPE,
		drop: (item: any) => handleDrop(item),
		collect: monitor => ({
			isHovering: monitor.isOver()
		})
	})
	
	drop(cardStackRef)

	const handleCardStackBuyCardsCombo = (amountToBuy: number) => {
		setCardStackStateMessage(`+${amountToBuy}`)

		setTimeout(() => {
			setCardStackStateMessage("")
		}, 1500)
	}

	useDidMount(() => {
		socket.onCardStackBuyCardsCombo(handleCardStackBuyCardsCombo)
	})

	return (
		<>
			<Menu
				anchorEl={cardStackRef?.current}
				keepMounted
				open={!!cardStackStateMessage}
				anchorOrigin={{
					horizontal: "right",
					vertical: "bottom"
				}}
				PaperProps={{
					className: classes.cardStackStateMessage
				}}
				style={{ zIndex: -1 }}
			>
				{cardStackStateMessage}
			</Menu>
			<Container
				disableGutters
				className={classes.cardContainer}
				maxWidth={false}
				innerRef={cardStackRef}
				style={{
					backgroundColor: isHovering ? "rgba(255, 255, 255, 0.7)" : "rgba(255, 255, 255, 0.1)"
				}}
			>
				{cards?.map((card, index) => (
					<img
						key={card.id}
						className={classes.card}
						alt={card.name}
						src={card.src}
						style={{
							transform: `rotate(${cards.length - index}rad)`,
							zIndex: cards.length - index,
							boxShadow: `0 0 25px ${(index === 0) ? "#000000" : "transparent"}`,
							filter: (index === 0) ? "saturate(1.5)" : "contrast(0.5)"
						}}
					/>
				))}
			</Container>
		</>
	)
}

export default CardStack
