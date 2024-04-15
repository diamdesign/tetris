import React, { useState, useEffect, useRef } from "react";
import { useGameContext } from "./Context";
import { playSound } from "./playSound";
import song1 from "./../assets/80s-synthpop-synthwave-148202.mp3";

export function Music() {
	const audioRef = useRef(null);
	const { isMuted, setMuted, music, alias, setMusic } = useGameContext();
	const [musicAudio, setMusicAudio] = useState(song1);

	useEffect(() => {
		const musicPlayer = audioRef.current;
		musicPlayer.src = musicAudio;
	}, []);

	useEffect(() => {
		// Play music when music state changes
		const musicPlayer = audioRef.current;

		if (musicAudio && musicPlayer) {
			if (isMuted) {
				musicPlayer.volume = 0;
			} else {
				musicPlayer.volume = 0.15;
			}

			musicPlayer.loop = true;
			if (musicPlayer.paused) {
				musicPlayer.play();
			}
		}
	}, [isMuted, musicAudio, alias]);

	function handleClickMute() {
		playSound("key", 0.5);
		setMuted((prevMuted) => !prevMuted);
	}
	function handleMouseOver() {
		playSound("mouseover", 0.2);
	}

	return (
		<>
			<div
				id="btn-mute"
				onClick={handleClickMute}
				onMouseOver={handleMouseOver}
				className={isMuted ? "" : "muted"}
			></div>
			{/* Music */}
			{music && <audio id="music" autoPlay loop ref={audioRef} />}
		</>
	);
}
