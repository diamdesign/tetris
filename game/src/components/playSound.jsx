import { useEffect, useState } from "react";

import keydownSound from "./../assets/mech-keyboard-02-102918.mp3";
import enterkeySound from "./../assets/analog-appliance-button-15-186961.mp3";
import impactSound from "./../assets/hit-brutal-puncher-cinematic-trailer-sound-effects-124760.mp3";
import startSound from "./../assets/production-elements-impactor-e-188986.mp3";
import fulldownSound from "../assets/epic-swoosh-boom-1-183996.mp3";
import fulldownSound2 from "../assets/epic-swoosh-boom-2-183997.mp3";

const soundFiles = {
	key: keydownSound,
	start: startSound,
	enter: enterkeySound,
	impact: impactSound,
	fulldown: fulldownSound,
	fulldown2: fulldownSound2,
	// Add more mappings as needed
};

export function SoundPlayer() {
	const [audioElements, setAudioElements] = useState([]);

	useEffect(() => {
		return () => {
			audioElements.forEach((audio) => audio.remove());
			setAudioElements([]);
		};
	}, [audioElements]);

	return (
		<>
			{Object.entries(soundFiles).map(([soundName, soundFile]) => (
				<audio key={soundName} src={soundFile} />
			))}
		</>
	);
}

export function playSound(soundname, volume = 1) {
	const audio = new Audio(soundFiles[soundname]);

	audio.volume = volume;
	audio.play();

	audio.onended = () => {
		// Optionally handle onended event
	};
}
