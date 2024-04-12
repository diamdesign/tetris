import React, { useState } from "react";
import { playSound } from "./playSound";

export function Fullscreen() {
	const [isFullscreen, setIsFullscreen] = useState(false);

	function handleClickFullscreen() {
		playSound("tickbig", 0.8);
		if (!document.fullscreenElement) {
			document.documentElement
				.requestFullscreen()
				.then(() => {
					setIsFullscreen(true);
				})
				.catch((err) => {
					console.error("Failed to enter fullscreen mode:", err);
				});
		} else {
			document
				.exitFullscreen()
				.then(() => {
					setIsFullscreen(false);
				})
				.catch((err) => {
					console.error("Failed to exit fullscreen mode:", err);
				});
		}
	}

	function handleMouseOver() {
		playSound("mouseover", 0.2);
	}

	return (
		<>
			<div
				id="btn-fullscreen"
				onClick={handleClickFullscreen}
				onMouseOver={handleMouseOver}
				className={isFullscreen ? "fullscreen" : ""}
			></div>
		</>
	);
}
