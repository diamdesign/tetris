import React, { useEffect, useContext } from "react";
import { useGameContext } from "./Context";

export function MiniGrid() {
	const { displayShape } = useGameContext();

	const minirows = 4;
	const minicolumns = 4;
	const minidivs = [];

	// Generate div elements
	for (let i = 0; i < minirows; i++) {
		for (let j = 0; j < minicolumns; j++) {
			// Calculate unique key for each div
			const key = `div-${i}-${j}`;

			// Add div element to the array with the appropriate class
			minidivs.push(<div key={key}></div>);
		}
	}

	useEffect(() => {
		// Define displayShape function
		displayShape();
	}, []);

	return (
		<>
			<div className="minigrid">{minidivs}</div>
		</>
	);
}
