import { coordToPosition, positionToCoord, validateCoordMove, coordExceedsBoundaries, getKingCoord, includes } from '../../commons/utils'

const checkIfIsMate = (boardPieces, pieceTurn, hasKingAlreadyMoved) => {
    const pieces = []
    let isCheckMate = true

    for (const position in boardPieces) {
        if (boardPieces[position][0] === pieceTurn) {
            pieces.push({ type: boardPieces[position], coord: positionToCoord(position) })
        }
    }

    pieces.forEach((piece) => {
        const availableMoves = decidesPieceToMove(piece.type, piece.coord, pieceTurn, boardPieces, true, hasKingAlreadyMoved)
        if (availableMoves.length !== 0) {
            isCheckMate = false
        }
    })

    return isCheckMate
}

const checkIfIsDraw = (boardPieces, pieceTurn, hasKingAlreadyMoved) => {
    const pieces = []
    let isDraw = true

    for (const position in boardPieces) {
        if (boardPieces[position][0] === pieceTurn) {
            pieces.push({ type: boardPieces[position], coord: positionToCoord(position) })
        }
    }

    pieces.forEach((piece) => {
        const availableMoves = decidesPieceToMove(piece.type, piece.coord, pieceTurn, boardPieces, false, hasKingAlreadyMoved)
        if (availableMoves.length !== 0) {
            isDraw = false
        }
    })

    return isDraw
}

const kingCanBeProtected = (boardPieces, nextMoveCoord, kingType, protectorCoord) => {
    const kingCoord = getKingCoord(boardPieces, kingType)

    // It's not possible to occupy king's square
    if (nextMoveCoord.x === kingCoord.x && nextMoveCoord.y === kingCoord.y) {
        return false
    }

    const protectorPosition = coordToPosition(protectorCoord)
    const nextMovePosition = coordToPosition(nextMoveCoord)

    const newBoardPieces = { ...boardPieces, [nextMovePosition]: boardPieces[protectorPosition] }
    delete newBoardPieces[protectorPosition] // erase the piece from its original position

    return kingCanMove(getKingCoord(newBoardPieces, kingType), newBoardPieces, kingType)
}

const infiniteMove = (pieceCoord, boardPieces, type, moveType, isKingChecked) => {
    const moves = []
    // if (isKingChecked) return moves

    const signs = moveType === 'diagonal' ? [[1, 1], [1, -1], [-1, 1], [-1, -1]] : [[1, 0], [-1, 0], [0, 1], [0, -1]]

    signs.forEach((sign) => {
        const [xSign, ySign] = sign
        let nextMoveCoord = { x: pieceCoord.x + (xSign * 1), y: pieceCoord.y + (ySign * 1) }
        let counter = 1

        while (true) {
            const haveToBreak = validateCoordMove(moves, nextMoveCoord, boardPieces, type, isKingChecked, pieceCoord)
            if (haveToBreak) break

            counter++
            nextMoveCoord = { x: pieceCoord.x + (xSign * counter), y: pieceCoord.y + (ySign * counter) }
        }
    })
    return moves
}

// For rook and queen
const straightMove = (pieceCoord, boardPieces, type, isKingChecked) => {
    return infiniteMove(pieceCoord, boardPieces, type, 'straight', isKingChecked)
}

// For bishop and queen
const diagonalMove = (pieceCoord, boardPieces, type, isKingChecked) => {
    return infiniteMove(pieceCoord, boardPieces, type, 'diagonal', isKingChecked)
}

const rookMove = (pieceCoord, boardPieces, type, isKingChecked) => {
    return straightMove(pieceCoord, boardPieces, type, isKingChecked)
}


const bishopMove = (coord, boardPieces, type, isKingChecked) => {
    return diagonalMove(coord, boardPieces, type, isKingChecked)
}

const queenMove = (pieceCoord, boardPieces, type, isKingChecked) => {
    return [...diagonalMove(pieceCoord, boardPieces, type, isKingChecked), ...straightMove(pieceCoord, boardPieces, type, isKingChecked)]
}

const kingMove = (pieceCoord, boardPieces, type, isKingChecked, hasKingAlreadyMoved) => {
    const moves = []

    const diagonalSign = [[1, 1], [1, -1], [-1, 1], [-1, -1]]
    const straightSign = [[1, 0], [-1, 0], [0, 1], [0, -1]]

    diagonalSign.forEach((sign) => {
        const nextMoveCoord = { x: pieceCoord.x + (sign[0] * 1), y: pieceCoord.y + (sign[1] * 1) }
        validateCoordMove(moves, nextMoveCoord, boardPieces, type, isKingChecked, pieceCoord)
    })

    straightSign.forEach((sign) => {
        const nextMoveCoord = { x: pieceCoord.x + (sign[0] * 1), y: pieceCoord.y + (sign[1] * 1) }
        validateCoordMove(moves, nextMoveCoord, boardPieces, type, isKingChecked, pieceCoord)
    })

    const castelingMoves = validateCasteling(pieceCoord, boardPieces, type, isKingChecked, hasKingAlreadyMoved)
    castelingMoves.forEach((move) => {
        moves.push({ ...move, casteling: true })
    })

    // console.log('kingMove', moves)

    return moves
}

const isRookAndKingConnected = (boardPieces, type, castelingType) => {
    let returnBoolean = false

    const checkLongCoords = {
        white: [{ x: 4, y: 8 }, { x: 3, y: 8 }, { x: 2, y: 8 }, { x: 1, y: 8 }],
        black: [{ x: 4, y: 1 }, { x: 3, y: 1 }, { x: 2, y: 1 }, { x: 1, y: 1 }]
    }
    const checkShortCoords = {
        white: [{ x: 6, y: 8 }, { x: 7, y: 8 }, { x: 8, y: 8 }],
        black: [{ x: 6, y: 1 }, { x: 7, y: 1 }, { x: 8, y: 1 }]
    }
    if (castelingType === 'long') {
        const checkCoords = type[0] === 'w' ? checkLongCoords.white : checkLongCoords.black
        for (let i = 0; i < checkCoords.length; i++) {
            const pieceCoord = checkCoords[i]
            const piecePosition = coordToPosition(pieceCoord)


            if (boardPieces[piecePosition]) {
                // The last square has to have a rook
                if (i === (checkCoords.length - 1) && boardPieces[piecePosition] === type[0].concat('r')) {
                    returnBoolean = true
                }
                return returnBoolean
            }
        }

    } else if (castelingType === 'short') {
        const checkCoords = type[0] === 'w' ? checkShortCoords.white : checkShortCoords.black
        for (let i = 0; i < checkCoords.length; i++) {
            const pieceCoord = checkCoords[i]
            const piecePosition = coordToPosition(pieceCoord)


            if (boardPieces[piecePosition]) {
                if (i === (checkCoords.length - 1) && boardPieces[piecePosition] === type[0].concat('r')) {
                    returnBoolean = true
                }
                return returnBoolean
            }
        }
    }

    return returnBoolean
}

const validateCasteling = (pieceCoord, boardPieces, type, isKingChecked, kingAlreadyMovedArray) => {
    let movesToLeft = []
    let movesToRight = []
    const moves = []

    const kingAlreadyMoved = type[0] === 'w' ? kingAlreadyMovedArray[0] : kingAlreadyMovedArray[1]


    if (kingAlreadyMoved || isKingChecked) return []


    const nextMoveCoordLeft1 = { ...pieceCoord, x: pieceCoord.x - 1 }
    const nextMoveCoordLeft2 = { ...pieceCoord, x: pieceCoord.x - 2 }

    validateCoordMove(movesToLeft, nextMoveCoordLeft1, boardPieces, type, isKingChecked, pieceCoord)
    validateCoordMove(movesToLeft, nextMoveCoordLeft2, boardPieces, type, isKingChecked, pieceCoord)
    if (!isRookAndKingConnected(boardPieces, type, 'long')) movesToLeft = []


    const nextMoveCoordRight1 = { ...pieceCoord, x: pieceCoord.x + 1 }
    const nextMoveCoordRight2 = { ...pieceCoord, x: pieceCoord.x + 2 }

    validateCoordMove(movesToRight, nextMoveCoordRight1, boardPieces, type, isKingChecked, pieceCoord)
    validateCoordMove(movesToRight, nextMoveCoordRight2, boardPieces, type, isKingChecked, pieceCoord)
    if (!isRookAndKingConnected(boardPieces, type, 'short')) movesToRight = []

    if (movesToLeft.length) {
        if (movesToLeft.length === 2) moves.push(movesToLeft[movesToLeft.length - 1])
    }

    if (movesToRight.length) {
        if (movesToRight.length === 2) moves.push(movesToRight[movesToRight.length - 1])
    }


    return moves
}

// Returns list of coords to move
const horseMove = (coord, boardPieces, type, isKingChecked) => {
    const moves = []

    const signs = [[1, 1], [1, -1], [-1, 1], [-1, -1]]
    for (let i = 0; i < 4; i++) {
        const newX = coord.x + (2 * signs[i][0])
        const newY = coord.y + (1 * signs[i][1])
        const nextMoveCoord = { x: newX, y: newY }
        validateCoordMove(moves, nextMoveCoord, boardPieces, type, isKingChecked, coord)

    }
    for (let i = 0; i < 4; i++) {
        const newX = coord.x + (1 * signs[i][0])
        const newY = coord.y + (2 * signs[i][1])
        const nextMoveCoord = { x: newX, y: newY }
        validateCoordMove(moves, nextMoveCoord, boardPieces, type, isKingChecked, coord)
    }
    return moves
}

// Todo: En passant
const pawnMove = (type, coord, boardPieces) => {
    const moves = []


    // Test if the piece is black
    if (type.split('')[0] === 'b') {
        let [y1, y2] = [coord.y + 1, coord.y + 2]

        // Check if there is enemies pieces on diagonals
        const positionBottomRight = coordToPosition({ x: coord.x + 1, y: y1 })
        const positionBottomLeft = coordToPosition({ x: coord.x - 1, y: y1 })
        if (boardPieces[positionBottomRight]) {
            if (type.split('')[0] !== boardPieces[positionBottomRight].split('')[0]) moves.push({ ...positionToCoord(positionBottomRight), target: true })
        }
        if (boardPieces[positionBottomLeft]) {
            if (type.split('')[0] !== boardPieces[positionBottomLeft].split('')[0]) moves.push({ ...positionToCoord(positionBottomLeft), target: true })
        }

        // Ensures pawns cannot move straight if any piece is on the way
        const position1 = coordToPosition({ ...coord, y: y1 })
        if (boardPieces[position1] !== undefined) return moves
        if (y1 >= 1 && y1 <= 8) moves.push({ ...coord, y: y1 })

        const position2 = coordToPosition({ ...coord, y: y2 })

        //invalidate the y2 move if pawn has passed the middle of the board
        if (y2 > 4) return moves

        if (boardPieces[position2] === undefined) {
            moves.push({ ...coord, y: y2 })
        }

    } else {
        let [y1, y2] = [coord.y - 1, coord.y - 2]

        // Check if there is enemies pieces on diagonals
        const positionBottomRight = coordToPosition({ x: coord.x + 1, y: y1 })
        const positionBottomLeft = coordToPosition({ x: coord.x - 1, y: y1 })
        if (boardPieces[positionBottomRight]) {
            if (type.split('')[0] !== boardPieces[positionBottomRight].split('')[0]) moves.push({ ...positionToCoord(positionBottomRight), target: true })
        }
        if (boardPieces[positionBottomLeft]) {
            if (type.split('')[0] !== boardPieces[positionBottomLeft].split('')[0]) moves.push({ ...positionToCoord(positionBottomLeft), target: true })
        }

        // Ensures pawns cannot move straight if any piece is on the way
        const position1 = coordToPosition({ ...coord, y: y1 })
        if (boardPieces[position1] !== undefined) return moves
        if (y1 >= 1 && y1 <= 8) moves.push({ ...coord, y: y1 })

        const position2 = coordToPosition({ ...coord, y: y2 })

        //invalidate the y2 move if pawn has passed the middle of the board
        if (y2 < 5) return moves

        if (boardPieces[position2] === undefined) {
            moves.push({ ...coord, y: y2 })
        }

    }

    return moves
}

const validatePawnMoves = (moves, boardPieces, pawnCoord, type) => {
    // Check if there is a possible promotion
    moves = checkPromotion(moves, type)

    // check if king is safe with those moves
    const movesChecked = moves.filter(moveCoord => kingCanBeProtected(boardPieces, moveCoord, type[0].concat('k'), pawnCoord))
    return movesChecked
}

const checkPromotion = (moves, type) => {
    let movements
    if (type[0] === 'b') {
        movements = moves.map((coord) => {
            if (coord.y === 8) return { ...coord, promotion: true }
            else return coord
        })
    } else {
        movements = moves.map((coord) => {
            if (coord.y === 1) return { ...coord, promotion: true }
            else return coord
        })
    }
    return movements
}

const decidesPieceToMove = (type, coord, pieceTurn, boardPieces, isKingChecked, hasKingAlreadyMoved) => {
    let moveDotsCoord = []
    // Decides who will move
    if (pieceTurn === 'w') {
        switch (type) {
            case 'wp':
                moveDotsCoord = [...pawnMove(type, coord, boardPieces, isKingChecked)]
                moveDotsCoord = validatePawnMoves(moveDotsCoord, boardPieces, coord, type)
                break
            case 'wn':
                moveDotsCoord = [...horseMove(coord, boardPieces, type, isKingChecked)]
                break
            case 'wb':
                moveDotsCoord = [...bishopMove(coord, boardPieces, type, isKingChecked)]
                break
            case 'wr':
                moveDotsCoord = [...rookMove(coord, boardPieces, type, isKingChecked)]
                break
            case 'wq':
                moveDotsCoord = [...queenMove(coord, boardPieces, type, isKingChecked)]
                break
            case 'wk':
                moveDotsCoord = [...kingMove(coord, boardPieces, type, isKingChecked, hasKingAlreadyMoved)]
                break

        }
    } else {
        switch (type) {
            case 'bp':
                moveDotsCoord = [...pawnMove(type, coord, boardPieces, isKingChecked)]
                moveDotsCoord = validatePawnMoves(moveDotsCoord, boardPieces, coord, type)
                break
            case 'bn':
                moveDotsCoord = [...horseMove(coord, boardPieces, type, isKingChecked)]
                break
            case 'bb':
                moveDotsCoord = [...bishopMove(coord, boardPieces, type, isKingChecked)]
                break
            case 'br':
                moveDotsCoord = [...rookMove(coord, boardPieces, type, isKingChecked)]
                break
            case 'bq':
                moveDotsCoord = [...queenMove(coord, boardPieces, type, isKingChecked)]
                break
            case 'bk':
                moveDotsCoord = [...kingMove(coord, boardPieces, type, isKingChecked, hasKingAlreadyMoved)]
                break
        }
    }

    return moveDotsCoord
}


const kingCanMove = (nextMoveCoord, boardPieces, type) => {
    let isKingSafe = true

    // Check diagonal threats
    const diagonalSign = [[1, 1], [1, -1], [-1, 1], [-1, -1]]
    const blackPawnDiagonals = [[1, 1], [-1, 1]]
    const whitePawnDiagonals = [[1, -1], [-1, -1]]

    const pawnDiagonalsThreat = type[0] === 'w' ? whitePawnDiagonals : blackPawnDiagonals

    diagonalSign.forEach(sign => {
        const [xSign, ySign] = sign

        let nextThreatCoord = { x: nextMoveCoord.x + (xSign * 1), y: nextMoveCoord.y + (ySign * 1) }
        let counter = 1


        while (true) {
            const nextThreatPosition = coordToPosition(nextThreatCoord)

            if (coordExceedsBoundaries(nextThreatCoord)) break

            if (boardPieces[nextThreatPosition]) {
                if (boardPieces[nextThreatPosition][0] !== type[0]) {
                    if (boardPieces[nextThreatPosition][1] === 'q' || boardPieces[nextThreatPosition][1] === 'b') {
                        isKingSafe = false
                        break
                    }
                    else if (boardPieces[nextThreatPosition][1] === 'p' && counter === 1) {
                        if (!includes(pawnDiagonalsThreat, sign)) break // excludes threats on all diagonals from pawns
                        isKingSafe = false
                        break
                    }
                    else if (boardPieces[nextThreatPosition][1] === 'k' && counter === 1) {
                        isKingSafe = false
                        break
                    }
                    else {
                        // if it doesn't find any threat 
                        break
                    }
                } else {
                    // if it doesn't find any threat 
                    break
                }
            }

            counter++
            nextThreatCoord = { x: nextMoveCoord.x + (xSign * counter), y: nextMoveCoord.y + (ySign * counter) }
        }
    })

    // Check Straight threats
    const straightSign = [[1, 0], [-1, 0], [0, 1], [0, -1]]

    straightSign.forEach(sign => {
        const [xSign, ySign] = sign

        let nextThreatCoord = { x: nextMoveCoord.x + (xSign * 1), y: nextMoveCoord.y + (ySign * 1) }
        let counter = 1



        while (true) {
            const nextTreatPosition = coordToPosition(nextThreatCoord)

            if (coordExceedsBoundaries(nextThreatCoord)) break
            
            if (boardPieces[nextTreatPosition]) {
                if (boardPieces[nextTreatPosition][0] !== type[0]) {
                    if (boardPieces[nextTreatPosition][1] === 'q' || boardPieces[nextTreatPosition][1] === 'r') {
                        isKingSafe = false
                        break
                    } else if (boardPieces[nextTreatPosition][1] === 'k' && counter === 1) {
                        isKingSafe = false
                        break
                    }
                    else {
                        // if it doesn't find any threat 
                        break
                    }
                }
                else {
                    // if it doesn't find any threat 
                    break
                }
            }

            counter++
            nextThreatCoord = { x: nextMoveCoord.x + (xSign * counter), y: nextMoveCoord.y + (ySign * counter) }
        }
    })

    // Check Knight Threats
    const signs = [[1, 1], [1, -1], [-1, 1], [-1, -1]]

    for (let i = 0; i < 4; i++) {
        const newX = nextMoveCoord.x + (2 * signs[i][0])
        const newY = nextMoveCoord.y + (1 * signs[i][1])
        const knightThreatCoord = { x: newX, y: newY }
        const knightThreatPosition = coordToPosition(knightThreatCoord)

        if (boardPieces[knightThreatPosition]) {
            if (boardPieces[knightThreatPosition][0] !== type[0] && boardPieces[knightThreatPosition][1] === 'n') {
                isKingSafe = false
            }
        }

    }
    for (let i = 0; i < 4; i++) {
        const newX = nextMoveCoord.x + (1 * signs[i][0])
        const newY = nextMoveCoord.y + (2 * signs[i][1])
        const knightThreatCoord = { x: newX, y: newY }
        const knightThreatPosition = coordToPosition(knightThreatCoord)

        if (boardPieces[knightThreatPosition]) {
            if (boardPieces[knightThreatPosition][0] !== type[0] && boardPieces[knightThreatPosition][1] === 'n') {
                isKingSafe = false
            }
        }
    }

    return isKingSafe
}

export { kingMove, pawnMove, validatePawnMoves, rookMove, queenMove, horseMove, bishopMove, decidesPieceToMove, kingCanMove, kingCanBeProtected, checkIfIsMate, checkIfIsDraw }