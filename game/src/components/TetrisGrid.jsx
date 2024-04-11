import React, { useEffect, useState, useContext, useRef } from "react";
import { useGameContext } from "./Context";
import { playSound } from "./playSound";

export function TetrisGrid() {
	const {
		color,
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
		nextStartRotationRef,
		score,
		setScore,
		generateGridArray,
		gridArray,
		setGridArray,
		colorRef,
		startX,
		setStartX,
		startXRef,
		addedLines,
		setAddedLines,
		addedScore,
		setAddedScore,
		setShowScore,
		showScore,
		gridArrayRef,
	} = useGameContext();

	useEffect(() => {
		// Inside useEffect, update gridArray using setGridArray

		// Call generateGridArray to initialize gridArray
		const initialGridArray = generateGridArray(height, width);
		setGridArray(initialGridArray);
		gridArrayRef.current = initialGridArray;
	}, [startX, height, width]);

	// Hardcode inline style gridStyle
	const gridStyle = {
		gridTemplateColumns: `repeat(${width}, 1fr)`,
	};

	let movedDiv = 0;

	const startY = -2; // Assuming the tetromino starts at the top row

	const currentY = useRef(startY);
	const currentX = useRef(startX);

	const currentRotation = useRef(startRotationRef.current);

	// let random = Math.floor(Math.random() * theTetrominoes.length);
	const current = useRef(theTetrominoes[randomRef.current][startRotationRef.current]);
	colorRef.current = randomRef.current;

	const timerId = useRef(null);
	useEffect(() => {
		let newValue = Math.floor(width / 2 - 1);
		setStartX(newValue);
		currentX.current = startX;
	}, [gameRunning]);

	useEffect(() => {
		console.log("StartX", startX);
		document.addEventListener("keydown", control);
		let lastMove = false;
		let addingScore = false;

		// Draw each new state of the gridArray with the tetrominos position
		function draw() {
			// Create a copy of the gridArray to modify
			const newGridArray = [...gridArrayRef.current];

			let tetromino = current.current;
			// Iterate over the Tetromino's shape and update the gridArray
			tetromino.forEach((row, rowIndex) => {
				row.forEach((cell, colIndex) => {
					const gridX = currentX.current + colIndex;
					const gridY = currentY.current + rowIndex;

					// Update the gridArray if the cell is part of the Tetromino
					if (cell === 1 && gridY >= 0 && gridY < height && gridX >= 0 && gridX < width) {
						// Set the Tetromino cell in the gridArray

						newGridArray[gridY][gridX].classNames.push(
							"tetromino",
							color[colorRef.current]
						);
					}
				});
			});

			// Set the newGridArray as the new state to draw it
			setGridArray(newGridArray);
			gridArrayRef.current = newGridArray;
		}

		function moveDown() {
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
			const newGridArray = [...gridArrayRef.current];

			// Iterate over the gridArray and remove the "tetromino" class from appropriate cells
			newGridArray.forEach((row, rowIndex) => {
				row.forEach((cell, columnIndex) => {
					// Check if the cell has the "tetromino" class and does not have the "taken" class
					if (
						cell.classNames.includes("tetromino") &&
						!cell.classNames.includes("taken")
					) {
						// Array of color classes to remove
						const colorsToRemove = [
							"red",
							"orange",
							"purple",
							"blue",
							"yellow",
							"green",
							"white",
						];

						// Remove the "tetromino" class and any color class from classNames in the newGridArray
						const cell = newGridArray[rowIndex][columnIndex];
						const indexesToRemove = [];

						// Find and store indexes of classes to remove
						["tetromino", ...colorsToRemove].forEach((className) => {
							const index = cell.classNames.indexOf(className);
							if (index !== -1) {
								indexesToRemove.push(index);
							}
						});

						// Remove classes from classNames array in reverse order to avoid changing indexes
						indexesToRemove
							.sort((a, b) => b - a)
							.forEach((index) => {
								cell.classNames.splice(index, 1);
							});
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
			playSound("ticksmall", 0.6);

			draw(); // Redraw the grid with the updated position
		}

		function moveRight() {
			undraw();

			currentX.current = currentX.current + 1;
			playSound("ticksmall", 0.6);
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
			playSound("rotate", 0.6);
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

				startRotationRef.current = nextStartRotationRef.current;
				nextStartRotationRef.current = Math.floor(Math.random() * 3);

				colorRef.current = newRandom;
				randomRef.current = newRandom;

				current.current = theTetrominoes[newRandom][startRotationRef.current];
				currentX.current = startX;
				currentY.current = startY;
				addScore();

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

			// draw();

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
			startRotationRef.current = nextStartRotationRef.current;
			nextStartRotationRef.current = Math.floor(Math.random() * 3);
			randomRef.current = newRandom;
			colorRef.current = newRandom;
			current.current = theTetrominoes[newRandom][startRotationRef.current];
			currentX.current = startX;
			currentY.current = startY;

			console.log(colorRef.current);

			addScore();

			displayShape();
		}

		function resetGrid() {
			undraw();
			let newGrid = [...gridArrayRef.current];
			// Iterate over the gridArray

			gridArray.forEach((row, rowIndex) => {
				row.forEach((cell, columnIndex) => {
					// Check if the cell has both "tetromino" and "taken" in classNames
					if (
						cell.classNames.includes("tetromino") &&
						cell.classNames.includes("taken")
					) {
						// Array of color classes to remove
						const colorsToRemove = [
							"red",
							"orange",
							"purple",
							"blue",
							"yellow",
							"green",
							"white",
						];

						// Remove the "tetromino" class and any color class from classNames in the newGridArray
						const cell = newGrid[rowIndex][columnIndex];
						const indexesToRemove = [];

						// Find and store indexes of classes to remove
						["tetromino", ...colorsToRemove].forEach((className) => {
							const index = cell.classNames.indexOf(className);
							if (index !== -1) {
								indexesToRemove.push(index);
							}
						});

						// Remove classes from classNames array in reverse order to avoid changing indexes
						indexesToRemove
							.sort((a, b) => b - a)
							.forEach((index) => {
								cell.classNames.splice(index, 1);
							});
					}
				});
			});

			const newRandom = Math.floor(Math.random() * theTetrominoes.length);
			randomRef.current = newRandom;
			colorRef.current = newRandom;
			current.current = theTetrominoes[randomRef.current][currentRotation.current];

			setGridArray(newGrid);
			gridArrayRef.current = newGrid;

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
			if (!disableControls) {
				if (e.keyCode === 37 || e.keyCode === 65) {
					moveLeft();
				} else if (e.keyCode === 39 || e.keyCode === 68) {
					moveRight();
				} else if (e.keyCode === 40 || e.keyCode === 83) {
					playSound("tickbig", 0.6);
					moveDown();
				} else if (e.keyCode === 38 || e.keyCode === 87) {
					rotate();
				} else if (e.keyCode === 32) {
					fullDown();
				} else if (e.keyCode === 82) {
					resetGame();
				}
			}
		}

		function checkCompletedRows() {
			const completedRows = [];

			// Iterate over each row
			gridArray.forEach((row, y) => {
				// Skip rows with "firstrow" or "lastrow" class
				if (
					row.some(
						(cell) =>
							cell.classNames.includes("firstrow") ||
							cell.classNames.includes("lastrow")
					)
				) {
					return;
				}

				let isCompleted = true;

				// Check if all cells in the row have class "taken"
				row.forEach((cell) => {
					if (!cell.classNames.includes("taken")) {
						isCompleted = false;
					}
				});

				// If all cells are taken, add the row index to completedRows
				if (isCompleted) {
					completedRows.push(y);
				}
			});

			return completedRows;
		}

		function removeAddRows(completedRows) {
			// Create a copy of gridArray
			const grid = gridArrayRef.current;
			console.log(grid);
			const newGridArray = grid.map((row) => [...row]);

			// Iterate through completedRows and remove/add rows accordingly
			completedRows.forEach((rowIndex, newIndex) => {
				const rowToRemove = newGridArray.splice(rowIndex, 1)[0];

				// Insert the row at the top (index 1)
				newGridArray.splice(1, 0, rowToRemove);

				// Update the indices of the remaining rows
				newGridArray.forEach((row) => {
					row.forEach((cell) => {
						movedDiv++;
						cell.key = `div-moved-${movedDiv}-${Math.floor(Math.random() * 1000)}`;
					});
				});
			});

			console.log(newGridArray);

			// Update gridArray
			setGridArray(newGridArray);
			gridArrayRef.current = newGridArray;
			console.log(gridArrayRef.current);
		}

		function addScore() {
			console.log("Checking adding score...");

			// Check which rows are completed
			const completedRows = checkCompletedRows();

			console.log(completedRows);

			if (completedRows.length >= 1) {
				removeAddRows(completedRows);

				setShowScore(true);
				// Update the score
				let newLines = lines - completedRows.length;
				if (newLines === 0) {
					setLines(10);
					let newLevel = level + 1;
					setLevel(newLevel);
				} else {
					setLines(newLines);
				}

				setAddedLines(completedRows.length);
				const scoreToAdd = completedRows.length * 10;
				setAddedScore(scoreToAdd);
				scoreRef.current += scoreToAdd;
				setScore(scoreRef.current);

				let scoreEl = document.querySelector(".score");
				scoreEl.classList.add("addscore");

				setTimeout(() => {
					scoreEl.classList.remove("addscore");
				}, 300);

				setTimeout(() => {
					setShowScore(false);
				}, 800);

				setTimeout(() => {
					addingScore = false;
				}, tickSpeedRef);
			}
		}

		timerId.current = setInterval(() => {
			if (!isPausedRef.current) {
				moveDown();
			}
		}, tickSpeedRef.current);

		return () => {
			clearInterval(timerId.current);
			document.removeEventListener("keydown", control);
		};
	}, [gameRunning]);
	/*
	useEffect(() => {
		return () => {
			clearInterval(timerId.current);
		};
	}, []);
*/
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
