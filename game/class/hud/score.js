import format from "../utils/formatnumber.js";

export default class {
	static #styleSheet;
	static getStyleSheet() {
		if (this.#styleSheet) return this.#styleSheet;

		const styleSheet = new CSSStyleSheet();
		styleSheet.replaceSync(`
.score-container {
	align-items: center;
	display: flex;
	font-family: 'helsinki';
	font-size: 8px;
	gap: 1.5em;
	left: 6px;
	line-height: 1em;
	margin: 0 auto;
	max-width: 75%;
	opacity: .975;
	overflow: hidden;
	pointer-events: none;
	position: absolute;
	top: 4px;
	width: fit-content;
}

.row { align-items: center }
.stack { flex-direction: column }
.row, .stack {
	display: flex;
	gap: .25em;
}

.score-container .sprite {
	aspect-ratio: 1;
	height: 24px;
	object-fit: cover;
	width: 24px;
}

.score-container .timer.sprite { object-position: top }
.score-container .timer.sprite.alt { object-position: bottom }

.score-container .time, .score-container .targets { font-size: 16px }
/* experiment */
.score-container .time { font-size: 18px }
.score-container .best.time { font-size: 14px; }
.score-container .title, .score-container .best.time { color: hsl(0 0% 50%) }
		`);
		this.#styleSheet = styleSheet;
		return styleSheet
	}

	constructor(t) {
		Object.defineProperties(this, {
			scene: { value: t, writable: true },
			gui: { value: t.game.gui, writable: true },
			timeout: { value: false, writable: true }
		});
		this.init(t);
		GameManager.scene === 'Editor' && this.bestTime.parentElement.style.setProperty('display', 'none')
	}

	init(t) {
		if (this.element) return console.warn('[Game] Score display already initialized!');

		const styleSheet = this.constructor.getStyleSheet();
		this.gui.insertStyleSheet(styleSheet);

		const container = this.gui.constructor.createElement('div.score-container');
		const timerRow = this.gui.constructor.createElement('div.row');
		const timerSprite = t.assets.getResult("time_icon");
		timerSprite.classList.add('timer', 'sprite');
		timerRow.appendChild(timerSprite);
		this.timerSprite = timerSprite;
		const timerStack = this.gui.constructor.createElement('div.stack');
		const timer = this.gui.constructor.createElement('span');
		timer.classList.add('time');
		timer.textContent = '0:00.00';
		timerStack.appendChild(timer);
		timerRow.appendChild(timerStack);
		container.appendChild(timerRow);
		this.timer = timer;
		const bestTimeStack = this.gui.constructor.createElement('div.stack');
		const bestTimeTitle = this.gui.constructor.createElement('span');
		bestTimeTitle.classList.add('title');
		bestTimeTitle.textContent = 'Best:';
		bestTimeStack.appendChild(bestTimeTitle);
		const bestTime = this.gui.constructor.createElement('span');
		bestTime.classList.add('time', 'best');
		bestTime.textContent = (t.settings.isCampaign && t.settings.campaignData.user.best_time || t.settings.userTrackStats && t.settings.userTrackStats.best_time) || '-- : --.--';
		bestTimeStack.appendChild(bestTime);
		container.appendChild(bestTimeStack);
		this.bestTime = bestTime;
		const targetRow = this.gui.constructor.createElement('div.row');
		const targetSprite = t.assets.getResult("targets_icon");
		targetSprite.classList.add('sprite');
		targetRow.appendChild(targetSprite);
		const targets = this.gui.constructor.createElement('span');
		targets.classList.add('targets');
		targets.textContent = `0/${t.track?.targetCount ?? 0}`;
		targetRow.appendChild(targets);
		container.appendChild(targetRow);
		this.targets = targets;
		this.element = container;
		this.gui.appendChild(this.element)
	}

	update() {
		let t = this.scene
		  , e = format(1e3 * ((null !== t.camera.playerFocus && t.camera.playerFocus._gamepad.playbackTicks || null) ?? t.ticks) / t.settings.drawFPS)
		  , i = (t.camera.playerFocus || t.playerManager.firstPlayer).getTargetsHit() + '/' + t.track.targetCount
		  , s = t.settings.isCampaign && t.settings.campaignData.user.best_time || t.settings.userTrackStats && t.settings.userTrackStats.best_time;
		this.timer.textContent !== e && (this.timer.textContent = e);
		this.targets.textContent !== i && (this.targets.textContent = i);
		if (s && this.bestTime.textContent !== s) this.bestTime.textContent = s
	}

	onStateChange(oldState, newState) {
		if (oldState.paused === newState.paused) return;
		// this.targets.textContent = `${this.scene.camera.playerFocus || }/${this.scene.track?.targetCount ?? 0}`;
		this.timerSprite.classList.toggle('alt', newState.paused)
	}
}