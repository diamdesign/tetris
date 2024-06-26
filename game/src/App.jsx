import React, { useState, useEffect, useRef, useContext } from "react";
import { Banner } from "./components/Banner";
import { TetrisGrid } from "./components/TetrisGrid";
import { MiniGrid } from "./components/MiniGrid";
import { Score } from "./components/Score";
import { Fullscreen } from "./components/Fullscreen";
import { Highscore } from "./components/Highscore";
import { useGameContext } from "./components/Context";
import { playSound } from "./components/playSound";
import { Music } from "./components/Music";
import "./App.css";
import "./css/stars.css";
import "./css/default.css";

function App() {
	const {
		pauseGame,
		page,
		setPage,
		alias,
		setAlias,
		showDarkoverlay,
		setShowDarkoverlay,
		level,
		setLevel,
		lines,
		setLines,
		gameRunning,
		setGameRunning,
		theTetrominoes,
		width,
		height,
		setHeight,
		setWidth,
		randomRef,
		isPausedRef,
		nextRandomRef,
		scoreRef,
		displayShape,
		generateGridArray,
		setGridArray,
		setDisableControls,
		gridArray,
		startX,
		setStartX,
		startXRef,
		setShowScore,
		showScore,
		addedLines,
		setAddedLines,
		addedScore,
		setAddedScore,
		winRow,
		setShowFullDown,
		showFullDown,
		fullDownScore,
		fullDownScoreRef,
		multiplier,
		setMultiplier,
		multiplierRef,
		gameOver,
		setGameOver,
		aliasRef,
		levelClassName,
		setIsResetGame,
		isResetGame,
		setTimerStarted,
		disableControls,
		disableControlsRef,
	} = useGameContext();

	const [aliasInput, setAliasInput] = useState("");
	const [scoreClassName, setScoreClassName] = useState("");

	const startRef = useRef(null);
	const inputRef = useRef(null);

	useEffect(() => {
		setTimeout(() => {
			inputRef.current.focus();
		}, 10);
	}, []);

	function Credits() {
		return (
			<div id="credits">
				<h1>Credits</h1>
				<ul>
					<li>
						Stars by
						<a href="https://codepen.io/WebSonick/pen/nBPZZO" target="_blank">
							Websonick
						</a>
					</li>
				</ul>
			</div>
		);
	}

	// Function to handle input change
	const handleAliasInput = (event) => {
		// Get the input value entered by the user
		const inputValue = event.target.value;

		// Remove spaces and SQL-intrusive symbols
		const sanitizedValue = inputValue.replace(/[^\w\s]/gi, "").replace(/\s+/g, "");

		// Update the state with the sanitized value
		setAliasInput(sanitizedValue);

		// Play a sound
		playSound("key", 0.35);
	};

	// Function to handle alias save
	const handleAliasKey = (event) => {
		if (event.key === "Enter") {
			if (event.target.value !== "") {
				setAlias(aliasInput);
				aliasRef.current = aliasInput;
				playSound("enter", 0.5);
				playSound("impact", 0.3);
				setShowDarkoverlay(false);
				displayShape();
				setTimeout(() => {
					startRef.current.focus();
				}, 10);
				setTimerStarted(false);
			} else {
				alert("You need to enter an alias for the highscores");
			}
		}
	};

	function handleStart() {
		playSound("enter", 0.5);
		playSound("start", 0.5);
		isPausedRef.current = false;
		setDisableControls(false);
		disableControlsRef.current = false;
		setGameRunning(true);
		setIsResetGame(true);
		setTimerStarted(false);
		setTimeout(() => {}, 10);
		setTimerStarted(true);
	}

	// Function to handle start button
	const handleStartClick = () => {
		handleStart();
	};

	// Function to handle start button
	const handleStartKey = (e) => {
		e.stopPropagation();
		if (e.keyCode === 13 || e.keyCode === 32) {
			handleStart();
		}
	};

	// Function to handle mouse over
	const handleMouseOver = () => {
		playSound("mouseover", 0.35);
	};

	const handleWidth = (action) => {
		let newWidth;
		if (action === "minus") {
			newWidth = width - 1;
			if (newWidth < 12) {
				return;
			}
			setWidth(newWidth);
			const newGrid = generateGridArray(width, height);
			setGridArray(newGrid);
		} else if (action === "plus") {
			newWidth = width + 1;
			if (newWidth > 34) {
				return;
			}
			setWidth(newWidth);
			const newGrid = generateGridArray(width, height);
			setGridArray(newGrid);
		}
		startXRef.current = Math.floor(newWidth / 2) - 2;
		setStartX(startXRef.current);
		console.log(startX);
		playSound("ticksmall", 0.8);
	};

	const handleHeight = (action) => {
		if (action === "minus") {
			let newHeight = height - 1;
			if (newHeight < 18) {
				return;
			}
			setHeight(newHeight);
			const newGrid = generateGridArray(width, height);
			setGridArray(newGrid);
		} else if (action === "plus") {
			let newHeight = height + 1;
			if (newHeight > 34) {
				return;
			}
			setHeight(newHeight);
			const newGrid = generateGridArray(width, height);
			setGridArray(newGrid);
		}
		playSound("tickbig", 0.8);
	};

	function handleClickBack() {
		setGameRunning(false);
		setGameOver(false);
		setAlias(null);
		setShowDarkoverlay(true);
		setDisableControls(true);
		disableControlsRef.current = true;
		setIsResetGame(true);
		isPausedRef.current = true;
		setTimerStarted(false);
		playSound("key", 0.5);
		setTimeout(() => {
			inputRef.current.focus();
		}, 10);

		isPausedRef.current = true;
	}

	const handleKeyPlayAgain = (e) => {
		if (e.keyCode === "13" || e.keyCode === "32") {
			handlePlayAgain();
		}
	};

	const handlePlayAgain = () => {
		isPausedRef.current = false;
		setIsResetGame(true);
		setShowDarkoverlay(false);
		setGameOver(false);
		setGameRunning(true);
		setDisableControls(false);
		disableControlsRef.current = false;
		playSound("key", 0.5);
		playSound("start", 0.5);
		setTimerStarted(true);
	};

	return (
		<>
			<div id="gamecontainer" className={levelClassName}>
				{!alias && <Banner />}
				<Fullscreen />

				<div id="settings"></div>
				{/* Credits page */}
				{page === "credits" && <Credits />}

				{!gameRunning && gameOver && (
					<div id="gameover">
						<div id="gameovercontainer">
							<h1>Game Over</h1>

							<Highscore />
							<button
								id="playagain"
								onMouseOver={handleMouseOver}
								onClick={handlePlayAgain}
								onKeyDown={handleKeyPlayAgain}
							>
								Play again
							</button>
							<Banner />
						</div>
					</div>
				)}

				{/* Input alias */}
				{!alias && (
					<div id="intro">
						<h1>
							<span>T</span>
							<span>E</span>
							<span>T</span>
							<span>R</span>
							<span>I</span>
							<span>S</span>
						</h1>

						<input
							type="text"
							value={aliasInput}
							ref={inputRef}
							onChange={handleAliasInput}
							onKeyDown={handleAliasKey}
							id="selectalias"
							placeholder="Enter alias"
						/>
						<p>Enter alias for highscore.</p>
					</div>
				)}

				{gameRunning && showScore && (
					<div className="newscore">
						{addedLines} Lines
						<br />
						<span>+{addedScore}</span>
					</div>
				)}

				{gameRunning && showFullDown && (
					<div className="newfastdown">
						Fast Down <br />
						<span>+{fullDownScore}</span>
					</div>
				)}

				{gameRunning && (
					<div className="multiplier">
						{multiplier >= 2 && (
							<>
								Multiplier
								<br />
								<span>x{multiplier}</span>
							</>
						)}
					</div>
				)}

				{!gameRunning && alias && !gameOver && (
					<div className="playbox">
						<button
							className="start"
							onClick={handleStartClick}
							onKeyDown={handleStartKey}
							onMouseOver={handleMouseOver}
							ref={startRef}
						>
							Play
						</button>
						<p>Click "Play" to start.</p>
						{/* 
						<p>
							Set up Tetris grid. <br /> (Normal is between 10x16 - 12x20)
						</p>
						<div className="setsize">
							<div className="width">
								Width
								<span>{width - 2}</span>
								<button
									className="sizebutton widthminus"
									onClick={() => handleWidth("minus")}
									onMouseOver={handleMouseOver}
								>
									-
								</button>
								<button
									className="sizebutton widthplus"
									onClick={() => handleWidth("plus")}
									onMouseOver={handleMouseOver}
								>
									+
								</button>
							</div>

							<div className="height">
								Height
								<span>{height - 2}</span>
								<button
									className="sizebutton heightminus"
									onClick={() => handleHeight("minus")}
									onMouseOver={handleMouseOver}
								>
									-
								</button>
								<button
									className="sizebutton heightplus"
									onClick={() => handleHeight("plus")}
									onMouseOver={handleMouseOver}
								>
									+
								</button>
							</div>
						</div>
						*/}
					</div>
				)}

				{/* Colorize or use for other means */}
				<div className="colorize">
					<i></i>
					<i></i>
					<i></i>
					<i></i>
				</div>

				{/* Currently left content, alias, score, lines, level */}
				<div className="gamesymbols">
					{/* Playername */}
					{alias && (
						<div className="alias">
							{alias} <i></i>
							<i></i>
							<i></i>
							<i></i>
						</div>
					)}

					<Score />
				</div>

				{/* Right content */}
				<div className="comingsymbol">
					Next:
					<MiniGrid />
					<i></i>
					<i></i>
					<i></i>
					<i></i>
				</div>

				{/* Tetris container */}

				<TetrisGrid />

				<div id="stars"></div>
				<div id="twinkling"></div>
				<div id="clouds"></div>
				<div id="backanim">
					<i></i>
					<i></i>
					<i></i>
					<i></i>
					<i></i>
					<i></i>
					<i></i>
					<i></i>
					<i></i>
					<i></i>
					<i></i>
					<i></i>
					<i></i>
					<i></i>
					<i></i>
					<i></i>
					<i></i>
					<i></i>
					<i></i>
					<i></i>
				</div>

				{gameRunning && (
					<div id="startanim">
						<i></i>
						<i></i>
						<i></i>
						<i></i>
						<i></i>
						<i></i>
						<i></i>
						<i></i>
						<i></i>
						<i></i>
						<i></i>
						<i></i>
						<i></i>
						<i></i>
						<i></i>
						<i></i>
						<i></i>
						<i></i>
						<i></i>
						<i></i>
					</div>
				)}

				{/* Dark overlay */}
				{showDarkoverlay && <div id="darkoverlay"></div>}

				{alias && (
					<div
						id="btn-back"
						onMouseOver={handleMouseOver}
						onClick={handleClickBack}
					></div>
				)}

				<div className="copyright">
					© 2024{" "}
					<a href="https://diam.se" target="_blank">
						DIAM
					</a>
					{" - "}
					Theme by{" "}
					<a href="https://diam.se" target="_blank">
						DIAM
					</a>
				</div>

				<Music />
			</div>
		</>
	);
}

export default App;
