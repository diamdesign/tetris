import React, { useState, useEffect, useRef } from "react";
import { useGameContext } from "./Context";
import song1 from "./../assets/80s-synthpop-synthwave-148202.mp3";

export function Music() {
	const audioRef = useRef(null);
	const { isMuted, music, setMusic } = useGameContext();
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
	}, [musicAudio]);

	return (
		<>
			{/* Music */}
			{music && <audio id="music" autoPlay loop ref={audioRef} />}
		</>
	);
}
