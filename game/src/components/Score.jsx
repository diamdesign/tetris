import React from "react";
import { useGameContext } from "./Context";

export function Score() {
	const { score, lines, level, winRow, winLevel } = useGameContext();

	return (
		<div>
			<div className="score">
				{score}
				<i></i>
				<i></i>
				<i></i>
				<i></i>
			</div>

			<div className={`lines ${winRow.current ? "lineupdate" : ""}`}>
				Lines: <span>{lines}</span>
				<i></i>
				<i></i>
				<i></i>
				<i></i>
			</div>

			<div className={`level ${winLevel.current ? "levelupdate" : ""}`}>
				Level: <span>{level}</span>
			</div>

			<i></i>
			<i></i>
			<i></i>
			<i></i>
		</div>
	);
}
