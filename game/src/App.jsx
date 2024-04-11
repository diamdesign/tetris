import React, { useState, useEffect, useRef, useContext } from "react";
import { TetrisGrid } from "./components/TetrisGrid";
import { MiniGrid } from "./components/MiniGrid";
import { Score } from "./components/Score";

import { useGameContext } from "./components/Context";
import { playSound } from "./components/playSound";
import { Music } from "./components/Music";
import "./App.css";
import "./css/stars.css";

function App() {
	const {
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
	} = useGameContext();

	const [aliasInput, setAliasInput] = useState("");
	const [scoreClassName, setScoreClassName] = useState("");
	const [levelClassName, setLevelClassName] = useState("");

	const startRef = useRef(null);
	const inputRef = useRef(null);

	const handleSetScore = () => {
		scoreRef.current += 1;
	};

	const handleSetLevel = () => {
		let newVar = level + 1;
		setLevel(newVar);

		// Add the 'level + number' class to container
		setLevelClassName("level" + newVar);
	};

	function pauseGame() {
		isPausedRef.current = !isPausedRef.current; // Toggle the paused state
	}

	useEffect(() => {
		setTimeout(() => {
			inputRef.current.focus();
		}, 10);
	}, []);

	useEffect(() => {
		function control(e) {
			if (e.keyCode === 80) {
				pauseGame();
			}
		}
		document.addEventListener("keydown", control);

		// Cleanup function to remove event listener
		return () => {
			document.removeEventListener("keydown", control);
		};
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
		// Update the state with the value entered by the user

		setAliasInput(event.target.value);
		playSound("key", 0.35);
	};

	// Function to handle alias save
	const handleAliasKey = (event) => {
		if (event.key === "Enter") {
			if (event.target.value !== "") {
				setAlias(aliasInput);
				playSound("enter", 0.5);
				playSound("impact", 0.3);
				setShowDarkoverlay(false);
				displayShape();
				setTimeout(() => {
					startRef.current.focus();
				}, 10);
			} else {
				alert("You need to enter an alias for the highscores");
			}
		}
	};

	// Function to handle start button
	const handleStartClick = () => {
		playSound("enter", 0.5);
		playSound("start", 0.5);
		isPausedRef.current = false;
		setDisableControls(false);
		setGameRunning(true);
	};

	// Function to handle start button
	const handleStartKey = (e) => {
		e.stopPropagation();
		if (e.keyCode === 13 || e.keyCode === 32) {
			playSound("enter", 0.5);
			playSound("start", 0.5);
			isPausedRef.current = false;
			setDisableControls(false);
			setGameRunning(true);
		}
	};

	// Function to handle mouse over
	const handleMouseOver = () => {
		playSound("mouseover", 0.35);
	};

	const handleWidth = (action) => {
		if (action === "minus") {
			let newWidth = width - 1;
			setWidth(newWidth);
			const newGrid = generateGridArray(width, height);
			setGridArray(newGrid);
		} else if (action === "plus") {
			let newWidth = width + 1;
			setWidth(newWidth);
			const newGrid = generateGridArray(width, height);
			setGridArray(newGrid);
		}
	};

	return (
		<>
			<div id="gamecontainer" className={levelClassName}>
				<div id="settings"></div>
				{/* Credits page */}
				{page === "credits" && <Credits />}

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
						<h2>Styler</h2>
						<input
							type="text"
							value={aliasInput}
							ref={inputRef}
							onChange={handleAliasInput}
							onKeyDown={handleAliasKey}
							id="selectalias"
							placeholder="Enter alias"
						/>
					</div>
				)}

				{!gameRunning && alias && (
					<div className="playbox">
						<a
							href="#"
							tabIndex={1}
							className="start"
							onClick={handleStartClick}
							onKeyDown={handleStartKey}
							onMouseOver={handleMouseOver}
							ref={startRef}
						>
							Play
						</a>
						<p>Press "Enter" or "Space" to begin.</p>
						<p>
							Set up Tetris grid. <br /> (Normal is between 10x16 - 12x20)
						</p>
						<button onClick={() => handleWidth("minus")}>- Width</button>
						<button onClick={() => handleWidth("plus")}>+ Width</button>
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
				<div id="container" className={levelClassName}>
					<h1>
						<span>T</span>
						<span>E</span>
						<span>T</span>
						<span>R</span>
						<span>I</span>
						<span>S</span>
					</h1>
					<i></i>
					<i></i>
					<i></i>
					<i></i>
					<TetrisGrid />
				</div>

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

				<div className="copyright">
					© 2024{" "}
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
