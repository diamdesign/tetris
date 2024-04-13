import React, { useState, useEffect, useContext } from "react";
import { useGameContext } from "./Context";

export function Timer() {
	const { timerStarted, setTimerStarted, milliseconds, setMilliseconds, millisecondsRef } =
		useGameContext();

	const formatTime = (time) => {
		const ms = String(time % 1000)
			.padStart(3, "0")
			.split("");
		const seconds = String(Math.floor((time / 1000) % 60))
			.padStart(2, "0")
			.split("");
		const minutes = String(Math.floor((time / (1000 * 60)) % 60))
			.padStart(2, "0")
			.split("");
		const hours = String(Math.floor((time / (1000 * 60 * 60)) % 24))
			.padStart(2, "0")
			.split("");
		const days = String(Math.floor(time / (1000 * 60 * 60 * 24)))
			.padStart(2, "0")
			.split("");
		return [days, hours, minutes, seconds, ms].flat(); // Use flat to flatten the array
	};

	useEffect(() => {
		let elapsedTimeId;

		// Reset the timer if it goes from false to true
		if (!timerStarted) {
			setMilliseconds(0);
			millisecondsRef.current = 0;
		}

		if (timerStarted) {
			elapsedTimeId = setInterval(() => {
				setMilliseconds((prev) => {
					millisecondsRef.current++;
					return prev + 1;
				});
			}, 1);
		}

		return () => clearInterval(elapsedTimeId);
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
