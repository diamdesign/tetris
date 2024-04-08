import React, { useState, useEffect, useContext } from "react";

import { useGameContext } from "./components/Context";
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
		setGameRunning,
		theTetrominoes,
		width,
	} = useGameContext();

	const [aliasInput, setAliasInput] = useState("");
	const [scoreClassName, setScoreClassName] = useState("");
	const [levelClassName, setLevelClassName] = useState("");
	const [random, setRandom] = useState(Math.floor(Math.random() * theTetrominoes.length));

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
		setGameRunning((prevGameRunning) => !prevGameRunning);
	}

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
		let current = theTetrominoes[random][currentRotation];

		useEffect(() => {
			// Select grid cells within the useEffect hook
			const cells = Array.from(document.querySelectorAll(".grid div"));
			console.log(cells);

			console.log(current);
			console.log(random);

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

			const timerId = setInterval(moveDown, 1000);

			function moveDown() {
				if (gameRunning) {
					undraw();
					currentPosition += width;
					draw();
					freeze();
				}
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

			function freeze() {
				if (
					current.some((index) =>
						cells[currentPosition + index + width].classList.contains("taken")
					)
				) {
					current.forEach((index) =>
						cells[currentPosition + index].classList.add("taken")
					);
					const random = Math.floor(Math.random() * theTetrominoes.length);
					current = theTetrominoes[random][currentRotation];
					currentPosition = 4;
					draw();
				}
			}

			function resetGrid() {
				setGameRunning(false);
				cells.forEach((cell) => {
					cell.classList.remove("tetromino");
				});
				currentPosition = 4;
				random = Math.floor(Math.random() * theTetrominoes.length);
				current = theTetrominoes[random][currentRotation];
				draw();
				setGameRunning(true);
			}

			function control(e) {
				if (e.keyCode === 37) {
					moveLeft();
				} else if (e.keyCode === 38) {
					//rotate
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
		}, [gameRunning, currentPosition, current, currentRotation, width, theTetrominoes]);

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
	};

	// Function to handle alias save
	const handleAliasKey = (event) => {
		if (event.key === "Enter") {
			setAlias(aliasInput);
		}
	};

	// Function to handle start button
	const handleStartClick = () => {
		setShowDarkoverlay(false);
		setGameRunning(true);
	};

	// Function to handle mouse over
	const handleMouseOver = () => {
		// playSound("mouseover");
	};

	return (
		<>
			<div id="gamecontainer" className={levelClassName}>
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
							onChange={handleAliasInput}
							onKeyDown={handleAliasKey}
							id="selectalias"
							placeholder="Enter alias"
						/>
					</div>
				)}

				{!gameRunning && (
					<div className="start" onClick={handleStartClick} onMouseOver={handleMouseOver}>
						Play
					</div>
				)}

				{/* Colorize or use for other means */}
				<div className="colorize"></div>

				{/* Currently left content, alias, score, lines, level */}
				<div className="gamesymbols">
					{/* Playername */}
					{alias && <div className="alias">{alias}</div>}
					<div className={`score ${scoreClassName}`} onClick={handleSetScore}>
						{score}
					</div>

					<div className="lines">
						Lines:
						<span>{lines}</span>
					</div>
					<div className="level" onClick={handleSetLevel}>
						Level:<span>{level}</span>
					</div>
				</div>

				{/* Right content */}
				<div className="comingsymbol">
					Next:
					<span>T</span>
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

				<Music />
			</div>
		</>
	);
}

export default App;
