class FreeRiderLite {
	dialogs = new Map();
	nativeEvents = new Map();
	playlists = new Map();
	snapshots = new class extends Array {
		push(...args) {
			if (this.length >= parseInt(lite.storage.get('snapshots')))
				this.splice(0, this.length - parseInt(lite.storage.get('snapshots')));
			return super.push(...args)
		}
	}
	storage = new Map();
	trackData = null;
	constructor() {
		let searchParams = new URLSearchParams(location.search);
		if (searchParams.has('ajax')) return;
		self.Application && Application.events.subscribe('mainview.loaded', this._childLoad.bind(this)),
		self.ModManager && (ModManager.hook(this, { name: 'lite' }),
		ModManager.addEventListener('game:ready', this._load.bind(this)),
		ModManager.addEventListener('game:stateChange', this.refresh.bind(this)));
		self.hasOwnProperty('Application') && (Object.defineProperty(Application.Helpers.AjaxHelper, 'lastRequest', { value: null, writable: true }),
		Object.defineProperty(Application.router.current_view, 'ajax', { value: null, writable: true }),
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
		Object.defineProperty(this, 'trackData', { enumerable: false }),
		Object.defineProperty(this, 'dialogs', { enumerable: false }),
		Object.defineProperty(this, 'nativeEvents', { enumerable: false })
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
		this.attachContextMenu(),
		this.initEditorStyles(),
		location.pathname.match(/^\/notifications\/?/i) && this.modifyCommentNotifications();
		this.storage.get('accountManager') && this.initAccountManager();
		location.pathname.match(/^\/t\//i) && GameSettings.track && (Application.events.publish("game.prerollAdStopped"),
		location.pathname.match(/\/r\/.+$/i) && GameSettings.raceData && this._updateChallengeLeaderboard(GameSettings.raceData),
		this.cacheTrackData(),
		this.storage.get('achievementMonitor') && this.initAchievementMonitor(),
		this.initBestDate(),
		this.initDownloadGhosts(),
		this.initGhostMetadata(),
		this.initHighlightComment(),
		this.initReportTracks(),
		location.search.includes('c_id=') && this.initJumpToComment(),
		Application.settings.user.u_id === GameSettings.track.u_id && this.initDownloadTracks(),
		this.storage.get('featuredGhostsDisplay') && this.initFeaturedGhosts(),
		typeof this.initPlayer == 'function' && this.initPlayer());
		location.pathname.match(/^\/u\//i) && (Application.router.current_view.username === Application.settings.user.u_name ? (this.storage.get('playlists') && this.initPlayLater(),
		this.initUserTrackAnalytics()) : this.initFriendsLastPlayed(),
		Application.settings.user.moderator && (this.initUserModeration(),
		this.initUserTrackModeration()));
		location.pathname.match(/^\/account\/settings\/?/i) && this.initRequestTrackData()
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
		// game.on('playerBaseVehicleDraw', ({ baseVehicle, ctx, player }) => {
		// 	if (this.scene.ticks <= 0 || player.isGhost()) return;
		// 	try {
		// 		if (!this.scene.state.playing) {
		// 			let t = parseInt(this.storage.get('snapshots'));
		// 			if (t > 0) {
		// 				// Object.create(Object.getPrototypeOf(baseVehicle))
		// 				for (let e of player._checkpoints.filter((e, i, s) => i > s.length - (t + 1) && e._baseVehicle))
		// 					baseVehicle.drawBikeFrame.call(Object.assign({}, baseVehicle, { scene: this.scene }, JSON.parse(e._baseVehicle)), ctx, t / 3e2 * player._checkpoints.indexOf(e) % 1);
		// 				for (let e of player._cache.filter((e, i, s) => i > s.length - (t + 1) && e._baseVehicle))
		// 					baseVehicle.drawBikeFrame.call(Object.assign({}, baseVehicle, { scene: this.scene }, JSON.parse(e._baseVehicle)), ctx, t / 3e2 * player._cache.indexOf(e) % 1);
		// 			}
		// 		}

		// 		if (this.storage.get('playerTrail')) {
		// 			for (let e of this.snapshots.filter(({ _baseVehicle: t }) => t))
		// 				baseVehicle.drawBikeFrame.call(Object.assign({}, baseVehicle, { scene: this.scene }, JSON.parse(e._baseVehicle)), ctx, this.snapshots.length / (this.snapshots.length * 200) * this.snapshots.indexOf(e) % 1);
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
		game.currentScene.playerManager.firstPlayer._gamepad.addEventListener('buttonDown', event => {
			if (event.key !== 'left' && event.key !== 'right') return;
			if (this.scene.camera.focusIndex < 1) return;
			const { playerFocus } = this.scene.camera;
			if (!playerFocus.isGhost() || playerFocus._gamepad.playbackTicks < 1) return;
			event.preventDefault();
			const dir = event.key === 'left' ? -1 : 1;
			const targetTick = (playerFocus._gamepad.playbackTicks ?? this.scene.ticks) + 5 * dir;
			playerFocus._replayIterator.next(targetTick);
			this.scene.state.playing = false;
			game.emit('seek', targetTick)
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
			case 'accountManager':
			case 'achievementMonitor':
			case 'featuredGhosts':
			case 'playlists':
				childLoad = true;
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
				this.constructor.styleSheet.set('#game-container', Object.assign({}, this.constructor.styleSheet.get('#game-container'), {
					filter: 'brightness(' + value / 100 + ')'
				}));
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
			case 'keymap':
				this.scene.playerManager.firstPlayer._gamepad.setKeyMap(GameManager.scene !== 'Editor' ? GameSettings.playHotkeys : GameSettings.editorHotkeys);
				break;
			case 'raceProgress':
				this.scene.raceProgress && (this.scene.raceProgress.enabled = value);
				break;
			case 'theme':
				const theme = this._getColorScheme(value);
				const colorPalette = this.storage.get('colorPalette');
				let backgroundColor = '#'.padEnd(7, theme == 'midnight' ? '1d2328' : theme == 'darker' ? '0' : theme == 'dark' ? '1b' : 'f');
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
				this.scene.message.color = GameSettings.UIDarkerGrayColor,
				this.scene.message.outline = backgroundColor;
				this.scene.score.best_time.color = GameSettings.UIGrayColor,
				this.scene.score.best_time_title.color = GameSettings.UIGrayColor;
				let color = GameSettings.UITextColor;
				this.scene.score.goals.color = color,
				this.scene.score.time.color = color,
				this.scene.score.time_title.color = GameSettings.UIGrayColor;
				if (this.scene.hasOwnProperty('campaignScore')) {
					this.scene.campaignScore.container.children.forEach(medal => {
						medal.children.forEach(element => element.color = color)
					});
				}

				if (this.scene.hasOwnProperty('raceTimes')) {
					this.scene.raceTimes.container.color = color;
					this.scene.raceTimes.raceList.forEach(race => {
						race.children.forEach(element => element.color = color)
					});
				}

				colorPalette.accentColor ?? (GameSettings.accentColor = GameSettings.UITextColor),
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
				// console.log(this.constructor.hexToRgb(backgroundColor), brightness, val, sceneryLineColor, minor)
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
				this.constructor.styleSheet.update('.editorGui > :is(.topMenu, .leftMenu, .rightMenu, .bottomMenu)', {
					backgroundColor,
					color
				})
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

	attachContextMenu() {
		if (!this._oncontextmenu) {
			Object.defineProperty(this, '_oncontextmenu', {
				value: async event => {
					let currentUser = event.target.closest('.left-nav-profile-top');
					if (null !== currentUser) {
						event.preventDefault();
						const options = await this.buildUserContextMenu(Application.settings.user);
						options.splice(3, 0, {
							name: 'Logout',
							styles: ['danger'],
							click: () => Application.User.logout()
						});
						if (this.storage.get('accountManager')) {
							const accounts = Object.values(this.constructor.getStorageEntry('account-manager') || {});
							const subOptions = accounts.map(account => ({
								name: account.name,
								styles: account.name.toLowerCase() === Application.settings.user.u_name && ['disabled'],
								click: () => {
									this.constructor.setCookie('frhd_app_sr', account.asr, { days: 365 }),
									location.reload()
								}
							}));
							accounts.length > 0 && subOptions.push({ type: 'hr' }) || subOptions.push({
								name: 'Add Account',
								// click: () => this.constructor.getAccountManager({ createIfNotExists: true, showLogin: true }).showModal('login')
								click: () => Application.Helpers.TemplateHelper.getTemplates(["auth/signup_login"], function(t) {
									Application.router.auth_dialog_view.template = t["auth/signup_login"],
									Application.router.auth_dialog_view.options = Object.assign({}, Application.settings, { login: true }),
									Application.router.auth_dialog_view.setup()
								})
							}),
							subOptions.push({
								name: 'Manage Accounts',
								click: () => this.constructor.getAccountManager({ createIfNotExists: true }).showModal()
							}),
							options.splice(3, 0, this.storage.get('accountManager') && {
								name: 'Switch Accounts',
								options: subOptions
							})
						}
						ContextMenu.create(options, event);
						return;
					}

					// let gameContiner = event.target.closest('#game-container');
					// if (null !== gameContiner) {
					// 	event.preventDefault();
					// 	const options = [{
					// 		name: 'Input Display',
					// 		type: 'checkbox'
					// 	}];
					// 	ContextMenu.create(options, event);
					// 	return;
					// }

					this.trackData === null && this.cacheTrackData();
					// track-list-tile
					let race = event.target.closest('.track-leaderboard-race-row');
					if (null !== race) {
						event.preventDefault();
						if (event.target.closest('.name')) {
							ContextMenu.create(await this.buildUserContextMenu(race.dataset), event);
							return;
						}

						const reports = this.constructor.fetchReports('\'{data-u_id}\' by @{data-d_name}', race.dataset, { type: 'race' });
						const options = [{
							name: 'Race',
							click: () => GameManager.loadRace(GameManager.trackId, race.dataset.u_id)
						}, {
							name: 'Copy Race Data', // 'Request Race Data' if data is not loaded,
							click: () => this.constructor.fetchRace(race.dataset.u_id).then(data => navigator.clipboard.writeText(JSON.stringify(data, '\t', 4)).catch(err => alert(err.message)))
						}, {
							name: race.dataset.legitimacy || 'Test Legitimacy',
							styles: race.dataset.legitimacy && ['disabled'],
							click: () => Application.Helpers.AjaxHelper.post('track_api/load_races', { // grab race data from GameSettings.raceData instead
								t_id: this.trackData.t_id,
								u_ids: race.dataset.u_id
							}).then(({ data, result: r }) => {
								if (!r) return alert('Race not found.');
								let [entry] = this.scene.formatRaces(data);
								let isTas = !this.constructor.verifyRaceData(entry);
								race.dataset.legitimacy = isTas ? 'Illegitimate (TAS)' : 'Legit';
								isTas && this.updateTASLeaderboard([entry])
							})
						}, this.constructor.isUserModerator(Application.settings.user) || (Application.settings.user.u_id == race.dataset.u_id ? {
							name: 'Request Deletion',
							styles: ['danger', race.dataset.requested && 'disabled'],
							click: () => this.constructor.report('Race \'{data-u_id}\' by @{data-d_name}', race.dataset, { type: 'request' }).then(() => {
								race.dataset.requested = true
							})
						} : {
							name: 'Report',
							styles: ['danger', (race.dataset.reported || reports.length > 0) && 'disabled'],
							click: () => this.constructor.report('Race \'{data-u_id}\' by @{data-d_name}', race.dataset, { type: 'race' }).then(() => {
								race.dataset.reported = true
							})
						})];
						if (Application.settings.user.u_id != race.dataset.u_id) {
							const raceData = GameManager.game.currentScene.races.find(({ user: u }) => u.u_id == race.dataset.u_id);
							if (raceData) {
								const cosmetics = await this.constructor.fetchCurrentUserCosmetics();
								const item = raceData.user.cosmetics.head;
								const hasItem = cosmetics.gear.head_gear.length > 0 && cosmetics.gear.head_gear.find(({ id }) => id == item.id);
								options.splice(options.length - 2, 0, {
									name: (hasItem ? 'Equip' : 'Preview') + ' Head',
									styles: GameManager.game.currentScene.playerManager.firstPlayer._user.cosmetics.head.id == item.id && ['disabled'],
									click: () => {
										for (let player of GameManager.game.currentScene.playerManager._players.filter(({ _user: u }) => u.u_id == Application.settings.user.u_id)) {
											player._user.cosmetics.head = item
										}
										return hasItem && Application.Helpers.AjaxHelper.post('store/equip', { item_id: item.id })
									}
								});
							}
						}
						Application.settings.user.u_id == race.dataset.u_id && options.splice(options.length - 1, 0, {
							name: race.title || 'Check Date',
							styles: race.title && ['disabled'],
							click: () => this.constructor.fetchRaceBestDate().then(date => race.setAttribute('title', date))
						}, {
							name: 'Download',
							click: () => this.constructor.downloadRace(this.trackData.t_id, race.dataset.u_id)
						});
						if (Application.settings.user.moderator) {
							let targetUser = await this.constructor.fetchUser(race.dataset.d_name);
							options.splice(options.length - 1, 0, {
								name: 'Feature',
								click: () =>  navigator.clipboard.writeText('"frhd.co/t/' + this.trackData.t_id + '/r/' + race.dataset.d_name.toLowerCase() + '": ""').then(() => {
									window.open('https://github.com/Calculamatrise/frhd-featured-ghosts/edit/master/data.json', 'blank')
								})
							}, {
								name: 'Delete',
								styles: ['danger'],
								click: () => Application.Helpers.AjaxHelper.post('moderator/remove_race', {
									t_id: this.trackData.t_id,
									u_id: race.dataset.u_id
								}).then(r => r.result && (race.remove(),
								Application.router.current_view.refresh_leaderboard())).fail(err => alert('Something went wrong! ' + err.message))
							}, {
								name: 'Delete & Ban', // only show if mod
								styles: ['danger', targetUser.user.banned && 'disabled'],
								click: () => Application.Helpers.AjaxHelper.post('moderator/remove_race', {
									t_id: this.trackData.t_id,
									u_id: race.dataset.u_id
								}).then(r => r.result && (race.remove(),
								Application.router.current_view.refresh_leaderboard(),
								Application.Helpers.AjaxHelper.post('moderator/ban_user', {
									u_id: race.dataset.u_id
								}))).fail(err => alert('Something went wrong! ' + err.message))
							});
						}
						this.storage.get('developerMode') && options.push({ type: 'hr' }, {
							name: 'Copy Racer Id',
							click: () => navigator.clipboard.writeText(race.dataset.u_id)
						});
						ContextMenu.create(options, event);
						return;
					}

					let leaderboard = event.target.closest('.track-leaderboard');
					if (null !== leaderboard) {
						event.preventDefault();
						const options = [{
							name: 'Race All',
							click: () => Application.Helpers.AjaxHelper.post('track_api/load_races', {
								t_id: this.trackData.t_id,
								u_ids: Array.from(leaderboard.querySelectorAll('.track-leaderboard-race-row')).map(row => row.dataset.u_id).join(',')
							}).then(r => r.result && this.scene.addRaces(r.data))
						}, this.constructor.isUserModerator(Application.settings.user) && {
							name: 'Copy Race Data',
							click: () => this.constructor.fetchRaces(Array.from(leaderboard.querySelectorAll('.track-leaderboard-race-row')).map(row => row.dataset.u_id)).then(races => navigator.clipboard.writeText(JSON.stringify(races, '\t', 4)).catch(err => alert(err.message)))
						}, { type: 'hr' }, this.constructor.isUserModerator(Application.settings.user) ? {
							name: 'Delete All',
							styles: ['danger', 'disabled'],
							click: () => confirm('Are you sure you want to delete ALL races on this leaderboard? This cannot be undone.') && Promise.all(Array.from(leaderboard.querySelectorAll('.track-leaderboard-race-row')).map(row => {
								return Application.Helpers.AjaxHelper.post('moderator/remove_race', {
									t_id: this.trackData.t_id,
									u_id: row.dataset.u_id
								})
							}))
						} : {
							name: 'Report',
							styles: ['danger'], // check session storage and disable button
							click: () => this.constructor.report('Leaderboard', {}, { type: 'leaderboard' })
						}];
						ContextMenu.create(options, event);
						return;
					}

					let comment = event.target.closest('.track-comment');
					if (null !== comment) {
						event.preventDefault();
						if (event.target.closest('.track-comment-img, a.bold')) {
							ContextMenu.create(await this.buildUserContextMenu(comment.dataset), event);
							return;
						} else if (event.target.tagName === 'A') {
							let href = event.target.href;
							let user = await this.constructor.fetchUser(href.replace(/.+\//, '')).then(r => r.user);
							ContextMenu.create(await this.buildUserContextMenu(user), event);
							return;
						}

						let confirmFlag = comment.querySelector('.track-comment-confirm-flag > .yes');
						const options = [{
							name: 'Reply',
							click: () => {
								let input = document.querySelector('#track-comment');
								input.focus();
								input.value = '@' + comment.dataset.d_name + ' ';
							}
						}, {
							name: 'Copy Text',
							click: () => navigator.clipboard.writeText(comment.querySelector('.track-comment-msg').innerText)
						}, Application.settings.user.d_name == comment.dataset.d_name ? {
							name: 'Delete',
							styles: ['danger'],
							click: () => Application.router.current_view._delete_comment(this.trackData.t_id, comment.dataset.c_id, r => r.result && comment.remove())
						} : this.constructor.isUserModerator(Application.settings.user) || {
							name: 'Report',
							styles: ['danger', confirmFlag || 'disabled'],
							click: () => confirmFlag.click()
						}];
						Application.settings.user.admin && options.push({ type: 'hr' }, {
							name: 'Set Messaging Ban',
							styles: ['danger'],
							click: () => Application.Helpers.AjaxHelper.post('admin/user_ban_messaging', {
								messaging_ban_uname: comment.dataset.d_name.toLowerCase()
							})
						});
						this.storage.get('developerMode') && options.push({ type: 'hr' }, {
							name: 'Copy Comment Id',
							click: () => navigator.clipboard.writeText(comment.dataset.c_id)
						});
						ContextMenu.create(options, event);
						return;
					}

					let track = event.target.closest('.track-about-panel > .panel-padding');
					if (null !== track) {
						event.preventDefault();
						if (event.target.closest('.track-about-author-img, a.bold')) {
							const options = await this.buildUserContextMenu(this.trackData.author);
							let subscribe = document.querySelector('#subscribe_to_author');
							Application.settings.user.u_id != this.trackData.author_id && options.splice(3, 0, {
								name: subscribe.innerText,
								styles: /^un/i.test(subscribe.innerText) && ['danger'],
								click: () => subscribe.click()
							});
							ContextMenu.create(options, event);
							return;
						}

						let confirmFlag = document.querySelector('.track-flag ~ .track-confirm-flag > .yes');
						const options = [{
							name: 'Copy Title',
							click: () => navigator.clipboard.writeText(track.querySelector('h1.bold').innerText)
						}, {
							name: 'Copy Description',
							click: () => navigator.clipboard.writeText(track.querySelector('.description').innerText)
						}, {
							name: track.dataset.last_played_date || 'Check Last Played',
							styles: track.dataset.last_played_date && ['disabled'],
							click: () => this.constructor.fetchTrackLastPlayedDate().then(date => track.dataset.last_played_date = date)
						} /* , {
							name: 'Add to Playlist',
							options: [{
								name: 'Play Later'
							}, {
								name: 'Create a new Playlist'
							}]
						} */];
						let playlist = this.fetchAndCachePlaylists('playlater');
						let savedToPlaylater = playlist && playlist.has(this.trackData.t_id);
						let showPlaylistButton = savedToPlaylater || this.storage.get('playlists');
						if (showPlaylistButton) {
						// if (this.storage.get('playlists')) {
							// let playlist = this.fetchAndCachePlaylists('playlater');
							// let savedToPlaylater = playlist && playlist.has(this.trackData.t_id);
							// let showPlaylistButton = savedToPlaylater || this.storage.get('playlists');
							showPlaylistButton && options.splice(2, 0, {
								name: (savedToPlaylater ? 'Remove from' : 'Add to') + ' Playlist',
								styles: [savedToPlaylater && 'danger', savedToPlaylater && !this.storage.get('playlists') && 'disabled'],
								click: () => Application.Helpers.AjaxHelper.get('t/' + this.trackData.t_id).then(({ track, user_track_stats }) => {
									const playlist = this.fetchAndCachePlaylists('playlater');
									playlist[savedToPlaylater ? 'delete' : 'set'](this.trackData.t_id, {
										author: track.author,
										averageTime: user_track_stats.avg_time,
										featured: track.featured,
										id: this.trackData.t_id,
										img: track.img,
										slug: track.slug,
										title: track.title
									});
									playlist.size > 0 ? this.constructor.setStorageEntry('playlists.playlater', Array.from(playlist.values())) : this.constructor.removeStorageEntry('playlists.playlater')
								})
							});
						}
						Application.settings.user.u_id == this.trackData.author_id ? (options.push({
							name: 'Download',
							click: () => this.constructor.downloadTrack(this.trackData.t_id)
						}, this.constructor.isUserModerator(Application.settings.user) || {
							name: 'Request Deletion',
							styles: ['danger', 'disabled']
						}, { type: 'hr' }, {
							name: 'Download All',
							click: () => this.constructor.downloadAllTracks(Application.settings.user.u_name)
						})) : this.constructor.isUserModerator(Application.settings.user) || options.push({
							name: 'Report',
							styles: ['danger', confirmFlag || 'disabled'],
							click: () => (confirmFlag.click(),
							confirmFlag.parentElement.remove(),
							document.querySelector('.track-flag')?.remove())
						});
						Application.settings.user.moderator && options.push({ type: 'hr' }, {
							name: 'Add to Track of the Day',
							styles: ['disabled']
						}, {
							name: (GameSettings.track.featured ? 'Unf' : 'F') + 'eature',
							styles: GameSettings.track.featured && ['danger'],
							click: () => Application.Helpers.AjaxHelper.post('track_api/feature_track/' + this.trackData.t_id + '/' + (1 - GameSettings.track.featured)).then(r => {
								r.result && (this.trackData.featured = !this.trackData.featured,
								GameSettings.track.featured = this.trackData.featured)
							})
						}, {
							name: (this.trackData.hide ? 'Unh' : 'H') + 'ide', // unhide if hidden
							styles: ['danger'],
							click: () => Application.Helpers.AjaxHelper.get('moderator/hide_track/' + this.trackData.t_id).then(r => {
								r.result && (this.trackData.hide = 1 - this.trackData.hide,
								GameSettings.track.hide = this.trackData.hide)
							})
						});
						Application.settings.user.admin && options.push({ type: 'hr' }, {
							name: 'Remove Track of the Day',
							styles: ['danger'],
							click: () => Application.Helpers.AjaxHelper.post('admin/removeTrackOfTheDay', {
								t_id: this.trackData.t_id
							})
						}, {
							name: (this.trackData.hide ? 'Unh' : 'H') + 'ide', // unhide if hidden
							styles: ['danger'],
							click: () => Application.Helpers.AjaxHelper.post('admin/' + (this.trackData.hide ? 'un' : '') + 'hide_track', { track_id: this.trackData.t_id }).then(r => {
								r.result && (this.trackData.hide = 1 - this.trackData.hide,
								GameSettings.track.hide = this.trackData.hide)
							})
						}, {
							name: 'Set Uploading Ban',
							styles: ['danger'],
							click: () => Application.Helpers.AjaxHelper.post('admin/user_ban_uploading', {
								uploading_ban_uname: this.trackData.author.u_name
							})
						});
						this.storage.get('developerMode') && options.push({ type: 'hr' }, {
							name: 'Copy Track Id',
							click: () => navigator.clipboard.writeText(this.trackData.t_id)
						});
						ContextMenu.create(options, event);
						return;
					}
				},
				writable: true
			});
			this.constructor.styleSheet.set('context-menu', {
				'--background-color': 'hsl(200deg 15% 15%)',
				'--border-color': 'hsl(200deg 25% 25% / 50%)',
				'--color': 'hsl(0 0% 90%)',
				fontSize: 'clamp(9px, .75rem, 13px)'
			})
		}
		document.removeEventListener('contextmenu', this._oncontextmenu),
		document.addEventListener('contextmenu', this._oncontextmenu)
	}

	async buildUserContextMenu(data) {
		data = Object.assign({}, data);
		!data.u_name && data.d_name && (data.u_name = data.d_name.toLowerCase());
		let isCurrentUser = Application.settings.user.u_id == data.u_id || Application.settings.user.u_name == data.u_name;
		const options = [{
			name: 'Profile',
			click: () => Application.router.do_route('u/' + (data.u_name || data.d_name.toLowerCase()))
		}, {
			name: 'Copy Username',
			click: () => navigator.clipboard.writeText(data.d_name)
		}];
		if (!isCurrentUser) {
			let currentUser = await this.constructor.fetchCurrentUser();
			let isFriend = currentUser.friends.friends_data.find(this.constructor.compareUsers.bind(this, data));
			let request = currentUser.friend_requests.request_cnt > 0 && currentUser.friend_requests.request_data.find(this.constructor.compareUsers.bind(this, data));
			const reports = this.constructor.fetchReports('@{data-d_name} ({data-u_id})', data, { type: 'user' });
			const cachedReports = this.constructor.getStorageEntry('reports.users');
			const reported = cachedReports && cachedReports.includes(data.u_id);
			options.splice(2, 0, {
				name: !request || !request.outgoing ? (isFriend ? 'Remove' : 'Add') + ' Friend' : 'Pending',
				styles: [isFriend && 'danger', (!isFriend && currentUser.friends.friend_cnt >= 30 || request && request.outgoing) && 'disabled'],
				click: () => Application.Helpers.AjaxHelper.post('friends/' + (isFriend ? 'remove_friend' : 'send_friend_request'), { u_name: data.d_name }).done(({ result }) => {
					!isFriend && (currentUser.friend_requests.request_data.push(Object.assign({ outgoing: true }, data)),
					currentUser.friend_requests.request_cnt = currentUser.friend_requests.request_data.length,
					this.constructor.setStorageEntry('current_user', currentUser, { temp: true }))
				})
			}, this.constructor.isUserModerator(Application.settings.user) || {
				name: 'Report',
				styles: ['danger', (reported || reports.length > 0) && 'disabled'], // check session storage and disable button
				// if more than one ghost is reported, report the leaderboard instead and disable all ghost reports on track
				click: () => this.constructor.report('User @{data-d_name} ({data-u_id})', data, { type: 'user' }).then(() => {
					this.constructor.updateStorageEntry('reports.users', [data.u_id])
				})
			});
			(request && !request.outgoing) && options.splice(3, 0, {
				name: 'Accept Friend Request',
				styles: !data.u_id && ['disabled'],
				click: () => Application.Helpers.AjaxHelper.post('friends/respond_to_friend_request', {
					u_id: data.u_id,
					action: 'accept'
				})
			}, {
				name: 'Reject Friend Request',
				styles: ['danger', !data.u_id && 'disabled'],
				click: () => Application.Helpers.AjaxHelper.post('friends/respond_to_friend_request', {
					u_id: data.u_id,
					action: 'decline'
				})
			});
		} else {
			options.splice(2, 0, {
				name: 'Edit Profile',
				click: () => Application.router.do_route('account/settings')
			});
		}
		if (Application.settings.user.moderator) {
			let targetUser = await this.constructor.fetchUser(data.d_name || data.u_name || data.u_id);
			options.push({ type: 'hr' }, {
				name: 'Change Email',
				click: () => (email => email && email.includes('@') && Application.Helpers.AjaxHelper.post('moderator/change_email', {
					u_id: data.u_id,
					email
				}))(prompt('Enter the new email address:'))
			}, {
				name: 'Change Username',
				click: () => (username => username && Application.Helpers.AjaxHelper.post('moderator/change_username', {
					u_id: data.u_id,
					username
				}))(prompt('Enter the new username:'))
			}, {
				name: (targetUser.user.classic ? 'Remove' : 'Set') + ' Official Author',
				styles: targetUser.user.classic && ['danger'],
				click: () => Application.Helpers.AjaxHelper.post('moderator/toggle_official_author/' + data.u_id)
			}, {
				name: (targetUser.user.banned ? 'Unb' : 'B') + 'an',
				styles: ['danger'],
				click: () => Application.Helpers.AjaxHelper.post('moderator/ban_user', {
					u_id: data.u_id
				})
			});
		}
		if (Application.settings.user.admin) {
			const username = data.u_name || data.d_name.toLowerCase();
			options.push({ type: 'hr' }, {
				name: 'Change Email',
				click: () => (email => email && Application.Helpers.AjaxHelper.post('admin/change_user_email', {
					username,
					email
				}))(prompt('Enter the new email address:'))
			}, {
				name: 'Change Username',
				click: () => (uname => uname && Application.Helpers.AjaxHelper.post('admin/change_username', {
					change_username_current: username,
					change_username_new: uname
				}))(prompt('Enter the new username:'))
			}, {
				name: 'Toggle Classic User',
				click: () => Application.Helpers.AjaxHelper.post('admin/toggle_classic_user', {
					toggle_classic_uname: username
				})
			}, {
				name: 'Set Admin Ban',
				styles: ['danger'],
				click: () => ((ban_secs, delete_race_stats) => ban_secs !== null && delete_race_stats !== null && Application.Helpers.AjaxHelper.post('admin/user_ban_messaging', {
					ban_secs,
					username,
					delete_race_stats
				}))(prompt('How long should this ban last? (in seconds)'), confirm('Would you like to delete race stats?'))
			}, {
				name: 'Set Messaging Ban',
				styles: ['danger'],
				click: () => Application.Helpers.AjaxHelper.post('admin/user_ban_messaging', {
					messaging_ban_uname: username
				})
			}, {
				name: 'Set Uploading Ban',
				styles: ['danger'],
				click: () => Application.Helpers.AjaxHelper.post('admin/user_ban_uploading', {
					uploading_ban_uname: username
				})
			}, {
				name: 'Deactivate User',
				styles: ['danger'],
				click: () => Application.Helpers.AjaxHelper.post('admin/deactivate_user', { username })
			}, {
				name: 'Delete User Account',
				styles: ['danger'],
				click: () => Application.Helpers.AjaxHelper.post('admin/delete_user_account', { username })
			});
		}
		this.storage.get('developerMode') && options.push({ type: 'hr' }, {
			name: 'Copy User Id',
			click: () => navigator.clipboard.writeText(data.u_id)
		});
		return options
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

	fetchAndCachePlaylists(name) {
		typeof name == 'string' && !this.playlists.has(name) && this.playlists.set(name, new Map());
		for (let key of this.playlists.keys()) {
			if (typeof name == 'string' && key !== name) continue;
			const entries = this.constructor.getStorageEntry('playlists.' + key);
			if (null === entries) continue;
			const playlist = this.playlists.get(key);
			for (const entry of entries) {
				playlist.set(String(parseInt(entry.id)), entry);
			}
		}
		return name ? this.playlists.get(name) || null : this.playlists
	}

	refresh() {
		const keymap = this.storage.get('keymap');
		for (const key in keymap)
			this.scene.playerManager.firstPlayer._gamepad.keymap[key.charCodeAt()] = keymap[key]
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
		this.storage.get('inputDisplay') && this.drawInputDisplay(ctx)
	}

	drawInputDisplay(ctx) {
		let { downButtons } = this.scene.playerManager.getPlayerByIndex(this.scene.camera.focusIndex)._gamepad
		  , size = parseInt(this.storage.get('inputDisplaySize')) + 3;
		if (this.storage.get('relativeUISize')) {
			let base = 1500
			  , current = (screen.width + screen.height) / 2;
			size *= current / base;
		}

		let offset = {
			x: size,
			y: ctx.canvas.height - size * 10
		}

		ctx.save(),
		ctx.fillStyle = GameSettings.physicsLineColor,
		ctx.globalAlpha = this.storage.get('inputDisplayOpacity'),
		// ctx.globalCompositeOperation = 'xor', // rect stroke/fill overlap
		ctx.lineWidth = size / 2,
		ctx.strokeStyle = GameSettings.physicsLineColor;

		let borderRadius = size / 2
		  , buttonSize = size * 4;

		ctx.beginPath(),
		ctx.roundRect(offset.x, offset.y, buttonSize, buttonSize, borderRadius),
		downButtons.z && ctx.fill(),
		ctx.stroke(),
		ctx.beginPath(),
		ctx.roundRect(offset.x + 5 * size, offset.y, buttonSize, buttonSize, borderRadius),
		downButtons.up && ctx.fill(),
		ctx.stroke(),
		ctx.beginPath(),
		ctx.roundRect(offset.x, offset.y + 5 * size, buttonSize, buttonSize, borderRadius),
		downButtons.left && ctx.fill(),
		ctx.stroke(),
		ctx.beginPath(),
		ctx.roundRect(offset.x + 5 * size, offset.y + 5 * size, buttonSize, buttonSize, borderRadius),
		downButtons.down && ctx.fill(),
		ctx.stroke(),
		ctx.beginPath(),
		ctx.roundRect(offset.x + 10 * size, offset.y + 5 * size, buttonSize, buttonSize, borderRadius),
		downButtons.right && ctx.fill(),
		ctx.stroke();

		ctx.globalCompositeOperation = 'xor', // destination-out
		ctx.lineWidth = size / 3,
		ctx.beginPath(),
		ctx.moveTo(offset.x + 2.7 * size, offset.y + 3 * size),
		ctx.lineTo(offset.x + 1.2 * size, offset.y + 3 * size),
		ctx.lineTo(offset.x + 2.7 * size, offset.y + 1 * size),
		ctx.lineTo(offset.x + 1.2 * size, offset.y + 1 * size),
		ctx.moveTo(offset.x + 6.2 * size, offset.y + 2.7 * size),
		ctx.lineTo(offset.x + 7 * size, offset.y + 1.2 * size),
		ctx.lineTo(offset.x + 7.8 * size, offset.y + 2.7 * size),
		ctx.moveTo(offset.x + 2.5 * size, offset.y + 7.8 * size),
		ctx.lineTo(offset.x + 1.2 * size, offset.y + 7 * size),
		ctx.lineTo(offset.x + 2.5 * size, offset.y + 6.2 * size),
		ctx.moveTo(offset.x + 6.2 * size, offset.y + 6.2 * size),
		ctx.lineTo(offset.x + 7 * size, offset.y + 7.8 * size),
		ctx.lineTo(offset.x + 7.8 * size, offset.y + 6.2 * size),
		ctx.moveTo(offset.x + 11.5 * size, offset.y + 7.8 * size),
		ctx.lineTo(offset.x + 12.8 * size, offset.y + 7 * size),
		ctx.lineTo(offset.x + 11.5 * size, offset.y + 6.2 * size),
		ctx.stroke(),
		ctx.restore()
	}

	initBestDate() {
		this.nativeEvents.has('leaderboardEvent') || this.initLeaderboardEvent();
		Application.router.current_view.on('leaderboard.rendered', () => {
			document.querySelectorAll(`.track-leaderboard-race-row[data-u_id="${Application.settings.user.u_id}"]`).forEach(race => {
				race.setAttribute('title', 'Loading...'),
				race.addEventListener('pointerover', () => this.constructor.fetchRaceBestDate().then(date => race.setAttribute('title', date)), { once: true, passive: true })
			})
		})
	}

	initDownloadGhosts() {
		this.nativeEvents.has('leaderboardEvent') || this.initLeaderboardEvent(),
		this.constructor.styleSheet
			.set('.track-page .track-leaderboard .track-leaderboard-action', { textAlign: 'right' })
			.set('.track-page .track-leaderboard .track-leaderboard-action > :is(span.core_icons, div.moderator-remove-race)', { right: '6px' })
			.set('#frhd-lite\\.download-race', {
				aspectRatio: 1,
				fontSize: '15px',
				height: '22px',
				lineHeight: '1.5em',
				marginRight: '8px',
				textAlign: 'center'
			}),
		Application.router.current_view.on('leaderboard.rendered', () => {
			for (let actionRow of document.querySelectorAll('.track-leaderboard-race-row[data-u_id="' + Application.settings.user.u_id + '"] > .track-leaderboard-action:not(:has(> #frhd-lite\\.download-race))')) {
				// let download = actionRow.querySelector('.track-leaderboard-race');
				// download.removeAttribute('class'),
				// download.setAttribute('id', 'frhd-lite.download-race'),
				// download.classList.add('btn', 'new-button', 'button-type-1'),
				// download.innerText = '⭳';
				let download = this.constructor.createElement('span.btn.new-button.button-type-1#frhd-lite\\.download-race', {
					innerText: '⭳',
					title: 'Download Race'
				});
				download.addEventListener('click', () => this.constructor.downloadRace(GameSettings.track.id, download.parentElement.parentElement.dataset.u_id), { passive: true });
				actionRow.style.setProperty('width', '20%'),
				actionRow.prepend(download),
				actionRow.textContent.length > 0 && actionRow.replaceChildren(...actionRow.children)
			}
		})
	}

	initDownloadTracks() {
		let subscribeToAuthor = document.querySelector('.subscribe-to-author-button');
		let downloadTrack = document.querySelector('#frhd-lite\\.download-track');
		if (!downloadTrack) {
			subscribeToAuthor.addEventListener('click', () => this.constructor.downloadTrack(GameSettings.track.id), { passive: true }),
			subscribeToAuthor.setAttribute('id', 'frhd-lite.download-track'),
			subscribeToAuthor.innerText = 'Download'
		}
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

	async initFriendsLastPlayed() {
		const { friends, is_profile_owner } = Application.router.current_view.ajax && Application.router.current_view.username === Application.router.current_view.ajax.header_title.toLowerCase() ? Application.router.current_view.ajax : await fetch(location.pathname + '?ajax').then(r => r.json());
		is_profile_owner || document.querySelectorAll('.friend-list-item-name').forEach(item => {
			item.after(this.constructor.createElement('div.friend-list-item-date', {
				innerText: "Last Played " + friends.friends_data.find(({ d_name }) => d_name == item.innerText).activity_time_ago
			}))
		})
	}

	initGhostMetadata() {
		this.nativeEvents.has('leaderboardEvent') || this.initLeaderboardEvent();
		const parseTicks = time => {
			if (!time) return 0;
			let parts = time.split(':').map(value => parseFloat(value));
			return Math.round((parts[1] * 1e3 + parts[0] * 6e4) * (GameSettings.drawFPS / 1e3))
		}
		Application.router.current_view.on('leaderboard.rendered', ({ track_leaderboard: trackLeaderboard }) => {
			trackLeaderboard = trackLeaderboard.filter(({ user_no_race_data }) => !user_no_race_data);
			const averageTicks = trackLeaderboard.reduce((total, { run_time }) => total += parseTicks(run_time), 0) / trackLeaderboard.length;
			for (let player of trackLeaderboard.filter(({ run_time: runTime, u_id: userId }, index) => {
				if (!runTime) return true;
				const filteredAverageTicks = trackLeaderboard.filter(({ u_id }) => u_id !== userId).reduce((total, { run_time }) => total += parseTicks(run_time), 0) / trackLeaderboard.length;
				const max = parseTicks(trackLeaderboard.at(-1).run_time);
				const calculatedMargin = max - parseTicks(trackLeaderboard[Math.min(trackLeaderboard.length - 1, index + 1)].run_time);
				this.constructor.debug && console.log(averageTicks, parseTicks(runTime), 'diff', averageTicks - parseTicks(runTime), 'max diff', max - averageTicks, max - filteredAverageTicks, filteredAverageTicks, calculatedMargin, 'max', max, 'max divided by 100', max / 100, calculatedMargin / max, calculatedMargin * (max / 100), max / calculatedMargin)
				if (averageTicks - parseTicks(runTime) > max - filteredAverageTicks) return true;
				return false
			})) {
				for (let flag of document.querySelectorAll('.track-leaderboard-race-row[data-u_id="' + player.u_id + '"] > .num:not(:has(> #frhd-lite\\.flagged))')) {
					flag.setAttribute('id', 'frhd-lite.flagged');
					flag.setAttribute('title', 'This race has been flagged by frhd-lite under suspicion of misconduct.');
					flag.innerText = '⚠️';
				}
			}
		})
	}

	initHighlightComment() {
		this.constructor.styleSheet.set('.track-comment:has(.track-comment-msg > a[href="' + location.origin + '/u/' + Application.settings.user.u_name + '"])', { backgroundColor: 'hsl(55 70% 85% / 1) !important' })
	}

	initJumpToComment() {
		let searchParams = new URLSearchParams(location.search);
		let commentId = searchParams.get('c_id');
		if (!commentId || this.lastLoadedComment == commentId /* || document.querySelector('.track-comment[data-c_id="' + commentId + '"]') */) return;
		Object.defineProperty(this, 'lastLoadedComment', { value: commentId, writable: true });
		if (typeof Application.router.current_view.load_comments_until != 'function') {
			const prototype = Object.getPrototypeOf(Application.router.current_view);
			prototype.load_comments_until = function(cid, callback) {
				let c = document.querySelector('.track-comment[data-c_id="' + commentId + '"]');
				if (c) return callback(c);
				let o = document.querySelector(".track-comments-list div.track-comment:last-child").dataset.c_id
				  , r = this._get_track_id()
				  , i = document.querySelector('.track-prev-comments');
				i.style.setProperty('display', 'none');
				let s = document.querySelector('.track-comments-loading');
				s.style.setProperty('display', 'block');
				this._get_comment_template(() => {
					Application.Helpers.AjaxHelper.post("track_comments/load_more/" + r + "/" + o).then(e => {
						if (e.result === !0 && e.data.track_comments.length > 0) {
							var a = Application.Helpers.TemplateHelper.render(this.templates["track/track_comment"], {}, e.data)
							  , o = this.$el.find(".track-comments-list")
							  , n = e.data.track_comments.findIndex(({ comment }) => comment.id == cid) > 0;
							o.append(a),
							e.data.track_comments_load_more === !0 && (n ? i.style.removeProperty('display') : this.load_comments_until(...arguments)),
							n && typeof callback == 'function' && callback(document.querySelector('.track-comment[data-c_id="' + cid + '"]'))
						}
						s.style.setProperty('display', 'none'),
						Application.events.publish('resize')
					})
				})
			}
			Object.setPrototypeOf(Application.router.current_view, prototype);
		}
		Application.router.current_view.load_comments_until(commentId, comment => {
			comment.scrollIntoView({ behavior: 'smooth' });
			window.addEventListener('scrollend', () => {
				comment.classList.add('animated', 'flash');
				setTimeout(() => {
					comment.classList.remove('animated', 'flash');
				}, 2e3)
			}, { once: true, passive: true })
		})
	}

	initLeaderboardEvent() {
		const renderLeaderboards = Application.Views.TrackView.prototype._render_leaderboards;
		this.nativeEvents.set('leaderboardEvent', renderLeaderboards);
		Application.Views.TrackView.prototype._render_leaderboards = function(e) {
			renderLeaderboards.apply(this, arguments);
			e.result && (this.trigger('leaderboard.rendered', ...arguments),
			Application.events.publish('leaderboard.rendered', ...arguments))
		}
	}

	initNotificationEvent() {
		const prototype = Object.getPrototypeOf(Application.Helpers.AjaxHelper);
		const checkNotificationEvent = prototype._check_event_notification;
		this.nativeEvents.set('notificationEvent', checkNotificationEvent);
		prototype._check_event_notification = function(e) {
			checkNotificationEvent.apply(this, arguments);
			e.result && Application.events.publish('notification.received', ...arguments);
		}
		Object.setPrototypeOf(Application.Helpers.AjaxHelper, prototype);
	}

	initPlayLater() {
		let recentlyPlayedTab = document.querySelector('.tab-entry.recently-played-tab');
		if (!recentlyPlayedTab || document.querySelector('.tab-entry.frhd-lite\\.play-later-tab')) return;
		let playlist = this.fetchAndCachePlaylists('playlater');
		if (playlist.size < 1) return;
		let tab = recentlyPlayedTab.parentElement.appendChild(recentlyPlayedTab.cloneNode(true));
		tab.classList.add('frhd-lite.play-later-tab');
		tab.dataset.panel = '#frhd-lite\\.play-later';
		tab.firstElementChild.lastChild.data = 'Play Later';
		let recentlyPlayedPanel = document.querySelector('#profile_recently_played');
		if (!recentlyPlayedPanel) return;
		let panel = recentlyPlayedPanel.parentElement.appendChild(recentlyPlayedPanel.cloneNode(true));
		panel.setAttribute('id', 'frhd-lite.play-later');
		let list = panel.querySelector('.track-list');
		list.replaceChildren(...Array.from(playlist && playlist.values()).map(entry => {
			const authorUrl = 'https://' + location.host + '/u/' + entry.author;
			const trackUrl = 'https://' + location.host + '/t/' + entry.slug;
			return this.constructor.createElement('li', {
				children: [
					this.constructor.createElement('div.track-list-tile.trackTile', {
						children: [
							this.constructor.createElement('a.top', {
								href: trackUrl,
								children: [
									this.constructor.createElement('img.track-list-tile-thumb.top-image', {
										src: entry.img
									}),
									this.constructor.createElement('img.track-list-tile-thumb', {
										alt: 'Track Preview',
										src: 'https://cdn.' + location.host.split('.').slice(-2).join('.') + '/free_rider_hd/sprites/track_preview_250x150.png'
									}),
									this.constructor.createElement('span.bestTime', {
										innerText: ' ' + entry.averageTime + ' ',
										title: 'Average Time'
									})
								]
							}),
							this.constructor.createElement('div.bottom', {
								children: [
									this.constructor.createElement('a.name', {
										href: trackUrl,
										innerText: entry.title
									}),
									this.constructor.createElement('div.profileGravatarIcon', {
										style: { backgroundImage: 'url(' + authorUrl + '/pic?size=50)' }
									}),
									this.constructor.createElement('a.author', {
										href: authorUrl + '/created',
										innerHTML: '&ensp;' + entry.author
									})
								]
							})
						]
					})
				]
			})
		}))
	}

	initReportTracks() {
		let confirm = document.querySelector('.track-flag ~ .track-confirm-flag > .yes');
		if (!confirm || confirm.classList.contains('frhd-lite.track-report')) return;
		confirm.classList.add('frhd-lite.track-report');
		confirm.addEventListener('click', () => {
			this.constructor.report('This track', {}, { type: 'track' }).then(r => alert(r.result ? "You have successfully reported this track." : r.msg))
		}, { passive: true })
	}

	initRequestTrackData() {
		let deleteALlPersonalData = document.querySelector('#delete-all-personal-data');
		if (deleteALlPersonalData) {
			let requestTrackData = deleteALlPersonalData.parentElement.appendChild(this.constructor.createElement('button.blue-button.settings-header.new-button', {
				innerText: 'Request All Data',
				style: {
					float: 'right',
					fontSize: '13px',
					height: 'auto',
					lineHeight: '23px',
					marginTop: '6px',
					marginRight: '14px',
					padding: '0 1rem'
				}
			}));
			requestTrackData.addEventListener('click', () => this.constructor.downloadAllTracks(Application.settings.user.u_name), { passive: true });
		} else {
			console.warn("Request track data failed to load! Personal data is not present.")
		}
	}

	initUserModeration() {
		let profileUserData = document.querySelector('#profile-user-data');
		if (!profileUserData) return;
		let onclick = event => {
			self = event.target;
			let input = self.previousElementSibling;
			if (self.innerText.toLowerCase() == 'save') {
				self.dispatchEvent(new CustomEvent('save', {
					detail: input.value
				}));
				input.setAttribute('readonly', '');
				self.classList.add('button-type-1');
				self.classList.remove('button-type-2');
				self.innerText = 'Edit';
			} else {
				input.removeAttribute('readonly');
				self.classList.add('button-type-2');
				self.classList.remove('button-type-1');
				self.innerText = 'Save';
			}
		}

		let data = profileUserData.dataset;
		data.u_name = document.querySelector('.profile-username').innerText;
		let pm = document.querySelector('.pm > .pm-user-properties');
		let email = pm.appendChild(pm.querySelector('.pm-user-property.pm-user-id').cloneNode(true));
		email.classList.remove('pm-user-id');
		let property = email.querySelector('.pm-property');
		property.innerText = "Email: ";
		let input = this.constructor.createElement('input', {
			placeholder: 'New email',
			readonly: '',
			type: 'text' // email
		});
		property.nextElementSibling.replaceWith(input);
		let edit = email.querySelector('#pm-ban-user');
		edit.classList.remove('ban-user-button');
		edit.innerText = "Edit";
		edit.removeAttribute('id');
		edit.addEventListener('click', onclick, { passive: true });
		edit.addEventListener('save', event => {
			return Application.Helpers.AjaxHelper.post("moderator/change_email", {
				u_id: data.u_id,
				email: event.detail
			}).then(r => (alert(r.msg), r));
		});
		email.querySelector('#pm-unban-user').remove();
		let username = pm.appendChild(email.cloneNode(true));
		property = username.querySelector('.pm-property');
		property.innerText = "Username: ";
		input = username.querySelector('input');
		input.setAttribute('placeholder', "New username");
		input.setAttribute('type', 'text');
		input.setAttribute('value', data.u_name);
		edit = username.querySelector('a');
		edit.addEventListener('click', onclick, { passive: true });
		edit.addEventListener('save', event => {
			return Application.Helpers.AjaxHelper.post("moderator/change_username", {
				u_id: data.u_id,
				username: event.detail
			}).then(r => (alert(r.msg), r))
		});
		let password = pm.appendChild(email.cloneNode());
		property = password.appendChild(property.cloneNode());
		property.innerText = "Password: ";
		edit = password.appendChild(this.constructor.createElement('button.new-button.ban-user-button', {
			innerText: 'Reset Password'
		}));
		edit.addEventListener('click', () => {
			return Application.Helpers.AjaxHelper.post("auth/forgot_password", {
				email: data.u_name
			}).then(r => (alert(r.msg), r));
		}, { passive: true })
	}

	initUserTrackAnalytics() {
		document.querySelectorAll("#created_tracks .bottom").forEach(metadata => {
			metadata.innerHTML = metadata.innerHTML.replace(/<!--|-->/g, '')
		})
	}

	initUserTrackModeration() {
		for (let metadata of document.querySelectorAll("#created_tracks .bottom")) {
			let label = metadata.appendChild(this.constructor.createElement('label', {
				style: { display: 'block' }
			}));
			let avatar = metadata.querySelector('.profileGravatarIcon');
			avatar && avatar.style.setProperty('margin-right', '4px');
			label.appendChild(metadata.querySelector('.profileGravatarIcon'));
			label.appendChild(metadata.querySelector('.author'));
			label.appendChild(this.constructor.createElement('input', {
				type: 'checkbox',
				style: {
					float: 'right',
					height: '1.5rem'
				}
			}));
		}
		let nav = document.querySelector("#content > div > div.profile-tabs > section > div.tab_buttons > div");
		let action = nav.appendChild(this.constructor.createElement('select', {
			style: {
				borderRadius: '4px',
				float: 'right',
				fontFamily: 'system-ui,roboto_medium,Arial,Helvetica,sans-serif',
				letterSpacing: '-.02em',
				marginRight: '10px',
				marginTop: '8px'
			}
		}));
		action.appendChild(this.constructor.createElement('option', {
			disabled: true,
			innerText: 'Select an action',
			value: 'default'
		}));
		action.appendChild(this.constructor.createElement('option', {
			innerText: 'Delete selected',
			value: 'hide'
		}));
		action.appendChild(this.constructor.createElement('option', {
			innerText: 'Deselect all',
			value: 'deselect'
		}));
		action.appendChild(this.constructor.createElement('option', {
			innerText: 'Select all',
			value: 'select'
		}));
		action.addEventListener('change', async event => {
			event.target.disabled = true;
			switch (event.target.value) {
			case 'hide':
				let tracks = document.querySelectorAll("#created_tracks li:has(.bottom > label > input[type='checkbox']:checked)");
				if (tracks.length > 0) {
					let dialog = document.body.appendChild(this.constructor.createElement('dialog', {
						style: {
							border: 'none',
							boxShadow: '0 0 4px 0px hsl(190deg 25% 60%)',
							maxHeight: '75vh',
							maxWidth: '50vw',
							padding: 0,
							width: '120vmin'
						}
					}));
					let title = dialog.appendChild(this.constructor.createElement('p', {
						innerText: 'Are you sure you would like to delete the following tracks?',
						style: {
							backgroundColor: 'inherit',
							boxShadow: '0 0 4px 0 black',
							padding: '1rem',
							position: 'sticky',
							top: 0,
							zIndex: 3
						}
					}));
					let close = title.appendChild(this.constructor.createElement('span.core_icons.core_icons-icon_close', {
						style: { float: 'right' }
					}));
					close.addEventListener('click', () => dialog.remove(), { passive: true });
					let list = dialog.appendChild(this.constructor.createElement('ul.track-list.clearfix', {
						style: {
							maxHeight: '50cqh',
							overflowY: 'auto',
							padding: '1rem',
							textAlign: 'center'
						}
					}));
					list.append(...Array.from(tracks).map(track => {
						let clone = track.cloneNode(true);
						clone.style.setProperty('width', 'min-content');
						return clone;
					}));
					let form = dialog.appendChild(this.constructor.createElement('form', {
						method: 'dialog',
						style: {
							backgroundColor: 'inherit',
							bottom: 0,
							boxShadow: '0 0 4px 0 black',
							display: 'flex',
							gap: '.25em',
							padding: '1rem',
							position: 'sticky',
							zIndex: 2
						}
					}));
					form.appendChild(this.constructor.createElement('button.new-button.button-type-1', {
						innerText: 'Cancel',
						value: 'cancel'
					}));
					let confirm = form.appendChild(this.constructor.createElement('button.new-button.button-type-2', {
						innerText: 'Confirm',
						value: 'default'
					}));
					confirm.addEventListener('click', async event => {
						event.preventDefault();
						for (let button of form.querySelectorAll('button')) {
							button.disabled = true;
							button.style.setProperty('opacity', .5);
							button.style.setProperty('pointer-events', 'none');
						}

						form.appendChild(this.constructor.createElement('span.loading-hourglass'));
						let cache = [];
						let tracks = list.querySelectorAll(".bottom:has(> label > input[type='checkbox']:checked)");
						for (let metadata of tracks) {
							let name = metadata.querySelector('.name');
							let url = name.href;
							let [tid] = url.match(/(?<=\/t\/)\d+/);
							await fetch('/moderator/hide_track/' + tid);
							cache.push(tid);
							let container = metadata.closest('li');
							container.remove();
						}

						// post message to extension?
						let key = 'frhd-lite_recently-hidden-tracks';
						let storage = Object.assign({}, JSON.parse(sessionStorage.getItem(key)));
						storage[Date.now()] = cache;
						sessionStorage.setItem(key, JSON.stringify(storage));
						dialog.close(event.target.value);
					});
					dialog.addEventListener('close', event => {
						action.disabled = false;
						dialog.remove();
					});
					dialog.showModal();
				}
			case 'deselect':
				for (let checkbox of document.querySelectorAll("#created_tracks .bottom > label > input[type='checkbox']:checked")) {
					checkbox.checked = false;
				}
				break;
			case 'select':
				for (let checkbox of document.querySelectorAll("#created_tracks .bottom > label > input[type='checkbox']:not(:checked)")) {
					checkbox.checked = true;
				}
			}

			event.target.value = 'default';
			event.target.disabled = false;
		}, { passive: true });
	}

	async modifyCommentNotifications() {
		Application.Helpers.TemplateHelper.getTemplates(['notifications/t_uname_mention'], templates => {
			for (let key in templates) {
				Application.Helpers.TemplateHelper.cached_templates[key] = templates[key].replace(/(?<={{track.url}})/, '?c_id={{comment.id}}')
			}
		});
		let { notification_days: d } = Application.router.current_view.ajax && /^notifications$/i.test(Application.router.current_view.ajax.header_title) ? Application.router.current_view.ajax : await Application.Helpers.AjaxHelper.get('notifications');
		let notifications = d && d.length > 0 && d.flatMap(({ notifications: n }) => n);
		let commentNotifications = notifications.filter(({ t_uname_mention: t }) => t);
		for (let { comment, track, ts } of commentNotifications) {
			let notification = document.querySelector('.notification[data-ts="' + ts + '"] p > a[href$="' + track.url + '"]')
			notification && (notification.href += '?c_id=' + comment.id)
		}
	}

	refreshAchievements() {
		return this.constructor.fetchAchievements(...arguments).then(async res => {
			let children = await Promise.all(res.achievements.filter(a => !a.complete).sort((a, b) => b.tot_num - a.tot_num).slice(0, 3).map(this.constructor.createProgressElement.bind(this.constructor)));
			this.achievementMonitor.container.replaceChildren(...children);
			return res
		})
	}

	static fetchRequestData({ attributeFilter, timeout = 10, typedFilter } = {}) {
		return new Promise((resolve, reject) => {
			var event = 'ajax.request';
			var listener = data => {
				data = typeof data == 'object' && typeof data.data == 'object' ? data.data : data;
				if (typeof attributeFilter == 'object' && attributeFilter instanceof Array) {
					const attributes = Object.keys(data);
					if (attributeFilter.find(attribute => !attributes.includes(attribute))) return;
				} else if (typeof typedFilter == 'object') {
					for (let attribute of typedFilter) {
						if (typeof data[attribute] !== typedFilter[attribute]) return;
					}
				}
				Application.events.unsubscribe(event, listener),
				Application.events.unsubscribe(timeoutEvent, listener),
				resolve(data)
			};
			Application.events.subscribe(event, listener);
			var timeoutEvent = 'mainview.loaded';
			var timeoutListener = () => {
				Application.events.unsubscribe(event, listener),
				Application.events.unsubscribe(timeoutEvent, listener),
				reject('Request timed out.')
			};
			Application.events.subscribe(timeoutEvent, timeoutListener),
			typeof timeout == 'number' && setTimeout(timeoutListener, timeout * 1e3)
		})
	}

	static #styleSheet = document.head.appendChild(this.createElement('style', { id: 'frhd-lite.style' }));
	static ajaxResponse = null;
	static debug = false;
	static styleSheet = GameStyleManager.createProxyStyle(this.#styleSheet);
	static compareUsers(a, b) {
		return a.u_id == b.u_id || a.u_name == b.u_name || a.d_name == b.d_name
	}

	static createAccountContainer({ asr, name }) {
		let container = this.createElement("div", {
			children: [
				this.createElement("button.new-button.button-type-1", {
					innerText: name,
					style: { width: '-webkit-fill-available' },
					click: event => {
						event.target.closest("#frhd-lite\\.account-manager").close();
						this.setCookie('frhd_app_sr', asr, { days: 365 }),
						location.reload()
					}
				}),
				this.createElement("button.new-button.button-type-3", {
					innerText: "X",
					style: {
						aspectRatio: 1,
						marginRight: 0
					},
					click: () => {
						let accounts = this.getStorageEntry('account-manager') || {};
						accounts.length > 0 && (accounts.splice(accounts.indexOf(accounts.find((account) => account.login === login)), 1),
						this.setStorageEntry('account-manager', accounts)),
						container.remove()
					}
				})
			],
			style: {
				display: 'flex',
            	gap: '0.25rem'
			}
		});
		return container
	}

	static getAccountManager({ createIfNotExists, showLogin } = {}) {
		(this.accountManager || createIfNotExists) && (Object.defineProperty(this, 'accountManager', {
			value: document.body.appendChild(this.createElement("dialog#frhd-lite\\.account-manager", {
				children: [
					this.createElement("span.core_icons.core_icons-icon_close.signup-login-modal-close", {
						style: {
							position: 'absolute',
							right: '.5em',
							top: '.5em'
						},
						click: () => this.accountManager.close()
					}),
					this.createElement("div.accounts-container", {
						children: Object.values(this.getStorageEntry('account-manager') ?? {}).map(account => this.createAccountContainer(account)),
						style: {
							display: 'flex',
							flexDirection: 'column',
							gap: '0.4rem'
						}
					}),
					this.createElement("button.new-button.button-type-2", {
						id: 'add-account',
						innerText: "Add account",
						click: () => this.accountManager.close('add-account')
					}),
					this.createElement("button.new-button.button-type-3", {
						innerText: "Logout",
						click: () => this.accountManager.close('logout')
					})
				],
				click: event => {
					if (this.accountManager !== event.target) return;
					let rect = event.target.getBoundingClientRect()
					  , isInDialog = (rect.top <= event.clientY && event.clientY <= rect.top + rect.height &&
						rect.left <= event.clientX && event.clientX <= rect.left + rect.width);
					!isInDialog && event.target.close()
				},
				close: event => {
					switch (event.target.returnValue) {
					case 'add-account':
						Application.Helpers.TemplateHelper.getTemplates(["auth/signup_login"], function(t) {
							Application.router.auth_dialog_view.template = t["auth/signup_login"],
							Application.router.auth_dialog_view.options = Object.assign({}, Application.settings, { login: true }),
							Application.router.auth_dialog_view.setup()
						});
						break;
					case 'logout':
						Application.User.logout()
					}
				},
				showModal(target) {
					switch (target) {
					case 'login':
						let addAccount = this.querySelector('#add-account');
						addAccount && !/^cancel$/i.test(addAccount.innerText) && addAccount.click()
					}
					return HTMLDialogElement.prototype.showModal.call(this)
				}
			})),
			writable: true
		}), this.styleSheet.set('dialog#frhd-lite\\.account-manager[open]', {
			display: 'flex',
			flexDirection: 'column',
			gap: '0.4em',
			height: 'fit-content',
			inset: 0,
			margin: 'auto',
			maxHeight: '50vmin',
			maxWidth: '25vw',
			minWidth: '230px',
			overflow: 'hidden auto',
			padding: '2.5em',
			position: 'fixed',
			width: '40vmin',
			zIndex: 1002
		}).set('dialog#frhd-lite\\.account-manager[open]::backdrop', {
			backgroundColor: 'hsl(0deg 0% 0% / 50%)'
		}).set('.button-type-3', {
			backgroundImage: 'linear-gradient(to bottom, hsl(7 86% 62% / 1), hsl(10 64% 46% / 1))'
		}).set('.button-type-3:hover', {
			backgroundImage: 'linear-gradient(to bottom, hsl(4 79% 60% / 1), hsl(4 69% 37% / 1))'
		}));
		return this.accountManager
	}

	static async createProgressElement(achievement) {
		let container = this.createElement('div.achievement-info', {
			children: [
				this.createElement('div', {
					children: [
						this.createElement('span.achievements-coin.store_icons.store_icons-coin_icon_lg.achievement-coin-value', {
							innerText: achievement.coins,
							style: {
								color: 'white',
								lineHeight: '45px',
								textAlign: 'center',
								textShadow: '0 -1px 1px #9E8500'
							}
						}),
						this.createElement('div.achievement-info', {
							children: [
								this.createElement('a.title', {
									children: [
										this.createElement('b', {
											innerText: achievement.title
										})
									],
									href: await (description => {
										switch (description) {
										case 'Buy 1 item from the shop':
											return 'store/gear';
										case 'Complete 1 friend race':
										case 'Win 5 friend(s) race':
											return this.fetchCurrentUser().then(async ({ friends }) => {
												if (friends.friend_cnt > 0) {
													let track;
													for (let friend of friends.friends_data) {
														if (track = await fetch('/u/' + friend.u_name).then(r => r.json()).then(({ recently_ghosted_tracks: { tracks }}) => {
															return tracks[Math.floor(Math.random() * tracks.length)];
														})) {
															return track;
														}
													}
												}
												return 'random/track'
											});
										case 'Improve 5 best times':
										case 'Send 5 friend race challenges':
											return this.fetchCurrentUser().then(({ recently_ghosted_tracks: { tracks }}) => {
												let track = tracks[Math.floor(Math.random() * tracks.length)];
												return track ? track.slug : 'random/track';
											});
										default:
											return 'random/track'
										}
									})(achievement.desc),
									style: { width: '-webkit-fill-available' }
								}),
								this.createElement('h6.achievement-info-desc.condensed', {
									innerText: achievement.desc,
									style: {
										color: 'hsl(190deg 25% 60%)',
										fontFamily: 'roboto_bold',
										margin: 0
									}
								})
							]
						})
					],
					style: {
						alignItems: 'center',
						display: 'flex',
						gap: '0.5rem'
					}
				}),
				// achievement.coins
				this.createElement('span', {
					innerText: achievement.progress, // achievement.current, // achievement.progress // achievement.current + '/' + achievement.max
					style: { fontSize: '1.25rem' }
				})
			],
			style: {
				alignItems: 'center',
				display: 'flex',
				justifyContent: 'space-between'
			}
		});
		return container;
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

	static async downloadFile(name, contents, { desc } = {}) {
		let mimeType = 'text/plain';
		if (!(contents instanceof Blob)) {
			typeof contents == 'object' && (mimeType = 'application/json',
			contents = JSON.stringify(contents, '\t', 4));
			if ('showSaveFilePicker' in window) {
				return showSaveFilePicker({
					excludeAcceptAllOption: true,
					startIn: 'downloads',
					suggestedName: name ?? '',
					types: [{
						description: 'Free Rider HD ' + (desc || 'File'),
						accept: { [mimeType]: ['.' + (mimeType == 'application/zip' ? 'zip' : mimeType == 'application/json' ? 'json' : 'txt')] }
					}]
				}).then(fileHandle => {
					return fileHandle.createWritable().then(writable => {
						return writable.write(contents).then(() => {
							return writable.close()
						})
					})
				}).catch(err => {
					console.warn('Download operation cancelled.', err.message)
				})
			}
		}

		let download = this.createElement('a', {
			download: name || ('frhd-lite_download-' + Date.now()),
			href: URL.createObjectURL(
				contents instanceof Blob ? contents : new Blob([contents], {
					type: mimeType
				})
			)
		});
		download.click();
		URL.revokeObjectURL(download.href)
	}

	static async downloadRace(tid, uid) {
		return Application.Helpers.AjaxHelper.post("track_api/load_races", {
			t_id: tid,
			u_ids: uid
		}).done(({ data: [entry], result: r }) => {
			if (!r) throw new Error();
			r && this.downloadFile('frhd_ghost_' + tid + '-' + uid, Object.assign(entry.race, {
				code: this.encodeReplayString(JSON.parse(entry.race.code)),
				metadata: {
					t_id: tid,
					u_id: entry.user.u_id
				}
			}), { desc: 'Race' })
		})
	}

	static async downloadTrack(id) {
		return fetch('/track_api/load_track?id=' + id + '&fields[]=code&fields[]=id&fields[]=title').then(r => r.json()).then(({ data: { track } = {}, result }) => {
			if (!result) return;
			this.downloadFile(track.title + '-' + track.id, track.code, { desc: 'Track' })
		})
	}

	static async downloadAllTracks(username) {
		return fetch('/u/' + username + '/created?ajax').then(r => r.json()).then(async ({ created_tracks }) => {
			const zip = new Zip()
				, tracks = await Promise.all(created_tracks.tracks.map(track => fetch('/track_api/load_track?id=' + track.id + '&fields[]=code&fields[]=id&fields[]=title').then(r => r.json())))
				.then(tracks => tracks.filter(({ result }) => result).map(({ data }) => data.track));
			for (let track of tracks)
				zip.newFile(track.title + '-' + track.id + '.txt', track.code);
			this.downloadFile('created-tracks', await zip.blob(), { desc: 'Created' })
		})
	}

	static encodeReplayString(t, e = {}) {
		let i = {
			version: e.replayVersion ?? 1
		};
		for (let s in t) {
			let n = t[s];
			i[s] = "";
			for (let r in n) {
				let o = n[r];
				i[s] += o.toString(32) + " "
			}
			i[s] = i[s].slice(0, -1)
		}
		return btoa(JSON.stringify(i))
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

	static async fetchAchievements({ force } = {}) {
		const KEY = this.keyify('achievements');
		let cache = sessionStorage.getItem(KEY);
		if (cache && !force) {
			return JSON.parse(cache);
		}

		let data = await fetch('/achievements?ajax').then(r => r.json());
		sessionStorage.setItem(KEY, JSON.stringify(data));
		return data
	}

	static async updateAchievements(data, { force } = {}) {
		const KEY = this.keyify('achievements');
		const entry = await this.fetchAchievements({ force });
		sessionStorage.setItem(KEY, JSON.stringify(Object.assign(entry, data)));
		return entry
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

	static fetchComment(trackId, commentId) {
		return Application.Helpers.AjaxHelper.post('track_comments/load_more/' + trackId + '/' + (commentId + 1)).then(r => r.result && r.data.track_comments[0]);
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

	static async fetchRaceBestDate({ force } = {}) {
		const KEY = this.keyify('race_best_dates');
		let cache = JSON.parse(sessionStorage.getItem(KEY)) || {}
		  , t = GameSettings.track.id;
		if (!force && cache[t]) {
			return cache[t]
		}
		const { ajax } = Application.router.current_view;
		const { user_track_stats: { best_date: date } = {}} = ajax && ajax.track && ajax.track.id === t ? ajax : await fetch(location.pathname + '?ajax').then(r => r.json());
		sessionStorage.setItem(KEY, JSON.stringify(Object.assign(cache, { [t]: date })));
		return date
	}

	static async fetchTrackLastPlayedDate({ force } = {}) {
		const KEY = this.keyify('track_last_played_dates');
		let cache = JSON.parse(sessionStorage.getItem(KEY)) || {}
		  , t = GameSettings.track.id;
		if (!force && cache[t]) {
			return cache[t]
		}
		const { ajax } = Application.router.current_view;
		const { user_track_stats: { last_played_date: date } = {}} = ajax && ajax.track && ajax.track.id === t ? ajax : await fetch(location.pathname + '?ajax').then(r => r.json());
		sessionStorage.setItem(KEY, JSON.stringify(Object.assign(cache, { [t]: date })));
		return date
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

	static report(message, data = {}, { type } = {}) {
		if (!Application.settings.user) return alert('You must be logged in to perform this action.');
		data = Object.assign({}, data, { t_id: GameSettings.track.id });
		window.postMessage({
			action: 'report',
			data,
			reporter: Application.settings.user,
			type
		});
		return Application.Helpers.AjaxHelper.post('track_comments/post', {
			t_id: data.t_id,
			msg: message.replace(/{data-(\w+)}/g, (_, key) => data[key]) + ' was reported with frhd-lite. (@Calculus/@Eric/@Totoca12)'
		})
	}

	static reportRegex(message, data, { type } = {}) {
		const hrefify = a => "<a\\shref=\"" + location.origin + "\\/u\\/" + a.toLowerCase() + "\">" + a + "<\/a>";
		message = message.replace(/{data-(\w+)}/g, (_, key) => data[key]).replace(/([\(\)])/g, '\\$1').replace(/@([\w\._-]+)/, (_, t) => hrefify(t));
		return new RegExp((message ? "^" + type.replace(/^\w/, c => c.toUpperCase()) + "\\s" + message : '') + " was reported with frhd-lite. \\(" + hrefify('Calculus') + "\\/" + hrefify('Eric') + "\\/" + hrefify('Totoca12') + "\\)$", 'i')
	}

	static fetchReports(...args) {
		args.length < 1 && (args.splice(0, 1, '.+'),
		args.splice(1, 1, { d_name: '\\w+', u_id: '\\d+' }),
		args.splice(2, 1, type = '\\w+'));
		const comments = Array.from(document.querySelectorAll('.track-comment-msg'));
		const reportRegex = this.reportRegex(...args);
		return comments.filter(t => t.innerHTML.match(reportRegex))
	}

	static setCookie(key, value, { days, domain, reload } = {}) {
		let entries = { [key]: value ?? '' };
		days && (entries.expires = new Date(864e5 * days + Date.now()).toUTCString());
		entries.domain = domain ?? ('.' + location.host);
		entries.path = '/';
		document.cookie = Object.entries(entries).map(([key, value]) => key + '=' + value).join('; ');
		reload && location.reload()
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
		console.log(data.race.code, duplicateInputs, isTas);
		return !isTas
	}

	static waitForElm(selector, limit) {
		return new Promise((resolve, reject) => {
			let element = document.querySelector(selector);
			if (element)
				return resolve(element);
			new MutationObserver((mutations, observer) => {
				if (!mutations.find(({ addedNodes }) => addedNodes.length > 0)) return;
				element = document.querySelector(selector);
				element && (resolve(element),
				observer.disconnect())
			}).observe(document.body, {
				childList: true,
				subtree: true
			});
			limit && setTimeout(reject, limit, new Error('Operation timed out'))
		})
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

function m(t, e) {
	for (var i in e)
		try {
			t[i] = e[i].constructor == Object ? m(t[i], e[i]) : e[i]
		} catch (s) {
			t[i] = e[i]
		}
	return t
}