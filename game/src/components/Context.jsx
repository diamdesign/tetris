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
	const [disableControls, setDisableControls] = useState(false);
	const [level, setLevel] = useState(1);
	const [lines, setLines] = useState(10);
	const [score, setScore] = useState(0);
	const [width, setWidth] = useState(14);
	const [height, setHeight] = useState(22);
	const [minidivs, setMinidivs] = useState([]);
	const [gridArray, setGridArray] = useState([]);

	//The Tetrominoes
	const lTetromino = [
		[
			// Original rotation (0 degrees)
			[1, 0],
			[1, 0],
			[1, 1],
		],
		[
			// 90 degrees clockwise rotation
			[1, 1, 1],
			[1, 0, 0],
		],
		[
			// 180 degrees clockwise rotation
			[1, 1],
			[0, 1],
			[0, 1],
		],
		[
			// 270 degrees clockwise rotation
			[0, 0, 1],
			[1, 1, 1],
		],
	];

	const jTetromino = [
		[
			// Original rotation (0 degrees)
			[0, 1],
			[0, 1],
			[1, 1],
		],
		[
			// 90 degrees clockwise rotation
			[1, 0, 0],
			[1, 1, 1],
		],
		[
			// 180 degrees clockwise rotation
			[1, 1],
			[1, 0],
			[1, 0],
		],
		[
			// 270 degrees clockwise rotation
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
		],
		[
			// 90 degrees clockwise rotation
			[0, 1],
			[1, 1],
			[0, 1],
		],
		[
			// 180 degrees clockwise rotation
			[0, 1, 0],
			[1, 1, 1],
		],
		[
			// 270 degrees clockwise rotation
			[1, 0],
			[1, 1],
			[1, 0],
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

	const isPausedRef = useRef(true);

	// Add more context variables here as needed

	const displayShape = () => {
		// Get the next tetromino shape
		const upNextTetromino = theTetrominoes[nextRandomRef.current][startRotationRef.current];

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
					newMinidivs[y][x].classNames.push("tetromino");
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
					key: `div-${i}-${j}`,
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
				}

				// Add class "leftborder" to cells at the beginning of each row (except the first row)
				if (!isFirstRow && isFirstColumn) {
					cell.classNames.push("leftborder");
				}

				// Add class "rightborder" to cells at the end of each row (except the first row)
				if (!isFirstRow && isLastColumn) {
					cell.classNames.push("rightborder");
				}

				rowArray.push(cell);
			}
			newGridArray.push(rowArray);
		}

		return newGridArray;
	}

	// Return the context provider with the variables as context values
	return (
		<GameContext.Provider
			value={{
				gridArray,
				setGridArray,
				generateGridArray,
				startRotationRef,
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
				alias,
				setAlias,
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
