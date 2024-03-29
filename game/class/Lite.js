window.lite = new class {
	#customStyleSheet = null;
	featuredGhostsLoaded = false;
	snapshots = new class extends Array {
		push(...args) {
			if (this.length >= parseInt(lite.storage.get('snapshots')))
				this.splice(0, this.length - parseInt(lite.storage.get('snapshots')));
			return super.push(...args);
		}
	}
	storage = new Map();
	styleSheet = new Proxy(new Map(), {
		get: (...args) => {
			let [target, property, receiver] = args;
			let returnValue = Reflect.get(...args);
			if (typeof returnValue == 'function') {
				return (...args) => {
					switch (property) {
					case 'delete':
						returnValue = returnValue.apply(target, args);
						this.updateCustomStyleSheet(this.styleSheet.entries());
						break;
					case 'set':
						let [key, value] = args;
						returnValue.call(target, key, new Proxy(value, {
							set: (...args) => {
								let returnValue = Reflect.set(...args);
								this.updateCustomStyleSheet(this.styleSheet.entries());
								return returnValue;
							}
						}));
						returnValue = receiver;
						this.updateCustomStyleSheet(this.styleSheet.entries());
						break;
					default:
						returnValue = returnValue.apply(target, args);
					}
					return returnValue;
				}
			}
			return returnValue;
		}
	});
	constructor() {
		let searchParams = new URLSearchParams(location.search);
		if (searchParams.has('ajax')) return;
		window.Application && Application.events.subscribe('mainview.loaded', this.childLoad.bind(this));
		window.ModManager && (ModManager.hook(this, { name: 'lite' }),
		ModManager.on('ready', this.load.bind(this)),
		ModManager.on('stateChange', this.refresh.bind(this)));
		this.#createCustomStyleSheet();
		addEventListener('message', ({ data }) => {
			if (!data) return console.warn('data is missing');
			switch (data.action) {
			case 'setStorage':
				this.storage = new Map(Object.entries(data.storage));
				this.childLoad();
				break;
			case 'updateStorage':
				let oldStorage = new Map(this.storage);
				this.storage = new Map(Object.entries(data.storage));
				let changes = new Map();
				for (const [key, value] of this.storage.entries()) {
					if (JSON.stringify(value) == JSON.stringify(oldStorage.get(key))) continue;
					changes.set(key, value);
				}
				this.updateFromSettings(changes);
			}
		});
	}

	get scene() {
		return GameManager.game && GameManager.game.currentScene;
	}

	#createCustomStyleSheet() {
		this.#customStyleSheet = document.head.appendChild(document.createElement('style'));
		this.#customStyleSheet.setAttribute('id', 'frhd-lite-style');
	}

	updateCustomStyleSheet(data) {
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

	load(game) {
		game.on('draw', this.draw.bind(this)),
		this.snapshots.splice(0, this.snapshots.length),
		this.updateFromSettings(this.storage)
	}

	childLoad() {
		this.storage.get('accountManager') && this.initAccountManager();
		this.storage.get('dailyAchievementsDisplay') && this.initAchievementsDisplay();
		location.pathname.match(/^\/t\//i) && GameSettings.track && (Application.events.publish("game.prerollAdStopped"),
		this.initBestDate(),
		this.initDownloadGhosts(),
		Application.settings.user.u_id === GameSettings.track.u_id && this.initDownloadTracks(),
		this.storage.get('featuredGhostsDisplay') && this.initFeaturedGhosts(),
		this.initGhostPlayer(),
		this.storage.get('uploadGhosts') && this.initUploadGhosts());
		location.pathname.match(/^\/u\//i) && (this.initFriendsLastPlayed(),
		location.pathname.match(new RegExp('^\/u\/' + Application.settings.user.u_name + '\/?', 'i')) && this.initUserTrackAnalytics(),
		Application.settings.user.moderator && (this.initUserModeration(),
		this.initUserTrackModeration()));
		location.pathname.match(/^\/account\/settings\/?/i) && this.initRequestTrackData();
	}

	updateFromSettings(changes = this.storage) {
		if (!this.scene) return;
		let childLoad = !1
		  , redraw = !1;
		for (const [key, value] of changes.entries()) {
			switch (key) {
			case 'accountManager':
			case 'dailyAchievementsDisplay':
			case 'featuredGhosts':
				childLoad = true;
				break;
			case 'experiments':
				for (const experiment in value) {
					switch(experiment) {
						case 'brightness':
							this.styleSheet.set('#game-container', Object.assign({}, this.styleSheet.get('#game-container'), {
								filter: 'brightness(' + value[experiment] / 100 + ')'
							}));
					}
				}
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
							element.color = color;
						});
					});
				}

				if (this.scene.hasOwnProperty('raceTimes')) {
					this.scene.raceTimes.container.color = color;
					this.scene.raceTimes.raceList.forEach(race => {
						race.children.forEach(element => {
							element.color = color;
						});
					});
				}

				GameSettings.physicsLineColor = '#'.padEnd(7, value == 'midnight' ? 'c' : value == 'darker' ? 'f' : value == 'dark' ? 'fd' : '0');
				GameSettings.sceneryLineColor = '#'.padEnd(7, value == 'midnight' ? '5' : value == 'darker' ? '121319' : value == 'dark' ? '6' : 'a');
				this.scene.toolHandler.options.gridMinorLineColor = '#'.padEnd(7, value == 'midnight' ? '20282e' : value == 'dark' ? '25' : 'e');
				this.scene.toolHandler.options.gridMajorLineColor = '#'.padEnd(7, value == 'midnight' ? '161b20' : value == 'dark' ? '3e' : 'c');
				this.scene.track.powerups.forEach(p => p.outline = GameSettings.physicsLineColor);
				for (const player of this.scene.playerManager._players)
					player._baseVehicle.color = GameSettings.physicsLineColor,
					player._tempVehicle && (player._tempVehicle.color = GameSettings.physicsLineColor)
			case 'isometricGrid':
				redraw = true;
			}
		}

		childLoad && this.childLoad(),
		redraw && this.scene.redraw(),
		this.refresh()
	}

	refresh() {
		let keymap = this.storage.get('keymap');
		for (let key in keymap)
			this.scene.playerManager.firstPlayer._gamepad.keymap[key.charCodeAt()] = keymap[key];
		for (const player of this.scene.playerManager._players.filter(player => player._user.u_id == this.scene.playerManager.firstPlayer._user.u_id))
			player._baseVehicle.color = this.storage.get('bikeFrameColor') != '#000000' && this.storage.get('bikeFrameColor') || GameSettings.physicsLineColor
	}

	draw(ctx) {
		this.storage.get('inputDisplay') && this.drawInputDisplay(ctx || GameManager.game.canvas.getContext('2d'));
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
		logout.removeAttribute('id');
		logout.innerText = "Switch";
		logout.addEventListener('click', () => {
			let overlay = this.constructor.createElement("div", {
				className: "simplemodal-overlay",
				id: "simplemodal-overlay",
				style: {
					inset: 0,
					opacity: 0.5,
					position: 'fixed',
					zIndex: 1001
				}
			});

			let container = this.constructor.createElement("div", {
				children: [
					this.constructor.createElement("span", {
						className: "core_icons core_icons-icon_close signup-login-modal-close",
						onclick() {
							overlay.remove();
							container.remove();
						}
					}),
					this.constructor.createElement("div", {
						children: (JSON.parse(localStorage.getItem("switcher-accounts")) ?? []).map(account => this.constructor.createAccountContainer(account)),
						id: "accounts-container",
						style: {
							display: 'flex',
							flexDirection: 'column',
							gap: '0.4rem'
						}
					}),
					this.constructor.createElement("button", {
						className: "new-button button-type-2",
						innerText: "Add account",
						onclick() {
							if (document.querySelector("div#login-container")) {
								this.innerText = "Add account";
								this.style.removeProperty("background-image");
								document.querySelector("div#login-container").remove();
								return;
							}

							this.before(lite.constructor.createElement("div", {
								children: [
									lite.constructor.createElement("input", {
										className: "field auth-field",
										id: "save-account-login",
										placeholder: "Username or Email",
										style: {
											borderRadius: "2rem"
										},
										type: "text"
									}),
									lite.constructor.createElement("input", {
										className: "field auth-field",
										id: "save-account-password",
										placeholder: "Password",
										style: {
											borderRadius: "2rem"
										},
										type: "password"
									}),
									lite.constructor.createElement("button", {
										className: "new-button button-type-1",
										innerText: "Save account",
										onclick() {
											Application.Helpers.AjaxHelper.post("/auth/standard_login", {
												login: document.querySelector("#save-account-login")?.value,
												password: document.querySelector("#save-account-password")?.value
											}).done(res => {
												if (res.result) {
													let accounts = JSON.parse(localStorage.getItem("switcher-accounts")) || [];
													if (accounts.find(({ login }) => login === res.data.user.d_name)) {
														return;
													}

													accounts.push({
														login: res.data.user.d_name,
														password: document.querySelector("#save-account-password")?.value
													});

													document.querySelector("#accounts-container")?.append(lite.constructor.createAccountContainer(accounts[accounts.length - 1]));
													localStorage.setItem("switcher-accounts", JSON.stringify(accounts));
													this.parentElement.remove();
												}
											});
										}
									})
								],
								id: 'login-container',
								style: {
									display: 'flex',
									flexDirection: 'column',
									gap: '0.4rem',
									marginTop: '1rem'
								}
							}));
							this.style.setProperty('background-image', 'linear-gradient(#ee5f5b,#c43c35)');
							this.innerText = "Cancel";
						}
					})
				],
				className: "simplemodal-container",
				id: "signup_login_container",
				style: {
					display: 'flex',
					flexDirection: 'column',
					gap: '0.6rem',
					height: 'fit-content',
					inset: 0,
					margin: 'auto',
					maxHeight: '50vmin',
					maxWidth: '25vw',
					minWidth: '230px',
					overflow: 'hidden auto',
					padding: '2.5rem',
					position: 'fixed',
					width: '40vmin',
					zIndex: 1002
				}
			});

			if (Application.User.logged_in) {
				container.appendChild(
					this.constructor.createElement("button", {
						className: "new-button",
						innerText: "Logout",
						style: {
							backgroundImage: 'linear-gradient(#ee5f5b,#c43c35)'
						},
						onclick() {
							Application.Helpers.AjaxHelper.post('/auth/logout').done(res => {
								if (res.result) {
									Application.User.logged_in = !1,
									Application.User.clear(),
									Application.events.publish('user.change'),
									Application.events.unsubscribe('user.change');
									Application.events.publish("user.logout");
									Application.User.unset_game_settings_user();
									this.remove();
								}
							});
						}
					})
				);
			}

			document.body.append(overlay, container);
		});
	}

	achievements = null;
	achievementsContainer = null;
	initAchievementsDisplay() {
		this.notificationEvent || this.initNotificationEvent();
		if (!this.achievementsContainer) {
			Application.events.subscribe('notification.received', ({ data }) => {
				if ('undefined' != typeof data && ('undefined' != typeof data.achievements_earned)) {
					'undefined' != typeof data.achievements_earned && Application.events.publish('achievementsEarned', data.achievements_earned);
					this.refreshAchievements() // only update percentages // this.updateAchievements?
				}
			});

			this.achievementsContainer ||= this.constructor.createElement('div', {
				children: [
					this.constructor.createElement('a', {
						children: [
							this.constructor.createElement('span', {
								innerText: 'Daily Achievements',
								style: {
									float: 'left'
								}
							}),
							this.countdown = this.constructor.createElement('span', {
								className: 'time-remaining',
								innerText: '00:00:00',
								style: {
									float: 'right'
								}
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
					this.achievements = this.constructor.createElement('div', {
						id: 'achievements-container',
						style: {
							display: 'flex',
							flexDirection: 'column',
							fontFamily: 'riffic',
							gap: '0.4rem'
						}
					})
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
			});
		}

		this.refreshAchievements().then(response => {
			this.countdown.innerText = [String(Math.floor(response.time_left / 3600)).padStart(2, '0'), String(Math.floor((response.time_left % 3600) / 60)).padStart(2, '0'), String(Math.floor(response.time_left % 60)).padStart(2, '0')].join(':');
			this.countdownTimer ||= setInterval(() => {
				let lastTime = this.countdown.innerText.split(':').map(e => parseInt(e));
				if (lastTime[2] === 0) {
					if (lastTime[1] === 0) {
						lastTime[0]--;
						lastTime[1] = 59;
					}

					lastTime[1]--;
					lastTime[2] = 59;
				}

				lastTime[2]--;
				lastTime.reduce((sum, remainingTime) => sum += remainingTime, 0) === 0 && clearInterval(this.countdownTimer);
				this.countdown.innerText = lastTime.map(e => String(e).padStart(2, '0')).join(':');
			}, 1e3)

			const rightContent = document.querySelector('#right_content');
			rightContent.prepend(this.achievementsContainer);
		});
	}

	initBestDate() {
		this.leaderboardEvent || this.initLeaderboardEvent();
		Application.router.current_view.on('leaderboard.rendered', () => {
			document.querySelectorAll(`.track-leaderboard-race-row[data-u_id="${Application.settings.user.u_id}"]`).forEach(race => {
				race.setAttribute('title', 'Loading...');
				race.addEventListener('mouseover', event => {
					fetch(location.pathname + '?ajax').then(r => r.json()).then(({ user_track_stats: { best_date } = {}} = {}) => {
						event.target.setAttribute('title', best_date ?? 'Failed to load');
					});
				}, { once: true });
			});
		});
	}

	async initDownloadGhosts() {
		this.leaderboardEvent || this.initLeaderboardEvent();
		this.styleSheet.set('.track-page .track-leaderboard .track-leaderboard-action', { textAlign: 'right' });
		this.styleSheet.set('.track-page .track-leaderboard .track-leaderboard-action > :is(span.core_icons, div.moderator-remove-race)', { right: '6px' });
		Application.router.current_view.on('leaderboard.rendered', () => {
			for (let actionRow of Array.from(document.querySelectorAll('.track-leaderboard-race-row[data-u_id="' + Application.settings.user.u_id + '"] > .track-leaderboard-action')).filter(actionRow => !actionRow.querySelector('#frhd-lite\\.download-race'))) {
				let download = document.createElement('span');
				download.setAttribute('id', 'frhd-lite.download-race');
				download.setAttribute('title', 'Download Race');
				download.classList.add('core_icons', 'core_icons-btn_add_race');
				download.style.setProperty('background-image', "linear-gradient(hsl(200 81% 65% / 1), hsl(200 60% 40% / 1))");
				download.style.setProperty('clip-path', "polygon(30% 5%, 30% 45%, 10% 45%, 50% 95%, 90% 45%, 70% 45%, 70% 5%)");
				download.addEventListener('click', function() {
					Application.Helpers.AjaxHelper.get("/track_api/load_races", {
						t_id: GameSettings.track.id,
						u_ids: download.parentElement.parentElement.dataset.u_id
					}).done(function(res) {
						if (res.result) {
							let [data] = res.data;
							data = Object.assign(data.race, {
								t_id: GameSettings.track.id,
								u_id: data.user.u_id
							});
							let download = document.createElement('a');
							download.setAttribute('download', 'frhd_ghost_' + GameSettings.track.id);
							download.setAttribute('href', URL.createObjectURL(
								new Blob([JSON.stringify(data, null, 4)], {
									type: 'application/json'
								})
							));
							download.click();
							URL.revokeObjectURL(download.getAttribute('href'));
						}
					});
				});

				actionRow.style.setProperty('width', '20%');
				actionRow.prepend(download);
				actionRow.textContent.length > 0 && actionRow.replaceChildren(...actionRow.children);
			}
		});
	}

	async initDownloadTracks() {
		let subscribeToAuthor = document.querySelector('.subscribe-to-author');
		let downloadTrack = document.querySelector('#frhd-lite\\.download-track');
		if (!downloadTrack) {
			downloadTrack = subscribeToAuthor.cloneNode(true);
			let subscriberCount = downloadTrack.querySelector('#subscribe_to_author_count');
			subscriberCount && subscriberCount.remove();
			let download = downloadTrack.querySelector('#subscribe_to_author');
			download.setAttribute('id', 'frhd-lite.download-track'); // check if it exists first
			download.innerText = 'Download';
			download.addEventListener('click', () => {
				this.constructor.downloadTrack(GameSettings.track.id);
			});
			subscribeToAuthor.after(downloadTrack);
		}
	}

	featuredGhosts = null;
	initFeaturedGhosts() {
		this.leaderboardEvent || this.initLeaderboardEvent();
		Application.router.current_view.on('leaderboard.rendered', async ({ track_leaderboard }) => {
			this.featuredGhosts ||= await fetch("https://raw.githubusercontent.com/calculamatrise/frhd-featured-ghosts/master/data.json").then(r => r.json());
			const matches = Object.fromEntries(Object.entries(lite.featuredGhosts).filter(e => Object.keys(e[1] = Object.fromEntries(Object.entries(e[1]).filter(([t]) => parseInt(t.split('/t/')[1]) == Application.router.current_view._get_track_id()))).length));
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
				item.after(this.constructor.createElement('div', {
					className: "friend-list-item-date",
					innerText: "Last Played " + friends.friends_data.find(({ d_name }) => d_name == item.innerText).activity_time_ago
				}));
			});
		});
	}

	initGhostPlayer() {
		this.replayGui ||= this.constructor.createElement('div', {
			style: {
				display: 'none',
				inset: 0,
				pointerEvents: 'none',
				position: 'absolute'
			}
		});
		this.replayGui.progress ||= this.replayGui.appendChild(this.constructor.createElement('progress', {
			className: 'ghost-player-progress',
			id: 'replay-seeker',
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
				if (player.isGhost()) {
					// let race = GameManager.game.currentScene.races.find(({ user }) => user.u_id == player._user.u_id);
					// let runTicks = race && race.race.run_ticks;
					// if (runTicks > 0) {
					// 	player._replayIterator.next(runTicks / this.value);
					// }

					// console.log(this.value)
					player._replayIterator.next(this.value);
				}
			},
			onpointerdown(event) {
				this.setPointerCapture(event.pointerId);
				this.value = Math.round(event.offsetX / parseInt(getComputedStyle(this).getPropertyValue('width')) * this.max);
				this.dispatchEvent(new InputEvent('change'));
				this.wasPlaying = GameManager.game.currentScene.state.playing;
			},
			onpointermove(event) {
				event.buttons & 1 == 1 && (this.value = Math.round(event.offsetX / parseInt(getComputedStyle(this).getPropertyValue('width')) * this.max),
				this.dispatchEvent(new InputEvent('change')));
			},
			onpointerup(event) {
				this.releasePointerCapture(event.pointerId);
				GameManager.game.currentScene.state.playing = this.wasPlaying;
			}
		}));
		this.styleSheet.set('.ghost-player-progress::-webkit-progress-value', {
			backgroundColor: 'hsl(195deg 57% 25%)'
		}).set('.ghost-player-progress:hover', {
			cursor: 'pointer',
			filter: 'brightness(1.25)',
			height: '6px !important'
		});
		// create progress element
		this.constructor.waitForElm('#game-container').then(container => {
			container.appendChild(this.replayGui);
		});
	}

	leaderboardEvent = null;
	initLeaderboardEvent() {
		const render_leaderboards = this.leaderboardEvent = Application.Views.TrackView.prototype._render_leaderboards;
		Application.Views.TrackView.prototype._render_leaderboards = function(e) {
			render_leaderboards.apply(this, arguments);
			e.result && (this.trigger('leaderboard.rendered', ...arguments),
			Application.events.publish('leaderboard.rendered', ...arguments));
		}
	}

	notificationEvent = null;
	initNotificationEvent() {
		const prototype = Object.getPrototypeOf(Application.Helpers.AjaxHelper);
		const check_event_notification = this.notificationEvent = prototype._check_event_notification;
		prototype._check_event_notification = function(e) {
			check_event_notification.apply(this, arguments);
			e.result && Application.events.publish('notification.received', ...arguments);
		}

		Object.setPrototypeOf(Application.Helpers.AjaxHelper, prototype);
	}

	initRequestTrackData() {
		let deleteALlPersonalData = document.querySelector('#delete-all-personal-data');
		if (deleteALlPersonalData) {
			let requestTrackData = deleteALlPersonalData.parentElement.appendChild(document.createElement('button'));
			requestTrackData.classList.add('blue-button', 'settings-header', 'new-button');
			requestTrackData.style.setProperty('float', 'right');
			requestTrackData.style.setProperty('font-size', '13px');
			requestTrackData.style.setProperty('height', 'auto');
			requestTrackData.style.setProperty('line-height', '23px');
			requestTrackData.style.setProperty('margin-top', '6px');
			requestTrackData.style.setProperty('margin-right', '14px');
			requestTrackData.style.setProperty('padding', '0 1rem');
			requestTrackData.innerText = 'Request All Data';
			requestTrackData.addEventListener('click', () => {
				this.constructor.downloadAllTracks();
			});
		} else {
			console.warn("Request track data failed to load! Personal data is not present.");
		}
	}

	ghostUploadDialog = null;
	initUploadGhosts() {
		this.ghostUploadDialog ||= document.body.appendChild(this.constructor.createElement('dialog', {
			children: [
				this.constructor.createElement('div', {
					children: [
						this.constructor.createElement('span', {
							className: 'editorDialog-close',
							innerText: '×',
							onclick: () => {
								this.ghostUploadDialog.close();
							}
						}),
						this.constructor.createElement('h1', {
							className: 'editorDialog-content-title',
							innerText: 'UPLOAD GHOST'
						})
					],
					className: 'editorDialog-titleBar'
				}),
				this.constructor.createElement('div', {
					children: [
						this.constructor.createElement('span', {
							children: [
								this.constructor.createElement('span', {
									innerText: 'Paste ghost data, drag and drop text files here, or '
								}),
								this.constructor.createElement('span', {
									className: 'link',
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
									style: {
										display: 'none'
									},
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
							],
							className: 'importDialog-placeholder'
						}),
						this.constructor.createElement('textarea', {
							autocomplete: false,
							className: 'importDialog-code',
							spellcheck: false
						})
					],
					className: 'importDialog-codeContainer'
				}),
				this.constructor.createElement('div', {
					children: [
						this.constructor.createElement('button', {
							className: 'primary-button primary-button-blue float-right margin-0-5',
							innerText: 'Upload'
						}),
						this.constructor.createElement('button', {
							className: 'primary-button primary-button-black float-right margin-0-5',
							innerText: 'Cancel',
							onclick: () => {
								this.ghostUploadDialog.close()
							}
						})
					],
					className: 'editorDialog-bottomBar clearfix'
				})
			],
			className: 'editorDialog-content editorDialog-content_importDialog',
			style: {
				margin: 'revert',
				padding: 0,
				position: 'revert',
				top: 'revert'
			}
		}));

		this.constructor.waitForElm('#friends-leaderboard-challenge').then(challenge => {
			if (!this.ghostUploadButton) {
				this.ghostUploadButton = challenge.cloneNode(true);
				this.ghostUploadButton.classList.add('button-type-1');
				this.ghostUploadButton.classList.remove('button-type-2');
				this.ghostUploadButton.style.setProperty('margin-top', 0);
				this.ghostUploadButton.removeAttribute('id');
				this.ghostUploadButton.innerText = 'Upload Ghost';
				this.ghostUploadButton.addEventListener('click', () => {
					this.ghostUploadDialog.showModal();
				})
			}

			challenge.after(this.ghostUploadButton);
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
		let input = document.createElement('input');
		input.setAttribute('placeholder', "New email");
		input.setAttribute('readonly', '');
		input.setAttribute('type', 'text'); // email
		property.nextElementSibling.replaceWith(input);
		let edit = email.querySelector('#pm-ban-user');
		edit.classList.remove('ban-user-button');
		edit.innerText = "Edit";
		edit.removeAttribute('id');
		edit.addEventListener('click', onclick);
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
		edit.addEventListener('click', onclick);
		edit.addEventListener('save', event => {
			return Application.Helpers.AjaxHelper.post("moderator/change_username", {
				u_id: data.u_id,
				username: event.detail
			}).then(r => (alert(r.msg), r));
		});
		let password = pm.appendChild(email.cloneNode());
		property = password.appendChild(property.cloneNode());
		property.innerText = "Password: ";
		edit = password.appendChild(document.createElement('button'));
		edit.classList.add('new-button', 'ban-user-button');
		edit.innerText = 'Reset Password';
		edit.addEventListener('click', () => {
			return Application.Helpers.AjaxHelper.post("auth/forgot_password", {
				email: data.u_name
			}).then(r => (alert(r.msg), r));
		})
	}

	initUserTrackAnalytics() {
		document.querySelectorAll("#created_tracks .bottom").forEach(metadata => {
			metadata.innerHTML = metadata.innerHTML.replace(/<!--|-->/g, '');
		});
	}

	initUserTrackModeration() {
		for (let metadata of document.querySelectorAll("#created_tracks .bottom")) {
			let label = metadata.appendChild(document.createElement('label'));
			let avatar = metadata.querySelector('.profileGravatarIcon');
			avatar && avatar.style.setProperty('margin-right', '4px');
			label.appendChild(metadata.querySelector('.profileGravatarIcon'));
			label.appendChild(metadata.querySelector('.author'));
			label.style.setProperty('display', 'block')
			let checkbox = label.appendChild(document.createElement('input'));
			checkbox.setAttribute('type', 'checkbox');
			checkbox.style.setProperty('float', 'right');
			checkbox.style.setProperty('height', '1.5rem');
		}

		let nav = document.querySelector("#content > div > div.profile-tabs > section > div.tab_buttons > div");
		let action = nav.appendChild(document.createElement('select'));
		action.style.setProperty('border-radius', '4px');
		action.style.setProperty('float', 'right');
		action.style.setProperty('font-family', 'system-ui,roboto_medium,Arial,Helvetica,sans-serif');
		action.style.setProperty('letter-spacing', '-.02em');
		action.style.setProperty('margin-right', '10px');
		action.style.setProperty('margin-top', '8px');
		let placeholder = action.appendChild(document.createElement('option'));
		placeholder.setAttribute('value', 'default');
		placeholder.disabled = true;
		placeholder.innerText = 'Select an action';
		let deleteSelected = action.appendChild(document.createElement('option'));
		deleteSelected.setAttribute('value', 'hide');
		deleteSelected.innerText = 'Delete selected';
		let deselect = action.appendChild(document.createElement('option'));
		deselect.setAttribute('value', 'deselect');
		deselect.innerText = 'Deselect all';
		let selectAll = action.appendChild(document.createElement('option'));
		selectAll.setAttribute('value', 'select');
		selectAll.innerText = 'Select all';
		action.addEventListener('change', async event => {
			event.target.disabled = true;
			switch (event.target.value) {
				case 'hide':
					let tracks = document.querySelectorAll("#created_tracks li:has(.bottom > label > input[type='checkbox']:checked)");
					if (tracks.length > 0) {
						let dialog = document.body.appendChild(document.createElement('dialog'));
						dialog.style.setProperty('border', 'none');
						dialog.style.setProperty('box-shadow', '0 0 4px 0px hsl(190deg 25% 60%)');
						dialog.style.setProperty('max-height', '75vh');
						dialog.style.setProperty('max-width', '50vw');
						dialog.style.setProperty('padding', 0);
						dialog.style.setProperty('width', '120vmin');
						let title = dialog.appendChild(document.createElement('p'));
						title.style.setProperty('background-color', 'inherit');
						title.style.setProperty('box-shadow', '0 0 4px 0 black');
						title.style.setProperty('padding', '1rem');
						title.style.setProperty('position', 'sticky');
						title.style.setProperty('top', 0);
						title.style.setProperty('z-index', 3);
						title.innerText = 'Are you sure you would like to delete the following tracks?';
						let close = title.appendChild(document.createElement('span'));
						close.classList.add('core_icons', 'core_icons-icon_close');
						close.style.setProperty('float', 'right');
						close.addEventListener('click', () => dialog.remove());
						let list = dialog.appendChild(document.createElement('ul'));
						list.classList.add('track-list', 'clearfix');
						list.style.setProperty('max-height', '50cqh');
						list.style.setProperty('overflow-y', 'auto');
						list.style.setProperty('padding', '1rem');
						list.style.setProperty('text-align', 'center');
						list.append(...Array.from(tracks).map(track => {
							let clone = track.cloneNode(true);
							clone.style.setProperty('width', 'min-content');
							return clone;
						}));
						let form = dialog.appendChild(document.createElement('form'));
						form.setAttribute('method', 'dialog');
						form.style.setProperty('background-color', 'inherit');
						form.style.setProperty('bottom', 0);
						form.style.setProperty('display', 'flex');
						form.style.setProperty('gap', '.25em');
						form.style.setProperty('box-shadow', '0 0 4px 0 black');
						form.style.setProperty('padding', '1rem');
						form.style.setProperty('position', 'sticky');
						form.style.setProperty('z-index', 2);
						let cancel = form.appendChild(document.createElement('button'));
						cancel.classList.add('new-button', 'button-type-1');
						cancel.setAttribute('value', 'cancel');
						cancel.innerText = 'Cancel';
						let confirm = form.appendChild(document.createElement('button'));
						confirm.classList.add('new-button', 'button-type-2');
						confirm.setAttribute('value', 'default');
						confirm.innerText = 'Confirm';
						confirm.addEventListener('click', async event => {
							event.preventDefault();
							for (let button of form.querySelectorAll('button')) {
								button.disabled = true;
								button.style.setProperty('opacity', .5);
								button.style.setProperty('pointer-events', 'none');
							}

							let hourglass = form.appendChild(document.createElement('span'));
							hourglass.classList.add('loading-hourglass');
							let cache = [];
							let tracks = list.querySelectorAll(".bottom:has(> label > input[type='checkbox']:checked)");
							for (let metadata of tracks) {
								let name = metadata.querySelector('.name');
								let url = name.getAttribute('href');
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
		});
	}

	refreshAchievements() {
		return fetch("/achievements?ajax").then(r => r.json()).then(async res => {
			let children = await Promise.all(res.achievements.filter(a => !a.complete).sort((a, b) => b.tot_num - a.tot_num).slice(0, 3).map(this.constructor.createProgressElement.bind(this.constructor)));
			this.achievements.replaceChildren(...children);
			return res;
		});
	}

	static createAccountContainer({ login, password }) {
		let container = this.createElement("div", {
			children: [
				this.createElement("button", {
					className: "new-button button-type-1",
					innerText: login,
					style: {
						width: '-webkit-fill-available'
					},
					onclick() {
						document.querySelector("#simplemodal-overlay")?.remove();
						document.querySelector("#signup_login_container")?.remove();
						Application.Helpers.AjaxHelper.post("/auth/standard_login", { login, password }).done(function (response) {
							response.result && Application.events.publish("auth.login", response.data.user, response.data.user_stats);
						});
					}
				}),
				this.createElement("button", {
					className: "new-button",
					innerText: "X",
					style: {
						aspectRatio: 1,
						backgroundImage: 'linear-gradient(#ee5f5b,#c43c35)',
						marginRight: 0
					},
					onclick() {
						let accounts = JSON.parse(localStorage.getItem("switcher-accounts")) ?? [];
						accounts.splice(accounts.indexOf(accounts.find((account) => account.login === login)), 1);
						localStorage.setItem("switcher-accounts", JSON.stringify(accounts));
						container.remove();
					}
				})
			],
			style: {
				display: 'flex',
            	gap: '0.25rem'
			}
		});

		return container;
	}

	static async createProgressElement(achievement) {
		let container = this.createElement('div', {
			children: [
				this.createElement('div', {
					children: [
						this.createElement('span', {
							className: 'achievements-coin store_icons store_icons-coin_icon_lg achievement-coin-value',
							innerText: achievement.coins,
							style: {
								color: 'white',
								lineHeight: '45px',
								textAlign: 'center',
								textShadow: '0 -1px 1px #9E8500'
							}
						}),
						this.createElement('div', {
							children: [
								this.createElement('a', {
									className: 'title',
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
											return fetch('/u/' + Application.settings.user.u_name + '?ajax').then(r => r.json()).then(async ({ friends }) => {
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
												return 'random/track';
											});
										case 'Improve 5 best times':
										case 'Send 5 friend race challenges':
											return fetch('/u/' + Application.settings.user.u_name + '?ajax').then(r => r.json()).then(({ recently_ghosted_tracks: { tracks }}) => {
												let track = tracks[Math.floor(Math.random() * tracks.length)];
												return track ? track.slug : 'random/track';
											});
										default:
											return 'random/track';
										}
									})(achievement.desc),
									style: {
										width: '-webkit-fill-available'
									}
								}),
								this.createElement('h6', {
									className: 'achievement-info-desc condensed',
									innerText: achievement.desc,
									style: {
										color: 'hsl(190deg 25% 60%)',
										fontFamily: 'roboto_bold',
										margin: 0
									}
								})
							],
							className: 'achievement-info'
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
					style: {
						// fontFamily: 'helsinki',
						fontSize: '1.25rem'
					}
				})
			],
			className: 'achievement-info',
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
		const element = document.createElement(type);
		if ('innerText' in options) {
			element.innerText = options.innerText;
			delete options.innerText;
		}

		for (const attribute in options) {
			if (typeof options[attribute] == 'object') {
				if (options[attribute] instanceof Array) {
					if (/^children$/i.test(attribute)) {
						element.append(...options[attribute]);
					} else if (/^on/i.test(attribute)) {
						for (const listener of options[attribute])
							element.addEventListener(attribute.slice(2), listener);
					}
				} else if (/^style$/i.test(attribute))
					Object.assign(element[attribute.toLowerCase()], options[attribute]);
				delete options[attribute];
			}
		}

		Object.assign(element, options);
		return typeof callback == 'function' && callback(element), element;
	}

	static downloadTrack(id) {
		fetch('/track_api/load_track?id=' + id + '&fields[]=code&fields[]=id&fields[]=title').then(r => r.json()).then(({ data, result }) => {
			if (!result) return;
			let { track } = data;
			let blob = new Blob([track.code], { type: 'text/plain' });
			let a = document.createElement('a');
			a.href = URL.createObjectURL(blob);
			a.download = track.title + '-' + track.id;
			a.click();
			URL.revokeObjectURL(a.href);
		});
	}

	static async downloadAllTracks() {
		fetch('/u/' + Application.settings.user.u_name + '/created?ajax').then(r => r.json()).then(async ({ created_tracks }) => {
			let zip = new Zip();
			let tracks = await Promise.all(created_tracks.tracks.map(track => fetch('/track_api/load_track?id=' + track.id + '&fields[]=code&fields[]=id&fields[]=title').then(r => r.json())))
			.then(tracks => tracks.filter(({ result }) => result).map(({ data }) => data.track));
			for (let track of tracks)
				zip.newFile(track.title + '-' + track.id + '.txt', track.code);
			let a = document.createElement('a');
			a.setAttribute('href', URL.createObjectURL(zip.blob()));
			a.setAttribute('download', 'created-tracks');
			a.click();
			URL.revokeObjectURL(a.getAttribute('href'));
		});
	}

	static waitForElm(selector) {
		return new Promise(resolve => {
			if (document.querySelector(selector))
				return resolve(document.querySelector(selector));
			const observer = new MutationObserver(mutations => {
				if (document.querySelector(selector)) {
					resolve(document.querySelector(selector));
					observer.disconnect();
				}
			});
			observer.observe(document.body, {
				childList: true,
				subtree: true
			});
		});
	}
}