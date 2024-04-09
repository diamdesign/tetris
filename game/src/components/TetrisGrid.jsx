import React, { useEffect, useContext } from "react";
import { useGameContext } from "./Context";

export function TetrisGrid() {
	const {
		disableControls,
		setDisableControls,
		level,
		setLevel,
		lines,
		setLines,
		displayShape,
		gameRunning,
		setGameRunning,
		theTetrominoes,
		width,
		height,
		randomRef,
		isPausedRef,
		nextRandomRef,
		scoreRef,
		tickSpeedRef,
		score,
		setScore,
	} = useGameContext();

	const rows = height;
	const columns = width;

	// Initialize the grid array
	const gridArray = [];

	// Generate the grid array
	for (let i = 0; i < rows; i++) {
		const rowArray = [];
		for (let j = 0; j < columns; j++) {
			const cell = {
				key: `div-${i}-${j}`,
				classNames: "",
			};

			// Determine if the cell is in the last row
			const isLastRow = i === rows - 1;
			// Determine if the cell is the first or last in the row
			const isFirstRow = i === 0;
			const isFirstColumn = j === 0;
			const isLastColumn = j === columns - 1;

			// Add appropriate class names to the cell
			if (!isFirstRow && (isLastRow || isFirstColumn || isLastColumn)) {
				cell.classNames = "taken border";
			}

			// Add class "lastrow" to cells in the last row
			if (isLastRow) {
				cell.classNames += " lastrow";
			}

			// Add class "firstrow" to cells in the first row
			if (isFirstRow) {
				cell.classNames += " firstrow border";
			}

			// Add class "leftborder" to cells at the beginning of each row (except the first row)
			if (!isFirstRow && isFirstColumn) {
				cell.classNames += " leftborder";
			}

			// Add class "rightborder" to cells at the end of each row (except the first row)
			if (!isFirstRow && isLastColumn) {
				cell.classNames += " rightborder";
			}

			rowArray.push(cell);
		}
		gridArray.push(rowArray);
	}

	console.log(gridArray);

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
		let cells = Array.from(document.querySelectorAll(".grid div"));

		function draw() {
			if (!cells) return;
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
		}, tickSpeedRef.current);

		let lastMove = false;
		let addingScore = false;

		function moveDown() {
			if (!lastMove && !disableControls && !addingScore) {
				undraw();
				currentPosition += width;
				draw();
				freeze();
			}
		}

		function moveLeft() {
			undraw();
			const isAtLeftEdge = current.some((index) => (currentPosition + index) % width === 0);
			if (!isAtLeftEdge && !checkCollision(current.map((index) => index - 1))) {
				currentPosition -= 1;
			}

			draw();
		}

		function moveRight() {
			undraw();
			const isAtRightEdge = current.some(
				(index) => (currentPosition + index) % width === width - 1
			);
			if (!isAtRightEdge && !checkCollision(current.map((index) => index + 1))) {
				currentPosition += 1;
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
					addScore();
					draw();

					displayShape();

					lastMove = false;
				}, tickSpeedRef.current);
			}
		}

		function resetGrid() {
			cells.forEach((cell) => {
				cell.classList.remove("tetromino");
				if (!cell.classList.contains("border")) {
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

		function checkCompletedRows() {
			const completedRows = [];
			for (let i = 0; i < cells.length; i += width) {
				// Check if the row is not the first row and not the last row
				if (
					!cells[i].classList.contains("firstrow") &&
					!cells[i].classList.contains("lastrow")
				) {
					let isCompleted = true;
					for (let j = i; j < i + width; j++) {
						if (!cells[j].classList.contains("taken")) {
							isCompleted = false;
							break; // Exit inner loop early if any cell in the row is not taken
						}
					}
					if (isCompleted) {
						// Full row completed
						completedRows.push(i / width); // Push the row index
					}
				}
			}
			return completedRows;
		}

		function addScore() {
			console.log("Checking adding score...");
			addingScore = true;

			// Check which rows are completed
			const completedRows = checkCompletedRows();

			console.log(completedRows);

			if (completedRows.length >= 1) {
				// Update the score
				const scoreToAdd = completedRows.length * 10;
				scoreRef.current += scoreToAdd;
				setScore(scoreRef.current);

				let scoreEl = document.querySelector(".score");
				scoreEl.classList.add("addscore");

				setTimeout(() => {
					scoreEl.classList.remove("addscore");
				}, 300);

				setTimeout(() => {
					addingScore = false;
				}, tickSpeedRef);
			} else {
				addingScore = false;
			}
		}

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

	// Render the grid based on the grid array
	return (
		<>
			<div className="grid" style={gridStyle}>
				{gridArray.map((row, rowIndex) =>
					row.map((cell) => <div key={cell.key} className={cell.classNames}></div>)
				)}
			</div>
		</>
	);
}
