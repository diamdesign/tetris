import React, { useState, useEffect, useRef } from "react";
import { useGameContext } from "./Context";
import { playSound } from "./playSound";
import song1 from "./../assets/80s-synthpop-synthwave-148202.mp3";

export function Music() {
	const audioRef = useRef(null);
	const { isMuted, setMuted, music, setMusic } = useGameContext();
	const [musicAudio, setMusicAudio] = useState(song1);

	useEffect(() => {
		// Play music when music state changes
		const musicPlayer = audioRef.current;

		if (musicAudio && musicPlayer) {
			musicPlayer.src = musicAudio;

			if (isMuted) {
				musicPlayer.volume = 0;
			} else {
				musicPlayer.volume = 0.15;
			}

			musicPlayer.loop = true;
			musicPlayer.play();
		}
	}, [isMuted, musicAudio]);

	function handleClickMute() {
		playSound("tickbig", 0.8);
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
