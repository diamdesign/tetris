import React, { useEffect, useState, useContext, useRef } from "react";
import { useGameContext } from "./Context";
import { playSound } from "./playSound";

export function TetrisGrid() {
	const {
		levelClassName,
		setLevelClassName,
		color,
		disableControls,
		setDisableControls,
		level,
		levelRef,
		setLevel,
		lines,
		linesRef,
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
		winRow,
		winLevel,
		setShowFullDown,
		showFullDown,
		multiplier,
		multiplierRef,
		setMultiplier,
		fullDownScoreRef,
		fullDownScore,
		setFullDownScore,
		gameOver,
		setGameOver,
		rotation,
		setRotation,
		highscoreArray,
		aliasRef,
		showDarkoverlay,
		setShowDarkoverlay,
		isResetGame,
		setIsResetGame,
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

	const startY = -1; // Assuming the tetromino starts at the top row

	const currentY = useRef(startY);
	const currentX = useRef(startX);

	const currentRotation = useRef(startRotationRef.current);

	// let random = Math.floor(Math.random() * theTetrominoes.length);
	const current = useRef(theTetrominoes[randomRef.current][startRotationRef.current]);

	colorRef.current = randomRef.current;

	const timerId = useRef(null);

	useEffect(() => {
		let newValue = Math.floor(width / 2 - 2);
		setStartX(newValue);
		currentX.current = startX;
	}, [gameRunning]);

	useEffect(() => {
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

		const isGameOver = () => {
			const newGridArray = [...gridArrayRef.current];

			return current.current.some((cell, colIndex) => {
				const gridX = startX + colIndex;
				return (
					cell &&
					newGridArray[3] &&
					newGridArray[3][gridX] &&
					newGridArray[3][gridX].classNames.includes("taken") &&
					newGridArray[3][gridX].classNames.includes("tetromino")
				);
			});
		};

		function moveDown() {
			const newY = currentY.current + 1;
			const isCollision = checkCollisionBottom(
				currentX.current,
				newY,
				current.current,
				gridArrayRef.current
			);
			if (isCollision) {
				freeze();
			}
			if (!disableControls && !winRow.current) {
				playSound("tickbig", 0.6);
				undraw();

				currentY.current = currentY.current + 1;

				const checkGameOver = isGameOver(); // Changed variable name to avoid conflict
				if (checkGameOver) {
					gameOver();
					return;
				}

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
			setGridArray(newGridArray);
			gridArrayRef.current = newGridArray;
		}

		function moveLeft() {
			undraw();

			let newLeft = currentX.current - 1;
			const isCollision = checkCollision(current.current, newLeft, currentY.current);

			if (isCollision) {
				draw();
				return;
			}

			currentX.current = currentX.current - 1;
			playSound("ticksmall", 0.6);

			draw(); // Redraw the grid with the updated position
		}

		function moveRight() {
			undraw();

			let newRight = currentX.current + 1;
			const isCollision = checkCollision(current.current, newRight, currentY.current);

			if (isCollision) {
				draw();
				return;
			}

			currentX.current = currentX.current + 1;
			playSound("ticksmall", 0.6);
			draw();
		}

		function rotate() {
			undraw();
			let nextRotation = currentRotation.current + 1;
			console.log(nextRotation);
			if (nextRotation === theTetrominoes[randomRef.current].length) {
				// Loop back order at the end
				nextRotation = 0;
			}

			const nextTetromino = theTetrominoes[randomRef.current][nextRotation];

			const isCollision = checkCollision(nextTetromino, currentX.current, currentY.current);

			if (!isCollision) {
				currentRotation.current = nextRotation;
				current.current = nextTetromino;
				// setRotation(nextRotation);
				playSound("rotate", 0.6);
			}
			draw();
		}

		function rotateBack() {
			undraw();
			let nextRotation = currentRotation.current - 1;
			console.log(nextRotation);
			if (nextRotation < 0) {
				// Loop back order at the end
				nextRotation = theTetrominoes[randomRef.current].length - 1;
			}
			console.log(nextRotation);
			const nextTetromino = theTetrominoes[randomRef.current][nextRotation];

			const isCollision = checkCollision(nextTetromino, currentX.current, currentY.current);

			if (!isCollision) {
				currentRotation.current = nextRotation;
				current.current = nextTetromino;
				// setRotation(nextRotation);
				playSound("rotate", 0.6);
			}
			draw();
		}

		function checkCollision(tetromino, x, y) {
			const newGridArray = gridArrayRef.current;
			return tetromino.some((row, rowIndex) =>
				row.some((cell, colIndex) => {
					const gridX = x + colIndex;
					const gridY = y + rowIndex;
					return (
						gridY >= 0 &&
						cell &&
						newGridArray[gridY] &&
						newGridArray[gridY][gridX] &&
						(newGridArray[gridY][gridX].classNames.includes("taken") ||
							newGridArray[gridY][gridX].classNames.includes("tetromino") ||
							newGridArray[gridY][gridX].classNames.includes("leftborder") ||
							newGridArray[gridY][gridX].classNames.includes("rightborder") ||
							newGridArray[gridY][gridX].classNames.includes("lastrow"))
					);
				})
			);
		}

		function checkCollisionBottom(currentX, currentY, tetromino, gridArray) {
			// Check for collision with the bottom edge of the grid

			let newGridArray = [...gridArray];
			const collisionUnderneath = tetromino.some((row, rowIndex) =>
				row.some((cell, colIndex) => {
					// Calculate grid coordinates for the current cell
					const gridX = currentX + colIndex;
					const gridY = currentY + rowIndex;

					// Check if the cell is filled in the tetromino and there is a collision with the grid
					return (
						cell === 1 &&
						(gridY >= gridArray.length || // Collision with bottom edge of grid
							(newGridArray[gridY] &&
								newGridArray[gridY][gridX] &&
								newGridArray[gridY][gridX].classNames.includes("taken")))
					);
				})
			);

			return collisionUnderneath;
		}

		function freeze() {
			let newY = currentY.current + 1;
			let currX = currentX.current;

			let tetromino = current.current;

			let newGridArray = [...gridArrayRef.current];

			const isCollision = checkCollisionBottom(currX, newY, tetromino, newGridArray);
			// If collision detected, freeze the tetromino
			if (isCollision) {
				try {
					tetromino.forEach((row, rowIndex) => {
						row.forEach((cell, colIndex) => {
							if (cell === 1) {
								const x = currentX.current + colIndex;
								const y = currentY.current + rowIndex;

								newGridArray[y][x].classNames.push("taken");
							}
						});
					});
				} catch (error) {
					console.log("Game Over");
					gameOver();
				}

				playSound("taken", 0.2);

				const newRandom = nextRandomRef.current;
				nextRandomRef.current = Math.floor(Math.random() * theTetrominoes.length - 1);

				startRotationRef.current = nextStartRotationRef.current;
				currentRotation.current = startRotationRef.current;
				const newRotation = currentRotation.current;

				nextStartRotationRef.current = Math.floor(Math.random() * 3);

				colorRef.current = newRandom;
				randomRef.current = newRandom;

				current.current = theTetrominoes[newRandom][newRotation];
				currentX.current = startX;
				currentY.current = startY;

				gridArrayRef.current = newGridArray;
				addScore();

				displayShape();
				draw();
			}
		}

		function fullDown() {
			let newY = currentY.current + 1;
			let newX = currentX.current;
			let stepsDown = 0;

			let newGridArray = [...gridArrayRef.current];

			let tetromino = current.current;

			undraw();
			// Move the object down until a collision is detected
			while (!checkCollisionBottom(newX, newY, tetromino, newGridArray)) {
				newY++; // Move down by incrementing the row index
				stepsDown++; // Increment the steps down counter
			}

			// Update the currentY to finalize the position
			currentY.current += stepsDown;

			// draw();

			setShowFullDown(true);
			if (multiplierRef.current > 1) {
				let multipliedScore = multiplierRef.current * 10;
				scoreRef.current += multipliedScore;
				fullDownScoreRef.current = multipliedScore;
			} else {
				fullDownScoreRef.current = 10;
				scoreRef.current += 10;
			}

			setFullDownScore(fullDownScoreRef.current);

			setScore(scoreRef.current);
			let scoreEl = document.querySelector(".score");
			scoreEl.classList.add("addscore");

			setTimeout(() => {
				scoreEl.classList.remove("addscore");
			}, 300);

			let fullDownSound = ["fulldown", "fulldown2"];
			let randomFullDownSound = Math.floor(Math.random() * fullDownSound.length);

			playSound(fullDownSound[randomFullDownSound], 0.7);
			playSound("fulldownpoint", 0.4);
			playSound("taken", 0.2);

			document.querySelector("#container").classList.add("fulldown");
			setTimeout(() => {
				document.querySelector("#container").classList.remove("fulldown");
			}, 250);

			setTimeout(() => {
				setShowFullDown(false);
			}, 1000);

			tetromino.forEach((row, rowIndex) => {
				row.forEach((cell, colIndex) => {
					if (cell === 1) {
						const x = currentX.current + colIndex;
						const y = currentY.current + rowIndex;
						newGridArray[y][x].classNames.push("taken");
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

			gridArrayRef.current = newGridArray;

			addScore();

			displayShape();
		}

		function resetGrid() {
			undraw();
			const newGridArray = generateGridArray(height, width);
			setGridArray(newGridArray);
			gridArrayRef.current = newGridArray;
			currentY.current = startY;

			// Iterate over the gridArray

			/*
			newGrid.forEach((row, rowIndex) => {
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

					movedDiv++;
					cell.key = `div-moved-${movedDiv}-${Math.floor(Math.random() * 1000)}`;
				});
			});
			*/

			const newRandom = Math.floor(Math.random() * theTetrominoes.length);
			randomRef.current = newRandom;
			colorRef.current = newRandom;
			current.current = theTetrominoes[randomRef.current][currentRotation.current];

			setGridArray(newGridArray);
			gridArrayRef.current = newGridArray;

			currentY.current = 0; // Update currentY state
			currentX.current = Math.floor(width / 2) - 1; // Update currentX state
			// Redraw the grid
			draw();
		}

		function resetGame(start = null) {
			resetGrid();

			if (start !== "start") {
				let startanimEl = document.querySelector("#startanim");
				startanimEl.style.display = "none";
				setTimeout(() => {
					startanimEl.style.display = "block";
				});
				playSound("start", 0.5);
				playSound("undo", 0.5);
			}

			setMultiplier(0);
			multiplierRef.current = 0;
			setScore(0);
			scoreRef.current = 0;
			setLines(10);
			linesRef.current = 10;
			setLevel(1);
			levelRef.current = 1;
			startXRef.current = Math.floor(width / 2 - 2);

			displayShape();
		}

		function control(e) {
			if (!disableControls) {
				if (e.keyCode === 37 || e.keyCode === 65) {
					moveLeft();
				} else if (e.keyCode === 39 || e.keyCode === 68) {
					moveRight();
				} else if (e.keyCode === 40 || e.keyCode === 83) {
					moveDown();
				} else if (e.keyCode === 38 || e.keyCode === 87) {
					rotate();
				} else if (e.keyCode === 90) {
					rotateBack();
				} else if (e.keyCode === 32) {
					fullDown();
				} else if (e.keyCode === 82) {
					resetGame();
				}
			}
		}

		function checkCompletedRows() {
			const completedRows = [];

			let newGridArray = [...gridArrayRef.current];
			// Iterate over each row
			newGridArray.forEach((row, y) => {
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
			winRow.current = true;
			const grid = [...gridArrayRef.current];
			const newGridArray = grid.map((row) => [...row]);

			// Iterate through completedRows and remove/add rows accordingly
			completedRows.forEach((rowIndex) => {
				const rowToChange = newGridArray[rowIndex]; // Get the row to change

				rowToChange.forEach((cell) => {
					// Remove 'taken' class if 'tetromino' class is present
					if (cell.classNames.includes("tetromino")) {
						cell.classNames.push("winrow");
						cell.classNames = cell.classNames.filter(
							(className) => className !== "taken"
						);
					}
				});
			});

			// Update gridArray
			setGridArray(newGridArray);
			gridArrayRef.current = newGridArray;

			setTimeout(() => {
				completedRows.forEach((rowIndex, newIndex) => {
					const rowToRemove = newGridArray.splice(rowIndex, 1)[0];

					rowToRemove.forEach((cell) => {
						// Remove specified color classes and 'tetromino' class
						cell.classNames = cell.classNames.filter(
							(className) =>
								![
									"winrow",
									"red",
									"green",
									"yellow",
									"blue",
									"purple",
									"white",
									"orange",
									"tetromino",
								].includes(className)
						);
					});

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

				// Update gridArray
				setGridArray(newGridArray);
				gridArrayRef.current = newGridArray;

				winRow.current = false;
			}, 1000);
		}

		function addScore() {
			// Check which rows are completed
			const completedRows = checkCompletedRows();

			let completedLines = completedRows.length;

			let newLines = linesRef.current - completedLines;

			setLines(newLines);
			linesRef.current = newLines;

			if (completedLines >= 1) {
				removeAddRows(completedRows);

				setShowScore(true);
				// Update the score
				let isNewLevel = false;
				if (newLines <= 0) {
					setLines(10);
					isNewLevel = true;
					linesRef.current = 10;
					let newLevel = levelRef.current + 1;
					setLevelClassName("level" + newLevel);
					setLevel(newLevel);
					levelRef.current = newLevel;
					winLevel.current = true;
					setTimeout(() => {
						winLevel.current = false;
					}, 1000);
				}

				if (completedLines === 1) {
					playSound("line1", 0.4);
				} else if (completedLines === 2) {
					playSound("line1", 0.4);
					setTimeout(() => {
						playSound("line1", 0.8);
					}, 300);
				} else if (completedLines === 3) {
					playSound("line1", 0.4);
					setTimeout(() => {
						playSound("line1", 0.8);
						setTimeout(() => {
							playSound("line1", 0.8);
						}, 300);
					}, 300);
				} else if (completedLines === 4) {
					playSound("line1", 0.4);
					setTimeout(() => {
						playSound("line1", 0.8);
						setTimeout(() => {
							playSound("line1", 0.8);
							setTimeout(() => {
								playSound("line1", 0.8);
							}, 100);
						}, 200);
					}, 300);
				} else if (completedLines >= 5) {
					playSound("line1", 0.4);
					setTimeout(() => {
						playSound("line1", 0.8);
						setTimeout(() => {
							playSound("line1", 0.8);
							setTimeout(() => {
								playSound("line1", 0.8);
								setTimeout(() => {
									playSound("line1", 0.8);
								}, 50);
							}, 100);
						}, 200);
					}, 300);
				}

				var scoreToAdd;
				if (multiplierRef.current === 0) {
					scoreToAdd = completedRows.length * 100;
				} else {
					scoreToAdd = completedRows.length * 100 * multiplierRef.current;
				}
				setAddedLines(completedLines);

				if (isNewLevel) {
					scoreToAdd += 1000 * levelRef.current;

					// Set Tick Speed after Level between 1000ms level 0 and 1ms level 33
					if (levelRef.current === 2) {
						tickSpeedRef.current = 900;
					} else if (levelRef.current === 3) {
						tickSpeedRef.current = 800;
					} else if (levelRef.current === 4) {
						tickSpeedRef.current = 700;
					} else if (levelRef.current === 5) {
						tickSpeedRef.current = 600;
					} else if (levelRef.current === 6) {
						tickSpeedRef.current = 500;
					} else if (levelRef.current === 5) {
						tickSpeedRef.current = 400;
					} else if (levelRef.current === 6) {
						tickSpeedRef.current = 350;
					} else if (levelRef.current === 7) {
						tickSpeedRef.current = 300;
					} else if (levelRef.current === 8) {
						tickSpeedRef.current = 250;
					} else if (levelRef.current === 9) {
						tickSpeedRef.current = 200;
					} else if (levelRef.current === 10) {
						tickSpeedRef.current = 150;
					} else if (levelRef.current === 11) {
						tickSpeedRef.current = 140;
					} else if (levelRef.current === 12) {
						tickSpeedRef.current = 130;
					} else if (levelRef.current === 13) {
						tickSpeedRef.current = 120;
					} else if (levelRef.current === 14) {
						tickSpeedRef.current = 100;
					} else if (levelRef.current === 15) {
						tickSpeedRef.current = 90;
					} else if (levelRef.current === 16) {
						tickSpeedRef.current = 80;
					} else if (levelRef.current === 17) {
						tickSpeedRef.current = 75;
					} else if (levelRef.current === 18) {
						tickSpeedRef.current = 70;
					} else if (levelRef.current === 19) {
						tickSpeedRef.current = 65;
					} else if (levelRef.current === 20) {
						tickSpeedRef.current = 60;
					} else if (levelRef.current === 21) {
						tickSpeedRef.current = 55;
					} else if (levelRef.current === 22) {
						tickSpeedRef.current = 50;
					} else if (levelRef.current === 23) {
						tickSpeedRef.current = 45;
					} else if (levelRef.current === 24) {
						tickSpeedRef.current = 40;
					} else if (levelRef.current === 25) {
						tickSpeedRef.current = 35;
					} else if (levelRef.current === 26) {
						tickSpeedRef.current = 30;
					} else if (levelRef.current === 27) {
						tickSpeedRef.current = 25;
					} else if (levelRef.current === 28) {
						tickSpeedRef.current = 20;
					} else if (levelRef.current === 29) {
						tickSpeedRef.current = 15;
					} else if (levelRef.current === 30) {
						tickSpeedRef.current = 10;
					} else if (levelRef.current === 31) {
						tickSpeedRef.current = 5;
					} else if (levelRef.current === 32) {
						tickSpeedRef.current = 3;
					} else if (levelRef.current === 33) {
						tickSpeedRef.current = 1;
					}

					startIntervalDown();
				}

				setAddedScore(scoreToAdd);
				scoreRef.current += scoreToAdd;
				setScore(scoreRef.current);

				const newMultiplier = multiplierRef.current + completedLines;
				setMultiplier(newMultiplier);
				multiplierRef.current = newMultiplier;

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
			} else {
				const newMultiplier = 0;
				setMultiplier(newMultiplier);
				multiplierRef.current = newMultiplier;
			}
		}

		const startIntervalDown = () => {
			clearInterval(timerId.current);

			timerId.current = setInterval(() => {
				if (!isPausedRef.current && !winRow.current) {
					moveDown();
				}
			}, tickSpeedRef.current);
		};

		startIntervalDown();

		function gameOver() {
			setGameRunning(false);
			setDisableControls(true);
			setShowDarkoverlay(true);
			isPausedRef.current = true;
			setGameOver(true);
			console.log("Game Over");

			// JSON to send to Database
			highscoreArray.current = {
				alias: aliasRef.current,
				highscore: scoreRef.current,
				time: "10:32",
				level: levelRef.current,
				width: width,
				height: height,
			};
			console.log(highscoreArray.current);

			clearInterval(timerId.current);
		}

		if (isResetGame) {
			resetGame("start");
		}

		return () => {
			clearInterval(timerId.current);
			document.removeEventListener("keydown", control);
		};
	}, [gameRunning, gridArrayRef, isResetGame]);

	useEffect(() => {
		return () => {
			clearInterval(timerId.current);
		};
	}, []);

	// Render the grid based on the grid array
	return (
		<>
			<div className="grid" style={gridStyle}>
				{gridArrayRef.current.map((row, rowIndex) =>
					row.map((cell) => (
						<div key={cell.key + rowIndex} className={cell.classNames.join(" ")}></div>
					))
				)}
			</div>
		</>
	);
}
