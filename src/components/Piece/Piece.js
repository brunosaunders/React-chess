import React from "react";
import './Piece.css';
import MoveSquares from "../MoveSquares/MoveSquares";

const Piece = ({ type, coord, handleClick, isInPast, highlight, handlePieceMove, pieceTurn, boardPieces, isKingChecked, hasKingAlreadyMoved }) => {
    let isActive
    const isPieceTurn = pieceTurn === type[0]

    let pieceClass = ''
    pieceClass = (`piece ${type} sq-${coord.y}${coord.x}`)

    if (coord.x === highlight.x && coord.y === highlight.y) {
        pieceClass = pieceClass.concat(' light-up')
        isActive = true
    }

    const onClick = () => {
        handleClick(isActive ? { x: 0, y: 0 } : coord)
    }

    const renderPiece = () => {
        if (isPieceTurn && !isInPast) {
            return <div className={pieceClass.concat(' grab')} onClick={onClick} />
        }
        return <div className={pieceClass} />
    }

    return (
        <>
            {renderPiece()}

            {isActive && !isInPast ? <MoveSquares key={type.concat(coord.x).concat(coord.y)} type={type} coord={coord} handlePieceMove={handlePieceMove} pieceTurn={pieceTurn} boardPieces={boardPieces} isKingChecked={isKingChecked} hasKingAlreadyMoved={hasKingAlreadyMoved}/> : ''}

        </>

    )
}

export default Piece