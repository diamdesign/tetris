import React, { createContext, useState, useContext, useRef } from "react";

// Create a context
const GameContext = createContext();

// Create a provider component
export const GameContextProvider = ({ children }) => {
	// Define your context variables here
	const [page, setPage] = useState("");
	const [alias, setAlias] = useState("");
	const [isMuted, setMuted] = useState(false);
	const [music, setMusic] = useState("start");
	const [showDarkoverlay, setShowDarkoverlay] = useState(true);
	const [gameRunning, setGameRunning] = useState(false);
	const [isPaused, setIsPaused] = useState(true);
	const [disableControls, setDisableControls] = useState(true);
	const [level, setLevel] = useState(1);
	const [lines, setLines] = useState(10);
	const [score, setScore] = useState(0);
	const [width, setWidth] = useState(14);
	const [height, setHeight] = useState(22);
	const [minidivs, setMinidivs] = useState([]);
	const [gridArray, setGridArray] = useState([]);
	const [startX, setStartX] = useState(Math.floor(width / 2) - 2);
	const [showScore, setShowScore] = useState(false);
	const [showFullDown, setShowFullDown] = useState(false);
	const [gameOver, setGameOver] = useState(false);
	const [addedLines, setAddedLines] = useState(0);
	const [addedScore, setAddedScore] = useState(0);
	const [multiplier, setMultiplier] = useState(0);
	const [fullDownScore, setFullDownScore] = useState(10);
	const [rotation, setRotation] = useState(0);
	const [levelClassName, setLevelClassName] = useState("");
	const [isResetGame, setIsResetGame] = useState(false);
	const [timerStarted, setTimerStarted] = useState(false);
	const [milliseconds, setMilliseconds] = useState(0);

	//The Tetrominoes
	const lTetromino = [
		[
			// Original rotation (0 degrees)
			[0, 1, 0],
			[0, 1, 0],
			[0, 1, 1],
		],
		[
			// 90 degrees clockwise rotation
			[0, 0, 0],
			[1, 1, 1],
			[1, 0, 0],
		],
		[
			// 180 degrees clockwise rotation
			[1, 1, 0],
			[0, 1, 0],
			[0, 1, 0],
		],
		[
			// 270 degrees clockwise rotation
			[0, 0, 1],
			[1, 1, 1],
			[0, 0, 0],
		],
	];

	const jTetromino = [
		[
			// Original rotation (0 degrees)
			[0, 1, 0],
			[0, 1, 0],
			[1, 1, 0],
		],
		[
			// 90 degrees clockwise rotation
			[1, 0, 0],
			[1, 1, 1],
			[0, 0, 0],
		],
		[
			// 180 degrees clockwise rotation
			[0, 1, 1],
			[0, 1, 0],
			[0, 1, 0],
		],
		[
			// 270 degrees clockwise rotation
			[0, 0, 0],
			[1, 1, 1],
			[0, 0, 1],
		],
	];

	const sTetromino = [
		[
			// Original rotation (0 degrees)
			[0, 1, 1],
			[1, 1, 0],
		],
		[
			// 90 degrees clockwise rotation
			[1, 0],
			[1, 1],
			[0, 1],
		],
		[
			// 180 degrees clockwise rotation
			[0, 1, 1],
			[1, 1, 0],
		],
		[
			// 270 degrees clockwise rotation
			[1, 0],
			[1, 1],
			[0, 1],
		],
	];

	const zTetromino = [
		[
			// Original rotation (0 degrees)
			[1, 1, 0],
			[0, 1, 1],
		],
		[
			// 90 degrees clockwise rotation
			[0, 1],
			[1, 1],
			[1, 0],
		],
		[
			// 180 degrees clockwise rotation
			[1, 1, 0],
			[0, 1, 1],
		],
		[
			// 270 degrees clockwise rotation
			[0, 1],
			[1, 1],
			[1, 0],
		],
	];

	const tTetromino = [
		[
			// Original rotation (0 degrees)
			[1, 1, 1],
			[0, 1, 0],
			[0, 0, 0],
		],
		[
			// 90 degrees clockwise rotation
			[0, 1, 0],
			[1, 1, 0],
			[0, 1, 0],
		],
		[
			// 180 degrees clockwise rotation
			[0, 1, 0],
			[1, 1, 1],
			[0, 0, 0],
		],
		[
			// 270 degrees clockwise rotation
			[1, 0, 0],
			[1, 1, 0],
			[1, 0, 0],
		],
	];

	const oTetromino = [
		[
			// Original rotation (0 degrees)
			[1, 1],
			[1, 1],
		],
		[
			// 90 degrees clockwise rotation
			[1, 1],
			[1, 1],
		],
		[
			// 180 degrees clockwise rotation
			[1, 1],
			[1, 1],
		],
		[
			// 270 degrees clockwise rotation
			[1, 1],
			[1, 1],
		],
	];

	const iTetromino = [
		[
			// Original rotation (0 degrees)
			[0, 1, 0, 0],
			[0, 1, 0, 0],
			[0, 1, 0, 0],
			[0, 1, 0, 0],
		],
		[
			// 90 degrees clockwise rotation
			[0, 0, 0, 0],
			[1, 1, 1, 1],
			[0, 0, 0, 0],
			[0, 0, 0, 0],
		],
		[
			// 180 degrees clockwise rotation
			[0, 1, 0, 0],
			[0, 1, 0, 0],
			[0, 1, 0, 0],
			[0, 1, 0, 0],
		],
		[
			// 270 degrees clockwise rotation
			[0, 0, 0, 0],
			[1, 1, 1, 1],
			[0, 0, 0, 0],
			[0, 0, 0, 0],
		],
	];

	const color = ["orange", "green", "purple", "blue", "red", "yellow", "white"];

	/*
	const zTetromino = [
		[0, width, width + 1, width * 2 + 1],
		[width + 1, width + 2, width * 2, width * 2 + 1],
		[0, width, width + 1, width * 2 + 1],
		[width + 1, width + 2, width * 2, width * 2 + 1],
	];

	const tTetromino = [
		[1, width, width + 1, width + 2],
		[1, width + 1, width + 2, width * 2 + 1],
		[width, width + 1, width + 2, width * 2 + 1],
		[1, width, width + 1, width * 2 + 1],
	];

	const oTetromino = [
		[0, 1, width, width + 1],
		[0, 1, width, width + 1],
		[0, 1, width, width + 1],
		[0, 1, width, width + 1],
	];

	const iTetromino = [
		[1, width + 1, width * 2 + 1, width * 3 + 1],
		[width, width + 1, width + 2, width + 3],
		[1, width + 1, width * 2 + 1, width * 3 + 1],
		[width, width + 1, width + 2, width + 3],
	];
*/

	const theTetrominoes = [
		lTetromino,
		sTetromino,
		tTetromino,
		jTetromino,
		zTetromino,
		oTetromino,
		iTetromino,
	];
	const randomRef = useRef(Math.floor(Math.random() * theTetrominoes.length));
	const nextRandomRef = useRef(Math.floor(Math.random() * theTetrominoes.length));
	const scoreRef = useRef(0);
	const tickSpeedRef = useRef(1000);
	const startRotationRef = useRef(0);
	const nextStartRotationRef = useRef(Math.floor(Math.random() * 3));
	const colorRef = useRef(color[randomRef.current]);
	const nextColorRef = useRef(color[nextRandomRef.current]);

	const startXRef = useRef(Math.floor(width / 2 - 1));
	const isPausedRef = useRef(true);
	const gridArrayRef = useRef([]);
	const winRow = useRef(false);
	const winLevel = useRef(false);
	const linesRef = useRef(10);
	const levelRef = useRef(1);
	const multiplierRef = useRef(0);
	const fullDownScoreRef = useRef(10);
	const highscoreArray = useRef([]);
	const aliasRef = useRef("");
	const millisecondsRef = useRef(0);

	const disableControlsRef = useRef(false);

	// Add more context variables here as needed

	const displayShape = () => {
		// Get the next tetromino shape
		const upNextTetromino = theTetrominoes[nextRandomRef.current][nextStartRotationRef.current];

		nextColorRef.current = color[nextRandomRef.current];
		const upNextColor = nextColorRef.current;

		// Create a copy of minidivs
		const newMinidivs = [...minidivs];

		// Reset all classNames in the copied minidivs
		newMinidivs.forEach((row) => {
			row.forEach((cell) => {
				cell.classNames = [];
			});
		});

		// Add tetromino class to cells based on the next tetromino shape
		upNextTetromino.forEach((row, rowIndex) => {
			row.forEach((cell, colIndex) => {
				if (cell === 1) {
					// Calculate the position of the cell in the grid
					const x = colIndex;
					const y = rowIndex;

					// Update classNames in the newMinidivs array
					newMinidivs[y][x].classNames.push("tetromino", upNextColor);
				}
			});
		});

		// Update the state with the newMinidivs
		setMinidivs(newMinidivs);
	};

	function generateGridArray(rows, columns) {
		const newGridArray = [];

		// Generate the grid array
		for (let i = 0; i < rows; i++) {
			const rowArray = [];
			for (let j = 0; j < columns; j++) {
				const cell = {
					key: `div-${i}-${j}-${Math.floor(Math.random() * 1000)}`,
					classNames: [],
				};

				// Determine if the cell is in the last row
				const isLastRow = i === rows - 1;
				// Determine if the cell is the first or last in the row
				const isFirstRow = i === 0;
				const isFirstColumn = j === 0;
				const isLastColumn = j === columns - 1;

				// Add appropriate class names to the cell
				if (!isFirstRow && (isLastRow || isFirstColumn || isLastColumn)) {
					cell.classNames.push("taken", "border");
				}

				// Add class "lastrow" to cells in the last row
				if (isLastRow) {
					cell.classNames.push("lastrow");
				}

				// Add class "firstrow" to cells in the first row
				if (isFirstRow) {
					cell.classNames.push("firstrow", "border");
					if (isFirstColumn) {
						cell.classNames.push("leftborder");
					}
					if (isLastColumn) {
						cell.classNames.push("rightborder");
					}
				}

				rowArray.push(cell);
			}
			newGridArray.push(rowArray);
		}

		return newGridArray;
	}

	function pauseGame() {
		if (disableControlsRef.current) {
			setDisableControls(false);
			disableControlsRef.current = false;
		} else {
			setDisableControls(true);
			disableControlsRef.current = true;
		}
		isPausedRef.current = !isPausedRef.current; // Toggle the paused state
	}

	// Return the context provider with the variables as context values
	return (
		<GameContext.Provider
			value={{
				pauseGame,
				disableControlsRef,
				setMilliseconds,
				milliseconds,
				millisecondsRef,
				timerStarted,
				setTimerStarted,
				isResetGame,
				setIsResetGame,
				levelClassName,
				setLevelClassName,
				alias,
				aliasRef,
				setAlias,
				highscoreArray,
				rotation,
				setRotation,
				gameOver,
				setGameOver,
				fullDownScoreRef,
				fullDownScore,
				setFullDownScore,
				multiplierRef,
				multiplier,
				setMultiplier,
				showFullDown,
				setShowFullDown,
				linesRef,
				levelRef,
				winRow,
				winLevel,
				gridArrayRef,
				addedLines,
				setAddedLines,
				addedScore,
				setAddedScore,
				showScore,
				setShowScore,
				startXRef,
				startX,
				setStartX,
				color,
				nextColorRef,
				colorRef,
				gridArray,
				setGridArray,
				generateGridArray,
				startRotationRef,
				nextStartRotationRef,
				minidivs,
				setMinidivs,
				disableControls,
				setDisableControls,
				tickSpeedRef,
				score,
				setScore,
				displayShape,
				width,
				height,
				setWidth,
				setHeight,
				scoreRef,
				nextRandomRef,
				theTetrominoes,
				lTetromino,
				jTetromino,
				gameRunning,
				setGameRunning,
				level,
				setLevel,
				lines,
				setLines,
				showDarkoverlay,
				setShowDarkoverlay,
				page,
				setPage,
				music,
				setMusic,
				isMuted,
				setMuted,
				isPaused,
				setIsPaused,
				randomRef,
				isPausedRef,
				// Add more context variables here as needed
			}}
		>
			{children}
		</GameContext.Provider>
	);
};

// Custom hook to use the context
export const useGameContext = () => {
	return useContext(GameContext); // Corrected from MyContext to GameContext
};
