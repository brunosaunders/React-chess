import React from "react";
import Piece from "../Piece/Piece";

const BlackPieces = ({handleClick, highlight}) => {
    return (
        <>
            <Piece type={'br'} coord={{x:1, y:1}} handleClick={handleClick} highlight={highlight}/>
            <Piece type={'br'} coord={{x:8, y:1}} handleClick={handleClick} highlight={highlight}/>
            <Piece type={'bn'} coord={{x:2, y:1}} handleClick={handleClick} highlight={highlight}/>
            <Piece type={'bn'} coord={{x:7, y:1}} handleClick={handleClick} highlight={highlight}/>
            <Piece type={'bb'} coord={{x:3, y:1}} handleClick={handleClick} highlight={highlight}/>
            <Piece type={'bb'} coord={{x:6, y:1}} handleClick={handleClick} highlight={highlight}/>
            <Piece type={'bq'} coord={{x:4, y:1}} handleClick={handleClick} highlight={highlight}/>
            <Piece type={'bk'} coord={{x:5, y:1}} handleClick={handleClick} highlight={highlight}/>

            <Piece type={'bp'} coord={{x:1, y:2}} handleClick={handleClick} highlight={highlight}/>
            <Piece type={'bp'} coord={{x:8, y:2}} handleClick={handleClick} highlight={highlight}/>
            <Piece type={'bp'} coord={{x:2, y:2}} handleClick={handleClick} highlight={highlight}/>
            <Piece type={'bp'} coord={{x:7, y:2}} handleClick={handleClick} highlight={highlight}/>
            <Piece type={'bp'} coord={{x:3, y:2}} handleClick={handleClick} highlight={highlight}/>
            <Piece type={'bp'} coord={{x:6, y:2}} handleClick={handleClick} highlight={highlight}/>
            <Piece type={'bp'} coord={{x:4, y:2}} handleClick={handleClick} highlight={highlight}/>
            <Piece type={'bp'} coord={{x:5, y:2}} handleClick={handleClick} highlight={highlight}/>
        </>
    )
}

export default BlackPieces