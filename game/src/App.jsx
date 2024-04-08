import { useState } from "react";
import "./App.css";

function App() {
	const [aliasInput, setAliasInput] = useState("");
	const [alias, setAlias] = useState("");

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

	return (
		<>
			{/* Input alias */}
			<input type="text" value={aliasInput} onChange={handleAliasInput} id="selectalias" />

			{/* Tetris container */}
			<div id="container">
				<EmptyGrid />
			</div>

			{/* Dark overlay */}
			<div id="darkoverlay"></div>
		</>
	);
}

export default App;
