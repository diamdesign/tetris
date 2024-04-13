import React, { useEffect, useState, useContext, useRef } from "react";
import { useGameContext } from "./Context";

export function Highscore() {
	const { width, height, highscoreArray } = useGameContext();

	const highscoreUrl = "https://diam.se/tetris/php/gethighscore.php";

	const [highscoresArray, setHighscoresArray] = useState([]);

	useEffect(() => {
		fetchData();
	}, []);

	const fetchData = () => {
		let newWidth = width - 2;
		let newHeight = height - 2;
		const params = { width: newWidth, height: newHeight };

		setTimeout(() => {
			fetch(highscoreUrl + "?" + new URLSearchParams(params))
				.then((response) => {
					if (!response.ok) {
						throw new Error("Network response was not ok");
					}
					return response.json();
				})
				.then((data) => {
					setHighscoresArray(data);
				})
				.catch((error) => {
					console.error("Error fetching data:", error);
				});
		}, 500);
	};

	function formatTime(days, hours, minutes, seconds, milliseconds) {
		let totalMinutes = days * 24 * 60 + hours * 60 + minutes;
		let remainingSeconds = seconds + milliseconds / 1000;

		// Limit remainingSeconds to 3 decimal places
		remainingSeconds = remainingSeconds.toFixed(3);

		return totalMinutes + ":" + remainingSeconds;
	}
	function formatDate(dateString) {
		const date = new Date(dateString);
		return date.toISOString().split("T")[0];
	}

	function formatScore(score) {
		return score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}

	return (
		<div id="highscores">
			<p>
				Showing records for board size: {width - 2}x{height - 2}
			</p>

			<div className="row thead">
				<div>Rank</div>
				<div>Alias</div>
				<div>Score</div>
				<div>Level</div>
				<div>Time</div>
				<div>Date</div>
				<div>Theme</div>
			</div>
			<div className="row yourscore">
				<div></div>
				<div>{highscoreArray.current.alias}</div>
				<div>{formatScore(highscoreArray.current.score)}</div>
				<div>{highscoreArray.current.level}</div>
				<div>
					{formatTime(
						highscoreArray.current.days,
						highscoreArray.current.hours,
						highscoreArray.current.minutes,
						highscoreArray.current.seconds,
						highscoreArray.current.milliseconds
					)}
				</div>
				<div></div>
				<div></div>
			</div>

			<div className="highscoretable">
				{highscoresArray &&
					highscoresArray.map((row, index) => (
						<div className="row" key={index}>
							<div>{row.rank}</div>
							<div>{row.alias}</div>
							<div>{formatScore(row.score)}</div>
							<div>{row.level}</div>
							<div>
								{formatTime(
									row.days,
									row.hours,
									row.minutes,
									row.seconds,
									row.milliseconds
								)}
							</div>
							<div>{formatDate(row.registered)}</div>
							<div>
								{row.theme !== "default" && (
									<a href={"https://diam.se/tetris/" + row.theme} target="_blank">
										{row.theme}
									</a>
								)}
							</div>
						</div>
					))}
			</div>
		</div>
	);
}
