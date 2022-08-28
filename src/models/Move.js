
const CastelingMove = (type, previousPosition, actualPosition) => (
    {
        type: type[0].concat('r'),
        previousPosition: previousPosition,
        actualPosition: actualPosition
    }
)

const Cemitery = (deadPieceType, deadPiecePosition) => ({
    type: deadPieceType,
    position: deadPiecePosition
})

const Move = (moveType, prevPosition, actualPosition, cemitery, castelingMove, typeAfterPromotion) => {
    return {
        movement: {
            label: `${moveType[1]}${actualPosition.slice(2, 4)}`,
            type: moveType,
            typeAfterPromotion: typeAfterPromotion,
            previousPosition: prevPosition,
            actualPosition: actualPosition,

            casteling: {
                type: castelingMove?.type,
                previousPosition: castelingMove?.previousPosition,
                actualPosition: castelingMove?.actualPosition
            }
        },
        cemitery: cemitery
    }
}

const newBoard = (board, move, isMovingForward = true) => {
    if (isMovingForward) {
        delete board[move.movement.previousPosition]
        board = { ...board, [move.movement.actualPosition]: move.movement.typeAfterPromotion ? move.movement.typeAfterPromotion : move.movement.type }

        // if it's casteling we need to make one more movement
        if (move.castelingMove) {
            delete board[move.movement.casteling.previousPosition]
            board = { ...board, [move.movement.casteling.actualPosition]: move.movement.casteling.type }
        }   

    } else {
        // restore the previous movement
        board = { ...board, [move.movement.previousPosition]: move.movement.type }
        delete board[move.movement.actualPosition]

        // some piece was killed and needs to be restored
        if (move.cemitery) {
            board = { ...board, [move.cemitery.position]: move.cemitery.type }
        }

        // casteling movements needs to restore one more movement
        if (move.movement.casteling) {
            board = { ...board, [move.movement.casteling.previousPosition]: move.movement.casteling.type }
            delete board[move.movement.casteling.actualPosition]
        }
    }
    return board
}


export { Move, newBoard, Cemitery, CastelingMove }