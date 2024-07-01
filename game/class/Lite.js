import ContextMenu from "./ContextMenu.js";

window.lite = new class {
	#customStyleSheet = null;
	currentTrackData = null;
	debug = false;
	dialogs = new Map();
	nativeEvents = new Map();
	playlists = new Map()
	snapshots = new class extends Array {
		push(...args) {
			if (this.length >= parseInt(lite.storage.get('snapshots')))
				this.splice(0, this.length - parseInt(lite.storage.get('snapshots')));
			return super.push(...args);
		}
	}
	storage = new Map();
	styleSheet = new Proxy(Object.defineProperty(new Map(), 'update', {
		value(key, value) {
			let newValue = Object.assign(this.get(key) || {}, value);
			this.set(key, newValue);
			return newValue
		},
		writable: true
	}), {
		get: (...args) => {
			let [target, property, receiver] = args;
			let returnValue = Reflect.get(...args);
			if (typeof returnValue == 'function') {
				switch (property) {
				case 'delete':
					return (...args) => {
						returnValue = returnValue.apply(target, args);
						this._updateCustomStyleSheet(this.styleSheet.entries());
						return returnValue
					}
				case 'set':
				case 'update':
					return (...args) => {
						let [key, value] = args;
						returnValue = returnValue.call(target, key, new Proxy(value, {
							set: (...args) => {
								let returnValue = Reflect.set(...args);
								this._updateCustomStyleSheet(this.styleSheet.entries());
								return returnValue;
							}
						}));
						this._updateCustomStyleSheet(this.styleSheet.entries());
						return returnValue
					}
				default:
					returnValue = returnValue.bind(target)
				}
			}
			return returnValue
		}
	});
	constructor() {
		let searchParams = new URLSearchParams(location.search);
		if (searchParams.has('ajax')) return;
		window.Application && Application.events.subscribe('mainview.loaded', this._childLoad.bind(this));
		window.ModManager && (ModManager.hook(this, { name: 'lite' }),
		ModManager.on('ready', this._load.bind(this)),
		ModManager.on('stateChange', this.refresh.bind(this)));
		this.#createCustomStyleSheet();
		addEventListener('message', ({ data }) => {
			if (!data) return console.warn('data is missing');
			switch (data.action) {
			case 'setStorage':
				this.storage = new Map(Object.entries(data.storage));
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
				this._updateFromSettings(changes);
			}
		}, { passive: true });
		Object.defineProperty(this, 'currentTrackData', { enumerable: false });
		Object.defineProperty(this, 'dialogs', { enumerable: false });
		Object.defineProperty(this, 'nativeEvents', { enumerable: false })
	}

	get scene() {
		return GameManager.game && GameManager.game.currentScene
	}

	#createCustomStyleSheet() {
		this.#customStyleSheet = document.head.appendChild(document.createElement('style'));
		this.#customStyleSheet.setAttribute('id', 'frhd-lite.style');
	}

	_appendRecords() {
		let record = []
		  , bikeFrameColor = this.storage.get('bikeFrameColor')
		  , bikeTireColor = this.storage.get('bikeTireColor');
		null !== bikeFrameColor && record.push('bikeFrameColor', bikeFrameColor);
		null !== bikeTireColor && record.push('bikeTireColor', bikeTireColor);
		return record.length > 0 && { 'lite': record } || null
	}

	_childLoad() {
		this.attachContextMenu();
		location.pathname.match(/^\/notifications\/?/i) && this.modifyCommentNotifications();
		this.storage.get('accountManager') && this.initAccountManager();
		location.pathname.match(/^\/t\//i) && GameSettings.track && (Application.events.publish("game.prerollAdStopped"),
		this.cacheTrackData(),
		this.storage.get('achievementMonitor') && this.initAchievementsDisplay(),
		this.initBestDate(),
		this.initDownloadGhosts(),
		this.initGhostMetadata(),
		this.initReportTracks(),
		location.search.includes('c_id=') && this.initJumpToComment(),
		Application.settings.user.u_id === GameSettings.track.u_id && this.initDownloadTracks(),
		this.storage.get('featuredGhostsDisplay') && this.initFeaturedGhosts(),
		this.initGhostPlayer(),
		this.storage.get('uploadGhosts') && this.initUploadGhosts());
		location.pathname.match(/^\/u\//i) && (Application.router.current_view.username === Application.settings.user.u_name ? (this.storage.get('playlists') && this.initPlayLater(),
		this.initUserTrackAnalytics()) : this.initFriendsLastPlayed(),
		Application.settings.user.moderator && (this.initUserModeration(),
		this.initUserTrackModeration()));
		location.pathname.match(/^\/account\/settings\/?/i) && this.initRequestTrackData()
	}

	_load(game) {
		game.on('baseVehicleCreate', baseVehicle => this._updateBaseVehicle(baseVehicle)),
		game.on('cameraFocus', playerFocus => {
			this.replayGui && (this.replayGui.style.setProperty('display', this.scene.camera.focusIndex !== 0 ? 'block' : 'none'),
			this.scene.camera.focusIndex !== 0 && (playerFocus = this.scene.races.find(({ user }) => user.u_id == playerFocus._user.u_id)) && (this.replayGui.progress.max = playerFocus.race.run_ticks ?? 100))
		}),
		game.on('draw', this.draw.bind(this)),
		game.on('replayTick', ticks => this.replayGui && (this.replayGui.progress.value = ticks)),
		game.on('trackChallengeUpdate', races => {
			let challengeLeaderboard = this.fetchChallengeLeaderboard({ createIfNotExists: true });
			challengeLeaderboard.replaceChildren(...races.map((data, index) => {
				let row = this.constructor.fetchRaceRow(data, { parent: challengeLeaderboard, placement: 1 + index });
				let num = row.querySelector('.num');
				num.innerText = (1 + index) + '.';
				let actionRow = row.querySelector('.track-leaderboard-action');
				actionRow.querySelector('span.btn.new-button.button-type-1') || actionRow.appendChild(this.constructor.createElement('span.btn.new-button.button-type-1', {
					innerText: 'X',
					title: 'Remove Race',
					style: {
						aspectRatio: 1,
						backgroundImage: 'linear-gradient(#ee5f5b,#c43c35)',
						fontSize: '12px',
						height: '24px',
						lineHeight: '2em',
						marginRight: '6px',
						textAlign: 'center'
					},
					onclick() {
						let row = this.closest('.track-leaderboard-race-row');
						lite.scene.removeRaces([row.dataset.u_id]);
					}
				}));
				return row
			}));
			challengeLeaderboard.children.length < 1 && challengeLeaderboard.closest('.track-leaderboard').style.setProperty('display', 'none');
			let tasRaces = races.filter(({ race }) => race.code.tas);
			tasRaces.length > 0 && this.updateTASLeaderboard(tasRaces);
		}),
		game.on('trackRaceCreate', data => {
			GameSettings.raceData ||= [];
			GameSettings.raceData.push(data),
			GameSettings.raceUids.push(data.user.u_id)
		});
		game.on('trackRaceDelete', data => {
			GameSettings.raceData && (GameSettings.raceData.splice(GameSettings.raceData.indexOf(data), 1),
			GameSettings.raceData.length < 1 && (GameSettings.raceData = !1)),
			GameSettings.raceUids.splice(GameSettings.raceUids.indexOf(data.user.u_id), 1)
		});
		this.snapshots.splice(0, this.snapshots.length),
		this._updateFromSettings(this.storage);
		for (let player of game.currentScene.playerManager._players)
			player._baseVehicle && this._updateBaseVehicle(player._baseVehicle)
	}

	_updateCustomStyleSheet(data) {
		const entries = Array.from(data);
		const filteredEntries = entries.filter(([_,value]) => Object.values(value).length);
		let textContent = '';
		for (let [key, properties] of filteredEntries) {
			properties = Object.entries(properties);
			for (let property of properties)
				property[0] = property[0].replace(/([A-Z])/g, c => '-' + c.toLowerCase());
			textContent += key + '{' + properties.map(property => property.join(':')).join(';') + '}';
		}
		this.#customStyleSheet.textContent = textContent;
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
				firstPlayer._baseVehicle.color = value,
				firstPlayer._tempVehicle && (firstPlayer._tempVehicle.color = firstPlayer);
				break;
			case 'bikeTireColor':
				var baseVehicle = this.scene.playerManager.firstPlayer._baseVehicle;
				baseVehicle && (baseVehicle.frontWheel.color = value,
				baseVehicle.rearWheel.color = value);
				break;
			case 'brightness':
				this.styleSheet.set('#game-container', Object.assign({}, this.styleSheet.get('#game-container'), {
					filter: 'brightness(' + value / 100 + ')'
				}));
				break;
			case 'keymap':
				this.scene.playerManager.firstPlayer._gamepad.setKeyMap(GameManager.scene !== 'Editor' ? GameSettings.playHotkeys : GameSettings.editorHotkeys);
				break;
			case 'theme':
				let backgroundColor = '#'.padEnd(7, value == 'midnight' ? '1d2328' : value == 'darker' ? '0' : value == 'dark' ? '1b' : 'f');
				this.styleSheet.set('#game-container > canvas', Object.assign({}, this.styleSheet.get('#game-container > canvas'), { backgroundColor }));
				this.styleSheet.set('.gameFocusOverlay', {
					backgroundColor: getComputedStyle(GameManager.game.canvas).backgroundColor.replace(/[,]/g, '').replace(/(?=\))/, '/90%'),
					color: '#'.padEnd(7, value == 'midnight' ? 'd' : value == 'dark' ? 'f' : value == 'dark' ? 'eb' : '2d')
				});
				this.scene.message.color = '#'.padEnd(7, /^(dark(er)?|midnight)$/i.test(value) ? 'c' : '3');
				this.scene.message.outline = backgroundColor;
				let gray = '#'.padEnd(7, /^(dark(er)?|midnight)$/i.test(value) ? '6' : '9');
				this.scene.score.best_time.color = gray;
				this.scene.score.best_time_title.color = gray;
				let color = '#'.padEnd(7, value == 'midnight' ? 'd' : /^dark(er)?$/i.test(value) ? 'f' : '0');
				this.scene.score.goals.color = color;
				this.scene.score.time.color = color;
				this.scene.score.time_title.color = gray;
				if (this.scene.hasOwnProperty('campaignScore')) {
					this.scene.campaignScore.container.children.forEach(medal => {
						medal.children.forEach(element => {
							element.color = color
						})
					});
				}

				if (this.scene.hasOwnProperty('raceTimes')) {
					this.scene.raceTimes.container.color = color;
					this.scene.raceTimes.raceList.forEach(race => {
						race.children.forEach(element => {
							element.color = color
						})
					});
				}

				GameSettings.physicsLineColor = '#'.padEnd(7, value == 'midnight' ? 'c' : value == 'darker' ? 'f' : value == 'dark' ? 'fd' : '0');
				GameSettings.sceneryLineColor = '#'.padEnd(7, value == 'midnight' ? '5' : value == 'darker' ? '121319' : value == 'dark' ? '6' : 'a');
				this.scene.toolHandler.options.gridMinorLineColor = '#'.padEnd(7, value == 'midnight' ? '20282e' : value == 'dark' ? '25' : 'e');
				this.scene.toolHandler.options.gridMajorLineColor = '#'.padEnd(7, value == 'midnight' ? '161b20' : value == 'dark' ? '3e' : 'c');
				this.scene.track.powerups.forEach(p => p.outline = GameSettings.physicsLineColor);
			case 'isometricGrid':
				redraw = true
			}
		}

		childLoad && this._childLoad(),
		redraw && this.scene.redraw(),
		this.refresh()
	}

	_updateBaseVehicle(baseVehicle) {
		if (!baseVehicle) return;
		let frameColor, tireColor;
		if (baseVehicle.player !== this.scene.playerManager.firstPlayer) {
			let playback = baseVehicle.player._gamepad.playback;
			if (!playback || !playback.hasOwnProperty('lite')) return;
			playback.lite.has('bikeFrameColor') && (frameColor = playback.lite.get('bikeFrameColor')),
			playback.lite.has('bikeTireColor') && (tireColor = playback.lite.get('bikeTireColor'));
		} else
			frameColor = this.storage.get('bikeFrameColor'),
			tireColor = this.storage.get('bikeTireColor');
		let colorMatch = /^#([a-f0-9]{3}){1,2}$/i;
		colorMatch.test(frameColor) && (baseVehicle.color = frameColor),
		colorMatch.test(tireColor) && (baseVehicle.frontWheel.color = tireColor,
		baseVehicle.rearWheel.color = tireColor)
	}

	attachContextMenu() {
		if (!this._oncontextmenu) {
			Object.defineProperty(this, '_oncontextmenu', {
				value: async event => {
					this.currentTrackData === null && this.cacheTrackData();
					// track-list-tile
					let race = event.target.closest('.track-leaderboard-race-row');
					if (null !== race) {
						event.preventDefault();
						if (event.target.closest('.name')) {
							ContextMenu.create(await this.buildUserContextMenu(race.dataset), event);
							return;
						}

						const options = [{
							name: 'Race',
							click: () => Application.Helpers.AjaxHelper.post('track_api/load_races', {
								t_id: this.currentTrackData.t_id,
								u_ids: race.dataset.u_id
							}).then(r => r.result && this.scene.addRaces(r.data))
						}, {
							name: 'Copy Race Data', // 'Request Race Data',
							click: () => Application.Helpers.AjaxHelper.post('track_api/load_races', {
								t_id: this.currentTrackData.t_id,
								u_ids: race.dataset.u_id
							}).then(r => r.result && navigator.clipboard.writeText(JSON.stringify(r.data, '\t', 4)).catch(err => alert(err.message)))
						}, {
							name: race.dataset.legitimacy || 'Test Legitimacy',
							styles: race.dataset.legitimacy && ['disabled'],
							click: () => Application.Helpers.AjaxHelper.post('track_api/load_races', {
								t_id: this.currentTrackData.t_id,
								u_ids: race.dataset.u_id
							}).then(({ data, result: r }) => {
								if (!r) return alert('Race not found.');
								let [entry] = this.scene.formatRaces(data);
								let isTas = !this.constructor.verifyRaceData(entry);
								race.dataset.legitimacy = isTas ? 'Illegitimate (TAS)' : 'Legit';
								isTas && this.updateTASLeaderboard([entry]);
							})
						}, Application.settings.user.u_id == race.dataset.u_id ? {
							name: 'Request Deletion',
							styles: ['danger', 'disabled']
						} : {
							name: 'Report',
							styles: ['danger', race.dataset.reported && 'disabled'],
							click: () => this.constructor.report('Race \'{data-u_id}\' by @{data-d_name}', race.dataset, { type: 'race' }).then(() => {
								race.dataset.reported = true
							})
						}];
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
							click: () => this.constructor.downloadRace(this.currentTrackData.t_id, race.dataset.u_id)
						});
						if (Application.settings.user.moderator) {
							let targetUser = await this.constructor.fetchUser(race.dataset.d_name);
							options.splice(options.length - 1, 0, {
								name: 'Feature',
								click: () =>  navigator.clipboard.writeText('"frhd.co/t/' + this.currentTrackData.t_id + '/r/' + race.dataset.d_name.toLowerCase() + '": ""').then(() => {
									window.open('https://github.com/Calculamatrise/frhd-featured-ghosts/edit/master/data.json', 'blank')
								})
							}, {
								name: 'Delete',
								styles: ['danger'],
								click: () => Application.Helpers.AjaxHelper.post('moderator/remove_race', {
									t_id: this.currentTrackData.t_id,
									u_id: race.dataset.u_id
								}).then(r => r.result && (race.remove(),
								Application.router.current_view.refresh_leaderboard())).fail(err => alert('Something went wrong! ' + err.message))
							}, {
								name: 'Delete & Ban', // only show if mod
								styles: ['danger', targetUser.user.banned && 'disabled'],
								click: () => Application.Helpers.AjaxHelper.post('moderator/remove_race', {
									t_id: this.currentTrackData.t_id,
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
								t_id: this.currentTrackData.t_id,
								u_ids: Array.from(leaderboard.querySelectorAll('.track-leaderboard-race-row')).map(row => row.dataset.u_id).join(',')
							}).then(r => r.result && this.scene.addRaces(r.data))
						}];
						Application.settings.user.moderator && options.splice(options.length, 0, {
							name: 'Delete All',
							styles: ['danger', 'disabled'],
							click: () => confirm('Are you sure you want to delete ALL races on this leaderboard? This cannot be undone.') && Promise.all(Array.from(leaderboard.querySelectorAll('.track-leaderboard-race-row')).map(row => {
								return Application.Helpers.AjaxHelper.post('moderator/remove_race', {
									t_id: this.currentTrackData.t_id,
									u_id: row.dataset.u_id
								})
							}))
						})
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
							click: () => Application.router.current_view._delete_comment(this.currentTrackData.t_id, comment.dataset.c_id, r => r.result && comment.remove())
						} : {
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
							const options = await this.buildUserContextMenu(this.currentTrackData.author);
							let subscribe = document.querySelector('#subscribe_to_author');
							Application.settings.user.u_id != this.currentTrackData.author_id && options.splice(3, 0, {
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
						}];
						let playlist = this.fetchAndCachePlaylists('playlater');
						let savedToPlaylater = playlist && playlist.has(this.currentTrackData.t_id);
						let showPlaylistButton = savedToPlaylater || this.storage.get('playlists');
						if (showPlaylistButton) {
						// if (this.storage.get('playlists')) {
							// let playlist = this.fetchAndCachePlaylists('playlater');
							// let savedToPlaylater = playlist && playlist.has(this.currentTrackData.t_id);
							// let showPlaylistButton = savedToPlaylater || this.storage.get('playlists');
							showPlaylistButton && options.splice(2, 0, {
								name: (savedToPlaylater ? 'Remove from' : 'Add to') + ' Playlist',
								styles: [savedToPlaylater && 'danger', savedToPlaylater && !this.storage.get('playlists') && 'disabled'],
								click: () => Application.Helpers.AjaxHelper.get('t/' + this.currentTrackData.t_id).then(({ track, user_track_stats }) => {
									const playlist = this.fetchAndCachePlaylists('playlater');
									playlist[savedToPlaylater ? 'delete' : 'set'](this.currentTrackData.t_id, {
										author: track.author,
										averageTime: user_track_stats.avg_time,
										featured: track.featured,
										id: this.currentTrackData.t_id,
										img: track.img,
										slug: track.slug,
										title: track.title
									});
									playlist.size > 0 ? localStorage.setItem('frhd-lite.playlists.playlater', JSON.stringify(Array.from(playlist.values()))) : localStorage.removeItem('frhd-lite.playlists.playlater');
								})
							});
						}
						Application.settings.user.u_id == this.currentTrackData.author_id ? (options.push({
							name: 'Download',
							click: () => this.constructor.downloadTrack(this.currentTrackData.t_id)
						}, {
							name: 'Request Deletion',
							styles: ['danger', 'disabled']
						}, { type: 'hr' }, {
							name: 'Download All',
							click: () => this.constructor.downloadAllTracks(Application.settings.user.u_name)
						})) : options.push({
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
							click: () => Application.Helpers.AjaxHelper.post('track_api/feature_track/' + this.currentTrackData.t_id + '/' + (1 - GameSettings.track.featured)).then(r => {
								r.result && (this.currentTrackData.featured = !this.currentTrackData.featured,
								GameSettings.track.featured = this.currentTrackData.featured)
							})
						}, {
							name: (this.currentTrackData.hide ? 'Unh' : 'H') + 'ide', // unhide if hidden
							styles: ['danger'],
							click: () => Application.Helpers.AjaxHelper.get('moderator/hide_track/' + this.currentTrackData.t_id).then(r => {
								r.result && (this.currentTrackData.hide = 1 - this.currentTrackData.hide,
								GameSettings.track.hide = this.currentTrackData.hide)
							})
						});
						Application.settings.user.admin && options.push({ type: 'hr' }, {
							name: 'Remove Track of the Day',
							styles: ['danger'],
							click: () => Application.Helpers.AjaxHelper.post('admin/removeTrackOfTheDay', {
								t_id: this.currentTrackData.t_id
							})
						}, {
							name: (this.currentTrackData.hide ? 'Unh' : 'H') + 'ide', // unhide if hidden
							styles: ['danger'],
							click: () => Application.Helpers.AjaxHelper.post('admin/' + (this.currentTrackData.hide ? 'un' : '') + 'hide_track', { track_id: this.currentTrackData.t_id }).then(r => {
								r.result && (this.currentTrackData.hide = 1 - this.currentTrackData.hide,
								GameSettings.track.hide = this.currentTrackData.hide)
							})
						}, {
							name: 'Set Uploading Ban',
							styles: ['danger'],
							click: () => Application.Helpers.AjaxHelper.post('admin/user_ban_uploading', {
								uploading_ban_uname: this.currentTrackData.author.u_name
							})
						});
						this.storage.get('developerMode') && options.push({ type: 'hr' }, {
							name: 'Copy Track Id',
							click: () => navigator.clipboard.writeText(this.currentTrackData.t_id)
						});
						ContextMenu.create(options, event);
						return;
					}
				},
				writable: true
			});
			this.styleSheet.set('context-menu', {
				backgroundColor: 'hsl(200deg 15% 15%)',
				border: '1px solid hsl(200deg 25% 25% / 50%)',
				borderRadius: '.25rem',
				boxShadow: '2px 2px 4px -1px hsl(0deg 0% 10% / 75%)',
				display: 'flex',
				flexDirection: 'column',
				fontSize: 'clamp(9px, .75rem, 13px)',
				maxHeight: '50vh',
				overflow: 'hidden auto',
				padding: '.275em',
				position: 'absolute',
				zIndex: 1002
			});
			this.styleSheet.set('context-menu button', {
				backgroundColor: 'transparent',
				border: 'none',
				borderRadius: '0.25em',
				color: 'white',
				padding: '0.5em 1em',
				textAlign: 'left'
			});
			this.styleSheet.set('context-menu button:hover', { backdropFilter: 'brightness(0.725)' });
			this.styleSheet.set('context-menu hr', {
				backgroundColor: 'hsl(200deg 20% 25% / 60%)',
				border: 'none',
				height: '1px',
				width: '90%'
			});
			this.styleSheet.set('button.danger', { color: 'hsl(0deg, 75%, 55%)' });
			this.styleSheet.set('button.danger:disabled', { color: 'hsl(0deg 75% 55% / 50%)' });
			this.styleSheet.set('context-menu::-webkit-scrollbar', { width: '.5em' });
			this.styleSheet.set('context-menu::-webkit-scrollbar, context-menu::-webkit-scrollbar-track', { backgroundColor: 'hsl(0deg 0% 0% / 4%)' });
			this.styleSheet.set('context-menu::-webkit-scrollbar-thumb', { backgroundColor: 'hsl(200deg 25% 20% / 50%)' });
		}
		document.removeEventListener('contextmenu', this._oncontextmenu);
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
			click: () => navigator.clipboard.writeText(comment.dataset.d_name)
		}];
		if (!isCurrentUser) {
			let currentUser = await this.constructor.fetchCurrentUser();
			let isFriend = currentUser.friends.friends_data.find(this.constructor.compareUsers.bind(this, data));
			let request = currentUser.friend_requests.request_data.find(this.constructor.compareUsers.bind(this, data));
			options.splice(2, 0, {
				name: (isFriend ? 'Remove' : 'Add') + ' Friend', // accept, deny, remove, send/add
				styles: [isFriend && 'danger', !isFriend && currentUser.friends.friend_cnt >= 30 && 'disabled'],
				click: () => Application.Helpers.AjaxHelper.post('friends/' + (isFriend ? 'remove_friend' : 'send_friend_request'), { u_name: data.d_name })
			}, {
				name: 'Report',
				styles: ['danger'],
				click: () => this.constructor.report('User @{data-d_name} ({data-u_id})', data, { type: 'user' })
			});
			request && options.splice(3, 0, {
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
					username: username,
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
		this.currentTrackData = Object.keys(combined).length > 0 ? Object.assign(combined, {
			author: {
				d_name: combined.author,
				u_id: parseInt(combined.author_id || combined.u_id),
				u_name: combined.u_url || combined.author.toLowerCase()
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
			leaderboard.setAttribute('id', 'frhd-lite.tas-leaderboard');
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
			const entries = localStorage.getItem('frhd-lite.playlists.' + key);
			if (null === entries) continue;
			const playlist = this.playlists.get(key);
			for (const entry of JSON.parse(entries)) {
				playlist.set(String(parseInt(entry.id)), entry);
			}
		}
		return name ? this.playlists.get(name) || null : this.playlists
	}

	refresh() {
		let keymap = this.storage.get('keymap');
		for (let key in keymap)
			this.scene.playerManager.firstPlayer._gamepad.keymap[key.charCodeAt()] = keymap[key];
	}

	updateTASLeaderboard(races) {
		let leaderboard = this.fetchTASLeaderboard({ createIfNotExists: true });
		for (let data of races) {
			let row = leaderboard.appendChild(this.constructor.fetchRaceRow(data, { parent: leaderboard, placement: 1 + races.indexOf(data) }))
			let num = row.querySelector('.num');
			num.innerText = (1 + races.indexOf(data)) + '.';
			let stats = Object.fromEntries(Object.keys(data.race.code.tas).slice(1).map(value => value.split(/:\s*/).map(value => isFinite(value) ? parseFloat(value) : value.replace(/\s+/g, '_'))));
			let time = row.querySelector(':nth-child(4)');
			time.innerText = this.constructor.formatRaceTime(stats.run_ticks / GameSettings.drawFPS * 1e3);
			let actionRow = row.querySelector('.track-leaderboard-action');
			actionRow.querySelector('span.core_icons.core_icons-btn_add_race.track-leaderboard-race') || actionRow.appendChild(this.constructor.createElement('span.core_icons.core_icons-btn_add_race.track-leaderboard-race', {
				title: 'Race ' + data.user.d_name,
				onclick() {
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
		let { downButtons } = this.scene.playerManager.getPlayerByIndex(this.scene.camera.focusIndex)._gamepad;
		let size = parseInt(this.storage.get('inputDisplaySize')) + 3;
		let offset = {
			x: size,
			y: ctx.canvas.height - size * 10
		}

		ctx.save();
		ctx.fillStyle = GameSettings.physicsLineColor;
		ctx.globalAlpha = this.storage.get('inputDisplayOpacity');
		// ctx.globalCompositeOperation = 'xor'; // rect stroke/fill overlap
		ctx.lineWidth = size / 2;
		ctx.strokeStyle = GameSettings.physicsLineColor;

		let borderRadius = size / 2;
		let buttonSize = size * 4;

		ctx.beginPath();
		ctx.roundRect(offset.x, offset.y, buttonSize, buttonSize, borderRadius);
		downButtons.z && ctx.fill();
		ctx.stroke();
		ctx.beginPath();
		ctx.roundRect(offset.x + 5 * size, offset.y, buttonSize, buttonSize, borderRadius);
		downButtons.up && ctx.fill();
		ctx.stroke();
		ctx.beginPath();
		ctx.roundRect(offset.x, offset.y + 5 * size, buttonSize, buttonSize, borderRadius);
		downButtons.left && ctx.fill();
		ctx.stroke();
		ctx.beginPath();
		ctx.roundRect(offset.x + 5 * size, offset.y + 5 * size, buttonSize, buttonSize, borderRadius);
		downButtons.down && ctx.fill();
		ctx.stroke();
		ctx.beginPath();
		ctx.roundRect(offset.x + 10 * size, offset.y + 5 * size, buttonSize, buttonSize, borderRadius);
		downButtons.right && ctx.fill();
		ctx.stroke();

		ctx.globalCompositeOperation = 'xor'; // destination-out
		ctx.lineWidth = size / 3;
		ctx.beginPath();
		ctx.moveTo(offset.x + 2.7 * size, offset.y + 3 * size);
		ctx.lineTo(offset.x + 1.2 * size, offset.y + 3 * size);
		ctx.lineTo(offset.x + 2.7 * size, offset.y + 1 * size);
		ctx.lineTo(offset.x + 1.2 * size, offset.y + 1 * size);
		ctx.moveTo(offset.x + 6.2 * size, offset.y + 2.7 * size);
		ctx.lineTo(offset.x + 7 * size, offset.y + 1.2 * size);
		ctx.lineTo(offset.x + 7.8 * size, offset.y + 2.7 * size);
		ctx.moveTo(offset.x + 2.5 * size, offset.y + 7.8 * size);
		ctx.lineTo(offset.x + 1.2 * size, offset.y + 7 * size);
		ctx.lineTo(offset.x + 2.5 * size, offset.y + 6.2 * size);
		ctx.moveTo(offset.x + 6.2 * size, offset.y + 6.2 * size);
		ctx.lineTo(offset.x + 7 * size, offset.y + 7.8 * size);
		ctx.lineTo(offset.x + 7.8 * size, offset.y + 6.2 * size);
		ctx.moveTo(offset.x + 11.5 * size, offset.y + 7.8 * size);
		ctx.lineTo(offset.x + 12.8 * size, offset.y + 7 * size);
		ctx.lineTo(offset.x + 11.5 * size, offset.y + 6.2 * size);
		ctx.stroke();
		ctx.restore();
	}

	initAccountManager() {
		if (!Application.User.logged_in) return;
		let logout = Application.router.left_navigation_view.el.querySelector('a.logout');
		if (!logout.hasAttribute('id')) return;
		logout.removeAttribute('id');
		logout.innerText = "Switch";
		logout.addEventListener('click', event => {
			event.stopPropagation();
			event.stopImmediatePropagation();
			this.accountManager || (Object.defineProperty(this, 'accountManager', {
				value: this.constructor.createElement("dialog#frhd-lite\\.account-manager", {
					children: [
						this.constructor.createElement("span.core_icons.core_icons-icon_close.signup-login-modal-close", {
							style: {
								position: 'absolute',
								right: '.5em',
								top: '.5em'
							},
							onclick: () => this.accountManager.close()
						}),
						this.constructor.createElement("div.accounts-container", {
							children: (JSON.parse(localStorage.getItem("frhd-lite.account-manager")) ?? []).map(account => this.constructor.createAccountContainer(account)),
							style: {
								display: 'flex',
								flexDirection: 'column',
								gap: '0.4rem'
							}
						}),
						this.constructor.createElement("button.new-button.button-type-2", {
							innerText: "Add account",
							onclick: event => {
								let loginContainer = document.querySelector("div#login-container");
								if (loginContainer) {
									event.target.innerText = "Add account";
									event.target.classList.replace('button-type-3', 'button-type-2');
									loginContainer.remove();
									return;
								}
	
								let submit = event.target;
								event.target.before(lite.constructor.createElement("div#login-container", {
									children: [
										this.constructor.createElement("input.field.auth-field#save-account-login", {
											placeholder: "Username or Email",
											style: { borderRadius: "2rem" },
											type: "text",
											onkeyup(event) {
												event.key === 'Enter' && this.nextElementSibling.focus()
											}
										}),
										this.constructor.createElement("input.field.auth-field#save-account-password", {
											placeholder: "Password",
											style: { borderRadius: "2rem" },
											type: "password",
											onkeyup(event) {
												event.key === 'Enter' && this.nextElementSibling.click()
											}
										}),
										this.constructor.createElement("button.new-button.button-type-1", {
											innerText: "Save account",
											onclick: event => {
												Application.Helpers.AjaxHelper.post("/auth/standard_login", {
													login: document.querySelector("#save-account-login")?.value,
													password: document.querySelector("#save-account-password")?.value
												}).done(res => {
													if (!res.result) return;
													let accounts = JSON.parse(localStorage.getItem("frhd-lite.account-manager")) || [];
													if (accounts.find(({ login }) => login === res.data.user.d_name)) return;
													accounts.push({
														login: res.data.user.d_name,
														password: document.querySelector("#save-account-password")?.value
													});
													this.accountManager.querySelector(".accounts-container").append(lite.constructor.createAccountContainer(accounts[accounts.length - 1]));
													localStorage.setItem("frhd-lite.account-manager", JSON.stringify(accounts));
													submit.innerText = "Add account";
													submit.classList.replace('button-type-3', 'button-type-2');
													event.target.parentElement.remove();
												})
											}
										})
									],
									style: {
										display: 'flex',
										flexDirection: 'column',
										gap: '0.4rem',
										marginTop: '1rem'
									}
								}));
								event.target.classList.replace('button-type-2', 'button-type-3');
								event.target.innerText = "Cancel";
							}
						}),
						this.constructor.createElement("button.new-button.button-type-3", {
							innerText: "Logout",
							onclick: () => {
								Application.Helpers.AjaxHelper.post('/auth/logout').done(({ result: r }) => {
									if (!r) return;
									Application.User.logged_in = !1,
									Application.User.clear(),
									Application.events.publish('user.change'),
									Application.events.unsubscribe('user.change');
									Application.events.publish("user.logout");
									Application.User.unset_game_settings_user();
									this.remove()
								})
							}
						})
					],
					onclick: event => {
						if (this.accountManager !== event.target) return;
						let rect = event.target.getBoundingClientRect()
						  , isInDialog = (rect.top <= event.clientY && event.clientY <= rect.top + rect.height &&
							rect.left <= event.clientX && event.clientX <= rect.left + rect.width);
						!isInDialog && event.target.close()
					}
				}),
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
			document.body.append(this.accountManager);
			this.accountManager.showModal()
		}, { passive: true })
	}

	initAchievementsDisplay() {
		this.nativeEvents.has('notificationEvent') || this.initNotificationEvent();
		!this.achievementMonitor && (Application.events.subscribe('notification.received', ({ data }) => {
			if ('undefined' != typeof data && ('undefined' != typeof data.achievements_earned)) {
				'undefined' != typeof data.achievements_earned && Application.events.publish('achievementsEarned', data.achievements_earned);
				this.refreshAchievements() // only update percentages // this.updateAchievements?
			}
		}),
		Object.defineProperty(this, 'achievementMonitor', { value: {
			container: this.constructor.createElement('div#achievements-container', {
				style: {
					display: 'flex',
					flexDirection: 'column',
					fontFamily: 'riffic',
					gap: '0.4rem'
				}
			})
		}, writable: true }),
		this.achievementMonitor.wrapper = this.constructor.createElement('div#frhd-lite\\.achievement-monitor', {
			children: [
				this.constructor.createElement('a', {
					children: [
						this.constructor.createElement('span', {
							innerText: 'Daily Achievements',
							style: { float: 'left' }
						}),
						this.achievementMonitor.countdown = this.constructor.createElement('span.time-remaining', {
							innerText: '00:00:00',
							style: { float: 'right' }
						})
					],
					href: '/achievements',
					style: {
						borderBottom: '1px solid hsl(190deg 25% 60%)',
						color: 'black',
						fontFamily: 'helsinki',
						paddingBottom: '5px'
					}
				}),
				this.achievementMonitor.container
			],
			style: {
				backgroundColor: 'hsl(190 25% 95% / 1)',
				// backgroundImage: 'linear-gradient(transparent, hsl(191 25% 90% / 1))',
				border: '1px solid hsl(190deg 25% 60%)',
				borderRadius: '1rem',
				display: 'flex',
				flexDirection: 'column',
				gap: '0.6rem',
				margin: '0 0.6rem',
				padding: '1.5rem',
				width: '-webkit-fill-available'
			}
		}));
		this.refreshAchievements().then(r => {
			this.achievementMonitor.countdown.innerText = [String(Math.floor(r.time_left / 3600)).padStart(2, '0'), String(Math.floor((r.time_left % 3600) / 60)).padStart(2, '0'), String(Math.floor(r.time_left % 60)).padStart(2, '0')].join(':');
			this.achievementMonitor.countdownTimer ||= setInterval(() => {
				let lastTime = this.achievementMonitor.countdown.innerText.split(':').map(e => parseInt(e));
				lastTime[2] === 0 && (lastTime[1] === 0 && (lastTime[0]--,
				lastTime[1] = 59),
				lastTime[1]--,
				lastTime[2] = 59);
				lastTime[2]--;
				lastTime.reduce((sum, remainingTime) => sum += remainingTime, 0) === 0 && clearInterval(this.achievementMonitor.countdownTimer);
				this.achievementMonitor.countdown.innerText = lastTime.map(e => String(e).padStart(2, '0')).join(':');
			}, 1e3);
			const rightContent = document.querySelector('#right_content');
			rightContent.prepend(this.achievementMonitor.wrapper)
		})
	}

	initBestDate() {
		this.nativeEvents.has('leaderboardEvent') || this.initLeaderboardEvent();
		Application.router.current_view.on('leaderboard.rendered', () => {
			document.querySelectorAll(`.track-leaderboard-race-row[data-u_id="${Application.settings.user.u_id}"]`).forEach(race => {
				race.setAttribute('title', 'Loading...');
				race.addEventListener('pointerover', () => this.constructor.fetchRaceBestDate().then(date => race.setAttribute('title', date)), { once: true, passive: true })
			})
		})
	}

	initDownloadGhosts() {
		this.nativeEvents.has('leaderboardEvent') || this.initLeaderboardEvent();
		this.styleSheet.set('.track-page .track-leaderboard .track-leaderboard-action', { textAlign: 'right' });
		this.styleSheet.set('.track-page .track-leaderboard .track-leaderboard-action > :is(span.core_icons, div.moderator-remove-race)', { right: '6px' });
		Application.router.current_view.on('leaderboard.rendered', () => {
			for (let actionRow of document.querySelectorAll('.track-leaderboard-race-row[data-u_id="' + Application.settings.user.u_id + '"] > .track-leaderboard-action:not(:has(> #frhd-lite\\.download-race))')) {
				let download = this.constructor.createElement('span.btn.new-button.button-type-1#frhd-lite\\.download-race', {
					innerText: '⭳',
					title: 'Download Race',
					style: {
						aspectRatio: 1,
						fontSize: '15px',
						height: '22px',
						lineHeight: '1.5em',
						marginRight: '8px',
						textAlign: 'center'
					}
				});
				download.addEventListener('click', () => this.constructor.downloadRace(GameSettings.track.id, download.parentElement.parentElement.dataset.u_id), { passive: true });
				actionRow.style.setProperty('width', '20%');
				actionRow.prepend(download);
				actionRow.textContent.length > 0 && actionRow.replaceChildren(...actionRow.children)
			}
		})
	}

	initDownloadTracks() {
		let subscribeToAuthor = document.querySelector('.subscribe-to-author');
		let downloadTrack = document.querySelector('#frhd-lite\\.download-track');
		if (!downloadTrack) {
			downloadTrack = subscribeToAuthor.cloneNode(true);
			let subscriberCount = downloadTrack.querySelector('#subscribe_to_author_count');
			subscriberCount && subscriberCount.remove();
			let download = downloadTrack.querySelector('#subscribe_to_author');
			download.setAttribute('id', 'frhd-lite.download-track'); // check if it exists first
			download.innerText = 'Download';
			download.addEventListener('click', () => this.constructor.downloadTrack(GameSettings.track.id), { passive: true });
			subscribeToAuthor.after(downloadTrack);
		}
	}

	initFeaturedGhosts() {
		this.nativeEvents.has('leaderboardEvent') || this.initLeaderboardEvent();
		Application.router.current_view.on('leaderboard.rendered', async () => {
			const matches = Object.fromEntries(Object.entries(await this.constructor.fetchFeaturedGhosts()).filter(e => Object.keys(e[1] = Object.fromEntries(Object.entries(e[1]).filter(([t]) => parseInt(t.split('/t/')[1]) == Application.router.current_view._get_track_id()))).length));
			for (const player in matches) {
				for (const ghost in matches[player]) {
					let name = ghost.split('/r/')[1];
					for (const row of document.querySelectorAll('.track-page .track-leaderboard .track-leaderboard-race-row[data-d_name="' + name + '" i]')) {
						let hue = 10;
						switch(matches[player][ghost]) {
							case 'fast': hue = 180; break;
							case 'vehicle': hue = 40; break;
							case 'trick': hue = 120;
						}

						let num = row.querySelector('.num');
						num.classList.add('core_icons', 'core_icons-icon_featured_badge');
						num.classList.remove('num');
						num.innerText = null;
						num.setAttribute('title', 'Featured');
						row.style.setProperty('background-color', `hsl(${hue}deg 60% 50% / 40%)`);
					}
				}
			}
		});
	}

	initFriendsLastPlayed() {
		fetch(location.pathname + '?ajax').then(r => r.json()).then(({ friends, is_profile_owner }) => {
			is_profile_owner || document.querySelectorAll('.friend-list-item-name').forEach(item => {
				item.after(this.constructor.createElement('div.friend-list-item-date', {
					innerText: "Last Played " + friends.friends_data.find(({ d_name }) => d_name == item.innerText).activity_time_ago
				}))
			})
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
				this.debug && console.log(averageTicks, parseTicks(runTime), 'diff', averageTicks - parseTicks(runTime), 'max diff', max - averageTicks, max - filteredAverageTicks, filteredAverageTicks, calculatedMargin, 'max', max, 'max divided by 100', max / 100, calculatedMargin / max, calculatedMargin * (max / 100), max / calculatedMargin)
				if (averageTicks - parseTicks(runTime) > max - filteredAverageTicks) return true;
				return false
			})) {
				for (let flag of document.querySelectorAll('.track-leaderboard-race-row[data-u_id="' + player.u_id + '"] > .num:not(:has(> #frhd-lite\\.flagged))')) {
					flag.setAttribute('id', 'frhd-lite.flagged');
					flag.setAttribute('title', 'This race has been flagged by frhd-lite under suspicion of misconduct.');
					flag.innerText = '⚠️';
				}
			}
		});
	}

	initGhostPlayer() {
		this.replayGui || Object.defineProperty(this, 'replayGui', {
			value: this.constructor.createElement('div', {
				style: {
					display: 'none',
					inset: 0,
					pointerEvents: 'none',
					position: 'absolute'
				}
			}),
			writable: true
		});
		this.replayGui.progress || Object.defineProperty(this.replayGui, 'progress', {
			value: this.replayGui.appendChild(this.constructor.createElement('progress.frhd-lite\\.race-player-progress#replay-seeker', {
				max: 100,
				min: 0,
				value: 0,
				style: {
					border: 'none',
					bottom: 0,
					height: '4px',
					pointerEvents: 'all',
					position: 'absolute',
					transition: 'height 100ms',
					width: '100%'
				},
				type: 'range',
				onchange(event) {
					GameManager.game.currentScene.state.playing = false;
					let player = GameManager.game.currentScene.playerManager.getPlayerByIndex(GameManager.game.currentScene.camera.focusIndex);
					player.isGhost() && player._replayIterator.next(this.value)
				},
				onpointerdown(event) {
					this.setPointerCapture(event.pointerId);
					this.value = Math.round(event.offsetX / parseInt(getComputedStyle(this).getPropertyValue('width')) * this.max);
					this.dispatchEvent(new InputEvent('change'));
					this.wasPlaying = GameManager.game.currentScene.state.playing
				},
				onpointermove(event) {
					event.buttons & 1 == 1 && (this.value = Math.round(event.offsetX / parseInt(getComputedStyle(this).getPropertyValue('width')) * this.max),
					this.dispatchEvent(new InputEvent('change')));
				},
				onpointerup(event) {
					this.releasePointerCapture(event.pointerId);
					GameManager.game.currentScene.state.playing = this.wasPlaying
				}
			})),
			writable: true
		});
		this.styleSheet.set('.frhd-lite\\.race-player-progress::-webkit-progress-value', {
			backgroundColor: 'hsl(195deg 57% 25%)'
		}).set('.frhd-lite\\.race-player-progress:hover', {
			cursor: 'pointer',
			filter: 'brightness(1.25)',
			height: '6px !important'
		});
		this.constructor.waitForElm('#game-container').then(container => {
			container.appendChild(this.replayGui)
		})
	}

	initJumpToComment() {
		let searchParams = new URLSearchParams(location.search);
		let commentId = searchParams.get('c_id');
		if (!commentId || this.lastLoadedComment == commentId || document.querySelector('.track-comment[data-c_id="' + commentId + '"]')) return;
		Object.defineProperty(this, 'lastLoadedComment', { value: commentId, writable: true });
		if (typeof Application.router.current_view.load_comments_until != 'function') {
			const prototype = Object.getPrototypeOf(Application.router.current_view);
			prototype.load_comments_until = function(cid, callback) {
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
			}, { once: true, passive: true });
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
		}));
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
			console.warn("Request track data failed to load! Personal data is not present.");
		}
	}

	initUploadGhosts() {
		this.dialogs.has('ghostUpload') || this.dialogs.set('ghostUpload', document.body.appendChild(this.constructor.createElement('dialog.editorDialog-content.editorDialog-content_importDialog.frhd-lite\\.dialog', {
			children: [
				this.constructor.createElement('div.editorDialog-titleBar', {
					children: [
						this.constructor.createElement('span.editorDialog-close', {
							innerText: '×',
							onclick: event => event.target.closest('dialog').close('cancel')
						}),
						this.constructor.createElement('h1.editorDialog-content-title', {
							innerText: 'UPLOAD GHOST'
						})
					]
				}),
				this.constructor.createElement('div.importDialog-codeContainer', {
					children: [
						this.constructor.createElement('span.importDialog-placeholder', {
							children: [
								this.constructor.createElement('span', {
									innerText: 'Paste ghost data, drag and drop text files here, or '
								}),
								this.constructor.createElement('span.link', {
									innerText: 'select a file',
									onclick: () => {
										this.ghostUploadPicker.click();
									}
								}),
								this.constructor.createElement('span', {
									innerText: ' to import'
								}),
								this.ghostUploadPicker ||= this.constructor.createElement('input', {
									accept: 'application/json',
									type: 'file',
									style: { display: 'none' },
									oninput: async event => {
										let [file] = event.target.files;
										let race = JSON.parse(await file.text());
										if (race.t_id !== GameSettings.track.id) {
											return;
										} else if (race.u_id !== Application.settings.user.u_id) {
											return;
										}

										delete race['t_id'];
										delete race['u_id'];
										Application.Helpers.AjaxHelper.post("/track_api/track_run_complete", {
											t_id: GameSettings.track.id,
											u_id: Application.User.attributes.u_id,
											code: race.code,
											vehicle: race.vehicle,
											run_ticks: race.run_ticks,
											fps: 25,
											time: (ticks => {
												let t = ticks / 30 * 1e3;
												t = parseInt(t, 10);
												let e = Math.floor(t / 6e4)
												, i = (t - 6e4 * e) / 1e3;
												return i = i.toFixed(2),
													10 > e && (e = e),
													10 > i && (i = "0" + i),
													e + ":" + i
											})(race.run_ticks),
											sig: await (async message => Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(message)))).map(b => b.toString(16).padStart(2, '0')).join(''))(`${GameSettings.track.id}|${Application.User.attributes.u_id}|${race.code}|${+race.run_ticks}|${race.vehicle}|25|erxrHHcksIHHksktt8933XhwlstTekz`)
										}).done(function(response) {
											if (response.result) {
												Application.router.current_view.refresh_leaderboard();
												Application.router.current_view.highlightLeaderboad();
												setTimeout(refreshlb, 1000);
											}
										});
									}
								})
							]
						}),
						this.constructor.createElement('textarea.importDialog-code', {
							autocomplete: false,
							spellcheck: false
						})
					]
				}),
				this.constructor.createElement('form.editorDialog-bottomBar.clearfix', {
					children: [
						this.constructor.createElement('button.primary-button.primary-button-blue.float-right.margin-0-5', {
							innerText: 'Upload',
							value: 'default'
						}),
						this.constructor.createElement('button.primary-button.primary-button-black.float-right.margin-0-5', {
							innerText: 'Cancel',
							value: 'cancel'
						})
					],
					method: 'dialog'
				})
			],
			style: {
				margin: 'revert',
				padding: 0,
				position: 'revert',
				top: 'revert'
			},
			onclose: event => {
				switch(event.target.returnValue) {
				case 'cancel':
					return;
				case 'default':
					// upload ghost
				}
			}
		})));
		this.constructor.waitForElm('#friends-leaderboard-challenge').then(challenge => {
			const dialog = this.dialogs.get('ghostUpload');
			if (!dialog.button) {
				// Switch to link button beside flag track
				dialog.button = challenge.cloneNode(true);
				dialog.button.classList.add('button-type-1');
				dialog.button.classList.remove('button-type-2');
				dialog.button.style.setProperty('margin-top', 0);
				dialog.button.removeAttribute('id');
				dialog.button.innerText = 'Upload Ghost';
				dialog.button.addEventListener('click', () => {
					dialog.showModal();
				}, { passive: true })
			}

			challenge.after(dialog.button);
		})
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
			}).then(r => (alert(r.msg), r));
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
		let notifications = await Application.Helpers.AjaxHelper.get('notifications').then(({ notification_days: d }) => {
			return d && d.length > 0 && d.flatMap(({ notifications: n }) => n)
		});
		let commentNotifications = notifications.filter(({ t_uname_mention: t }) => t);
		for (let { comment, track, ts } of commentNotifications) {
			let notification = document.querySelector('.notification[data-ts="' + ts + '"] p > a[href$="' + track.url + '"]')
			notification.href += '?c_id=' + comment.id
		}
	}

	refreshAchievements() {
		return fetch("/achievements?ajax").then(r => r.json()).then(async res => {
			let children = await Promise.all(res.achievements.filter(a => !a.complete).sort((a, b) => b.tot_num - a.tot_num).slice(0, 3).map(this.constructor.createProgressElement.bind(this.constructor)));
			this.achievementMonitor.container.replaceChildren(...children);
			return res
		})
	}

	static compareUsers(a, b) {
		return a.u_id == b.u_id || a.u_name == b.u_name || a.d_name == b.d_name
	}

	static createAccountContainer({ login, password }) {
		let container = this.createElement("div", {
			children: [
				this.createElement("button.new-button.button-type-1", {
					innerText: login,
					style: { width: '-webkit-fill-available' },
					onclick: event => {
						event.target.closest("#frhd-lite\\.account-manager").close();
						Application.Helpers.AjaxHelper.post("/auth/standard_login", { login, password }).done(r => {
							r.result && Application.events.publish("auth.login", r.data.user, r.data.user_stats);
						})
					}
				}),
				this.createElement("button.new-button.button-type-3", {
					innerText: "X",
					style: {
						aspectRatio: 1,
						marginRight: 0
					},
					onclick() {
						let accounts = JSON.parse(localStorage.getItem("frhd-lite.account-manager")) ?? [];
						accounts.splice(accounts.indexOf(accounts.find((account) => account.login === login)), 1);
						localStorage.setItem("frhd-lite.account-manager", JSON.stringify(accounts));
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
			element.innerText = options.innerText;
			delete options.innerText;
		}

		for (const attribute in options) {
			if (typeof options[attribute] == 'object') {
				if (options[attribute] instanceof Array) {
					if (/^children$/i.test(attribute)) {
						element.append(...options[attribute]);
					} else if (/^classlist$/i.test(attribute)) {
						element.classList.add(...options[attribute]);
					} else if (/^on/i.test(attribute)) {
						for (const listener of options[attribute])
							// make listener passive if preventDefault() not found in stringified function
							element.addEventListener(attribute.slice(2), listener, { passive: !/\.preventDefault\(\)/g.test(listener.toString()) });
					}
				} else if (/^(dataset|style)$/i.test(attribute))
					Object.assign(element[attribute.toLowerCase()], options[attribute]);
				delete options[attribute]
			}
		}

		Object.assign(element, options);
		return typeof callback == 'function' && callback(element), element;
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
						description: 'Free Rider HD ' + desc,
						accept: { [mimeType]: ['.' + (mimeType == 'application/zip' ? 'zip' : mimeType == 'application/json' ? 'json' : 'txt')] }
					}]
				}).then(async fileHandle => {
					let writable = fileHandle.createWritable();
					await writable.write(contents);
					await writable.close();
				}).catch(err => {
					console.log('Download operation cancelled.')
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

	static downloadRace(tid, uid) {
		return Application.Helpers.AjaxHelper.post("/track_api/load_races", {
			t_id: tid,
			u_ids: uid
		}).done(({ data: [entry], result: r }) => {
			r && this.downloadFile('frhd_ghost_' + tid + '-' + uid, Object.assign(entry.race, {
				t_id: tid,
				u_id: entry.user.u_id
			}), { desc: 'Race' })
		})
	}

	static downloadTrack(id) {
		return fetch('/track_api/load_track?id=' + id + '&fields[]=code&fields[]=id&fields[]=title').then(r => r.json()).then(({ data: { track } = {}, result }) => {
			if (!result) return;
			this.downloadFile(track.title + '-' + track.id, track.code, { desc: 'Track' })
		})
	}

	static async downloadAllTracks(username) {
		return fetch('/u/' + username + '/created?ajax').then(r => r.json()).then(async ({ created_tracks }) => {
			let zip = new Zip();
			let tracks = await Promise.all(created_tracks.tracks.map(track => fetch('/track_api/load_track?id=' + track.id + '&fields[]=code&fields[]=id&fields[]=title').then(r => r.json())))
			.then(tracks => tracks.filter(({ result }) => result).map(({ data }) => data.track));
			for (let track of tracks)
				zip.newFile(track.title + '-' + track.id + '.txt', track.code);
			this.downloadFile('created-tracks', zip.blob(), { desc: 'Created' })
		})
	}

	static async fetchCurrentUser({ force } = {}) {
		const KEY = 'frhd-lite.current_user';
		let cache = sessionStorage.getItem(KEY);
		if (cache && !force) {
			return JSON.parse(cache);
		}

		let data = await fetch('/u/' + Application.settings.user.u_name + '?ajax').then(r => r.json());
		sessionStorage.setItem(KEY, JSON.stringify(data));
		return data
	}

	static async fetchCurrentUserCosmetics({ force } = {}) {
		const KEY = 'frhd-lite.current_user.cosmetics';
		let cache = sessionStorage.getItem(KEY);
		if (cache && !force) {
			return JSON.parse(cache);
		}

		let data = await fetch('/store/gear?ajax').then(r => r.json());
		sessionStorage.setItem(KEY, JSON.stringify(data));
		return data
	}

	static users = [];
	static async fetchUser(uid, { force } = {}) {
		uid = String(uid).toLowerCase();
		if (uid == Application.settings.user.u_id || uid == Application.settings.user.u_name) return this.fetchCurrentUser();
		let cache = this.users.find(({ user: { u_id, u_name }}) => u_id == uid || u_name === uid.toLowerCase());
		if (cache && !force) {
			return cache;
		}

		let entry = await fetch('/u/' + uid + '?ajax').then(r => r.json());
		this.users.push(entry);
		return entry || null
	}

	static fetchComment(trackId, commentId) {
		return Application.Helpers.AjaxHelper.post('track_comments/load_more/' + trackId + '/' + (commentId + 1)).then(r => r.result && r.data.track_comments[0]);
	}

	static async fetchFeaturedGhosts({ force } = {}) {
		const KEY = 'frhd-lite.featured_ghosts';
		let cache = sessionStorage.getItem(KEY);
		if (cache && !force) {
			return JSON.parse(cache);
		}

		let data = await fetch("https://raw.githubusercontent.com/calculamatrise/frhd-featured-ghosts/master/data.json").then(r => r.json());
		sessionStorage.setItem(KEY, JSON.stringify(data));
		return data
	}

	static async fetchRaceBestDate({ force } = {}) {
		const KEY = 'frhd-lite.race_best_dates';
		let cache = JSON.parse(sessionStorage.getItem(KEY)) || {}
		  , t = GameSettings.track.id;
		if (!force && cache[t]) {
			return cache[t]
		}
		let date = await fetch(location.pathname + '?ajax').then(r => r.json()).then(({ user_track_stats: { best_date } = {}} = {}) => best_date);
		sessionStorage.setItem(KEY, JSON.stringify(Object.assign(cache, { [t]: date })));
		return date;
	}

	static async fetchTrackLastPlayedDate({ force } = {}) {
		const KEY = 'frhd-lite.track_last_played_dates';
		let cache = JSON.parse(sessionStorage.getItem(KEY)) || {}
		  , t = GameSettings.track.id;
		if (!force && cache[t]) {
			return cache[t]
		}
		let date = await fetch(location.pathname + '?ajax').then(r => r.json()).then(({ user_track_stats: { last_played_date } = {}} = {}) => last_played_date);
		sessionStorage.setItem(KEY, JSON.stringify(Object.assign(cache, { [t]: date })));
		return date;
	}

	static fetchRaceRow(data, { parent, placement }) {
		const racerProfile = 'https://' + location.host + '/u/' + data.user.d_name.toLowerCase();
		const racerAvatar = racerProfile + '/pic?sz=50';
		return parent.querySelector('tr.track-leaderboard-race-' + data.user.u_id) || this.createElement('tr', {
			className: 'track-leaderboard-race-' + data.user.u_id + ' track-leaderboard-race-row',
			dataset: {
				u_id: data.user.u_id,
				d_name: data.user.d_name,
				run_time: data.runTime,
				type: 'tas'
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

	static formatRaceTime(t) {
		t = parseInt(t, 10);
		let e = t % 6e4 / 1e3;
		return Math.floor(t / 6e4) + ":" + e.toFixed(2).padStart(5, 0)
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
			msg: message.replace(/{data-(\w+)}/g, (_, key) => data[key]) + ' was reported with frhd-lite. (@Calculus/@Totoca12)'
		})
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
}