import React from "react";
import './MoveSquares.css'
import '../Piece/Piece.css'
import { decidesPieceToMove } from "./movements";


const MoveSquares = ({ type, coord, handlePieceMove, pieceTurn, boardPieces, isKingChecked, hasKingAlreadyMoved }) => {
    const moveDotsCoord = decidesPieceToMove(type, coord, pieceTurn, boardPieces, isKingChecked, hasKingAlreadyMoved)
    
    const EatCircle = ({ finalCoord }) => {
        const onClick = () => handlePieceMove(coord, finalCoord, type)
        return (
            <>
                <div className={`eat-ring sq-${finalCoord.y}${finalCoord.x}`} />
                <div className={`clickable sq-${finalCoord.y}${finalCoord.x}`} onClick={onClick} />
            </>
        )
    }

    const MoveCircle = ({ finalCoord }) => {
        const onClick = () => handlePieceMove(coord, finalCoord, type)

        return (
            <>
                <div className={`move-circle sq-${finalCoord.y}${finalCoord.x}`} />
                <div className={`clickable sq-${finalCoord.y}${finalCoord.x}`} onClick={onClick} />
            </>
        )
    }


    return (
        moveDotsCoord.map((coords => {
            return coords.target ? <EatCircle finalCoord={coords} /> : <MoveCircle finalCoord={coords} />
        }))
    )
}

export default MoveSquares
