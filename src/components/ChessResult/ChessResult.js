import React from "react";
import './ChessResult.css'

const ChessResult = ({ winner, handlePlayAgain }) => {

    const resultTitle = winner === 'nobody' ? 'Empate!' : `Vitória das ${winner}!`
    const resultSubtitle = winner === 'nobody' ? 'por afogamento' : 'por xeque-mate'
    return (
        <div className="result-popup">
            <div className="green-circle"></div>

            <div className="result-title">{resultTitle}</div>
            <div className="result-subtitle">{resultSubtitle}</div>
            <div className="profile-photos-row">
                <div>
                    <div className="profile-photo-white"></div>
                    <div className="score-green">brancas</div>
                </div>
                <div className="score-green">1-0</div>
                <div>
                    <div className="profile-photo-black"></div>
                    <div className="score-green">pretas</div>
                </div>
            </div>


            <div className="container-play-again"><button className="btn-play-again" onClick={handlePlayAgain}>Jogar novamente</button></div>

        </div>
    )
}

export default ChessResult