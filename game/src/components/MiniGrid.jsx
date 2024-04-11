import React, { useEffect, useContext } from "react";
import { useGameContext } from "./Context";

export function MiniGrid() {
	const { gameRunning, displayShape, startRotationRef, minidivs, setMinidivs } = useGameContext();

	useEffect(() => {
		const minirows = 4;
		const minicolumns = 4;
		const divs = [];
		for (let i = 0; i < minirows; i++) {
			const row = [];
			for (let j = 0; j < minicolumns; j++) {
				const key = `div-${i}-${j}`;
				row.push({
					key: key,
					classNames: [], // Initialize classNames array
				});
			}
			divs.push(row);
		}

		setMinidivs(divs);
	}, []);

	return (
		<div className="minigrid">
			{minidivs &&
				minidivs.map((row, rowIndex) =>
					// Render the child divs directly without wrapping them in a div with class "row"
					row.map((cell, columnIndex) => (
						<div key={cell.key} className={cell.classNames.join(" ")}></div>
					))
				)}
		</div>
	);
}
