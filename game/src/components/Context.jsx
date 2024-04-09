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
	const [level, setLevel] = useState(1);
	const [lines, setLines] = useState(10);
	const [score, setScore] = useState(0);
	const [width, setWidth] = useState(14);

	//The Tetrominoes
	const lTetromino = [
		[1, width + 1, width * 2 + 1, 2],
		[width, width + 1, width + 2, width * 2 + 2],
		[1, width + 1, width * 2 + 1, width * 2],
		[width, width * 2, width * 2 + 1, width * 2 + 2],
	];

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

	const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];

	const randomRef = useRef(Math.floor(Math.random() * theTetrominoes.length));
	const nextRandomRef = useRef(0);
	const scoreRef = useRef(0);
	const tickSpeedRef = useRef(1000);

	const isPausedRef = useRef(true);

	// Add more context variables here as needed

	let displayIndex = 0;

	// Define the displayShape function
	const displayShape = () => {
		const displaySquares = Array.from(document.querySelectorAll(".minigrid div"));

		const displayWidth = 4;

		const upNextTetrominoes = [
			[1, displayWidth + 1, displayWidth * 2 + 1, 2],
			[0, displayWidth, displayWidth + 1, displayWidth * 2 + 1],
			[1, displayWidth, displayWidth + 1, displayWidth + 2],
			[0, 1, displayWidth, displayWidth + 1],
			[1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1],
		];

		displaySquares.forEach((square) => {
			square.classList.remove("tetromino");
		});

		upNextTetrominoes[nextRandomRef.current].forEach((index) => {
			displaySquares[displayIndex + index].classList.add("tetromino");
		});
	};

	// Return the context provider with the variables as context values
	return (
		<GameContext.Provider
			value={{
				tickSpeedRef,
				score,
				setScore,
				displayShape,
				width,
				scoreRef,
				nextRandomRef,
				theTetrominoes,
				lTetromino,
				zTetromino,
				tTetromino,
				oTetromino,
				iTetromino,
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
