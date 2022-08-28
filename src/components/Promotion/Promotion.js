import React from "react";
import './Promotion.css'

const promotionPieces = ['q', 'r', 'n', 'b']

const Promotion = ({ coord, type, handlePromotion }) => {

    const pieceColor = type[0] === 'w' ? 'white' : 'black'

    const renderPromotionPiece = (type) => {
        const onClick = () => {
            handlePromotion(type)
        }

        return <div className={`promotion-piece ${type}`} onClick={onClick} />
    }

    return (
        <div className={`promotion-container-${pieceColor} sq${coord.x}${coord.y}`}>
            {promotionPieces.map((piece) => {
                return renderPromotionPiece(type[0].concat(piece))
            })}
        </div>)
}

export default Promotion