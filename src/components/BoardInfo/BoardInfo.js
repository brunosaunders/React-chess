import React, { useEffect } from "react";
import './BoardInfo.css'

const BoardInfo = ({ boardMoves, boardMovesIndex, handleFallback, handleAdvance }) => {

    useEffect(() => {
        const script = document.createElement('script');

        script.src = "https://kit.fontawesome.com/6ee30b40d0.js";
        script.async = true;

        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        }
    }, []);

    const Button = ({ title, handleClick }) => (
        <button className='btn-advance-history' onClick={handleClick}>{title}</button>
    )

    const ArrowButton = ({ type, handleClick }) => {
        return (
            <div className="btn-history" onClick={handleClick}>
                <i className={type === 'right' ? 'fa-solid fa-angle-right' : 'fa-solid fa-angle-left'}></i>
            </div>
        )
    }

    const AnalysisButton = () => {
        return (
            <div className="btn-history" >
                <i className="fa-solid fa-magnifying-glass"></i>
            </div>)
    }

    const NewGameButton = () => (
        <div className="btn-history" >
            <i className="fa-duotone fa-plus"></i>
        </div>
    )
    const MoveLabel = ({ name, active }) => (
        <span className={active ? 'label-move-active' : "label-move"}>
            {name}
        </span>
    )

    return (
        <div className='board-info'>
            <div className='board-history'>
                {boardMoves.map((move, index) => {
                    return <MoveLabel name={move.movement.label} active={index === boardMovesIndex}/>
                })}
            </div>
            <div className='buttons-container'>
                {/* <Button title='voltar' handleClick={handleFallback}></Button>
                <Button title='avançar'><i class="fa-solid fa-angle-right"></i></Button> */}
                <NewGameButton />
                <ArrowButton type='left' handleClick={handleFallback} />
                <ArrowButton type='right' handleClick={handleAdvance} />
                <AnalysisButton />
            </div>
        </div>
    )
}



export default BoardInfo