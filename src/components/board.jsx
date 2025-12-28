import { useState } from 'react'
import './board.css';
import { useEffect } from 'react';

export const WINNING_LINES = [
    // строки
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],

    // колонки
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],

    // диагонали
    [0, 4, 8],
    [2, 4, 6],
];

const initialBoard = [
{ id: 0, condition: null, count: 0, disappeared: 0 },
        { id: 1, condition: null, count: 0, disappeared: 0 },
        { id: 2, condition: null, count: 0, disappeared: 0 },
        { id: 3, condition: null, count: 0, disappeared: 0 },
        { id: 4, condition: null, count: 0, disappeared: 0 },
        { id: 5, condition: null, count: 0, disappeared: 0 },
        { id: 6, condition: null, count: 0, disappeared: 0 },
        { id: 7, condition: null, count: 0, disappeared: 0 },
        { id: 8, condition: null, count: 0, disappeared: 0 }
]

function Board() {
    const [board, setBoard] = useState(initialBoard);
    const [currentEelemnt, setCurrentElement] = useState('◯');
    const [wonNumbers, setWonNumbers] = useState([]);
    const [isFinished, setIsFinished] = useState(false);
    const [winShape, setWinShape] = useState(null);
    const [isDisable, setIsDisable] = useState(false)

    const replay = () => {
        setBoard(initialBoard.map(el => ({ ...el }))); // создаём новую копию
        setWonNumbers([]);
        setIsFinished(false);
        setWinShape(null);
        setIsDisable(false)
    };

    const changeCurrentElement = () => {
        if (currentEelemnt === '◯') {
            setCurrentElement('✕')
        } else {
            setCurrentElement('◯')
        };
    }

    function checkWinner(board) {
        for (const [a, b, c] of WINNING_LINES) {
            const cellA = board[a].condition
            const cellB = board[b].condition
            const cellC = board[c].condition



            // 1. если хотя бы одна пустая — победы нет
            if (!cellA || !cellB || !cellC) continue

            // 2. если все три равны — победа
            if (cellA === cellB && cellB === cellC) {
                setWonNumbers([a, b, c]);
                setIsFinished(true);
                setWinShape(cellA)
                return cellA // 'x' или '0'
            }
        }

        return null
    }

    useEffect(() => {
        if (isFinished) {
            const newBoard = board.map(el => {
                if (wonNumbers.includes(el.id) && !el.condition) {
                    return {
                        ...el,
                        condition: winShape,
                    }
                } else {
                    return { ...el }
                }
            });
            setBoard(newBoard)
        }
    }, [isFinished])

    const putCondition = (i, cell) => {
        if(!isDisable) {
            setIsDisable(true);
        }
        if (cell.condition || isFinished) {
            return;
        };

        const newBoard = [...board]; // создаём поверхностную копию массива
        newBoard[i] = { ...newBoard[i], condition: currentEelemnt }; // создаём копию объекта внутри массива и меняем condition
        checkWinner(newBoard)
        const updatedBoard = newBoard.map(el => {
            if (!el.condition) {
                return { ...el }
            }

            if (el.count === 6) {
                return {
                    ...el,
                    count: 0,
                    disappeared: el.condition,
                    condition: null,
                }
            }

            return {
                ...el,
                count: el.count + 1,
                disappeared: 0
            }
        });
        setBoard(updatedBoard);
        changeCurrentElement();
    };


    return (
        <div className='wrapper'>
        <h1>Let's play</h1>
        <h2>Tic-Tac-Toe</h2>
            <div className='buttonSide'>
                <button onClick={() => replay()}><span className='replay'>↻</span> replay</button>
                <button 
                disabled={isDisable} 
                className={isDisable? 'btn':''}
                onClick={() => changeCurrentElement()}
                >
                    change
                    <span className={currentEelemnt === '◯' ? 'circle' : 'iks'}>{currentEelemnt}</span>
                    </button>
            </div>
            <div className='board'>
                {board.map((cell, i) => {
                    return <div
                        className={`cell ${cell.condition ?
                            cell.condition === '◯' ? 'red' : 'blue' : ''
                            }`}
                        key={i}
                        onClick={() => putCondition(i, cell)}
                    >
                        <div className={`${cell.count === 6 ? 'opacity' : ''} ${wonNumbers.includes(cell.id) ? 'winColor' : isFinished? 'opacity': ''}`}>{cell.condition}</div>
                    </div>
                })}
            </div>
        </div>
    )
}

export default Board;