import './App.css';
import './components/Piece/Piece.css';
import React, { useState, useEffect, useRef } from 'react';
import Pieces from './components/Pieces/Pieces';
import { coordToPosition, getKingCoord, startBoard } from './commons/utils';
import { kingCanMove, checkIfIsMate, checkIfIsDraw } from './components/MoveSquares/movements';
import ChessResult from './components/ChessResult/ChessResult';
import Promotion from './components/Promotion/Promotion';
import { CastelingMove, Cemitery, Move, newBoard } from './models/Move';
import BoardInfo from './components/BoardInfo/BoardInfo';

const squares = []
for (let i = 0; i < 64; i++) {
  squares.push(i + 1)
}

function App() {
  const [boardPieces, setBoardPieces] = useState(startBoard())
  const [boardMoves, setBoardMoves] = useState([])
  const [boardMovesIndex, setBoardMovesIndex] = useState()
  const [isMovingForward, setIsMovingForward] = useState(true)
  const isInPast = useRef(false)
  const promotingMove = useRef()
  const [highlight, setHighLight] = useState({ x: 0, y: 0 })


  const [pieceTurn, setPieceTurn] = useState('w')
  const [isMate, setIsMate] = useState(false)
  const [isDraw, setIsDraw] = useState(false)
  const [winner, setWinner] = useState()

  const [isPromoting, setIsPromoting] = useState(false)
  const [promoteCoord, setPromoteCoord] = useState()
  const [promoteType, setPromoteType] = useState()

  const [blackKingHasMoved, setBlackKingHasMoved] = useState(false)
  const [whiteKingHasMoved, setWhiteKingHasMoved] = useState(false)
  const hasKingAlreadyMoved = [whiteKingHasMoved, blackKingHasMoved]

  let isKingChecked = false


  // when a move is made, updates the moveIndex to the final move
  useEffect(() => {
    if (boardMoves.length) {
      // console.log(boardMoves)
      setBoardMovesIndex(boardMoves.length - 1)
    }
  }, [boardMoves])

  const updateBoard = (isMovingForward) => {

  }

  // when moveIndex actually changes, the board updates
  useEffect(() => {
    if (boardMoves.length) {
      if (isMovingForward) {
        if (boardMovesIndex === -1 && isInPast.current) return // don't rebuild if it is the first move

        const currentMove = boardMoves[boardMovesIndex]
        const board = newBoard(boardPieces, currentMove, true)
        setBoardPieces(board)
      } else {
        const currentMove = boardMoves[boardMovesIndex]
        const board = newBoard(boardPieces, currentMove, false)
        setBoardPieces(board)

        setIsMovingForward(true)
        setBoardMovesIndex(boardMovesIndex - 1)
      
      }
    }
  }, [boardMovesIndex, isMovingForward])

  useEffect(() => {
    // Important to don't repeat this over and over
    if (!isDraw) {
      if (isPromoting) return
      if (checkIfIsDraw(boardPieces, pieceTurn, hasKingAlreadyMoved)) {
        setIsDraw(true)
        setWinner('nobody')
        setIsMate(true)
        console.log('draw')

      }
    }
  }, [pieceTurn, boardPieces])

  const handleAdvanceClick = () => {

    if (!isMovingForward) {
      setIsMovingForward(true)
    }

    if (boardMovesIndex === boardMoves.length - 1) {
      console.log('return')
      setIsMovingForward(true)
      isInPast.current = false
      return
    }

    // if (boardMovesIndex <= boardMoves.length - 2) {
    setIsMovingForward(true)
    setBoardMovesIndex(boardMovesIndex + 1)

    if (boardMovesIndex === boardMoves.length - 2) {
      isInPast.current = false
    }
    // }

  }
  const handleFallbackClick = () => {
    if (boardMovesIndex >= 0) {
      setIsMovingForward(false)
      isInPast.current = true
    }
  }

  let count = 1
  let [first, second] = ['square light', 'square dark']
  

  const handleClick = (coord) => {
    setHighLight(coord)
  }

  const handlePlayAgain = () => {
    setBoardPieces(startBoard())
    setPieceTurn('w')
    setIsMate(false)
    setHighLight({ x: 0, y: 0 })
  }

  const handlePieceMove1 = (initialCoord, finalCoord, pieceType) => {
    const initialPosition = `sq${initialCoord.y}${initialCoord.x}`
    const finalPosition = `sq${finalCoord.y}${finalCoord.x}`
    const finalPieceType = boardPieces[finalPosition] ? boardPieces[finalPosition] : ''

    let move = Move(pieceType, initialPosition, finalPosition)

    // some piece is gonna be killed
    if (boardPieces[finalPosition]) {
      const cemitery = Cemitery(finalPieceType, finalPosition)
      move = { ...move, cemitery: cemitery }
      // const board = newBoard(boardPieces, move, true)
      // setBoardPieces(board)
    }

    if (finalCoord.casteling) {
      if (finalCoord.x === 3) {
        const oldRookPosition = coordToPosition({ ...finalCoord, x: 1 })
        const newRookPosition = coordToPosition({ ...finalCoord, x: finalCoord.x + 1 })

        const casteling = CastelingMove(pieceType, oldRookPosition, newRookPosition)
        move = { ...move, movement: { ...move.movement, casteling: casteling } }
        // const board = newBoard(boardPieces, move, true)
        // setBoardPieces(board)

      } else {
        const oldRookPosition = coordToPosition({ ...finalCoord, x: 8 })
        const newRookPosition = coordToPosition({ ...finalCoord, x: finalCoord.x - 1 })

        const casteling = CastelingMove(pieceType, oldRookPosition, newRookPosition)
        move = { ...move, movement: { ...move.movement, casteling: casteling } }
        // const board = newBoard(boardPieces, move, true)
        // setBoardPieces(board)
      }

      // Piece is not casteling
    } else {
      // const board = newBoard(boardPieces, move, true)
      // setBoardPieces(board)
    }


    if (pieceType === 'wk') {
      setWhiteKingHasMoved(true)
    }
    else if (pieceType === 'bk') {
      setBlackKingHasMoved(true)
    }

    // Check if there is a promotion
    if (finalCoord.promotion) {
      setIsPromoting(true)
      setPromoteCoord(finalCoord)
      setPromoteType(pieceType)
      setPieceTurn()
      promotingMove.current = move
      return
    }

    setBoardMoves([...boardMoves, move])
    setPieceTurn(pieceTurn === 'w' ? 'b' : 'w') // After moves, change the next piece turn
  }

  const handlePromotion = (finalType) => {
    setIsPromoting(false)
    setPromoteCoord()
    setPromoteType()

    const move = {...promotingMove.current, movement: {...promotingMove.current.movement, typeAfterPromotion: finalType}}
    
    setBoardMoves([...boardMoves, move])
    setPieceTurn(finalType[0] === 'w' ? 'b' : 'w') // After promotes, change the next piece turn
  }

  useEffect(() => {
    const script = document.createElement('script');
  
    script.src = "https://kit.fontawesome.com/6ee30b40d0.js";
    script.async = true;
  
    document.body.appendChild(script);
  
    return () => {
      document.body.removeChild(script);
    }
  }, []);

  const darkOrLight = () => {

    let classReturned = count % 2 === 0 ? second : first

    if (count % 8 === 0) {
      [first, second] = [second, first]
      count++
    } else {
      count++
    }
    return classReturned
  }

  const rowIndexes = '12345678'.split('')
  const columnIndexes = 'abcdefgh'.split('')

  if (pieceTurn) {
    let kingCoord = getKingCoord(boardPieces, pieceTurn.concat('k'))
    if (!kingCanMove(kingCoord, boardPieces, pieceTurn.concat('k'))) {
      // Check if king is checked

      isKingChecked = true
      if (!isMate) {
        if (checkIfIsMate(boardPieces, pieceTurn, hasKingAlreadyMoved)) {
          setIsMate(true)
          if (pieceTurn === 'w') setWinner('pretas')
          else setWinner('brancas')
        }
      }
    }
  }

  return (
    <div className='home-container'>
      <div className='board-grid'>
        {squares.map(square => (<div key={square} className={darkOrLight()}></div>))}
        {rowIndexes.map((row, index) => <div key={row} className={`row-index sq-${index + 1}1 ${index % 2 === 0 ? 'light-text' : 'dark-text'}`} >{row}</div>)}
        {columnIndexes.map((column, index) => <div key={column} className={`column-index sq-8${index + 1} ${index % 2 === 0 ? 'light-text' : 'dark-text'}`} >{column}</div>)}

        <Pieces boardPieces={boardPieces} isInPast={isInPast.current} handleClick={handleClick} handlePieceMove={handlePieceMove1} highlight={highlight} pieceTurn={pieceTurn} isKingChecked={isKingChecked} isMate={isMate} hasKingAlreadyMoved={hasKingAlreadyMoved} />

        {isMate ? <ChessResult winner={winner} handlePlayAgain={handlePlayAgain} /> : ''}

        {isPromoting ? <Promotion coord={promoteCoord} type={promoteType} handlePromotion={handlePromotion} /> : ''}

      </div>
      <BoardInfo boardMoves={boardMoves} boardMovesIndex={boardMovesIndex} handleAdvance={handleAdvanceClick} handleFallback={handleFallbackClick} />

    </div>
  );
}

export default App;
