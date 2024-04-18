import React, { useState, useEffect, useContext } from "react";
import { useGameContext } from "./Context";

export function Timer() {
	const { timerStarted, setTimerStarted, milliseconds, setMilliseconds, millisecondsRef } =
		useGameContext();

	const formatTime = (time) => {
		const totalMilliseconds = Math.floor(time);
		const totalSeconds = Math.floor(totalMilliseconds / 1000);
		const totalMinutes = Math.floor(totalSeconds / 60);
		const totalHours = Math.floor(totalMinutes / 60);
		const totalDays = Math.floor(totalHours / 24);

		const milliseconds = String(totalMilliseconds % 1000).padStart(3, "0");
		const seconds = String(totalSeconds % 60).padStart(2, "0");
		const minutes = String(totalMinutes % 60).padStart(2, "0");
		const hours = String(totalHours % 24).padStart(2, "0");
		const days = String(totalDays).padStart(2, "0");

		return [days, hours, minutes, seconds, milliseconds];
	};

	useEffect(() => {
		let startTime;

		if (timerStarted) {
			startTime = performance.now();
			const timerId = setInterval(() => {
				const now = performance.now();
				const delta = now - startTime;
				setMilliseconds(delta);
				millisecondsRef.current = delta;
			}, 100); // Update every 10 milliseconds

			return () => clearInterval(timerId);
		}
	}, [timerStarted]);

	/*
	const handleReset = () => {
		setMilliseconds(0);
	};

	const handleStart = () => {
		setTimerStarted(true);
	};*/

	const timerDigits = formatTime(milliseconds);

	return (
		<div id="timer">
			<h1>Timer</h1>
			<div>
				{timerDigits.map((digit, index) => (
					<span key={index}>
						{index > 0 && index % 2 === 0 && index !== timerDigits.length - 1
							? ":"
							: null}
						{digit}
					</span>
				))}
			</div>
		</div>
	);
}
