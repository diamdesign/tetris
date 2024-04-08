import React, { useState, useEffect, useContext } from "react";

import { useGameContext } from "./components/Context";
import { Music } from "./components/Music";
import "./App.css";
import "./css/stars.css";

function App() {
	const [aliasInput, setAliasInput] = useState("");

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
	} = useGameContext();

	function EmptyGrid() {
		const rows = 20;
		const columns = 12;
		const divs = [];

		// Generate div elements
		for (let i = 0; i < rows; i++) {
			for (let j = 0; j < columns; j++) {
				// Calculate unique key for each div
				const key = `div-${i}-${j}`;
				// Add div element to the array
				divs.push(<div key={key}></div>);
			}
		}

		// Return the array of div elements
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
				<div className="score">{score}</div>

				<div className="lines">
					Lines:
					<span>{lines}</span>
				</div>
				<div className="level">
					Level:<span>{level}</span>
				</div>
			</div>

			{/* Right content */}
			<div className="comingsymbol">T</div>

			{/* Tetris container */}
			<div id="container">
				<h1>
					<span>T</span>
					<span>E</span>
					<span>T</span>
					<span>R</span>
					<span>I</span>
					<span>S</span>
				</h1>
				<EmptyGrid />
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
		</>
	);
}

export default App;
