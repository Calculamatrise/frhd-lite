import drawInputDisplay from "./features/inputDisplay.js";

class FreeRiderLite {
	snapshots = new class extends Array {
		push(...args) {
			if (this.length >= parseInt(lite.storage.get('snapshots')))
				this.splice(0, this.length - parseInt(lite.storage.get('snapshots')));
			return super.push(...args)
		}
	};
	storage = new Map();
	trackData = null;
	constructor() {
		window.Application?.events.subscribe('mainview.loaded', this._childLoad.bind(this)),
		self.ModManager && (ModManager.hook(this, { name: 'lite' }),
		ModManager.addEventListener('game:ready', this._load.bind(this)),
		ModManager.addEventListener('game:stateChange', this.refresh.bind(this)));
		self.hasOwnProperty('Application') && (Object.defineProperty(Application.Helpers.AjaxHelper, 'lastRequest', { value: null, writable: true }),
		Application.router && Object.defineProperty(Application.router.current_view, 'ajax', { value: null, writable: true }),
		Application.events.subscribe('ajax.request', e => (Application.Helpers.AjaxHelper.lastRequest = e,
		typeof e.header_title == 'string' && (Application.router.current_view.ajax = e))));
		addEventListener('message', ({ data }) => {
			if (!data || data.sender != 'frhd-lite') return;
			switch (data.action) {
			case 'setStorage':
				this.storage = new Map(Object.entries(data.storage)),
				this._childLoad();
				break;
			case 'updateStorage':
				let oldStorage = new Map(this.storage);
				this.storage = new Map(Object.entries(data.storage));
				let changes = new Map();
				for (const [key, value] of this.storage.entries()) {
					if (JSON.stringify(value) == JSON.stringify(oldStorage.get(key))) continue;
					changes.set(key, value);
				}
				this._updateFromSettings(changes)
			}
		}, { passive: true });
		Object.defineProperty(this, 'trackData', { enumerable: false })
	}

	get scene() {
		return GameManager.game && GameManager.game.currentScene
	}

	_appendRecords() {
		let record = []
		  , bikeFrameColor = this.storage.get('bikeFrameColor')
		  , bikeTireColor = this.storage.get('bikeTireColor');
		null !== bikeFrameColor && record.push(['frameColor', bikeFrameColor]);
		null !== bikeTireColor && record.push(['tireColor', bikeTireColor]);
		return record.length > 0 && { 'bike_options': record.map(t => t.join(': ')) } || null
	}

	_childLoad() {
		// if pathname === /create discard all track related variables (this.playerGui)
		navigator.onLine && this._uploadOfflineRaces(),
		this.initEditorStyles(),
		(location.pathname.startsWith('/t/') || location.pathname.startsWith('/random/track') || location.pathname.startsWith('/game/')) && GameSettings.track && (Application.events.publish("game.prerollAdStopped"),
		this.cacheTrackData(),
		!location.pathname.startsWith('/game/') && (location.pathname.match(/\/r\/.+$/i) && GameSettings.raceData && this._updateChallengeLeaderboard(GameSettings.raceData)));
		// for (const module of this.constructor.modules.values())
		// 	module.call(this)
	}

	_load({ detail: game }) {
		if (this.playerGui) {
			if (game.currentScene.races?.length > 0) {
				const runTicks = game.currentScene.races[0].race.run_ticks;
				const progress = this.playerGui.querySelector('.progress-bar-value');
				progress.setAttribute('max', runTicks);
				const progressIndicator = this.playerGui.querySelector('#time');
				progressIndicator.setAttribute('max', this.constructor.formatRaceTime(runTicks / GameSettings.drawFPS * 1e3));
			}
			const targets = this.playerGui.querySelector('#target-count');
			targets && targets.setAttribute('max', game.currentScene.track.targetCount);
		}

		game.on('baseVehicleCreate', baseVehicle => this._integratePlaybackOptions(baseVehicle));
		game.on('cameraFocus', playerFocus => {
			if (!this.playerGui) return;
			// this.playerGui.toggleAttribute('hidden', this.scene.camera.focusIndex === 0);
			this.playerGui.toggleAttribute('playing', this.scene.camera.focusIndex === 0);
			if (this.scene.camera.focusIndex === 0) return;
			if (this.scene.playerManager._players.length < 2) return;
			if (!(playerFocus = this.scene.races.find(({ user }) => user.u_id == playerFocus._user.u_id) || this.scene.races[this.scene.races.length - 1])) return;
			const progress = this.playerGui.querySelector('.progress-bar-value');
			if (!progress) return;
			progress.setAttribute('max', playerFocus.race.run_ticks ?? 100)
		});
		game.on('draw', ctx => this.draw(ctx));
		// game.on('playerBaseVehicleDraw', (baseVehicle, ctx) => {
		// 	if (this.scene.ticks <= 0 || baseVehicle.player.isGhost()) return;
		// 	try {
		// 		if (this.storage.get('playerTrail')) {
		// 			baseVehicle._save();
		// 			for (const e of this.snapshots.filter(({ _baseVehicle: t }) => t)) {
		// 				const snapshot = JSON.parse(e._baseVehicle);
		// 				baseVehicle.dir = snapshot.dir;
		// 				baseVehicle.drawHeadAngle = snapshot.drawHeadAngle;
		// 				baseVehicle.pedala = snapshot.pedala;
		// 				baseVehicle.frontWheel.displayPos.equ(snapshot.frontWheel.displayPos);
		// 				baseVehicle.head.displayPos.equ(snapshot.head.displayPos);
		// 				baseVehicle.rearWheel.displayPos.equ(snapshot.rearWheel.displayPos);
		// 				// baseVehicle.updateDrawHeadAngle();
		// 				baseVehicle.drawBikeFrame(ctx, this.snapshots.length / (this.snapshots.length * 200) * this.snapshots.indexOf(e) % 1);
		// 			}

		// 			baseVehicle._restore();
		// 		}
		// 	} catch (err) {
		// 		this.constructor.warn(err)
		// 	}
		// });
		game.on('playerReset', () => {
			// make sure it's first player???
			this.snapshots.splice(0);
			if (!this.playerGui) return;
			const progress = this.playerGui.querySelector('.progress-bar-value');
			progress.style.setProperty('--value', 0);
			// progress.setAttribute('value', 0);
			const progressIndicator = this.playerGui.querySelector('#time');
			progressIndicator.textContent = this.constructor.formatRaceTime(0)
		});
		game.on('replayTick', ticks => {
			// update replay progressIndicator
			if (!this.playerGui) return;
			const progress = this.playerGui.querySelector('.progress-bar-value');
			const max = parseInt(progress.getAttribute('max'));
			progress.style.setProperty('--value', ticks / max * 100);
			// const time
			const progressIndicator = this.playerGui.querySelector('#time');
			progressIndicator.textContent = this.constructor.formatRaceTime(ticks / GameSettings.drawFPS * 1e3);
			// this._updateMediaSessionPosition()
		});
		game.on('stateChange', (oldState, newState) => {
			if (!this.playerGui) return;
			const playpause = this.playerGui.querySelector('.playpause');
			playpause.classList.toggle('playing', !newState.paused);
			const fullscreen = this.playerGui.querySelector('.fullscreen');
			fullscreen.classList.toggle('active', newState.fullscreen)
		});
		game.on('trackChallengeUpdate', races => {
			this.playerGui && races.length > 0 && this.playerGui.show();
			this._updateChallengeLeaderboard(races);
			let tasRaces = races.filter(({ race }) => race.code.tas);
			tasRaces.length > 0 && this.updateTASLeaderboard(tasRaces)
		});
		game.on('trackRaceCreate', data => {
			GameSettings.raceData ||= [],
			GameSettings.raceData.push(data),
			GameSettings.raceUids.push(data.user.u_id),
			this._updateRaceURL(GameSettings.raceData)
		});
		game.on('trackRaceDelete', data => {
			GameSettings.raceData && (GameSettings.raceData.splice(GameSettings.raceData.indexOf(data), 1),
			this._updateRaceURL(GameSettings.raceData),
			GameSettings.raceData.length < 1 && (GameSettings.raceData = !1)),
			GameSettings.raceUids.splice(GameSettings.raceUids.indexOf(data.user.u_id), 1)
		});
		game.on('trackRaceUpload', () => this._updateChallengeLeaderboard(GameManager.game.currentScene.races));
		game.on('trackRaceUploadError', error => {
			const OFFLINE_RACES_KEY = this.constructor.keyify('offline.races');
			let offlineRaces = this.constructor.getStorageEntry(OFFLINE_RACES_KEY);
			offlineRaces instanceof Array || (offlineRaces = []);
			let existingEntry = offlineRaces.find(({ postData: t }) => t.t_id === error.data.postData.t_id);
			existingEntry && existingEntry.postData.run_ticks >= error.data.postData.run_ticks ? offlineRaces.splice(offlineRaces.indexOf(existingEntry), 1, error.data) : offlineRaces.push(error.data);
			this.constructor.setStorageEntry(OFFLINE_RACES_KEY, offlineRaces.reduce((t, e) => -1 !== t.findIndex(i => i.postData.t_id === e.postData.t_id) ? t : t.concat(e), [])),
			alert('Your connection is offline! Free Rider Lite saved your ghost, and it will be published when your connection is back online!'),
			!this._connectionEvent && (Object.defineProperty(this, '_connectionEvent', {
				value: () => {
					if (!navigator.onLine) return;
					this._uploadOfflineRaces(),
					navigator.connection.removeEventListener('change', this._connectionEvent),
					this._connectionEvent = null
				},
				writable: true
			}),
			navigator.connection.addEventListener('change', this._connectionEvent))
		});
		game.currentScene.playerManager.firstPlayer._gamepad.on('buttonDown', key => {
			if ((key !== 'left' && key !== 'right') || this.scene.camera.focusIndex < 1) return;
			const { playerFocus } = this.scene.camera;
			if (!playerFocus.isGhost() || playerFocus._gamepad.playbackTicks < 1) return;
			const dir = key === 'left' ? -1 : 1;
			const targetTick = (playerFocus._gamepad.playbackTicks ?? this.scene.ticks) + 5 * dir;
			playerFocus._replayIterator.next(targetTick);
			this.scene.state.playing = false;
			game.emit('seek', targetTick);
			return false
		});
		this.snapshots.splice(0);
		this._updateFromSettings(this.storage);
		for (const player of game.currentScene.playerManager._players.filter(t => t._baseVehicle))
			this._integratePlaybackOptions(player)
	}

	_updateChallengeLeaderboard(races) {
		let challengeLeaderboard = this.fetchChallengeLeaderboard({ createIfNotExists: true });
		challengeLeaderboard.replaceChildren(...races.map((data, index) => {
			let row = this.constructor.fetchRaceRow(data, { parent: challengeLeaderboard, placement: 1 + index });
			let num = row.querySelector('.num');
			num && (num.innerText = (1 + index) + '.');
			let actionRow = row.querySelector('.track-leaderboard-action');
			let children = Array.from(actionRow.children);
			this.constructor.isUserModerator(Application.settings.user) && (actionRow.querySelector('div.btn.new-button.button-type-1.moderator-remove-race') || children.push(this.constructor.createElement('div.btn.new-button.button-type-1.moderator-remove-race', {
				data: { u_id: actionRow.dataset.u_id },
				innerText: 'X'
			})));
			actionRow.querySelector('span.btn.new-button.button-type-1') || children.push(this.constructor.createElement('span.btn.new-button.button-type-1', {
				innerText: 'X',
				title: 'Remove Race',
				style: {
					aspectRatio: 1,
					// backgroundImage: 'linear-gradient(#ee5f5b,#c43c35)',
					fontSize: '12px',
					height: '24px',
					lineHeight: '2em',
					marginRight: '6px',
					textAlign: 'center'
				},
				click() {
					let row = this.closest('.track-leaderboard-race-row');
					lite.scene.removeRaces([row.dataset.u_id]);
				}
			}));
			children.length > 0 && actionRow.replaceChildren(...children);
			return row
		}));
		challengeLeaderboard.children.length < 1 && challengeLeaderboard.closest('.track-leaderboard').style.setProperty('display', 'none')
	}

	_uploadOfflineRaces() {
		if (!navigator.onLine) return;
		let offlineRaces = this.constructor.getStorageEntry('offline.races');
		if (!offlineRaces || offlineRaces.length < 1) return;
		for (let data of offlineRaces) {
			if (!confirm('Would you like to upload a race you made while offline on ' + data.postData.t_id + '?')) continue;
			if (this.trackData && this.trackData.id === data.postData.t_id) {
				this.scene.state.showDialog = !1,
				setTimeout(() => {
					this.scene.state.dialogOptions = data,
					this.scene.command('dialog', 'track_complete')
				}, this.scene.game.updateInterval);
			} else
				Application.Helpers.AjaxHelper.post('track_api/track_run_complete', data.postData, { track: !1 });
		}
		offlineRaces.delete()
	}

	_updateRaceURL(raceData) {
		if (!raceData) return;
		let parsedTrackURL = location.pathname.replace(/\/r(\/[^\/]*)+\/?$/i, '');
		let raceURL = raceData.filter(t => t.user.u_id != Application.settings.user.u_id).map(t => t.user.u_name).join('/');
		history.replaceState(null, null, location.pathname.replace(/(\/r(\/[^\/]*)+\/?)?$/i, raceURL.length > 0 ? '/r/' + raceURL : '') + location.search)
	}

	_getColorScheme(theme) {
		if (/^(?:device|system)$/i.test(theme)) {
			this._csPreference || Object.defineProperty(this, '_csPreference', {
				value: matchMedia('(prefers-color-scheme: dark)'),
				writable: true
			});
			this._csPreference.onchange = event => this._updateFromSettings(new Map([['theme', event.target.matches ? 'dark' : 'light']]));
			theme = this._csPreference.matches ? 'dark' : 'light';
		} else if (this._csPreference) {
			this._csPreference = null;
		}
		return theme
		// this.storage.get('colorPalette');
		// return object with accentColor, etc.
	}

	_updateFromSettings(changes = this.storage) {
		if (!this.scene) return;
		let childLoad = !1
		  , redraw = !1;
		for (const [key, value] of changes.entries()) {
			switch (key) {
			case 'autoRestart':
				GameSettings.restartOnComplete = value;
				this.scene.game.removeListener('beforeComplete', this.restartOnComplete);
				value && this.scene.game.on('beforeComplete', this.restartOnComplete);
				break;
			case 'bikeFrameColor':
				var firstPlayer = this.scene.playerManager.firstPlayer;
				firstPlayer && (firstPlayer._baseVehicle.color = value,
				firstPlayer._tempVehicle && (firstPlayer._tempVehicle.color = value));
				break;
			case 'bikeFrameColor':
				var firstPlayer = this.scene.playerManager.firstPlayer;
				firstPlayer && (firstPlayer.color = value);
				break;
			case 'bikeTireColor':
				var baseVehicle = this.scene.playerManager.firstPlayer._baseVehicle;
				baseVehicle && (baseVehicle.frontWheel.color = value,
				baseVehicle.rearWheel.color = value);
				break;
			case 'brightness':
				this.constructor.styleSheet.set('#game-container', Object.assign({}, this.constructor.styleSheet.get('#game-container'), { filter: `brightness(${value / 100})` }));
				break;
			case 'colorPalette':
				let updateTheme = !1;
				for (let property in value) {
					if (!value[property]) {
						updateTheme = !0;
						continue;
					}
					switch (property) {
					case 'backgroundColor':
						this.constructor.styleSheet.set('#game-container > canvas', Object.assign({}, this.constructor.styleSheet.get('#game-container > canvas'), {
							backgroundColor: value[property]
						}));
						break;
					case 'accentColor':
						this.scene.track.updatePowerups(p => {
							p.constructor.outline = value[property],
							p.outline = value[property]
						});
					case 'physicsLineColor':
					case 'sceneryLineColor':
						GameSettings[property] = value[property]
					}
				}
				updateTheme && !changes.has('theme') && changes.set('theme', this.storage.get('theme'));
				break;
			case 'cosmetics':
				for (let property in value) {
					let currentUser = this.scene.playerManager.firstPlayer._user;
					switch (property) {
					case 'head':
						currentUser.cosmetics.head.classname = value[property],
						currentUser.cosmetics.head.script = currentUser.cosmetics.head.script.replace(/\w+(\.js)$/, value[property] + '$1');
						break;
					case 'options':
						currentUser.cosmetics.head[property] = value[property]
					}
				}
				break;
			case 'curveBreakLength':
				this.scene.toolHandler.tools.hasOwnProperty('curve') && (this.scene.toolHandler.tools.curve.options.breakLength = value / 100);
				break;
			case 'curvePoints':
				this.scene.toolHandler.tools.hasOwnProperty('curve') && (this.scene.toolHandler.tools.curve.options.controlPoints = value - 2);
				break;
			case 'disableAnalytics':
				GameSettings.analyticsEnabled = !value;
				break;
			case 'frameTimeSmoothing':
				this.scene.game.config.smoothing = value;
				break;
			case 'interpolation':
				this.scene.game.interpolation = value;
				break;
			case 'keymap':
				this.scene.playerManager.firstPlayer._gamepad.setKeyMap(GameManager.scene !== 'Editor' ? GameSettings.playHotkeys : GameSettings.editorHotkeys);
				break;
			case 'freezeOnPause':
			case 'lowLatencyMode':
			case 'multiThreadedRendering':
				GameSettings[key] = value;
				break;
			case 'maxFrameRate':
				this.scene.game.setMaxFrameRate(value);
				break;
			case 'raceProgress':
				this.scene.raceProgress && (this.scene.raceProgress.enabled = value);
				break;
			case 'theme':
				const theme = this._getColorScheme(value);
				const colorPalette = this.storage.get('colorPalette');
				let backgroundColor = '#'.padEnd(7, theme == 'midnight' ? '1d2328' : theme == 'darker' ? '0' : theme == 'dark' ? '1b' : 'f');
				GameSettings.backgroundColor = backgroundColor;
				colorPalette.backgroundColor ?? this.constructor.styleSheet.set('#game-container > canvas', Object.assign({}, this.constructor.styleSheet.get('#game-container > canvas'), { backgroundColor }));
				backgroundColor = this.constructor.styleSheet.get('#game-container > canvas').backgroundColor;
				GameSettings.UITextColor = this.constructor.getVisibleColor(backgroundColor),
				GameSettings.UIGrayColor = this.constructor.getVisibleColor(backgroundColor, { darkDefault: '6', initial: 128, lightDefault: '9', min: 40, max: 215 }),
				GameSettings.UIDarkerGrayColor = this.constructor.getVisibleColor(backgroundColor, { darkDefault: '3', initial: 180, lightDefault: 'c', min: 40, max: 215 });
				this.constructor.styleSheet.set('.gameDialog, .gameFocusOverlay, .gameLoading', {
					backgroundColor: getComputedStyle(GameManager.game.canvas).backgroundColor.replace(/[,]/g, '').replace(/(?=\))/, '/90%'),
					color: GameSettings.UITextColor
				})
				.set('.gameLoading-bar', {
					backgroundColor,
					borderColor: GameSettings.UITextColor
				})
				.set('.gameLoading-name', { color: GameSettings.UITextColor });
				// this.scene.message.color = GameSettings.UIDarkerGrayColor,
				// this.scene.message.outline = backgroundColor;
				// this.scene.score.best_time.color = GameSettings.UIGrayColor,
				// this.scene.score.best_time_title.color = GameSettings.UIGrayColor;
				let color = GameSettings.UITextColor;
				this.scene.game.container.style.setProperty('--color', color);
				// this.scene.score.goals.color = color,
				// this.scene.score.time.color = color,
				// this.scene.score.time_title.color = GameSettings.UIGrayColor;
				// if (this.scene.hasOwnProperty('campaignScore')) {
				// 	this.scene.campaignScore.container.children.forEach(medal => {
				// 		medal.children.forEach(element => element.color = color)
				// 	});
				// }

				// if (this.scene.hasOwnProperty('raceTimes')) {
				// 	this.scene.raceTimes.container.color = color;
				// 	this.scene.raceTimes.raceList.forEach(race => {
				// 		race.children.forEach(element => element.color = color)
				// 	});
				// }

				colorPalette.accentColor ?? (GameSettings.accentColor = GameSettings.UITextColor);
				colorPalette.physicsLineColor ?? (GameSettings.physicsLineColor = GameSettings.UITextColor);
				// scenery/grid lines don't need to be grayscaled!!!
				// higher/lower brightness instead by increasing/decreasing rgb by the same value
				const { r, g, b } = this.constructor.hexToRgb(backgroundColor);
				const brightness = this.constructor.getBrightness(backgroundColor);
				// let val = (brightness % 128) / 3.625;
				// val = Math.max(16, 120 - Math.min(96, val)) // Math.max(60, val);
				// let val = 128 - (brightness % 128);
				// brightness >= 128 && (val *= -1);
				let factor = brightness < 128 ? 1 : -1;
				let val = Math.max(42, Math.min(84, (brightness % 128))) * factor;
				const sceneryLineColor = this.constructor.rgbToHex(r + val, g + val, b + val);
				const minor = this.constructor.rgbToHex(r + val / 4.9, g + val / 4.9, b + val / 4.9);
				// console.debug(this.constructor.hexToRgb(backgroundColor), brightness, val, sceneryLineColor, minor)
				colorPalette.sceneryLineColor ?? (GameSettings.sceneryLineColor = this.constructor.rgbToHex(r + val, g + val, b + val)),
				this.scene.toolHandler.options.gridMinorLineColor = this.constructor.rgbToHex(r + val / 4.9, g + val / 4.9, b + val / 4.9), // this.constructor.getVisibleColor(backgroundColor, { darkDefault: '25', initial: 128, lightDefault: 'e', min: 40, max: 215 }), // '#'.padEnd(7, theme == 'midnight' ? '20282e' : /^dark(er)?$/.test(theme) ? '25' : 'e'),
				this.scene.toolHandler.options.gridMajorLineColor = this.constructor.rgbToHex(r + val / 1.66, g + val / 1.66, b + val / 1.66),
				this.scene.track.updatePowerups(p => {
					p.constructor.outline = GameSettings.accentColor,
					p.outline = GameSettings.accentColor
				});
				for (let player of this.scene.playerManager._players) {
					this._integratePlaybackOptions(player);
				}

				// attempt modify editor gui
				this.constructor.styleSheet.update('.editorGui > :is(.topMenu, .leftMenu, .rightMenu, .bottomMenu)', { backgroundColor, color })
					.set('.editorGui :not(.rightMenu .sideButton_powerupTool) > .editorgui_icons', { filter: 'invert(' + Number(brightness < 128) + ')' })
					.set('.editorGui > .editorDialog', { backgroundColor: `hsl(0 0% ${Math.round(brightness / 255 * 100)}% / 50%)` });
			case 'isometricGrid':
				redraw = true
			}
		}

		childLoad && this._childLoad(),
		redraw && this.scene.redraw(),
		this.refresh()
	}

	_parsePlaybackOptions(player, alt) {
		player.hasOwnProperty('player') && ({ player } = player);
		let playback = player._gamepad.playback;
		let options = playback && playback[alt || 'bike_options'] || (this.scene.playerManager.firstPlayer == player && new Map([
			['frameColor', this.storage.get('bikeFrameColor')],
			['riderColor', this.storage.get('bikeRiderColor')],
			['tireColor', this.storage.get('bikeTireColor')]
		]));
		if (typeof options == 'object') {
			let colorMatch = /^#([a-f0-9]{3}){1,2}$/i;
			for (let [key, value] of options.entries()) {
				if (!colorMatch.test(value)) {
					options.delete(key);
				}
			}
		}
		return options || null
	}

	_integratePlaybackOptions(player) {
		player.hasOwnProperty('player') && ({ player } = player);
		let options = this._parsePlaybackOptions(player, ...Array.prototype.slice.call(arguments, 1));
		this._integrateDefaultOptions(...arguments);
		if (!options) return;
		let baseVehicle = player._baseVehicle;
		for (let [key, value] of options.entries()) {
			switch (key) {
			case 'frameColor':
				baseVehicle && (baseVehicle.color = value);
				break;
			case 'riderColor':
				player.color = value;
				break;
			case 'tireColor':
				baseVehicle && (baseVehicle.tireColor = value,
				baseVehicle.frontWheel.color = value,
				baseVehicle.rearWheel.color = value);
				break;
			default:
				console.warn('Unrecognized playback option:', key);
			}
		}
	}

	_integrateDefaultOptions(player) {
		let value = GameSettings.physicsLineColor;
		player.color = value;
		let baseVehicle = player._baseVehicle;
		baseVehicle && (baseVehicle.color = value,
		baseVehicle.tireColor = value,
		baseVehicle.frontWheel.color = value,
		baseVehicle.rearWheel.color = value)
	}

	_updateMediaSessionMetadata() {
		if (!('mediaSession' in navigator)) return;
		this.scene?.game.on('soundCreate', sound => {
			sound.addEventListener('play', () => {
				navigator.mediaSession.playbackState = 'playing'
			}, { passive: true }),
			sound.addEventListener('pause', () => {
				navigator.mediaSession.playbackState = 'paused'
			}, { passive: true })
		});
		// this.scene.game.on('soundDelete', () => navigator.mediaSession.playbackState = 'none');
		// this.scene?.game.on('soundUpdate', sound => {
		// 	this._updateMediaSessionPosition()
		// });
		navigator.mediaSession.metadata = new MediaMetadata({
			title: this.trackData.title,
			artist: this.trackData.author.d_name,
			album: '',
			artwork: [{
				src: this.trackData.img,
				sizes: "250x150",
				type: "image/png",
			}]
		});
		navigator.mediaSession.setActionHandler('play', () => {
			this.scene.state.inFocus = true,
			this.scene.state.paused = false,
			this.scene.state.playing = true
		});
		navigator.mediaSession.setActionHandler('pause', () => {
			this.scene.state.paused = true,
			this.scene.state.playing = false
		});
		navigator.mediaSession.setActionHandler('seekbackward', () => {
			const player = GameManager.game.currentScene.camera.focusPlayer;
			player?.isGhost() && player._replayIterator.next((player._gamepad.playbackTicks ?? GameManager.game.currentScene.ticks) - 5)
		});
		navigator.mediaSession.setActionHandler('seekto', event => {
			const player = GameManager.game.currentScene.camera.focusPlayer;
			player?.isGhost() && player._replayIterator.next(event.seekTime)
		});
		navigator.mediaSession.setActionHandler('seekforward', () => {
			const player = GameManager.game.currentScene.camera.focusPlayer;
			player?.isGhost() && player._replayIterator.next((player._gamepad.playbackTicks ?? GameManager.game.currentScene.ticks) + 5)
		});
		navigator.mediaSession.setActionHandler('nexttrack', () => {
			Application.router.do_route("t/" + (this.trackData.id + 1), {
				trigger: !0,
				replace: !1
			})
		});
		navigator.mediaSession.setActionHandler('previoustrack', () => {
			Application.router.do_route("t/" + (this.trackData.id - 1), {
				trigger: !0,
				replace: !1
			})
		});
	}

	_updateMediaSessionPosition() {
		if (!('mediaSession' in navigator)) return;
		if (typeof navigator.mediaSession.setPositionState != 'function') return;
		if (!this.playerGui) return;
		// this.playerGui && navigator.mediaSession.setPositionState({
		// 	duration: this.playerGui.progress.max,
		// 	playbackRate: 1, // this.playerGui.progress.step?
		// 	position: this.playerGui.progress.value
		// })
	}

	cacheTrackData() {
		let trackData = document.querySelector('#track-data');
		let combined = Object.assign({}, trackData && trackData.dataset, window.hasOwnProperty('GameSettings') && GameSettings.track);
		this.trackData = Object.keys(combined).length > 0 ? Object.assign(combined, {
			author: {
				d_name: combined.author,
				u_id: parseInt(combined.author_id || combined.u_id),
				u_name: combined.u_url || combined.author?.toLowerCase()
			}
		}) : null
	}

	fetchChallengeLeaderboard({ createIfNotExists } = {}) {
		let leaderboard = document.querySelector('#race_leaderboard');
		if (!leaderboard && createIfNotExists) {
			let container = document.querySelector('#track_best_times');
			if (!container) return;
			let fragmentFromString = str => new DOMParser().parseFromString(str, 'text/html').body.childNodes[0];
			leaderboard = fragmentFromString(Application.Helpers.TemplateHelper.render(Application.router.current_view.templates['track/track_race_leaderboard'], {}, {
				race_leaderboard: [] // GameManager.game.currentScene.races
			}));
			container.prepend(leaderboard);
		}

		let tbody = leaderboard.querySelector('table > tbody');
		if (!tbody && createIfNotExists) {
			let table = leaderboard.querySelector('table');
			tbody = table.appendChild(document.createElement('tbody'));
		}
		leaderboard.style.removeProperty('display');
		return tbody || null
	}

	fetchTASLeaderboard({ createIfNotExists } = {}) {
		let leaderboard = document.querySelector('#frhd-lite\\.tas-leaderboard > table > tbody');
		if (!leaderboard && createIfNotExists) {
			let globalLeaderboard = document.querySelector('#track_leaderboard');
			if (!globalLeaderboard) return;
			leaderboard = globalLeaderboard.cloneNode(true);
			leaderboard.setAttribute('id', this.constructor.keyify('tas-leaderboard'));
			let title = leaderboard.querySelector('h3:first-child');
			title.setAttribute('title', 'Tool-assisted speedruns');
			title.innerText = 'TAS BEST TIMES';
			globalLeaderboard.after(leaderboard);
			leaderboard = leaderboard.querySelector('table > tbody');
			leaderboard.replaceChildren();
		}
		return leaderboard || null
	}

	refresh() {
		const keymap = this.storage.get('keymap');
		for (const key in keymap)
			this.scene.playerManager.firstPlayer._gamepad.keymap[key.charCodeAt()] = keymap[key]
	}

	restartOnComplete() {
		const userId = this.settings.user.u_id;
		// Check actual best time, even if not racing -- this.settings.trackUserStats
		const bestTicks = this.currentScene.races?.find(({ user }) => user.u_id == userId)?.race.run_ticks;
		if (!bestTicks) return;

		const surpassed = this.currentScene.ticks < bestTicks;
		if (!surpassed) {
			this.currentScene.state.playing = false;
			// this.currentScene.restart();
			this.currentScene.restartTrack = true;
		}

		return surpassed
	}

	updateTASLeaderboard(races) {
		let leaderboard = this.fetchTASLeaderboard({ createIfNotExists: true });
		for (let data of races) {
			let row = leaderboard.appendChild(this.constructor.fetchRaceRow(data, { parent: leaderboard, placement: 1 + races.indexOf(data) }))
			  , num = row.querySelector('.num');
			num.innerText = (1 + races.indexOf(data)) + '.';
			let stats = Object.fromEntries(Object.keys(data.race.code.tas).slice(1).map(value => value.split(/:\s*/).map(value => isFinite(value) ? parseFloat(value) : value.replace(/\s+/g, '_'))))
			  , time = row.querySelector(':nth-child(4)');
			time.innerText = this.constructor.formatRaceTime(stats.run_ticks / GameSettings.drawFPS * 1e3);
			let actionRow = row.querySelector('.track-leaderboard-action');
			actionRow.querySelector('span.core_icons.core_icons-btn_add_race.track-leaderboard-race') || actionRow.appendChild(this.constructor.createElement('span.core_icons.core_icons-btn_add_race.track-leaderboard-race', {
				title: 'Race ' + data.user.d_name,
				click() {
					let row = this.closest('.track-leaderboard-race-row');
					lite.scene.removeRaces([row.dataset.u_id])
				}
			}))
		}
	}

	draw(ctx) {
		this.storage.get('inputDisplay') && drawInputDisplay.call(this, ctx)
	}

	initEditorStyles() {
		this.constructor.styleSheet
		.update('.editorGui > :is(.topMenu, .leftMenu, .rightMenu, .bottomMenu)', { borderColor: 'hsl(0 0% 40% / 60%)' })
		.set('.editorGui >  .bottomMenu', { filter: 'brightness(.89)' })
		.set('.editorGui > :is(.topMenu, .bottomMenu) :is(.topMenu-button, .bottomMenu-button):hover', { backgroundColor: 'hsl(0 0% 40% / 60%)' })
		.set('.editorGui .sideButton', { borderColor: 'transparent' })
		.set('.editorGui .sideButton:hover', {
			backgroundColor: 'hsl(0 0% 50% / 15%)',
			borderColor: 'hsl(0 0% 50% / 50%)'
		})
		.set('.editorGui .sideButton.active', {
			backgroundColor: 'hsl(0 0% 50% / 35%)',
			borderColor: 'hsl(0 0% 50% / 50%)'
		})
	}

	static #styleSheet = document.head.appendChild(this.createElement('style', { id: 'frhd-lite.style' }));
	static ajaxResponse = null;
	static debug = false;
	static modules = new Map();
	static styleSheet = GameStyleManager.createProxyStyle(this.#styleSheet);
	static compareUsers(a, b) {
		return a.u_id == b.u_id || a.u_name == b.u_name || a.d_name == b.d_name
	}

	static createElement(type, options = {}) {
		const callback = arguments[arguments.length - 1];
		const element = document.createElement(type.replace(/[\.#].+/g, ''));
		const matchId = type.match(/(?<=#)([^\.]+((?<=\\)\.)?)+/);
		null !== matchId && (element.setAttribute('id', matchId[0].replace(/\\/g, '')),
		type = type.replace('#' + matchId[0], ''));
		const classList = type.match(/(?<=\.)([^\.#]+((?<=\\)\.)?)+/g);
		null !== classList && element.classList.add(...classList.map(name => name.replace(/\\/g, '')));
		if ('innerText' in options) {
			element.innerText = options.innerText,
			delete options.innerText;
		}

		for (const attribute in options) {
			if (typeof options[attribute] == 'object') {
				if (options[attribute] instanceof Array) {
					if (/^children$/i.test(attribute)) {
						element.append(...options[attribute]);
					} else if (/^classlist$/i.test(attribute))
						element.classList.add(...options[attribute]);
				} else if (/^(dataset|style)$/i.test(attribute))
					Object.assign(element[attribute.toLowerCase()], options[attribute]);
				else continue;
			} else if (typeof options[attribute] == 'function') {
				if (/^mutation$/i.test(attribute)) {
					typeof options['MutationObserverOptions'] == 'object' && (new MutationObserver(options[attribute]).observe(element, options['MutationObserverOptions']),
					delete options['MutationObserverOptions']);
				} else if (element['on' + attribute] !== undefined)
					element.addEventListener(attribute, options[attribute], { passive: !/\.preventDefault\(\)/g.test(options[attribute].toString()) });
				else continue;
			} else continue;
			delete options[attribute]
		}

		Object.assign(element, options);
		typeof callback == 'function' && callback(element);
		return element
	}

	static async openRace({ desc, multiple } = {}) {
		let races = [];
		if ('showOpenFilePicker' in window) {
			let results = await showOpenFilePicker({
				excludeAcceptAllOption: true,
				multiple: true,
				types: [{
					accept: { 'application/json': ['.json'] },
					description: 'Free Rider HD ' + (desc || 'File')
				}]
			});
			for (let fileHandle of results) {
				let file = await fileHandle.getFile();
				races.push(JSON.parse(await file.text()))
			}
		} else {
			let results = await new Promise((resolve, reject) => {
				let filePicker = this.createElement('input', {
					accept: 'application/json',
					multiple: true,
					type: 'file'
				});
				filePicker.addEventListener('cancel', () => resolve([]), { once: true, passive: true });
				filePicker.addEventListener('change', event => {
					resolve(event.target.files)
				}, { once: true, passive: true }),
				filePicker.click();
			});
			for (let file of results) {
				races.push(JSON.parse(await file.text()))
			}
		}

		for (let i in races) {
			let metadata = races[i].metadata;
			delete races[i].metadata;
			races[i].code = JSON.stringify(GameManager.game.currentScene.playerManager.firstPlayer._gamepad.constructor.decodeReplayString(races[i].code));
			let user, userPage = window.hasOwnProperty('lite') && lite.storage.get('importRaceMetadata') && await this.fetchUserById(metadata.u_id);
			if (userPage.user && 1 >= Object.keys(userPage.user.cosmetics.head).length) {
				let recentGhosts = userPage.recently_ghosted_tracks.tracks;
				recentGhosts && recentGhosts.length > 0 && (user = await Application.Helpers.AjaxHelper.get('t/' + recentGhosts[0].slug).then(({ game_settings: { raceData }}) => raceData[0].user))
			}
			user ||= {
				cosmetics: { head: { type: '1' }},
				d_name: 'Guest',
				guest: true,
				img_url_small: 'https://cdn.freeriderhd.com/free_rider_hd/sprites/guest_profile_v2.png',
				u_id: metadata.u_id
			}
			races[i] = {
				race: races[i],
				user
			}
		}

		GameManager.game.currentScene.addRaces(races)
	}

	static async fetchUserById(uid) {
		// check current user, then friend list, then remove friend
		let currentUser = await this.fetchCurrentUser();
		if (currentUser) {
			if (currentUser.user.u_id === uid) return currentUser;
			let friend = currentUser.friends.friends_data.find(friend => friend.u_id === uid);
			if (friend) return this.fetchUser(friend.u_name)
		}
		return this.fetchUser(await Application.Helpers.AjaxHelper.post('friends/remove_friend', { u_id: uid }).then(r => r.result || /\w+(?=,)/.exec(r.msg).toString()))
	}

	static async fetchCurrentUser({ force } = {}) {
		const KEY = this.keyify('current_user');
		let cache = sessionStorage.getItem(KEY);
		if (cache && !force) {
			return JSON.parse(cache);
		}

		const { ajax } = Application.router.current_view;
		const entry = ajax && ajax.header_title && ((ajax.user && Application.settings.user.u_id === ajax.user.u_id) || Application.settings.user.u_name === ajax.header_title.toLowerCase()) ? ajax : await fetch('/u/' + Application.settings.user.u_name + '?ajax').then(r => r.json());
		sessionStorage.setItem(KEY, JSON.stringify(entry));
		return entry || null
	}

	static async fetchCurrentUserCosmetics({ force } = {}) {
		const KEY = this.keyify('current_user.cosmetics');
		let cache = sessionStorage.getItem(KEY);
		if (cache && !force) {
			return JSON.parse(cache);
		}

		let data = await fetch('/store/gear?ajax').then(r => r.json());
		sessionStorage.setItem(KEY, JSON.stringify(data));
		return data
	}

	static users = [];
	static async fetchUser(uid, { cache, force } = {}) {
		uid = String(uid).toLowerCase();
		if (uid == Application.settings.user.u_id || uid == Application.settings.user.u_name) return this.fetchCurrentUser();
		let entry = this.users.find(({ user: { u_id, u_name }}) => u_id == uid || u_name === uid.toLowerCase());
		if (entry && !force) {
			return entry;
		}
		const { ajax } = Application.router.current_view;
		entry = ajax && ajax.header_title && ((ajax.user && uid === ajax.user.u_id) || uid === ajax.header_title.toLowerCase()) ? ajax : await fetch('/u/' + uid + '?ajax').then(r => r.json());
		// let entry = await fetch('/u/' + uid + '?ajax').then(r => r.json());
		!1 !== cache && this.users.push(entry);
		return entry || null
	}

	static isFeaturedRace(user) {
		// GameSettings.track.id
		let data = this.getStorageEntry('featured_ghosts', null, { temp: true });
		if (!data) return !1;
		return Object.entries(data).filter(([, entries]) => Object.keys(entries).find(t => t.includes(GameSettings.track.id))).map(([u]) => u.toLowerCase()).includes(user.u_name)
	}

	static integrateBadges(user) {
		Object.defineProperty(user, 'badges', {
			value: new Set(),
			writable: true
		}),
		/^5815066$/.test(user.u_id) && user.badges.add('🛠️');
		(user.admin || user.moderator || /^(?:10(?:18|82)|5(?:0(?:00(?:1|3)|1(?:15|7935))|815066))$/.test(user.u_id)) && user.badges.add('🛡️');
		this.isFeaturedRace(user) && user.badges.add('⭐');
		Object.defineProperty(user, 'r_name', {
			value: (user.badges.size > 0 ? Array.from(user.badges).join('').concat(' ') : '') + user.d_name,
			writable: true
		}),
		Object.defineProperty(user, 'gradient', { value: [], writable: true });
		if (user.badges.has('🛡️')) {
			user.gradient.push('#e95f4d');
			return '#d34836';
		} else if (user.badges.has('⭐')) {
			user.gradient.push('#fac51f');
			return '#e8a923'
		}
	}

	static async fetchRace(uid, { trackId = GameManager.trackId } = {}) {
		if (typeof uids == 'object') return this.fetchRaces(...arguments);
		let data = GameManager.trackId === trackId && GameSettings.raceData && GameSettings.raceData.find(data => data.user.u_id == userId);
		if (!data) {
			data = await Application.Helpers.AjaxHelper.post('track_api/load_races', {
				t_id: trackId,
				u_ids: uid
			}).then(r => {
				if (!r.result) throw new Error(r.msg || 'Something went wrong! Failed to fetch race.');
				return r.data
			});
		}
		return data && data[0] || null
	}

	static async fetchRaces(uids, { trackId = GameManager.trackId } = {}) {
		if (typeof uids != 'object') return this.fetchRace(...arguments);
		let races = GameManager.trackId === trackId && GameSettings.raceData && GameSettings.raceData.filter(data => uids.includes(data.user.u_id)) || [];
		if (!races || races.length !== uids.length) {
			await Application.Helpers.AjaxHelper.post('track_api/load_races', {
				t_id: trackId,
				u_ids: uids.filter(uid => -1 === races.findIndex(data => data.user.u_id == uid)).toString()
			}).then(r => {
				if (!r.result) throw new Error(r.msg || 'Something went wrong! Failed to fetch race.');
				races.push(...r.data)
			});
		}
		return races
	}

	static fetchRaceRow(data, { parent, placement }) {
		const racerProfile = 'https://' + location.host + '/u/' + data.user.d_name.toLowerCase();
		const racerAvatar = racerProfile + '/pic?sz=50';
		let row = parent.querySelector('tr.track-leaderboard-race-' + data.user.u_id);
		if (row === null) {
			row = this.createElement('tr', {
				className: 'track-leaderboard-race-' + data.user.u_id + ' track-leaderboard-race-row',
				dataset: {
					u_id: data.user.u_id,
					d_name: data.user.d_name,
					run_time: data.runTime,
					// type: 'tas'
				},
				children: [
					this.createElement('td.num', { innerText: placement + '.' }),
					this.createElement('td.name', {
						children: [
							this.createElement('a.profile-icon', {
								href: racerProfile,
								title: 'View Profile',
								children: [
									this.createElement('div.circular', {
										style: {
											background: 'url(' + racerAvatar + ') no-repeat center center',
											backgroundSize: '100%'
										},
										children: [
											this.createElement('img', {
												src: racerAvatar,
												width: 35,
												height: 35,
												alt: data.user.d_name
											})
										]
									})
								]
							}),
							this.createElement('span.track-leaderboard-race', {
								innerText: data.user.d_name,
								title: 'Race ' + data.user.d_name
							})
						]
					}),
					document.createElement('td'),
					this.createElement('td', {
						innerText: data.runTime,
						style: { textAlign: 'left' }
					}),
					this.createElement('td.track-leaderboard-action', {
						style: { width: '20%' }
					})
				]
			})
		}
		row.dataset.d_name = data.user.d_name,
		data.runTime && (row.dataset.run_time = data.runTime);
		let time = row.querySelector('td:nth-child(4)');
		time !== null && data.runTime && (time.innerText = data.runTime);
		return row
	}

	static formatRaceTime(t) {
		t = parseInt(t, 10);
		let e = t % 6e4 / 1e3;
		return Math.floor(t / 6e4) + ":" + e.toFixed(2).padStart(5, 0)
	}

	static getVisibleColor(hex, { darkDefault, initial = 255, lightDefault, min = 55, max = 200 } = {}) {
		const brightness = this.getBrightness(hex);
		return '#'.padEnd(7, brightness < min || brightness > max ? (initial - brightness).toString(16).padStart(2, 0) : brightness < 128 ? lightDefault || 'F' : darkDefault || '0')
	}

	static getBrightness(hex) {
		const { r, g, b } = this.hexToRgb(hex);
		return Math.round(.299 * r + .587 * g + .114 * b)
	}

	static hexToRgb(hex) {
		hex = hex.replace(/^#/, '');
		if (hex.length < 5) {
			hex = hex.split('').map(c => c + c).join('');
		}

		return {
			r: parseInt(hex.substring(0, 2), 16),
			g: parseInt(hex.substring(2, 4), 16),
			b: parseInt(hex.substring(4, 6), 16)
		}
	}

	static rgbToHex(...args) {
		return '#' + args.map(value => Math.max(0, Math.min(255, Math.round(value))).toString(16).padStart(2, 0)).join('')
	}

	static isUserModerator(data) {
		data.hasOwnProperty('user') && (data = data.user);
		return data.moderator || data.admin
	}

	static _attachShortcuts(key, target) {
		return Object.defineProperties(target, {
			delete: {
				value: () => localStorage.removeItem(this.keyify(key)),
				writable: true
			},
			set: {
				value: value => this.setStorageEntry(key, value),
				writable: true
			},
			update: {
				value: value => this.setStorageEntry(key, value),
				writable: true
			}
		})
	}

	static deleteStorageEntry(key, { temp } = {}) {
		return globalThis[(temp ? 'session' : 'local') + 'Storage'].removeItem(this.keyify(key))
	}

	static getStorageEntry(key, value, { temp } = {}) {
		let entry = globalThis[(temp ? 'session' : 'local') + 'Storage'].getItem(this.keyify(key));
		if (!entry && value) {
			return this.setStorageEntry(key, value)
		}
		return entry !== null && /^[\[{]]|[}\]]$/g.test(entry) ? this._attachShortcuts(this.keyify(key), JSON.parse(entry)) : entry
	}

	static setStorageEntry(key, value, { temp } = {}) {
		return globalThis[(temp ? 'session' : 'local') + 'Storage'].setItem(this.keyify(key), typeof value == 'object' ? JSON.stringify(value) : value),
		typeof value == 'object' ? this._attachShortcuts(this.keyify(key), structuredClone(value)) : value
	}

	static updateStorageEntry(key, value, { temp } = {}) {
		let entry = this.getStorageEntry(key) || new value.constructor;
		entry instanceof Array && typeof value[Symbol.iterator] == 'function' ? entry.push(...value) : Object.assign(entry, value); // recurse?
		return this.setStorageEntry(key, entry)
	}

	static keyify(key) {
		return key.replace(/^(?:frhd-lite\.)?(.+)/i, 'frhd-lite.$1')
	}

	static verifyRaceData(data) {
		typeof data.race.code == 'string' && (data.race.code = JSON.parse(data.race.code));
		let isTas = true == 'tas' in data.race.code;
		let duplicateInputs = 0;
		for (let i in data.race.code) {
			if (!/_down$/i.test(i)) continue;
			let key = i.replace(/_\w+$/i, '');
			let ticksDown = Object.keys(data.race.code[i]);
			if (!data.race.code[key + '_up']) continue;
			for (let s of ticksDown) {
				data.race.code[key + '_up'][s] > 0 && (isTas = true,
				duplicateInputs++)
			}
		}
		duplicateInputs > 0 && (isTas = true);
		console.debug(data.race.code, duplicateInputs, isTas);
		return !isTas
	}

	static warn(err) {
		console.log('%cFree Rider Lite', `
			background-color: hsl(207deg 33% 33%);
			border: 1px solid hsl(0 0% 50% / 12.5%);
			border-radius: .25em;
			color: white;
			font-size: .95em;
			font-weight: bold;
			line-height: 1em;
			padding: .05em .33em;
		`, err)
	}
}

Object.defineProperty(self, 'FreeRiderLite', {
	value: FreeRiderLite,
	writable: true
});

Object.defineProperty(self, 'lite', {
	value: new FreeRiderLite(),
	writable: true
});

// function m(t, e) {
// 	for (var i in e)
// 		try {
// 			t[i] = e[i].constructor == Object ? m(t[i], e[i]) : e[i]
// 		} catch (s) {
// 			t[i] = e[i]
// 		}
// 	return t
// }