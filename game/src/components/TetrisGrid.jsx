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
		startRotationRef,
		score,
		setScore,
	} = useGameContext();

	const [gridArray, setGridArray] = useState([]);

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
		const initialGridArray = generateGridArray(height, width);
		setGridArray(initialGridArray);
	}, [height, width]);

	/*
	useEffect(() => {
		console.log(gridArray);
	}, [gridArray]);
*/

	// Hardcode inline style gridStyle
	const gridStyle = {
		gridTemplateColumns: `repeat(${width}, 1fr)`,
	};

	const startX = Math.floor(width / 2) - 1;
	const startY = 0; // Assuming the tetromino starts at the top row

	let currentX = startX;
	let currentY = startY;

	let currentRotation = startRotationRef.current;

	// let random = Math.floor(Math.random() * theTetrominoes.length);
	let current = theTetrominoes[randomRef.current][startRotationRef.current];

	useEffect(() => {
		let lastMove = false;
		let addingScore = false;

		const timerId = setInterval(() => {
			if (!isPausedRef.current) {
				moveDown();
			}
		}, tickSpeedRef.current);

		return () => clearInterval(timerId);

		// Draw each new state of the gridArray with the tetrominos position
		function draw() {
			// Create a copy of the gridArray to modify
			const newGridArray = [...gridArray];

			// Iterate over the tetromino and update classNames in newGridArray
			current.forEach((row, rowIndex) => {
				row.forEach((cell, columnIndex) => {
					if (cell === 1) {
						// If the cell is part of the tetromino (has a value of 1)
						const x = currentX + columnIndex;
						const y = currentY + rowIndex;

						// Update classNames in the newGridArray if the cell doesn't already have the "tetromino" class
						if (!newGridArray[y][x].classNames.includes("tetromino")) {
							newGridArray[y][x].classNames.push("tetromino");
						}
					}
				});
			});

			// Set the newGridArray as the new state to draw it
			setGridArray(newGridArray);
		}

		function moveDown() {
			if (!lastMove && !disableControls && !addingScore) {
				undraw();
				currentY++; // Move down by incrementing the row index
				draw();
				freeze();
			}
		}

		function undraw() {
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
						const index = cell.classNames.indexOf("tetromino");
						if (index !== -1) {
							newGridArray[rowIndex][columnIndex].classNames.splice(index, 1);
						}
					}
				});
			});

			// Set the newGridArray as the new state

			setGridArray(newGridArray);
		}

		function moveLeft() {
			console.log("Move left...");
			undraw();

			// Check if any filled cell of the tetromino is at the left edge of the grid
			const isAtLeftEdge = current.some((row, rowIndex) =>
				row.some((cell, colIndex) => cell === 1 && (currentX + colIndex) % width === 0)
			);

			// Check if moving left would result in a collision
			const leftPositions = current.map((row, rowIndex) =>
				row.map((cell, colIndex) => (cell === 1 ? currentX + colIndex - 1 : null))
			);
			const collision = checkCollision(leftPositions);

			// Move the tetromino left if it's not at the left edge and there is no collision
			if (!isAtLeftEdge && !collision) {
				currentX--; // Move left by decrementing the column index
			}

			draw(); // Redraw the grid with the updated position
		}

		function moveRight() {
			undraw();
			const isAtRightEdge = current.some((index) => (currentX + index) % width === width - 1);
			if (!isAtRightEdge && !checkCollision(current.map((index) => index + 1))) {
				currentX++; // Move right by incrementing the column index
			}

			draw();
		}

		/*
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
*/
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
						(gridArray[gridY][gridX].classNames.includes("taken") ||
							gridArray[gridY][gridX].classNames.includes("tetromino"))
					);
				})
			);
		}

		function freeze() {
			let newY = currentY + 1;

			// Determine the bottom row of the tetromino
			const collisionUnderneath = current.some((row, rowIndex) =>
				row.some((cell, colIndex) => {
					// Calculate grid coordinates for the current cell
					const gridX = currentX + colIndex;
					const gridY = newY + rowIndex;

					// Check if the cell is filled in the tetromino and there is a collision with the grid
					return (
						cell === 1 &&
						gridY >= 0 &&
						gridArray[gridY] &&
						gridArray[gridY][gridX] &&
						gridArray[gridY][gridX].classNames.includes("taken")
					);
				})
			);

			// If collision detected, freeze the tetromino
			if (collisionUnderneath) {
				lastMove = true;
				setTimeout(() => {
					current.forEach((row, rowIndex) => {
						row.forEach((cell, colIndex) => {
							if (cell === 1) {
								const x = currentX + colIndex;
								const y = currentY + rowIndex;
								gridArray[y][x].classNames.push("taken");
							}
						});
					});

					const newRandom = nextRandomRef.current;
					nextRandomRef.current = Math.floor(Math.random() * theTetrominoes.length);
					startRotationRef.current = Math.floor(Math.random() * 4);
					randomRef.current = newRandom;
					current = theTetrominoes[newRandom][startRotationRef.current];
					currentX = startX;
					currentY = startY;

					displayShape();
					draw();

					lastMove = false;
				}, tickSpeedRef.current);
			}
		}

		/*
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

		*/
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

		/*
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

		*/

		return () => {
			clearInterval(timerId);
			document.removeEventListener("keydown", control);
		};
	}, [gameRunning, width, setScore, randomRef.current, current, currentRotation, theTetrominoes]);

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
