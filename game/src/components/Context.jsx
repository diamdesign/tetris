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

	//The Tetrominoes
	const lTetromino = [
		[
			// Original rotation (0 degrees)
			[1, ""],
			[1, ""],
			[1, 1],
		],
		[
			// 90 degrees clockwise rotation
			[1, 1, 1],
			[1, "", ""],
		],
		[
			// 180 degrees clockwise rotation
			[1, 1],
			["", 1],
			["", 1],
		],
		[
			// 270 degrees clockwise rotation
			["", "", 1],
			[1, 1, 1],
		],
	];

	const jTetromino = [
		[
			// Original rotation (0 degrees)
			["", 1],
			["", 1],
			[1, 1],
		],
		[
			// 90 degrees clockwise rotation
			[1, "", ""],
			[1, 1, 1],
		],
		[
			// 180 degrees clockwise rotation
			[1, 1],
			[1, ""],
			[1, ""],
		],
		[
			// 270 degrees clockwise rotation
			[1, 1, 1],
			["", "", 1],
		],
	];

	const sTetromino = [
		[
			// Original rotation (0 degrees)
			["", 1, 1],
			[1, 1, ""],
		],
		[
			// 90 degrees clockwise rotation
			[1, ""],
			[1, 1],
			["", 1],
		],
		[
			// 180 degrees clockwise rotation
			["", 1, 1],
			[1, 1, ""],
		],
		[
			// 270 degrees clockwise rotation
			[1, ""],
			[1, 1],
			["", 1],
		],
	];

	const zTetromino = [
		[
			// Original rotation (0 degrees)
			[1, 1, ""],
			["", 1, 1],
		],
		[
			// 90 degrees clockwise rotation
			[""],
			[1, 1],
			[1, ""],
		],
		[
			// 180 degrees clockwise rotation
			[1, 1, ""],
			["", 1, 1],
		],
		[
			// 270 degrees clockwise rotation
			["", 1],
			[1, 1],
			[1, ""],
		],
	];

	const tTetromino = [
		[
			// Original rotation (0 degrees)
			[1, 1, 1],
			["", 1, ""],
		],
		[
			// 90 degrees clockwise rotation
			["", 1],
			[1, 1],
			["", 1],
		],
		[
			// 180 degrees clockwise rotation
			["", 1, ""],
			[1, 1, 1],
		],
		[
			// 270 degrees clockwise rotation
			[1, ""],
			[1, 1],
			[1, ""],
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
			[1],
			[1],
			[1],
			[1],
		],
		[
			// 90 degrees clockwise rotation
			[1, 1, 1, 1],
		],
		[
			// 180 degrees clockwise rotation
			[1],
			[1],
			[1],
			[1],
		],
		[
			// 270 degrees clockwise rotation
			[1, 1, 1, 1],
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

	let displayIndex = 0;
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

	// Return the context provider with the variables as context values
	return (
		<GameContext.Provider
			value={{
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
