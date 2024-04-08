import { useState } from "react";
import "./App.css";

function App() {
	const [aliasInput, setAliasInput] = useState("");
	const [alias, setAlias] = useState("");
	const [showDarkoverlay, setShowDarkoverlay] = useState(true);

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

	// Function to handle input change
	const handleAliasInput = (event) => {
		// Update the state with the value entered by the user
		setAliasInput(event.target.value);
	};

	// Function to handle alias save
	const handleAliasKey = (event) => {
		if (event.key === "Enter") {
			setAlias(aliasInput);
			setShowDarkoverlay(false);
		}
	};

	return (
		<>
			{/* Input alias */}
			{!alias && (
				<input
					type="text"
					value={aliasInput}
					onChange={handleAliasInput}
					onKeyDown={handleAliasKey}
					id="selectalias"
					placeholder="Enter alias"
				/>
			)}

			{/* Tetris container */}
			<div id="container">
				<EmptyGrid />
			</div>

			{/* Dark overlay */}
			{showDarkoverlay && <div id="darkoverlay"></div>}
		</>
	);
}

export default App;
