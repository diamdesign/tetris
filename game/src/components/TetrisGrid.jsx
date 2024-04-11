import React, { useEffect, useState, useContext, useRef } from "react";
import { useGameContext } from "./Context";
import { playSound } from "./playSound";

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
		generateGridArray,
		gridArray,
		setGridArray,
	} = useGameContext();

	useEffect(() => {
		// Inside useEffect, update gridArray using setGridArray

		// Call generateGridArray to initialize gridArray
		const initialGridArray = generateGridArray(height, width);
		setGridArray(initialGridArray);
	}, [height, width]);

	// Hardcode inline style gridStyle
	const gridStyle = {
		gridTemplateColumns: `repeat(${width}, 1fr)`,
	};

	const startX = Math.floor(width / 2) - 1;
	const startY = 0; // Assuming the tetromino starts at the top row

	const currentY = useRef(startY);
	const currentX = useRef(startX);

	const currentRotation = useRef(startRotationRef.current);

	// let random = Math.floor(Math.random() * theTetrominoes.length);
	const current = useRef(theTetrominoes[randomRef.current][startRotationRef.current]);

	const timerId = useRef(null);

	useEffect(() => {
		document.addEventListener("keydown", control);
		let lastMove = false;
		let addingScore = false;

		// Draw each new state of the gridArray with the tetrominos position
		function draw() {
			// Create a copy of the gridArray to modify
			const newGridArray = [...gridArray];

			console.log(currentY.current);

			let tetromino = current.current;
			// Iterate over the Tetromino's shape and update the gridArray
			tetromino.forEach((row, rowIndex) => {
				row.forEach((cell, colIndex) => {
					const gridX = currentX.current + colIndex;
					const gridY = currentY.current + rowIndex;

					// Update the gridArray if the cell is part of the Tetromino
					if (cell === 1 && gridY >= 0 && gridY < height && gridX >= 0 && gridX < width) {
						// Set the Tetromino cell in the gridArray
						newGridArray[gridY][gridX].classNames.push("tetromino");
					}
				});
			});

			// Set the newGridArray as the new state to draw it
			setGridArray(newGridArray);
		}

		function moveDown() {
			console.log(disableControls);
			// const isCollision = checkCollisionBottom(currentX, newY, current, gridArray);
			if (!disableControls) {
				undraw();
				currentY.current = currentY.current + 1; // Move down by incrementing the row index
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
		}

		function moveLeft() {
			undraw();
			/*
			// Check if any filled cell of the tetromino is at the left edge of the grid
			const isAtLeftEdge = current.some((row, rowIndex) =>
				row.some(
					(cell, colIndex) =>
						cell === 1 &&
						colIndex === 0 && // Check if it's the leftmost cell in the tetromino
						gridArray[currentY + rowIndex] && // Check if the row exists in gridArray
						gridArray[currentY + rowIndex][currentX + colIndex] // Check if the cell exists in gridArray
				)
			);

		
			// Check if moving left would result in a collision
			const leftPositions = current.map((row, rowIndex) =>
				row.map((cell, colIndex) => (cell === 1 ? currentX + colIndex - 1 : null))
			);
			const collision = checkCollision(leftPositions);
	*/
			// Move the tetromino left if it's not at the left edge and there is no collision

			currentX.current = currentX.current - 1;

			draw(); // Redraw the grid with the updated position
		}

		function moveRight() {
			undraw();

			currentX.current = currentX.current + 1;

			draw();
		}

		function rotate() {
			undraw();
			let nextRotation = currentRotation.current + 1;
			if (nextRotation === theTetrominoes[randomRef.current].length) {
				// Loop back order at the end
				nextRotation = 0;
			}
			const nextTetromino = theTetrominoes[randomRef.current][nextRotation];

			// Calculate the potential position after rotation
			const nextX = currentX.current;
			const nextY = currentY.current;

			currentRotation.current = nextRotation;
			current.current = nextTetromino;

			/*
			// Check if rotation is possible without hitting walls or other objects
			if (!checkCollision(nextTetromino, nextX, nextY)) {
				currentRotation = nextRotation;
				current = nextTetromino;
			}
			*/
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
						(gridArray[gridY][gridX].classNames.includes("taken") ||
							gridArray[gridY][gridX].classNames.includes("tetromino"))
					);
				})
			);
		}

		function checkCollisionBottom(currentX, currentY, tetromino, gridArray) {
			// Check for collision with the bottom edge of the grid

			const collisionUnderneath = tetromino.some((row, rowIndex) =>
				row.some((cell, colIndex) => {
					// Calculate grid coordinates for the current cell
					const gridX = currentX + colIndex;
					const gridY = currentY + rowIndex;

					// Check if the cell is filled in the tetromino and there is a collision with the grid
					return (
						cell === 1 &&
						(gridY >= gridArray.length || // Collision with bottom edge of grid
							(gridArray[gridY] &&
								gridArray[gridY][gridX] &&
								gridArray[gridY][gridX].classNames.includes("taken")))
					);
				})
			);

			return collisionUnderneath;
		}

		function freeze() {
			let newY = currentY.current + 1;
			let currX = currentX.current;

			let tetromino = current.current;

			const isCollision = checkCollisionBottom(currX, newY, tetromino, gridArray);
			// If collision detected, freeze the tetromino
			if (isCollision) {
				tetromino.forEach((row, rowIndex) => {
					row.forEach((cell, colIndex) => {
						if (cell === 1) {
							const x = currentX.current + colIndex;
							const y = currentY.current + rowIndex;
							gridArray[y][x].classNames.push("taken");
						}
					});
				});

				const newRandom = nextRandomRef.current;
				nextRandomRef.current = Math.floor(Math.random() * theTetrominoes.length);
				startRotationRef.current = Math.floor(Math.random() * 4);
				randomRef.current = newRandom;
				current.current = theTetrominoes[newRandom][startRotationRef.current];
				currentX.current = startX;
				currentY.current = startY;

				displayShape();
				draw();
			}
		}

		function fullDown() {
			let newY = currentY.current + 1;
			let newX = currentX.current;
			let stepsDown = 0;

			let tetromino = current.current;

			undraw();
			// Move the object down until a collision is detected
			while (!checkCollisionBottom(newX, newY, tetromino, gridArray)) {
				newY++; // Move down by incrementing the row index
				stepsDown++; // Increment the steps down counter
			}

			// Update the currentY to finalize the position
			currentY.current += stepsDown;

			draw();

			let fullDownSound = ["fulldown", "fulldown2"];
			let randomFullDownSound = Math.floor(Math.random() * fullDownSound.length);

			playSound(fullDownSound[randomFullDownSound], 0.6);

			document.querySelector("#container").classList.add("fulldown");
			setTimeout(() => {
				document.querySelector("#container").classList.remove("fulldown");
			}, 250);

			tetromino.forEach((row, rowIndex) => {
				row.forEach((cell, colIndex) => {
					if (cell === 1) {
						const x = currentX.current + colIndex;
						const y = currentY.current + rowIndex;
						gridArray[y][x].classNames.push("taken");
					}
				});
			});

			draw();

			const newRandom = nextRandomRef.current;
			nextRandomRef.current = Math.floor(Math.random() * theTetrominoes.length);
			startRotationRef.current = Math.floor(Math.random() * 4);
			randomRef.current = newRandom;
			current.current = theTetrominoes[newRandom][startRotationRef.current];
			currentX.current = startX;
			currentY.current = startY;

			displayShape();
		}

		function resetGrid() {
			undraw();
			// Iterate over the gridArray

			gridArray.forEach((row) => {
				row.forEach((cell) => {
					// Check if the cell has both "tetromino" and "taken" in classNames
					if (
						cell.classNames.includes("tetromino") &&
						cell.classNames.includes("taken")
					) {
						// Remove both "tetromino" and "taken" from classNames
						cell.classNames = cell.classNames.filter(
							(className) => className !== "tetromino" && className !== "taken"
						);
					}
				});
			});

			const newRandom = Math.floor(Math.random() * theTetrominoes.length);
			randomRef.current = newRandom;
			current.current = theTetrominoes[randomRef.current][currentRotation.current];

			let newGrid = [...gridArray];
			setGridArray(newGrid);

			currentY.current = 0; // Update currentY state
			currentX.current = Math.floor(width / 2) - 1; // Update currentX state
			// Redraw the grid
			draw();
		}

		function resetGame() {
			resetGrid();

			displayShape();
		}

		function control(e) {
			if (e.keyCode === 37) {
				moveLeft();
			} else if (e.keyCode === 39) {
				moveRight();
			} else if (e.keyCode === 40) {
				moveDown();
			} else if (e.keyCode === 38) {
				rotate();
			} else if (e.keyCode === 32) {
				fullDown();
			} else if (e.keyCode === 82) {
				resetGame();
			}
		}

		/*
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

		timerId.current = setInterval(() => {
			if (!isPausedRef.current) {
				moveDown();
				console.log("Timer tick");
			}
		}, tickSpeedRef.current);

		return () => {
			clearInterval(timerId.current);
			document.removeEventListener("keydown", control);
		};
	}, [gameRunning, width]);

	useEffect(() => {
		return () => {
			clearInterval(timerId.current);
		};
	}, []);

	// Render the grid based on the grid array
	return (
		<>
			<div className="grid" style={gridStyle}>
				{gridArray.map((row, rowIndex) =>
					row.map((cell) => (
						<div key={cell.key + rowIndex} className={cell.classNames.join(" ")}></div>
					))
				)}
			</div>
		</>
	);
}
