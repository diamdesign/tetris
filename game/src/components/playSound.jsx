import { useEffect, useState } from "react";

import keydownSound from "./../assets/mech-keyboard-02-102918.mp3";
import enterkeySound from "./../assets/analog-appliance-button-15-186961.mp3";
import impactSound from "./../assets/hit-brutal-puncher-cinematic-trailer-sound-effects-124760.mp3";
import startSound from "./../assets/production-elements-impactor-e-188986.mp3";
import fulldownSound from "../assets/epic-swoosh-boom-1-183996.mp3";
import fulldownSound2 from "../assets/epic-swoosh-boom-2-183997.mp3";
import ticksmallSound from "../assets/ticksmall.mp3";
import tickbigSound from "../assets/tickbig.mp3";
import rotateSound from "../assets/rotate.mp3";
import mouseoverSound from "../assets/button-124476.mp3";
import fulldownPointSound from "../assets/90s-game-ui-2-185095.mp3";
import takenSound from "../assets/8-bit-game-2-186976.mp3";
import line1Sound from "../assets/90s-game-ui-7-185100.mp3";
import line2Sound from "../assets/high-zcore-96686.mp3";
import undoSound from "../assets/cinematic-whoosh-reverse-161307.mp3";
import gameoverSound from "../assets/gameover-86548.mp3";
import announceAmazingSound from "../assets/announcements-amazing.mp3";
import announceAmazingSound2 from "../assets/announcements-amazing2.mp3";
import announceIncredibleSound from "../assets/announcements-incredible.mp3";
import announceOutstandingSound from "../assets/announcements-outstanding.mp3";
import nextlevelSound from "../assets/next-level-160613.mp3";

const soundFiles = {
	key: keydownSound,
	start: startSound,
	enter: enterkeySound,
	impact: impactSound,
	fulldown: fulldownSound,
	fulldown2: fulldownSound2,
	ticksmall: ticksmallSound,
	tickbig: tickbigSound,
	rotate: rotateSound,
	mouseover: mouseoverSound,
	fulldownpoint: fulldownPointSound,
	taken: takenSound,
	line1: line1Sound,
	line2: line2Sound,
	undo: undoSound,
	gameover: gameoverSound,
	amazing: announceAmazingSound,
	amazing2: announceAmazingSound2,
	incredible: announceIncredibleSound,
	outstanding: announceOutstandingSound,
	nextlevel: nextlevelSound,

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
