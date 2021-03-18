import { useState } from 'react'
import styled from 'styled-components'

// Style our elements-- these are our basic GUI building blocks

const SqButton = styled.button`
  background-color: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(0, 0, 0, 0.8);
  padding: 10px;
  margin: 5px;
  box-sizing: border-box;
`

const Board = styled.div`
  display: grid;
  grid-template-columns: 50px 50px 50px;
  background-color: #2196F3;
  margin-top: 15px;
  padding: 10px;
  width: 170px;
  box-sizing: border-box;
`

const Square = ({ fxn, sqId, val }: any) => {
  return (
    <SqButton onClick={() => fxn(sqId)} disabled={val !== '_' || val === '-'}>{val}</SqButton>
  )
}

interface IGame {
  currentPlayer: string,
  boardState: Array<string>,
  history: Array<Array<string>>,
  winner: null | string
}

const Game = () => {
  const gameInitialState: IGame = {
    currentPlayer: 'X',
    boardState: Array(9).fill('_'),
    history: [Array(9).fill('_')],
    winner: null
  }
  const [gameState, setGameState] = useState(gameInitialState)

  function checkIfWinnerExists (boardState: Array<string>): null | string {
    console.log('>> checkIfWinnerExists:', boardState)
    const winningPatterns: Array<Array<number>> = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ]
    for (const pattern of winningPatterns) {
      const [loc1, loc2, loc3] = pattern
      const candidateBoard = [boardState[loc1], boardState[loc2], boardState[loc3]]
      if (candidateBoard.every(item => item === 'X')) {
        return 'X'
      } else if (candidateBoard.every(item => item === 'O')) {
        return 'O'
      }
    }
    return null
  }

  function occupySquare (sqId: number): void {
    console.log('>> occupySquare:', sqId, gameState.currentPlayer)

    setGameState(oldGameState => {
      let newBoardState = oldGameState.boardState.slice()
      newBoardState[sqId] = gameState.currentPlayer

      // Handle the case where we've time-traveled back to this board state.
      // If that's the case, erase all remaining history.
      // We're forking the timeline!
      const currentMove = newBoardState.reduce((acc: number, el: string) => acc + Number(el !== '_'), 0)
      const history = oldGameState.history.slice(0, currentMove)

      // Check if there's a winner?
      const winner: string | null = checkIfWinnerExists(newBoardState)
      console.log('>> winnerExists', winner)

      // If a winner exists, disable all remaining board states
      if (winner) {
        newBoardState = newBoardState.map(item => item === '_' ? '-' : item)
      }

      return ({
        currentPlayer: oldGameState.currentPlayer === 'X' ? 'O' : 'X',
        boardState: newBoardState,
        history: [...history, newBoardState],
        winner: winner
      })
    })
    console.log('>> history:', gameState.history)
  }

  function timeTravel (move: number): void {
    console.log('Time travel to move:', move)
    setGameState(oldGameState => {
      const winner: string | null = checkIfWinnerExists(oldGameState.history[move])
      return ({
        currentPlayer: move % 2 === 0 ? 'X' : 'O', // All even moves are 'X'
        boardState: oldGameState.history[move].slice(),
        history: [...oldGameState.history],
        winner: winner
      })
    })
  }

  function resetGame (): void {
    setGameState(gameInitialState)
  }

  function getMoveNo (): number {
    return gameState.boardState.reduce((acc: number, el: string) => acc + Number(el === 'X' || el === 'O'), 0)
  }

  // Check if it's a "Cat's Game"
  // https://english.stackexchange.com/questions/155621/why-is-a-tie-in-tic-tac-toe-called-a-cats-game
  let message = <><strong>Player to Move:</strong> {gameState.currentPlayer}</>
  if (gameState.winner) {
    message = <><strong>Winner:</strong> {gameState.winner} 🚀😀</>
  } else if (!gameState.winner && gameState.history.length === 10 && getMoveNo() === 9) {
    message = <strong>Game is draw! 🤷🤷🤷</strong>
  }

  // Set title of app
  const title = <h2>Robert's Tic Tac Toe Game</h2>
  return (
    <>
      {title}
      <strong>Move #: </strong>{getMoveNo()}<br />
      {message}
      <Board>
        <Square fxn={occupySquare} sqId={0} val={gameState.boardState[0]} />
        <Square fxn={occupySquare} sqId={1} val={gameState.boardState[1]} />
        <Square fxn={occupySquare} sqId={2} val={gameState.boardState[2]} />
        <Square fxn={occupySquare} sqId={3} val={gameState.boardState[3]} />
        <Square fxn={occupySquare} sqId={4} val={gameState.boardState[4]} />
        <Square fxn={occupySquare} sqId={5} val={gameState.boardState[5]} />
        <Square fxn={occupySquare} sqId={6} val={gameState.boardState[6]} />
        <Square fxn={occupySquare} sqId={7} val={gameState.boardState[7]} />
        <Square fxn={occupySquare} sqId={8} val={gameState.boardState[8]} />
      </Board>
      <br />
      <button onClick={resetGame} disabled={gameState.history.length === 1}>Reset Game</button>
      <br /><br />
      {gameState.history.length === 1 // Only display history if it exists.
        ? ''
        : <>
          <strong>Game History:</strong><br />
          {gameState.history.map((boardState, i) =>
            <div key={'move' + i}>
              <button onClick={() => timeTravel(i)}>
                {i}: {boardState.join(' ')}
              </button><br />
            </div>
          )}
        </>
      }
    </>
  )
}

const TicTacToe = () => {
  return (
    <Game />
  )
}

export default TicTacToe
