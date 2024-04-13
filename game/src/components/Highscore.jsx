import React from "react";

export function Highscore() {
	const highscoreUrl = "https://diam.se/tetris/php/gethighscore.php";
	const params = { width: width, height: height }; // Example parameters

	const [highscoresArray, setHighscoresArray] = useState([]);

	useEffect(() => {
		fetchData();
	}, []);

	const fetchData = () => {
		fetch(apiUrl + "?" + new URLSearchParams(params))
			.then((response) => {
				if (!response.ok) {
					throw new Error("Network response was not ok");
				}
				return response.json();
			})
			.then((data) => {
				setHighscoresArray(data);
				console.log(data);
			})
			.catch((error) => {
				console.error("Error fetching banner data:", error);
			});
	};

	return (
		<div id="highscores">
			<div className="row thead">
				<div>Rank</div>
				<div>Alias</div>
				<div>Score</div>
				<div>Level</div>
				<div>Time</div>
				<div>Width</div>
				<div>Height</div>
				<div>Date</div>
				<div>Theme</div>
			</div>
			<div className="row">
				<div>1</div>
				<div>Evil_DoG</div>
				<div>323,560,564</div>
				<div>4</div>
				<div>1:12:132</div>
				<div>12</div>
				<div>20</div>
				<div>2024-04-13</div>
				<div>
					<a href="/" target="_blank">
						Default
					</a>
				</div>
			</div>
		</div>
	);
}
