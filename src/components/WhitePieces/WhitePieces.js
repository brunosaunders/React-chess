import React from "react";
import Piece from "../Piece/Piece";

const WhitePieces = ({handleClick, highlight}) => {
    return (
        <>
            <Piece type={'wr'} coord={{x:1, y:8}} handleClick={handleClick} highlight={highlight}/>
            <Piece type={'wr'} coord={{x:8, y:8}} handleClick={handleClick} highlight={highlight}/>
            <Piece type={'wn'} coord={{x:2, y:8}} handleClick={handleClick} highlight={highlight}/>
            <Piece type={'wn'} coord={{x:7, y:8}} handleClick={handleClick} highlight={highlight}/>
            <Piece type={'wb'} coord={{x:3, y:8}} handleClick={handleClick} highlight={highlight}/>
            <Piece type={'wb'} coord={{x:6, y:8}} handleClick={handleClick} highlight={highlight}/>
            <Piece type={'wq'} coord={{x:4, y:8}} handleClick={handleClick} highlight={highlight}/>
            <Piece type={'wk'} coord={{x:5, y:8}} handleClick={handleClick} highlight={highlight}/>
            
            <Piece type={'wp'} coord={{x:1, y:7}} handleClick={handleClick} highlight={highlight}/>
            <Piece type={'wp'} coord={{x:8, y:7}} handleClick={handleClick} highlight={highlight}/>
            <Piece type={'wp'} coord={{x:2, y:7}} handleClick={handleClick} highlight={highlight}/>
            <Piece type={'wp'} coord={{x:7, y:7}} handleClick={handleClick} highlight={highlight}/>
            <Piece type={'wp'} coord={{x:3, y:7}} handleClick={handleClick} highlight={highlight}/>
            <Piece type={'wp'} coord={{x:6, y:7}} handleClick={handleClick} highlight={highlight}/>
            <Piece type={'wp'} coord={{x:4, y:7}} handleClick={handleClick} highlight={highlight}/>
            <Piece type={'wp'} coord={{x:5, y:7}} handleClick={handleClick} highlight={highlight}/>
        </>
    )
}

export default WhitePieces