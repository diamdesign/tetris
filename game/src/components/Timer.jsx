import React, { useState } from "react";

export function Timer() {
	const [milliseconds, setMilliseconds] = useState(0);
	const [timer, setTimer] = useState("00:00:00:000");

	const formatTime = (time) => {
		const ms = String(time % 1000).padStart(3, "0");
		const seconds = String(Math.floor((time / 1000) % 60)).padStart(2, "0");
		const minutes = String(Math.floor((time / (1000 * 60)) % 60)).padStart(2, "0");
		const hours = String(Math.floor((time / (1000 * 60 * 60)) % 24)).padStart(2, "0");
		const days = String(Math.floor(time / (1000 * 60 * 60 * 24))).padStart(2, "0");
		return `${days}:${hours}:${minutes}:${seconds}:${ms}`;
	};

	const updateTimer = () => {
		const intervalId = setInterval(() => {
			setMilliseconds((prev) => prev + 1);
		}, 1);

		return () => clearInterval(intervalId);
	};

	// Start the timer when the component mounts
	useState(updateTimer);

	// Update the timer string whenever milliseconds change
	useState(() => {
		setTimer(formatTime(milliseconds));
	});

	return (
		<div id="timer">
			<h1>Timer</h1>
			<div>{timer}</div>
		</div>
	);
}
