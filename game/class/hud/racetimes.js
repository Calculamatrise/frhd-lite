import formatnumber from "../utils/formatnumber.js";

export default class {
	static #styleSheet;
	static getStyleSheet() {
		if (this.#styleSheet) return this.#styleSheet;

		const styleSheet = new CSSStyleSheet();
		styleSheet.replaceSync(`
.race-times {
	display: flex;
	flex-direction: column;
	font-family: 'helsinki';
	font-size: 12px;
	gap: .5em;
	left: 6px;
	line-height: 1em;
	max-height: 40%;
	opacity: .975;
	overflow: hidden auto;
	overscroll-behavior: contain;
	position: absolute;
	scrollbar-width: none;
	top: 36px;
	touch-action: pan-y;
	user-select: none;
	width: fit-content;
}

.race-times > * { pointer-events: none }

.race-times .best.time { color: hsl(0 0% 50%) }
.race-times > .race {
	display: flex;
	font-size: 12px;
	gap: .3em;
}

.race-times > .race:not(.focused) { opacity: .3 }
.race-times > .race > .user {
	aspect-ratio: 1;
	border-radius: 50%;
	font-size: 10px;
	height: .8em;
	line-height: 1;
	padding: .3em;
	text-align: center;
	width: .8em;
}

.race-times > .race > .target-row { margin-left: .3em }
.race-times > .race .targets {
	font-size: .9em;
	line-height: 1rem;
	margin-left: .3em;
	vertical-align: top;
}
.race-times > .race .sprite { height: 1em }
.race-times > .race .target-icon {
	/* background-color: hsl(0 0% 60%); */
	background-image: linear-gradient(to right, hsl(0 0% 60%) calc(1% * var(--percentage)), transparent calc(1% * var(--percentage)));
	display: inline-block;
	height: 1.25em;
	mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none'%3E%3Cpath d='M 9.2691 2.4112 C 9.5006 1.8918 9.6164 1.6321 9.7776 1.5521 C 9.9176 1.4826 10.082 1.4826 10.222 1.5521 C 10.3832 1.6321 10.499 1.8918 10.7305 2.4112 L 12.5745 6.5481 C 12.643 6.7016 12.6772 6.7784 12.7302 6.8372 C 12.777 6.8892 12.8343 6.9308 12.8982 6.9593 C 12.9705 6.9915 13.0541 7.0003 13.2213 7.018 L 17.7256 7.4934 C 18.2911 7.553 18.5738 7.5829 18.6997 7.7115 C 18.809 7.8232 18.8598 7.9796 18.837 8.1342 C 18.8108 8.3122 18.5996 8.5025 18.1772 8.8832 L 14.8125 11.9154 C 14.6877 12.0279 14.6252 12.0842 14.5857 12.1527 C 14.5507 12.2134 14.5288 12.2807 14.5215 12.3503 C 14.5132 12.429 14.5306 12.5112 14.5655 12.6757 L 15.5053 17.1064 C 15.6233 17.6627 15.6823 17.9408 15.5989 18.1002 C 15.5264 18.2388 15.3934 18.3354 15.2393 18.3615 C 15.0619 18.3915 14.8156 18.2495 14.323 17.9654 L 10.3995 15.7024 C 10.2539 15.6184 10.1811 15.5765 10.1037 15.56 C 10.0352 15.5455 9.9644 15.5455 9.8959 15.56 C 9.8185 15.5765 9.7457 15.6184 9.6001 15.7024 L 5.6766 17.9654 C 5.184 18.2495 4.9378 18.3915 4.7603 18.3615 C 4.6062 18.3354 4.4732 18.2388 4.4008 18.1002 C 4.3174 17.9408 4.3764 17.6627 4.4943 17.1064 L 5.4341 12.6757 C 5.469 12.5112 5.4864 12.429 5.4781 12.3503 C 5.4708 12.2807 5.4489 12.2134 5.4139 12.1527 C 5.3744 12.0842 5.312 12.0279 5.1871 11.9154 L 1.8225 8.8832 C 1.4 8.5025 1.1888 8.3122 1.1626 8.1342 C 1.1398 7.9796 1.1906 7.8232 1.2999 7.7115 C 1.4258 7.5829 1.7086 7.553 2.2741 7.4934 L 6.7783 7.018 C 6.9455 7.0003 7.0291 6.9915 7.1014 6.9593 C 7.1653 6.9308 7.2226 6.8892 7.2695 6.8372 C 7.3224 6.7784 7.3566 6.7016 7.4251 6.5481 L 9.2691 2.4112 Z' fill='white' stroke-width='2'/%3E%3C/svg%3E");
	position: relative;
	width: 1.25em;
}

.race-times > .race .target-icon::after {
	background-color: hsl(0 0% 60%);
	content: "";
	display: block;
	height: 100%;
	mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none'%3E%3Cpath d='M 9.2691 2.4112 C 9.5006 1.8918 9.6164 1.6321 9.7776 1.5521 C 9.9176 1.4826 10.082 1.4826 10.222 1.5521 C 10.3832 1.6321 10.499 1.8918 10.7305 2.4112 L 12.5745 6.5481 C 12.643 6.7016 12.6772 6.7784 12.7302 6.8372 C 12.777 6.8892 12.8343 6.9308 12.8982 6.9593 C 12.9705 6.9915 13.0541 7.0003 13.2213 7.018 L 17.7256 7.4934 C 18.2911 7.553 18.5738 7.5829 18.6997 7.7115 C 18.809 7.8232 18.8598 7.9796 18.837 8.1342 C 18.8108 8.3122 18.5996 8.5025 18.1772 8.8832 L 14.8125 11.9154 C 14.6877 12.0279 14.6252 12.0842 14.5857 12.1527 C 14.5507 12.2134 14.5288 12.2807 14.5215 12.3503 C 14.5132 12.429 14.5306 12.5112 14.5655 12.6757 L 15.5053 17.1064 C 15.6233 17.6627 15.6823 17.9408 15.5989 18.1002 C 15.5264 18.2388 15.3934 18.3354 15.2393 18.3615 C 15.0619 18.3915 14.8156 18.2495 14.323 17.9654 L 10.3995 15.7024 C 10.2539 15.6184 10.1811 15.5765 10.1037 15.56 C 10.0352 15.5455 9.9644 15.5455 9.8959 15.56 C 9.8185 15.5765 9.7457 15.6184 9.6001 15.7024 L 5.6766 17.9654 C 5.184 18.2495 4.9378 18.3915 4.7603 18.3615 C 4.6062 18.3354 4.4732 18.2388 4.4008 18.1002 C 4.3174 17.9408 4.3764 17.6627 4.4943 17.1064 L 5.4341 12.6757 C 5.469 12.5112 5.4864 12.429 5.4781 12.3503 C 5.4708 12.2807 5.4489 12.2134 5.4139 12.1527 C 5.3744 12.0842 5.312 12.0279 5.1871 11.9154 L 1.8225 8.8832 C 1.4 8.5025 1.1888 8.3122 1.1626 8.1342 C 1.1398 7.9796 1.1906 7.8232 1.2999 7.7115 C 1.4258 7.5829 1.7086 7.553 2.2741 7.4934 L 6.7783 7.018 C 6.9455 7.0003 7.0291 6.9915 7.1014 6.9593 C 7.1653 6.9308 7.2226 6.8892 7.2695 6.8372 C 7.3224 6.7784 7.3566 6.7016 7.4251 6.5481 L 9.2691 2.4112 Z' stroke='white' stroke-width='2'/%3E%3C/svg%3E");
	position: absolute;
	width: 100%; /* calc(1% * var(--percentage)); */
}
		`);
		this.#styleSheet = styleSheet;
		return styleSheet
	}

	raceCount = 0;
	raceList = null;
	raceYOffset = 0;
	maxRaces = 10;
	constructor(t) {
		Object.defineProperties(this, {
			scene: { value: t, writable: true },
			gui: { value: t.game.gui, writable: true }
		});
		this.scene.settings.isCampaign && (this.raceYOffset += 24);
		this.scene.settings.mobile && (this.maxRaces = 3)
	}

	init(t) {
		const styleSheet = this.constructor.getStyleSheet();
		this.gui.insertStyleSheet(styleSheet);

		const container = this.gui.constructor.createElement('div.race-times');
		container.style.setProperty('margin-top', this.raceYOffset + 'px');
		this.element = container;
		this.gui.appendChild(this.element);

		t.game.on('cameraFocus', entity => {
			this.unhighlightRace();
			if (!entity.isGhost()) return;
			this.highlightRace(entity._user.u_id)
		});
		t.game.on('raceTimes:updateTargetProgress', this.updateTarget.bind(this));
		// t.game.on('playbackTick', this.updateProgress.bind(this))
	}

	addRace(t, e) {
		if (!this.element) this.init(this.scene);
		if (this.raceCount < this.maxRaces) {
			let i = this.scene
			  , r = t.user
			  , o = t.race
			  , a = i.settings
			  , h = a.drawFPS;

			const raceRow = this.gui.constructor.createElement('div.row.race');
			raceRow.dataset.uid = r.u_id;
			const user = this.gui.constructor.createElement('span.user');
			user.style.setProperty('background-color', r.color);
			user.textContent = r.d_name.charAt(0).toUpperCase();
			raceRow.appendChild(user);
			const timer = this.gui.constructor.createElement('span.time');
			timer.textContent = formatnumber(parseInt(o.run_ticks) / h * 1e3);
			raceRow.appendChild(timer);
			const targetRow = this.gui.constructor.createElement('div.target-row');
			// const targetSprite = i.assets.getResult("targets_icon");
			// targetSprite.classList.add('sprite');
			// targetRow.appendChild(targetSprite.cloneNode(true));
			const targetIcon = this.gui.constructor.createElement('div.target-icon');
			targetRow.appendChild(targetIcon);
			const targets = this.gui.constructor.createElement('span.targets');
			targets.textContent = 0;
			targetRow.appendChild(targets);
			raceRow.appendChild(targetRow);
			this.element.appendChild(raceRow);
			this.raceCount++
		}
	}

	clear() {
		this.element?.replaceChildren();
		this.raceCount = 0
	}

	highlightRace(t) {
		const race = this.element.querySelector(`.race-times > [data-uid="${t}"]:not(.focused)`);
		race?.classList.add('focused')
	}

	unhighlightRace() {
		const highlightedRace = this.element.querySelector('.race-times > .race.focused');
		highlightedRace?.classList.remove('focused')
	}

	// updateProgress(t) {
	// 	// Use gradient on time?
	// 	const timeElement = this.element.querySelector(`.race-times > [data-uid="${t._user.u_id}"] .time`);
	// 	const ticks = t._gamepad.playbackTicks;
	// 	const maxTicks = this.scene.races.find(({ user }) => user.u_id == t._user.u_id).race.run_ticks;
	// 	timeElement.style.setProperty('--percentage', ticks / maxTicks * 100)
	// }

	updateTarget(t) {
		const targets = this.element.querySelector(`.race-times > [data-uid="${t.player._user.u_id}"] .targets`);
		if (targets) targets.textContent = t.collected;

		const targetProgressIcon = this.element.querySelector(`.race-times > [data-uid="${t.player._user.u_id}"] .target-icon`);
		targetProgressIcon.style.setProperty('--percentage', t.collected / this.scene.track.targetCount * 100)
	}

	reset() {
		if (!this.element) return;
		for (const child of this.element.children) {
			const targets = child.querySelector('.targets');
			targets.textContent = 0;

			const targetIcon = child.querySelector('.target-icon');
			targetIcon.style.removeProperty('--percentage')
		}
	}
}