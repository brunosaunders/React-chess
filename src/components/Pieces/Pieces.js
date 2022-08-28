import React from "react";
import Piece from "../Piece/Piece";

const Pieces = ({ boardPieces, handleClick, isInPast, handlePieceMove, highlight, pieceTurn , isKingChecked, isMate, hasKingAlreadyMoved}) => {
    const pieces = []

    let pieceToRenderLater;

    for (const piecePosition in boardPieces) {
        if (boardPieces[piecePosition] === '') continue // In case there is nothing

        const piecePositionJustNumbers = piecePosition.split('q')[1]

        pieces.push([boardPieces[piecePosition], { x: Number(piecePositionJustNumbers[1]), y: Number(piecePositionJustNumbers[0])}, piecePosition])
    }

    return (
        <>
            {
                pieces.map(piece => {
                    // Save this piece to render later
                    const coord = piece[1]
                    if (coord.x === highlight.x && coord.y === highlight.y) {
                        pieceToRenderLater = piece
                        return ''
                    }

                    return <Piece key={piece[2]} type={piece[0]} isInPast={isInPast} coord={piece[1]} handleClick={handleClick} highlight={highlight} handlePieceMove={handlePieceMove} pieceTurn={pieceTurn} boardPieces={boardPieces} isKingChecked={isKingChecked} isCheckMate={isMate} hasKingAlreadyMoved={hasKingAlreadyMoved}/>
                })
            }
            
            {/* Render this piece later to its MoveSquares be rendered later */}

            {pieceToRenderLater ? <Piece key={pieceToRenderLater[2]} isInPast={isInPast} type={pieceToRenderLater[0]} coord={pieceToRenderLater[1]} handleClick={handleClick} highlight={highlight} handlePieceMove={handlePieceMove} boardPieces={boardPieces} pieceTurn={pieceTurn} isKingChecked={isKingChecked} hasKingAlreadyMoved={hasKingAlreadyMoved}/> : ''}
        </>
    )
}

export default Pieces