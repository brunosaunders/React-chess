import { kingCanBeProtected, kingCanMove } from "../components/MoveSquares/movements"

const includes = (matrix, array) => {
    let returnBoolean = false

    for (const item of matrix) {
        if (JSON.stringify(item) === JSON.stringify(array)) returnBoolean = true
    }
    return returnBoolean
}

const coordToPosition = (coord) => {
    return `sq${coord.y}${coord.x}`
}

const positionToCoord = (position) => {
    const coords = position.split('q')[1]
    const coord = { x: Number(coords[1]), y: Number(coords[0]) }
    return coord
}

const getKingCoord = (boardPieces, type) => {
    let kingCoord
    for (const position in boardPieces) {
        if (boardPieces[position]) {
            if (boardPieces[position] === type) kingCoord = positionToCoord(position)
        }
    }

    return kingCoord
}


const validateCoordMove = (moves, nextMoveCoord, boardPieces, type, isKingChecked, pieceCoord) => {
    let haveToBreak = false // Used in infinite move (bishop, rook and queen)
    const nextMovePosition = coordToPosition(nextMoveCoord)

    if (type[1] === 'k') {
        if (!kingCanMove(nextMoveCoord, boardPieces, type)) {
            return
        }
    }

    if (isKingChecked) {
        if (boardPieces[nextMovePosition]) {
            if (boardPieces[nextMovePosition][0] !== type[0]) {
                if (kingCanBeProtected(boardPieces, nextMoveCoord, type[0].concat('k'), pieceCoord)) {
                    moves.push({ ...nextMoveCoord, target: true })
                }
            }
            haveToBreak = true
        } else {
            if (kingCanBeProtected(boardPieces, nextMoveCoord, type[0].concat('k'), pieceCoord) && !coordExceedsBoundaries(nextMoveCoord)) {
                moves.push(nextMoveCoord)
                haveToBreak = true
            }
            else if (coordExceedsBoundaries(nextMoveCoord)) {
                haveToBreak = true
            }
        }

        // King not checked
    } else {
        // Piece stuck
        if (!kingCanBeProtected(boardPieces, nextMoveCoord, type[0].concat('k'), pieceCoord)) {
            haveToBreak = true
            return haveToBreak
        }

        if (boardPieces[nextMovePosition]) {
            if (boardPieces[nextMovePosition][0] !== type[0]) {
                moves.push({ ...nextMoveCoord, target: true })
            }
            haveToBreak = true
        } else {
            if (!coordExceedsBoundaries(nextMoveCoord)) moves.push(nextMoveCoord)
            else haveToBreak = true
        }
    }



    return haveToBreak
}

const coordExceedsBoundaries = (coord) => {
    return (coord.x > 8 || coord.x < 1 || coord.y > 8 || coord.y < 1)
}
const startBoard = () => ({
    sq11: 'br', sq12: 'bn', sq13: 'bb', sq14: 'bq', sq15: 'bk', sq16: 'bb', sq17: 'bn', sq18: 'br',
    sq21: 'bp', sq22: 'bp', sq23: 'bp', sq24: 'bp', sq25: 'bp', sq26: 'bp', sq27: 'bp', sq28: 'bp',
    sq81: 'wr', sq82: 'wn', sq83: 'wb', sq84: 'wq', sq85: 'wk', sq86: 'wb', sq87: 'wn', sq88: 'wr',
    sq71: 'wp', sq72: 'wp', sq73: 'wp', sq74: 'wp', sq75: 'wp', sq76: 'wp', sq77: 'wp', sq78: 'wp',
})

// TESTING
// const startBoard1 = () => ({
//     sq18: 'bk', sq51: 'bp',
//     sq81: 'wr', sq82: 'wn', sq83: 'wb', sq26: 'wq', sq85: 'wk', sq86: 'wb', sq87: 'wn', sq88: 'wr',
//     sq71: 'wp', sq62: 'wp', sq73: 'wp', sq74: 'wp', sq75: 'wp', sq76: 'wp', sq77: 'wp', sq78: 'wp',
// })

const newBoard = (board, move, isMovingForward = true) => {
    if (isMovingForward) {
        delete board[move.movement.previousPosition]
        board = { ...board, [move.movement.actualPosition]: move.movement.type }

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
            board = { ...board, [move.cemitery.position]: move.cemitery.deadPieceType }
        }

        // casteling movements needs to restore one more movement
        if (move.movement.casteling) {
            board = { ...board, [move.movement.casteling.previousPosition]: move.movement.casteling.type }
            delete board[move.movement.casteling.actualPosition]
        }
    }
    return board
}

export { coordToPosition, positionToCoord, coordExceedsBoundaries, validateCoordMove, getKingCoord, startBoard, newBoard, includes }