export default class {
	_fadeTimeout = null;
	element = null;
	progress = null;
	settings = null;
	styleSheet = null;
	constructor(t) {
		Object.defineProperties(this, {
			_fadeTimeout: { enumerable: false },
			scene: { value: t, writable: true },
			game: { value: t.game, writable: true },
			gui: { value: t.game.gui, writable: true }
		});
		this.settings = t.settings;
		this._createStyleSheet();
		this.init();
		this.gui.appendChild(this.element);
		this.addListeners()
	}

	_createStyleSheet() {
		if (!this.styleSheet) {
			const styleSheet = new CSSStyleSheet();
			styleSheet.replaceSync(`
				:host {
					--accent: hsl(192 50% 60%);
					accent-color: var(--accent);
					color: hsl(180 4% 91%);
					position: relative;
				}

				.player-overlay {
					inset: 0;
					pointer-events: none;
					position: absolute;
					transition: opacity 120ms ease;
				}

				.bottom, .top {
					left: 0;
					pointer-events: inherit;
					position: absolute;
					right: 0;
				}

				.bottom { bottom: 0 }
				.top {
					background-image: linear-gradient(to bottom, hsl(0 0 0% / 50%), transparent);
					padding: 0 .75em;
					top: 0;
				}

				.top > h2 { margin: .75em 0 }

				:has(.fullscreen:not(.active)) .top { display: none }

				.bottom > .progress-bar-container {
					--container-height: .85em;
					align-items: center;
					box-sizing: border-box;
					display: flex;
					height: var(--container-height);
					padding: 0 .5em;
					pointer-events: all;
					position: relative;
					user-select: none;
					width: 100%;
				}

				.progress-bar-container:hover::after {
					bottom: calc(100% + .5em);
					content: attr(target);
					font-size: .85em;
					left: var(--offset-x);
					position: absolute;
				}

				.player-overlay[playing] .progress-bar-container { display: none }
				.progress-bar-container > .progress-bar {
					/* --value: 10; */ /* testing */
					background-color: hsl(0 0% 40% / 12%);
					height: 35%;
					pointer-events: all;
					transition: height 80ms ease;
					user-select: none;
					width: 100%;
					will-change: height;
				}

				.progress-bar-container > .progress-bar > .progress-bar-value {
					background-color: var(--accent);
					height: 100%;
					position: relative;
					width: calc(var(--value, 0) * 1%);
				}

				.progress-bar-container:hover { cursor: pointer }
				.progress-bar-container:hover > .progress-bar { height: 45% }
				.progress-bar-container > .progress-bar > .progress-bar-value::after {
					--size: 1em;
					aspect-ratio: 1;
					background-color: inherit;
					border-radius: 50%;
					/* bottom: 0; */
					bottom: calc(-.75 * var(--size) / 2);
					box-sizing: border-box;
					content: "";
					/* height: 100%; */
					height: var(--size);
					left: calc(100% - var(--size) / 2);
					/* left: calc(var(--value, 0) * 1%); */
					position: absolute;
					/* top: 0; */
					width: auto;
				}

				.controls {
					align-items: center;
					background-image: linear-gradient(to top, hsl(0 0 0% / 50%), transparent);
					display: flex;
					font-size: clamp(16px, 2.25cqmin, 20px);
					justify-content: space-between;
					padding: 0 .5em;
					pointer-events: inherit;
					transition: background-image 80ms ease;
					will-change: background-image;
				}

				.controls > :is(.left, .right) {
					align-items: center;
					display: flex;
				}

				.control {
					display: inline-block;
					filter: drop-shadow(0px 0px 2px hsl(0 0 0% / 50%));
					min-height: 1em;
					min-width: 1em;
				}

				.control:hover { cursor: pointer }
				.control-icon {
					-webkit-font-smoothing: antialiased;
					-webkit-text-stroke-width: thin;
					-webkit-user-select: none;
					align-items: center;
					aspect-ratio: 1;
					background-color: transparent;
					border: none;
					box-sizing: content-box;
					color: currentColor;
					display: flex;
					font-size: inherit;
					height: 2rem;
					justify-content: center;
					line-height: 1em;
					margin: 0;
					max-height: 2vh;
					min-height: 1em;
					min-width: 0;
					outline: none;
					padding: .5em;
					pointer-events: all;
					position: relative;
					text-align: center;
					user-select: none;
					width: auto;
				}

				.control-icon::before {
					content: "";
					inset: .5em;
					position: absolute;
				}
				.control-icon.clip::before { background-color: currentColor }
				.playpause::before {
					/* content: "▶"; */
					clip-path: polygon(
						10% 10%,
						50% 30%,
						50% 70%,
						50% 70%,
						50% 30%,
						90% 50%,
						90% 50%,
						10% 90%
					);
					transition: clip-path 120ms ease;
					will-change: clip-path;
				}
				.playpause.playing::before {
					clip-path: polygon(
						10% 10%,
						40% 10%,
						40% 90%,
						60% 90%,
						60% 10%,
						90% 10%,
						90% 90%,
						10% 90%
					)
				}
				:is(.backtrack, .rewind).reverse::before { scale: -1 }
				.backtrack::before {
					clip-path: polygon(
						15% 10%,
						25% 10%,
						25% 50%,
						85% 10%,
						85% 90%,
						25% 50%,
						25% 90%,
						15% 90%
					)
				}
				.rewind::before {
					clip-path: polygon(
						0 10%,
						15% 10%,
						15% 50%,

						/* arrow left midway end */
						60% 10%,
						60% 50%,

						/* arrow left midway arrow left*/
						100% 10%,
						100% 90%,
						50% 50%,
						60% 50%,

						60% 90%,
						15% 50%,
						15% 90%,
						0 90%
					)
				}
				.fullscreen::before {
					--frame-width: 16;
					--w: calc(var(--frame-width, 20) * 1%);
					/* content: "⛶"; */
					clip-path: polygon(0 40%,
						0 0,
						40% 0,
						40% var(--w),
						var(--w) var(--w),
						var(--w) 40%,
						0 40%,
						0 100%,
						40% 100%,
						40% calc(100% - var(--w)),
						var(--w) calc(100% - var(--w)),
						var(--w) 60%,
						0 60%,
						0 100%,
						100% 100%,
						100% 60%,
						calc(100% - var(--w)) 60%,
						calc(100% - var(--w)) calc(100% - var(--w)),
						60% calc(100% - var(--w)),
						60% 100%,
						100% 100%,
						100% 0,
						60% 0,
						60% var(--w),
						calc(100% - var(--w)) var(--w),
						calc(100% - var(--w)) 40%,
						100% 40%,
						100% 100%,
						0 100%);
					transition: clip-path 120ms ease;
					will-change: clip-path;
				}
				.fullscreen.active::before, :fullscreen .fullscreen::before {
					clip-path: polygon(0 calc(30% + calc(var(--w) / 2)),
						calc(30% + calc(var(--w) / 2)) calc(30% + calc(var(--w) / 2)),
						calc(30% + calc(var(--w) / 2)) 0,
						calc(30% - calc(var(--w) / 2)) 0,
						calc(30% - calc(var(--w) / 2)) calc(30% - calc(var(--w) / 2)),
						0 calc(30% - calc(var(--w) / 2)),
						0 calc(70% - calc(var(--w) / 2)),
						calc(30% + calc(var(--w) / 2)) calc(70% - calc(var(--w) / 2)),
						calc(30% + calc(var(--w) / 2)) 100%,
						calc(30% - calc(var(--w) / 2)) 100%,
						calc(30% - calc(var(--w) / 2)) calc(70% + calc(var(--w) / 2)),
						0 calc(70% + calc(var(--w) / 2)),
						0 100%,
						calc(70% - calc(var(--w) / 2)) 100%,
						calc(70% - calc(var(--w) / 2)) calc(70% - calc(var(--w) / 2)),
						100% calc(70% - calc(var(--w) / 2)),
						100% calc(70% + calc(var(--w) / 2)),
						calc(70% + calc(var(--w) / 2)) calc(70% + calc(var(--w) / 2)),
						calc(70% + calc(var(--w) / 2)) 100%,
						100% 100%,
						100% calc(30% + calc(var(--w) / 2)),
						calc(70% - calc(var(--w) / 2)) calc(30% + calc(var(--w) / 2)),
						calc(70% - calc(var(--w) / 2)) 0,
						calc(70% + calc(var(--w) / 2)) 0,
						calc(70% + calc(var(--w) / 2)) calc(30% - calc(var(--w) / 2)),
						100% calc(30% - calc(var(--w) / 2)),
						100% calc(30% + calc(var(--w) / 2)),
						100% 100%,
						0 100%)
				}

				.player-overlay[playing] .backtrack { display: none }

				.cinema::before {
					--frame-width: 15;
					--vertical-margin: 15;
					--m: calc(var(--vertical-margin, 20) * 1%);
					--w: calc(var(--frame-width, 25) * 1%);
					clip-path: polygon(0 var(--m), 0 calc(100% - var(--m)), var(--w) calc(100% - var(--m)), var(--w) calc(var(--m) + var(--w)), calc(100% - var(--w)) calc(var(--m) + var(--w)), calc(100% - var(--w)) calc(calc(100% - var(--m)) - var(--w)), var(--w) calc(calc(100% - var(--m)) - var(--w)), var(--w) calc(100% - var(--m)), 100% calc(100% - var(--m)), 100% var(--m));
					transition: clip-path 120ms ease;
					will-change: clip-path;
				}
				.cinema:has(> :checked)::before { --vertical-margin: 5 }

				.control-icon.svg {
					background-position: center;
					background-repeat: no-repeat;
					background-size: 75%;
				}
				.settings { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-linejoin='round' stroke-width='2'%3E%3Cpath d='M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z'/%3E%3Cpath d='M10.47 4.32c.602-1.306 2.458-1.306 3.06 0l.218.473a1.684 1.684 0 0 0 2.112.875l.49-.18c1.348-.498 2.66.814 2.162 2.163l-.18.489a1.684 1.684 0 0 0 .875 2.112l.474.218c1.305.602 1.305 2.458 0 3.06l-.474.218a1.684 1.684 0 0 0-.875 2.112l.18.49c.498 1.348-.814 2.66-2.163 2.162l-.489-.18a1.684 1.684 0 0 0-2.112.875l-.218.473c-.602 1.306-2.458 1.306-3.06 0l-.218-.473a1.684 1.684 0 0 0-2.112-.875l-.49.18c-1.348.498-2.66-.814-2.163-2.163l.181-.489a1.684 1.684 0 0 0-.875-2.112l-.474-.218c-1.305-.602-1.305-2.458 0-3.06l.474-.218a1.684 1.684 0 0 0 .875-2.112l-.18-.49c-.498-1.348.814-2.66 2.163-2.163l.489.181a1.684 1.684 0 0 0 2.112-.875l.218-.474Z'/%3E%3C/svg%3E") }
				.volume { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M3 14V10C3 9.44772 3.44772 9 4 9H6.64922C6.87629 9 7.0966 8.92272 7.27391 8.78087L10.3753 6.29976C11.0301 5.77595 12 6.24212 12 7.08062V16.9194C12 17.7579 11.0301 18.2241 10.3753 17.7002L7.27391 15.2191C7.0966 15.0773 6.87629 15 6.64922 15H4C3.44772 15 3 14.5523 3 14Z'/%3E%3Cpath d='M15.8302 15.2139C16.5435 14.3639 16.9537 13.3008 16.9963 12.1919C17.0389 11.0831 16.7114 9.99163 16.0655 9.08939'/%3E%3Cpath d='M18.8944 17.7851C20.2406 16.1807 20.9852 14.1571 20.9998 12.0628C21.0144 9.96855 20.2982 7.93473 18.9745 6.31174'/%3E%3C/svg%3E") }
				.volume.mid { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M5 14V10C5 9.44772 5.44772 9 6 9H8.64922C8.87629 9 9.0966 8.92272 9.27391 8.78087L12.3753 6.29976C13.0301 5.77595 14 6.24212 14 7.08062V16.9194C14 17.7579 13.0301 18.2241 12.3753 17.7002L9.27391 15.2191C9.0966 15.0773 8.87629 15 8.64922 15H6C5.44772 15 5 14.5523 5 14Z'/%3E%3Cpath d='M17.8302 15.2139C18.5435 14.3639 18.9537 13.3008 18.9963 12.1919C19.0389 11.0831 18.7114 9.99163 18.0655 9.08939'/%3E%3C/svg%3E") }
				.volume.off { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M7 14V10C7 9.44772 7.44772 9 8 9H10.6492C10.8763 9 11.0966 8.92272 11.2739 8.78087L14.3753 6.29976C15.0301 5.77595 16 6.24212 16 7.08062V16.9194C16 17.7579 15.0301 18.2241 14.3753 17.7002L11.2739 15.2191C11.0966 15.0773 10.8763 15 10.6492 15H8C7.44772 15 7 14.5523 7 14Z'/%3E%3C/svg%3E") }
				.volume.mute { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M3 14V10C3 9.44772 3.44772 9 4 9H6.64922C6.87629 9 7.0966 8.92272 7.27391 8.78087L10.3753 6.29976C11.0301 5.77595 12 6.24212 12 7.08062V16.9194C12 17.7579 11.0301 18.2241 10.3753 17.7002L7.27391 15.2191C7.0966 15.0773 6.87629 15 6.64922 15H4C3.44772 15 3 14.5523 3 14Z'/%3E%3Cpath d='M16 9.5L18.5 12M21 14.5L18.5 12M18.5 12L21 9.5M18.5 12L16 14.5'/%3E%3C/svg%3E") }
				.volume-container > input[type="range"] {
					max-width: 100px;
					overflow: hidden;
					pointer-events: all;
					transition: max-width 120ms;
				}
				.volume-container { display: flex }
				.volume-container:not(:hover) > input[type="range"]:not(:hover) { max-width: 0 }
				.progress-indicator {
					align-items: center;
					display: flex;
					font-size: .65em;
					gap: .25em;
					margin: 0 .5em;
				}
				.progress-indicator::after { content: " / " attr(max) }

				.player-overlay[playing] .progress-indicator#time::after { content: unset }

				[tooltip]:hover::after {
					background-color: hsl(0 0 10%);
					border: 1px solid hsl(0 0 40% / 15%);
					border-radius: .4em;
					bottom: calc(100% + 1.5em);
					content: attr(tooltip);
					font-size: max(14px, .65em);
					max-width: 200px;
					overflow: hidden;
					padding: .15em .4em;
					position: absolute;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
			`);
			this.gui.insertStyleSheet(styleSheet);
			this.styleSheet = styleSheet;
		}
		return this.styleSheet
	}

	addListeners() {
		const t = this.gui._container;
		t.addEventListener('pointerenter', () => this.show(), { passive: true });
		t.addEventListener('pointermove', () => {
			this.show();
			this.fade(3e3)
		}, { passive: true });
		t.addEventListener('pointerleave', () => this.fade(0), { passive: true })
	}

	init() {
		if (this.element) return;
		const t = this.gui._container;
		const overlay = this.gui.constructor.createElement('div.player-overlay');
		const top = overlay.appendChild(this.gui.constructor.createElement('div.top'));
		const title = top.appendChild(document.createElement('h2'));
		title.textContent = GameSettings.track.title;
		const bottom = overlay.appendChild(this.gui.constructor.createElement('div.bottom'));
		const progressBarContainer = bottom.appendChild(this.gui.constructor.createElement('div.progress-bar-container'));
		progressBarContainer.addEventListener('pointerdown', function(event) {
			this.setPointerCapture(event.pointerId);
			progressBarValue.setAttribute('value', Math.round(event.offsetX / parseInt(getComputedStyle(this).getPropertyValue('width')) * parseInt(progressBarValue.getAttribute('max'))));
			progressBarValue.dispatchEvent(new InputEvent('change'));
			this.wasPlaying = GameManager.game.currentScene.state.playing
		}, { passive: true });
		progressBarContainer.addEventListener('pointermove', function(event) {
			const targetValue = Math.round(event.offsetX / parseInt(getComputedStyle(this).getPropertyValue('width')) * parseInt(progressBarValue.getAttribute('max')));
			this.setAttribute('target', targetValue);
			this.style.setProperty('--offset-x', event.offsetX + 'px');
			const isPointerDown = event.buttons & 1 == 1;
			isPointerDown && (progressBarValue.setAttribute('value', targetValue),
			progressBarValue.dispatchEvent(new InputEvent('change')))
		}, { passive: true });
		progressBarContainer.addEventListener('pointerup', function(event) {
			this.releasePointerCapture(event.pointerId);
			GameManager.game.currentScene.state.playing = this.wasPlaying
		}, { passive: true });
		// const progress = progressBarContainer.appendChild(this.gui.constructor.createElement('input.progress', {
		// 	min: 0,
		// 	value: 10,
		// 	max: 100,
		// 	type: 'range'
		// }));
		const progressBar = progressBarContainer.appendChild(this.gui.constructor.createElement('div.progress-bar'));
		const progressBarValue = progressBar.appendChild(this.gui.constructor.createElement('div.progress-bar-value'));
		progressBarValue.addEventListener('change', function() {
			GameManager.game.currentScene.state.playing = false;
			const player = GameManager.game.currentScene.playerManager.getPlayerByIndex(GameManager.game.currentScene.camera.focusIndex);
			player.isGhost() && player._replayIterator.next(parseInt(this.getAttribute('value')))
		});
		const controls = bottom.appendChild(this.gui.constructor.createElement('div.controls'));
		const left = controls.appendChild(this.gui.constructor.createElement('div.left'));
		const backtrack = left.appendChild(this.gui.constructor.createElement('a.control.control-icon.clip.backtrack'));
		backtrack.setAttribute('tooltip', 'Replay');
		backtrack.addEventListener('click', () => {
			// if time is shorter than 5 seconds, location.back()
			this.scene.playerManager.firstPlayer.gotoCheckpoint()
		});
		// after some time, switch to previous (previous track)
		const playpause = left.appendChild(this.gui.constructor.createElement('button.control.control-icon.clip.playpause.playing'));
		playpause.setAttribute('tooltip', 'Pause (space)');
		playpause.addEventListener('click', () => {
			this.scene.state.paused = !this.scene.state.paused;
			playpause.setAttribute('tooltip', `P${this.scene.state.paused ? 'lay' : 'ause'} (space)`);
		}, { passive: true });
		const next = left.appendChild(this.gui.constructor.createElement('a.control.control-icon.clip.backtrack.reverse'));
		next.setAttribute('tooltip', 'Next');
		next.addEventListener('click', () => {
			this.scene.playerManager.firstPlayer.returnToCheckpoint()
		});
		const volumeContainer = left.appendChild(this.gui.constructor.createElement('div.volume-container'));
		const volume = volumeContainer.appendChild(this.gui.constructor.createElement('button.control.control-icon.svg.volume'));
		volume.classList.toggle('mute', !GameSettings.soundsEnabled);
		volume.setAttribute('tooltip', `${GameSettings.soundsEnabled ? 'M' : 'Unm'}ute`);
		volume.addEventListener('click', () => {
			volume.classList.toggle('mute', !(GameSettings.soundsEnabled = !GameSettings.soundsEnabled));
			volume.setAttribute('tooltip', `${GameSettings.soundsEnabled ? 'M' : 'Unm'}ute`)
		}, { passive: true });
		const volumeSlider = volumeContainer.appendChild(this.gui.constructor.createElement('input', { type: 'range' }));
		volumeSlider.value = 100;
		volumeSlider.setAttribute('tooltip', volumeSlider.value + '%');
		volumeSlider.addEventListener('input', () => {
			GameSettings.volume = volumeSlider.value / 100;
			volume.classList.toggle('mid', volumeSlider.value <= 50);
			volume.classList.toggle('off', volumeSlider.value < 1);
			volumeSlider.setAttribute('tooltip', volumeSlider.value + '%')
		});
		const progressIndicator = left.appendChild(this.gui.constructor.createElement('span.progress-indicator#time', { max: '--:--.--' }));
		progressIndicator.textContent = '--:--.--';
		const target = left.appendChild(this.gui.constructor.createElement('img', {
			src: 'https://cdn.kanoapps.com/free_rider_hd/assets/images/game/icons/goal_icon.png',
			style: {
				marginLeft: '.65em',
				maxHeight: '1em',
				maxWidth: '1em'
			}
		}));
		const targets = left.appendChild(this.gui.constructor.createElement('span.progress-indicator#target-count', { max: 0 }));
		targets.textContent = 0;
		const right = controls.appendChild(this.gui.constructor.createElement('div.right'));
		// const autoNext = right.appendChild(this.gui.constructor.createElement('label.control.auto-play'));
		// autoNext.setAttribute('tooltip', 'Auto-play');
		// const autoNextToggle = autoNext.appendChild(this.gui.constructor.createElement('input', { type: 'checkbox' }));
		const settings = right.appendChild(this.gui.constructor.createElement('button.control.control-icon.svg.settings'));
		settings.setAttribute('tooltip', 'Settings (\\)');
		settings.addEventListener('click', () => this.scene.openDialog('settings'), { passive: true });
		const theatre = right.appendChild(this.gui.constructor.createElement('label.control.control-icon.clip.cinema'));
		theatre.setAttribute('tooltip', 'Cinema mode');
		const theatreToggle = theatre.appendChild(this.gui.constructor.createElement('input', {
			type: 'checkbox',
			hidden: true
		}));
		// theatreToggle.checked = container.hasAttribute('cinema');
		theatreToggle.addEventListener('change', function() {
			t.toggleAttribute('cinema', this.checked);
			const gameBox = t.parentElement;
			gameBox.classList.toggle('content', this.checked);
			if (this.checked) {
				const mainPage = document.getElementById('main_page');
				mainPage && Application.router.header_view.el.parentElement !== document.body && mainPage.before(Application.router.header_view.el);
				gameBox.style.setProperty('height', '50vmax');
				gameBox.style.setProperty('margin-top', '48px');
				gameBox.style.setProperty('max-height', '70vh');
				gameBox.style.setProperty('padding', '10px');
				const main = document.getElementById('main_page');
				main.before(gameBox);
			} else {
				gameBox.style.removeProperty('margin-top');
				const trackData = document.getElementById('track-data');
				trackData.prepend(gameBox);
				t.style.setProperty('height', '100%');
				t.style.setProperty('width', '100%');
			}
			GameManager.game.setSize();
			theatre.setAttribute('tooltip', this.checked ? 'Default view' : 'Cinema mode');
		});
		const fullscreen = right.appendChild(this.gui.constructor.createElement('button.control.control-icon.clip.fullscreen'));
		fullscreen.setAttribute('tooltip', 'Fullscreen (f)');
		fullscreen.addEventListener('click', () => {
			this.scene.toggleFullscreen();
			fullscreen.classList.toggle('active', this.scene.settings.fullscreen);
		}, { passive: true });
		this.element = overlay;
		this.progress = progressBarValue
	}

	fade(ms) {
		if (0 == this.element.style.getPropertyValue('opacity')) return;
		clearTimeout(this._fadeTimeout);
		this._fadeTimeout = setTimeout(() => !this.scene.state.paused && this.scene.state.playing && this.hide(), ms ?? 3e3)
	}

	hide() {
		if (0 == this.element.style.getPropertyValue('opacity')) return;
		clearTimeout(this._fadeTimeout);
		this.game.canvas.style.setProperty('cursor', 'none');
		this.element.style.setProperty('opacity', 0);
		Object.assign(this.settings.inset, {
			bottom: 0,
			top: 0
		})
	}

	show() {
		if (1 == this.element.style.getPropertyValue('opacity')) return;
		clearTimeout(this._fadeTimeout);
		this.game.canvas.style.removeProperty('cursor');
		this.element.style.setProperty('opacity', 1);
		const bottom = getComputedStyle(this.element.querySelector('.bottom'))
			, top = getComputedStyle(this.element.querySelector('.top'));
		Object.assign(this.settings.inset, {
			bottom: parseInt(bottom.height) | 0,
			top: parseInt(top.height) | 0
		})
	}

	onStateChange(oldState, newState) {
		// stateChange
	}

	update() {
		console.log('update')
	}
}