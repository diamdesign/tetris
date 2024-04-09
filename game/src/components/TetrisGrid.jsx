import React, { useEffect, useContext } from "react";
import { useGameContext } from "./Context";

export function TetrisGrid() {
	const {
		level,
		setLevel,
		lines,
		setLines,
		displayShape,
		gameRunning,
		setGameRunning,
		theTetrominoes,
		width,
		randomRef,
		isPausedRef,
		nextRandomRef,
		scoreRef,
		tickSpeedRef,
		score,
		setScore,
	} = useGameContext();

	const rows = 23;
	const columns = width;
	const divs = [];

	// Generate div elements
	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < columns; j++) {
			// Calculate unique key for each div
			const key = `div-${i}-${j}`;
			// Determine if the current div is in the last row
			const isLastRow = i === rows - 1;
			// Determine if the current div is the first or last in the row
			const isFirstRow = i === 0;
			const isFirstColumn = j === 0;
			const isLastColumn = j === columns - 1;
			// Add class "taken" to divs in the last row and first/last columns
			let classNames =
				isLastRow || isFirstRow || isFirstColumn || isLastColumn ? "taken border" : "";
			// Add class "lastrow" to divs in the last row
			if (isLastRow) {
				classNames += " lastrow";
			}
			// Add div element to the array with the appropriate class
			divs.push(<div key={key} className={classNames}></div>);
		}
	}

	// Inline styles for the grid
	const gridStyle = {
		gridTemplateColumns: `repeat(${width}, 1fr)`,
	};

	const startCurrentPos = width / 2 - 1;
	let currentPosition = startCurrentPos;
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

			if (scoreRef.current !== score) {
				setScore(scoreRef.current);
			}
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
		}, tickSpeedRef.current);

		let lastMove = false;

		function moveDown() {
			if (!lastMove) {
				undraw();
				currentPosition += width;
				draw();
				freeze();
			}
		}

		function moveLeft() {
			undraw();
			const isAtLeftEdge = current.some((index) => (currentPosition + index) % width === 0);
			if (!isAtLeftEdge) {
				currentPosition -= 1;
			}

			if (
				current.some((index) => cells[currentPosition + index].classList.contains("taken"))
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
				current.some((index) => cells[currentPosition + index].classList.contains("taken"))
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
				(index) => (currentPosition + index) % width === width - 1
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
				lastMove = true;
				setTimeout(() => {
					current.forEach((index) =>
						cells[currentPosition + index].classList.add("taken")
					);
					const newRandom = nextRandomRef.current;
					nextRandomRef.current = Math.floor(Math.random() * theTetrominoes.length);

					randomRef.current = newRandom;

					current = theTetrominoes[randomRef.current][currentRotation];
					currentPosition = startCurrentPos;
					draw();
					displayShape();
					lastMove = false;
				}, tickSpeedRef.current);
			}
		}

		function resetGrid() {
			cells.forEach((cell) => {
				cell.classList.remove("tetromino");
				if (!cell.classList.contains("lastrow")) {
					cell.classList.remove("taken");
				}
			});
			currentPosition = startCurrentPos;
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
		setScore,
		randomRef,
		currentPosition,
		current,
		currentRotation,
		width,
		theTetrominoes,
	]);

	return (
		<>
			<div className="grid" style={gridStyle}>
				{divs}
			</div>
		</>
	);
}
