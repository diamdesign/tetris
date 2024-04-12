import React from "react";
import { useGameContext } from "./Context";

export function Highscore() {
	const { score } = useGameContext();

	return <div>highscore</div>;
}
