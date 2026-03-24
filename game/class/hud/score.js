import Component from "../interfaces/component.js";
import GUI from "../interfaces/gui.js";
import format from "../utils/formatnumber.js";

export default class extends GUI {
	paused = !1;
	sprites = {};
	spriteSheet = {
		timer: [2, 2, 58, 58],
		timer_paused: [2, 62, 116, 118],
		target: [2, 2, 58, 58]
	}
	time = new Component({
		text: '0:00.00',
		font: { size: 16 },
		x: 23,
		y: 7
	}, this.container);
	time_title = new Component({
		text: 'TIME:',
		color: '#999',
		x: 24,
		y: 2
	}, this.container);
	timer_sprite = new Component({
		cached: true,
		image: {
			x: 2,
			y: 2,
			width: 58,
			height: 58
		},
		width: 24,
		height: 24
	}, this.container);
	best_time = new Component({
		text: '-- : --.--',
		color: '#999',
		font: { size: 14 },
		x: 95,
		y: 8
	}, this.container);
	best_time_title = new Component({
		text: 'BEST:',
		color: '#999',
		x: 96,
		y: 2
	}, this.container);
	goals = new Component({
		text: '0/0',
		font: { size: 16 },
		x: 185,
		y: 6
	}, this.container);
	target_sprite = new Component({
		cached: true,
		image: {
			x: 2,
			y: 2,
			width: 58,
			height: 58
		},
		x: 160,
		width: 24,
		height: 24
	}, this.container);
	constructor(t) {
		super(t, {
			font: { size: 8 },
			x: 6,
			y: 4
		}),
		Object.defineProperties(this, {
			gui: { value: t.game.gui, writable: true },
			timeout: { value: false, writable: true }
		});
		this._createStyleSheet();
		this.init(t);
		this.gui.appendChild(this.element)
		this.sprites.timer = t.assets.getResult("time_icon"),
		this.sprites.target = t.assets.getResult("targets_icon"),
		this.timer_sprite.image.canvas = this.sprites.timer,
		this.target_sprite.image.canvas = this.sprites.target,
		GameManager.scene === 'Editor' && (this.bestTime.toggleAttribute('hidden', true),
		this.best_time.visible = false,
		this.best_time_title.visible = false)
	}
	_createStyleSheet() {
		if (!this.styleSheet) {
			const styleSheet = new CSSStyleSheet();
			styleSheet.replaceSync(`
				.score-container {
					align-items: center;
					color: var(--color, currentColor);
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

				.sprite {
					aspect-ratio: 1;
					height: 24px;
					object-fit: cover;
					width: 24px;
				}

				.timer.sprite { object-position: top }
				.timer.sprite.alt { object-position: bottom }

				.time, .targets { font-size: 16px }
				.best.time { font-size: 14px; }
				.title, .best.time { color: hsl(0 0% 50%) }
			`);
			this.gui.insertStyleSheet(styleSheet);
			this.styleSheet = styleSheet;
		}
		return this.styleSheet
	}

	init(t) {
		const container = this.gui.constructor.createElement('div.score-container');
		const timerRow = this.gui.constructor.createElement('div.row');
		const timerSprite = t.assets.getResult("time_icon");
		timerSprite.classList.add('timer', 'sprite');
		timerRow.appendChild(timerSprite);
		this.timerSprite = timerSprite;
		const timerStack = this.gui.constructor.createElement('div.stack');
		const timerTitle = this.gui.constructor.createElement('span');
		timerTitle.classList.add('title');
		timerTitle.textContent = 'Time:';
		timerStack.appendChild(timerTitle);
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
		this.targetSprite = targetSprite;
		const targets = this.gui.constructor.createElement('span');
		targets.classList.add('targets');
		targets.textContent = '0/0';
		targetRow.appendChild(targets);
		container.appendChild(targetRow);
		this.targets = targets;
		this.element = container
	}
	update() {
		let t = this.scene
		  , e = t.state.paused
		  , i = format(1e3 * ((null !== t.camera.playerFocus && t.camera.playerFocus._gamepad.playbackTicks || null) ?? t.ticks) / t.settings.drawFPS)
		  , s = (t.camera.playerFocus || t.playerManager.firstPlayer).getTargetsHit() + '/' + t.track.targetCount
		  , n = t.settings.isCampaign && t.settings.campaignData.user.best_time || t.settings.userTrackStats && t.settings.userTrackStats.best_time;
		this.updateInset(4);
		this.timer.textContent !== i && (this.timer.textContent = i);
		this.goals.text !== s && (this.goals.text = s,
		this.goals.setDirty());
		n && this.best_time.text !== n && (this.best_time.text = n,
		this.best_time.setDirty())
	}
	centerContainer() {
		let t = this.container
		  , e = t.width
		  , i = this.scene.screen;
		t.x = i.width / 2 / window.devicePixelRatio - e / 2,
		t.y = 10
	}
	onStateChange(oldState, newState) {
		if (oldState.paused === newState.paused) return;
		this.timerSprite.classList.toggle('alt', newState.paused)
	}
}