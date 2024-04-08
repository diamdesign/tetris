import { useState } from "react";
import "./App.css";

function App() {
	const [count, setCount] = useState(0);

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
		return <>{divs}</>;
	}

	return (
		<>
			<div className="container">
				<div className="grid">
					<EmptyGrid />
				</div>
			</div>
		</>
	);
}

export default App;
