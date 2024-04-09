import React, { useState, useEffect, useRef, useContext } from "react";

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
		score,
		setScore,
		gameRunning,
		isPaused,
		setIsPaused,
		setGameRunning,
		theTetrominoes,
		width,
		randomRef,
		isPausedRef,
	} = useGameContext();

	const [aliasInput, setAliasInput] = useState("");
	const [scoreClassName, setScoreClassName] = useState("");
	const [levelClassName, setLevelClassName] = useState("");

	const startRef = useRef(null);
	const inputRef = useRef(null);

	const handleSetScore = (newScore) => {
		let newVar = score + 1;
		setScore(newVar);

		// Add the 'addscore' class
		setScoreClassName("addscore");

		// Remove the 'addscore' class after 0.5s
		setTimeout(() => {
			setScoreClassName("");
		}, 300);
	};

	const handleSetLevel = (newLevel) => {
		let newVar = level + 1;
		setLevel(newVar);

		// Add the 'level + number' class to container
		setLevelClassName("level" + newVar);
	};

	function pauseGame() {
		isPausedRef.current = !isPausedRef.current; // Toggle the paused state
	}
	useEffect(() => {
		inputRef.current.focus();
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

	function TetrisGrid() {
		const rows = 21;
		const columns = 12;
		const divs = [];

		// Generate div elements
		for (let i = 0; i < rows; i++) {
			for (let j = 0; j < columns; j++) {
				// Calculate unique key for each div
				const key = `div-${i}-${j}`;
				// Determine if the current div is in the last row
				const isLastRow = i === rows - 1;
				// Add class "taken" to divs in the last row
				const classNames = isLastRow ? "taken lastrow" : "";
				// Add div element to the array with the appropriate class
				divs.push(<div key={key} className={classNames}></div>);
			}
		}

		let currentPosition = 4;
		let currentRotation = 0;

		// let random = Math.floor(Math.random() * theTetrominoes.length);
		let current = theTetrominoes[randomRef.current][currentRotation];

		useEffect(() => {
			// Select grid cells within the useEffect hook
			const cells = Array.from(document.querySelectorAll(".grid div"));

			function draw() {
				current.forEach((index) => {
					cells[currentPosition + index].classList.add("tetromino");
				});
			}

			function undraw() {
				current.forEach((index) => {
					cells[currentPosition + index].classList.remove("tetromino");
				});
			}

			const timerId = setInterval(() => {
				if (!isPausedRef.current) {
					moveDown();
				}
			}, 1000);

			function moveDown() {
				undraw();
				currentPosition += width;
				draw();
				freeze();
			}

			function moveLeft() {
				undraw();
				const isAtLeftEdge = current.some(
					(index) => (currentPosition + index) % width === 0
				);
				if (!isAtLeftEdge) {
					currentPosition -= 1;
				}

				if (
					current.some((index) =>
						cells[currentPosition + index].classList.contains("taken")
					)
				) {
					currentPosition += 1;
				}

				draw();
			}

			function moveRight() {
				undraw();
				const isAtRightEdge = current.some(
					(index) => (currentPosition + index) % width === width - 1
				);
				if (!isAtRightEdge) {
					currentPosition += 1;
				}

				if (
					current.some((index) =>
						cells[currentPosition + index].classList.contains("taken")
					)
				) {
					currentPosition -= 1;
				}

				draw();
			}

			function rotate() {
				undraw();
				let nextRotation = currentRotation + 1;
				if (nextRotation === current.length) {
					// Loop back order at the end
					nextRotation = 0;
				}
				const nextTetromino = theTetrominoes[randomRef.current][nextRotation];

				const isAtLeftEdge = nextTetromino.some(
					(index) => (currentPosition + index) % width === width - 1
				);
				const isAtRightEdge = nextTetromino.some(
					(index) => (currentPosition + index) % width === width + 1
				);

				// Check if rotation is possible without hitting walls or other objects
				if (!isAtLeftEdge && !isAtRightEdge && !checkCollision(nextTetromino)) {
					currentRotation = nextRotation;
					current = nextTetromino;
				}

				draw();
			}

			// Function to check collision with other tetrominoes
			function checkCollision(tetromino) {
				return tetromino.some(
					(index) =>
						cells[currentPosition + index].classList.contains("taken") ||
						cells[currentPosition + index].classList.contains("tetromino")
				);
			}

			function freeze() {
				if (
					current.some((index) =>
						cells[currentPosition + index + width].classList.contains("taken")
					)
				) {
					current.forEach((index) =>
						cells[currentPosition + index].classList.add("taken")
					);
					const newRandom = Math.floor(Math.random() * theTetrominoes.length);
					randomRef.current = newRandom;

					current = theTetrominoes[randomRef.current][currentRotation];
					currentPosition = 4;
					draw();
				}
			}

			function resetGrid() {
				cells.forEach((cell) => {
					cell.classList.remove("tetromino");
					if (!cell.classList.contains("lastrow")) {
						cell.classList.remove("taken");
					}
				});
				currentPosition = 4;
				const newRandom = Math.floor(Math.random() * theTetrominoes.length);
				randomRef.current = newRandom;

				current = theTetrominoes[randomRef.current][currentRotation];

				draw();
			}

			function control(e) {
				if (e.keyCode === 37) {
					moveLeft();
				} else if (e.keyCode === 38) {
					rotate();
				} else if (e.keyCode === 39) {
					moveRight();
				} else if (e.keyCode === 40) {
					moveDown();
				} else if (e.keyCode === 82) {
					resetGrid();
				}
			}

			document.addEventListener("keydown", control);

			draw();

			// Cleanup function to remove event listener
			return () => {
				clearInterval(timerId);
				document.removeEventListener("keydown", control);
			};
		}, [
			gameRunning,
			randomRef,
			currentPosition,
			current,
			currentRotation,
			width,
			theTetrominoes,
		]);

		return (
			<>
				<div className="grid">{divs}</div>
			</>
		);
	}

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
		playSound("key", 0.2);
	};

	// Function to handle alias save
	const handleAliasKey = (event) => {
		if (event.key === "Enter") {
			setAlias(aliasInput);
			playSound("enter", 0.5);
			playSound("impact", 0.3);
			setShowDarkoverlay(false);
			setTimeout(() => {
				startRef.current.focus();
			}, 10);
		}
	};

	// Function to handle start button
	const handleStartClick = () => {
		setShowDarkoverlay(false);
		setGameRunning(true);
		isPausedRef.current = false;
		playSound("enter", 0.5);
		playSound("start", 0.5);
	};

	// Function to handle start button
	const handleStartKey = (e) => {
		if (e.keyCode === "13") {
			setGameRunning(true);
			playSound("enter", 0.5);
			playSound("start", 0.5);
			isPausedRef.current = false;
		}
	};

	// Function to handle mouse over
	const handleMouseOver = () => {
		// playSound("mouseover");
	};

	return (
		<>
			{/* Game Container*/}
			<div id="gamecontainer" className={levelClassName}>
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
					<div className={`score ${scoreClassName}`} onClick={handleSetScore}>
						{score}
						<i></i>
						<i></i>
						<i></i>
						<i></i>
					</div>

					<div className="lines">
						Lines:
						<span>{lines}</span>
						<i></i>
						<i></i>
						<i></i>
						<i></i>
					</div>
					<div className="level" onClick={handleSetLevel}>
						Level:<span>{level}</span>
					</div>
					<i></i>
					<i></i>
					<i></i>
					<i></i>
				</div>

				{/* Right content */}
				<div className="comingsymbol">
					Next:
					<span>T</span>
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
