import React, { useEffect, useState, useContext } from "react";
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
		setWidth,
		setHeight,
		randomRef,
		isPausedRef,
		nextRandomRef,
		scoreRef,
		tickSpeedRef,
		score,
		setScore,
	} = useGameContext();

	const [gridArray, setGridArray] = useState([]);
	const [undrawPending, setUndrawPending] = useState(true);

	const rows = height;
	const columns = width;

	useEffect(() => {
		// Inside useEffect, update gridArray using setGridArray
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

		// Call generateGridArray to initialize gridArray
		const initialGridArray = generateGridArray(rows, columns);
		setGridArray(initialGridArray);
	}, [rows, columns]);

	// Hardcode inline style gridStyle
	const gridStyle = {
		gridTemplateColumns: `repeat(${width}, 1fr)`,
	};

	const startX = Math.floor(width / 2) - 1;
	const startY = 0; // Assuming the tetromino starts at the top row

	let currentX = startX;
	let currentY = startY;

	let currentRotation = 0;

	// let random = Math.floor(Math.random() * theTetrominoes.length);
	let current = theTetrominoes[randomRef.current][currentRotation];

	useEffect(() => {
		const timerId = setInterval(() => {
			if (!isPausedRef.current) {
				moveDown();
			}
		}, tickSpeedRef.current);

		return () => clearInterval(timerId);

		// Draw each new state of the gridArray with the tetrominos position
		function draw() {
			if (undrawPending) {
				// Create a copy of the gridArray to modify
				const newGridArray = [...gridArray];

				// Iterate over the tetromino and update classNames in newGridArray
				current.forEach((row, rowIndex) => {
					row.forEach((cell, columnIndex) => {
						if (cell === 1) {
							// If the cell is part of the tetromino (has a value of 1)
							const x = currentX + columnIndex;
							const y = currentY + rowIndex;

							// Update classNames in the newGridArray
							newGridArray[y][x].classNames.push("tetromino");
						}
					});
				});

				// Set the newGridArray as the new state to draw it
				setGridArray(newGridArray);
				setUndrawPending(false);
			}
		}

		if (gameRunning) {
			draw();
		}

		let lastMove = false;
		let addingScore = false;

		function moveDown() {
			if (!lastMove && !disableControls && !addingScore) {
				undraw();
				currentY++; // Move down by incrementing the row index
				draw();
				// freeze();
			}
		}

		function undraw() {
			if (!undrawPending) {
				// Create a copy of the gridArray to modify
				const newGridArray = [...gridArray];

				// Iterate over the gridArray and remove the "tetromino" class from appropriate cells
				newGridArray.forEach((row, rowIndex) => {
					row.forEach((cell, columnIndex) => {
						// Check if the cell has the "tetromino" class and does not have the "taken" class
						if (
							cell.classNames.includes("tetromino") &&
							!cell.classNames.includes("taken")
						) {
							// Remove the "tetromino" class from classNames in the newGridArray
							newGridArray[rowIndex][columnIndex].classNames = cell.classNames.filter(
								(className) => className !== "tetromino"
							);
						}
					});
				});

				// Set the newGridArray as the new state
				setGridArray(newGridArray);
				setUndrawPending(true);
			}
		}

		/*
		function moveLeft() {
			undraw();
			const isAtLeftEdge = current.some((index) => (currentX + index) % width === 0);
			if (!isAtLeftEdge && !checkCollision(current.map((index) => index - 1))) {
				currentX--; // Move left by decrementing the column index
			}

			draw();
		}

		function moveRight() {
			undraw();
			const isAtRightEdge = current.some((index) => (currentX + index) % width === width - 1);
			if (!isAtRightEdge && !checkCollision(current.map((index) => index + 1))) {
				currentX++; // Move right by incrementing the column index
			}

			draw();
		}

		function rotate() {
			undraw();
			let nextRotation = currentRotation + 1;
			if (nextRotation === theTetrominoes[randomRef.current].length) {
				// Loop back order at the end
				nextRotation = 0;
			}
			const nextTetromino = theTetrominoes[randomRef.current][nextRotation];

			// Calculate the potential position after rotation
			const nextX = currentX;
			const nextY = currentY;

			// Check if rotation is possible without hitting walls or other objects
			if (!checkCollision(nextTetromino, nextX, nextY)) {
				currentRotation = nextRotation;
				current = nextTetromino;
			}

			draw();
		}

		function checkCollision(tetromino, x, y) {
			return tetromino.some((row, rowIndex) =>
				row.some((cell, colIndex) => {
					const gridX = x + colIndex;
					const gridY = y + rowIndex;
					return (
						gridY >= 0 &&
						cell &&
						gridArray[gridY] &&
						gridArray[gridY][gridX] &&
						(gridArray[gridY][gridX].classList.contains("taken") ||
							gridArray[gridY][gridX].classList.contains("tetromino"))
					);
				})
			);
		}

		function freeze() {
			if (
				current.some((index) =>
					gridArray[currentY + Math.floor((index + currentY * width) / width) + 1][
						currentX + ((index + currentY * width) % width)
					].classNames.includes("taken")
				)
			) {
				lastMove = true;
				setTimeout(() => {
					current.forEach(
						(index) =>
							(gridArray[currentY + Math.floor((index + currentY * width) / width)][
								currentX + ((index + currentY * width) % width)
							].classNames += " taken")
					);
					const newRandom = nextRandomRef.current;
					nextRandomRef.current = Math.floor(Math.random() * theTetrominoes.length);

					randomRef.current = newRandom;

					current = theTetrominoes[randomRef.current][currentRotation];
					currentX = startX;
					currentY = startY;
					// addScore();
					draw();

					displayShape();

					lastMove = false;
				}, tickSpeedRef.current);
			}
		}

		function resetGrid() {
			// Iterate over the gridArray
			gridArray = generateGridArray(rows, columns);

			// Reset current position and rotation
			currentX = startX;
			currentY = startY;
			const newRandom = Math.floor(Math.random() * theTetrominoes.length);
			randomRef.current = newRandom;
			current = theTetrominoes[randomRef.current][currentRotation];

			// Redraw the grid
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
			for (let i = 0; i < gridArray.length; i += width) {
				// Check if the row is not the first row and not the last row
				if (
					!gridArray[i].classList.contains("firstrow") &&
					!gridArray[i].classList.contains("lastrow")
				) {
					let isCompleted = true;
					for (let j = i; j < i + width; j++) {
						if (!gridArray[j].classList.contains("taken")) {
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

		*/
	}, [gameRunning, setScore, randomRef.current, current, currentRotation, width, theTetrominoes]);

	// Render the grid based on the grid array
	return (
		<>
			<div className="grid" style={gridStyle}>
				{gridArray.map((row, rowIndex) =>
					row.map((cell) => (
						<div key={cell.key} className={cell.classNames.join(" ")}></div>
					))
				)}
			</div>
		</>
	);
}
