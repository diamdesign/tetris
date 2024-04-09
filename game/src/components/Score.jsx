import React from "react";
import { useGameContext } from "./Context";

export function Score() {
	const { score, lines, level } = useGameContext();

	return (
		<div>
			<div className="score">
				{score}
				<i></i>
				<i></i>
				<i></i>
				<i></i>
			</div>

			<div className="lines">
				Lines: <span>{lines}</span>
				<i></i>
				<i></i>
				<i></i>
				<i></i>
			</div>

			<div className="level">
				Level: <span>{level}</span>
			</div>

			<i></i>
			<i></i>
			<i></i>
			<i></i>
		</div>
	);
}
