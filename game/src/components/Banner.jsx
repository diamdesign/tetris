import React, { useState, useEffect } from "react";

export function Banner() {
	const apiUrl = "https://diam.se/api/getbanner.php";
	const params = { size: "728x90" }; // Example parameters

	const [bannerArray, setBannerArray] = useState([]);
	const [newBanner, setNewBanner] = useState(null);

	useEffect(() => {
		fetchBannerData();
	}, []); // Fetch data on component mount

	useEffect(() => {
		if (bannerArray.length > 0) {
			randomUpdate();
			const intervalId = setInterval(randomUpdate, 20000); // Set interval to update banner every 20 seconds
			return () => clearInterval(intervalId); // Cleanup function to clear interval on component unmount
		}
	}, [bannerArray]); // Update banner when bannerArray changes

	const fetchBannerData = () => {
		fetch(apiUrl + "?" + new URLSearchParams(params))
			.then((response) => {
				if (!response.ok) {
					throw new Error("Network response was not ok");
				}
				return response.json();
			})
			.then((data) => {
				setBannerArray(data);
			})
			.catch((error) => {
				console.error("Error fetching banner data:", error);
			});
	};

	const randomUpdate = () => {
		const randomBannerIndex = Math.floor(Math.random() * bannerArray.length);
		setNewBanner(bannerArray[randomBannerIndex]);
	};

	return (
		<div className="banner">
			{newBanner && (
				<a href={newBanner.url} target="_blank" rel="noopener noreferrer">
					<img src={"https://diam.se/banner/" + newBanner.image} alt="" />
				</a>
			)}
		</div>
	);
}
