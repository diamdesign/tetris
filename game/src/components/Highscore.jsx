import React, { useEffect, useState, useContext, useRef } from "react";
import { useGameContext } from "./Context";

export function Highscore() {
	const { width, height } = useGameContext();

	const highscoreUrl = "https://diam.se/tetris/php/gethighscore.php";

	const [highscoresArray, setHighscoresArray] = useState([]);

	useEffect(() => {
		fetchData();
	}, []);

	const fetchData = () => {
		let newWidth = width - 2;
		let newHeight = height - 2;
		const params = { width: newWidth, height: newHeight };

		fetch(highscoreUrl + "?" + new URLSearchParams(params))
			.then((response) => {
				if (!response.ok) {
					throw new Error("Network response was not ok");
				}
				console.log(response.json);
				return response.json();
			})
			.then((data) => {
				console.log(data); // Log the response here
				setHighscoresArray(data);
			})
			.catch((error) => {
				console.error("Error fetching data:", error);
			});
	};

	function formatTime(days, hours, minutes, seconds, milliseconds) {
		let totalMinutes = days * 24 * 60 + hours * 60 + minutes;
		let remainingSeconds = seconds + milliseconds / 1000;
		return totalMinutes + ":" + remainingSeconds;
	}

	function formatDate(dateString) {
		const date = new Date(dateString);
		return date.toISOString().split("T")[0];
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
			<div className="highscoretable">
				{highscoresArray &&
					highscoresArray.map((row, index) => (
						<div className="row" key={index}>
							<div>{row.rank}</div>
							<div>{row.alias}</div>
							<div>{row.score}</div>
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
