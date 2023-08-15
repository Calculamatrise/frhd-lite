let styleSheetProxyHandler;
window.lite = new class {
	#customStyleSheet = null;
	featuredGhostsLoaded = false;
	loaded = false;
	snapshots = new class extends Array {
		push(...args) {
			if (this.length >= parseInt(lite.storage.get('snapshots'))) {
				this.splice(0, this.length - parseInt(lite.storage.get('snapshots')));
			}

			super.push(...args);
		}
	}
	storage = new Map(Object.entries(JSON.parse(sessionStorage.getItem('lite'))));
	styleSheet = new Proxy({}, styleSheetProxyHandler = {
		get(target) {
			let value = Reflect.get(...arguments);
			if (typeof value == 'object' && value !== null) {
				return new Proxy(value, styleSheetProxyHandler)
			} else if (typeof value == 'function') {
				value = value.bind(target)
			}

			return value;
		},
		set() {
			let returnValue = Reflect.set(...arguments);
			lite.updateCustomStyleSheet(lite.styleSheet);
			return returnValue;
		}
	});
	constructor() {
		Application.events.subscribe('route', () => this.loaded = false);
		Application.events.subscribe('mainview.loaded', this.childLoad.bind(this));
		GameManager.on('stateChange', state => {
			if (state.preloading === false && this.loaded === false) {
				this.loaded = this.load();
			}

			this.loaded && this.refresh();
		});

		this.childLoad();
		addEventListener('message', ({ data }) => {
			if (!data) return;
			switch (data.action) {
				case 'updateStorage':
					let oldStorage = new Map(this.storage);
					this.storage = new Map(Object.entries(data.storage));
					let changes = new Map();
					for (const [key, value] of this.storage.entries()) {
						if (JSON.stringify(value) == JSON.stringify(oldStorage.get(key))) continue;
						changes.set(key, value);
					}

					this.updateFromSettings(changes);
					break;
			}
		});

		this.#createCustomStyleSheet();
	}

	get scene() {
		return GameManager.game && GameManager.game.currentScene;
	}

	#createCustomStyleSheet() {
		this.#customStyleSheet = document.body.appendChild(document.createElement('style'));
		this.#customStyleSheet.setAttribute('id', 'frhd-lite-style');
	}

	updateCustomStyleSheet(textContent) {
		if (typeof textContent == 'object' && textContent !== null) {
			const entries = Object.entries(textContent);
			const filteredEntries = entries.filter(([_,value]) => Object.values(value).length);
			textContent = '';
			for (let [key, properties] of filteredEntries) {
				properties = Object.entries(properties);
				for (let property of properties) {
					property[0] = property[0].replace(/([A-Z])/g, c => '-' + c.toLowerCase());
				}

				textContent += key + '{' + properties.map(property => property.join(':')).join(';') + '}';
			}
		}

		this.#customStyleSheet.textContent = textContent;
	}

	load() {
        this.snapshots.splice(0, this.snapshots.length);
		this.updateFromSettings(this.storage);
        return true;
    }

	childLoad() {
		this.storage.get('accountManager') && this.initAccountManager();
		this.storage.get('dailyAchievementsDisplay') && this.initAchievementsDisplay();
		location.pathname.match(/^\/t\//i) && (this.initBestDate(),
		/*this.storage.get('ghostPlayer') && */this.initGhostPlayer());
		this.storage.get('featuredGhostsDisplay') && this.featuredGhostsLoaded || this.initFeaturedGhosts();
		location.pathname.match(/^\/u\//i) && this.initFriendsLastPlayed();
	}

	updateFromSettings(changes = this.storage) {
		if (!this.scene) return;
		for (const [key, value] of changes.entries()) {
			switch (key) {
				case 'keymap': {
					this.scene.playerManager.firstPlayer._gamepad.setKeyMap(GameManager.scene !== 'Editor' ? GameSettings.playHotkeys : GameSettings.editorHotkeys);
					break;
				}

				case 'theme': {
					let background = '#'.padEnd(7, this.storage.get('theme') == 'midnight' ? '1d2328' : this.storage.get('theme') == 'dark' ? '1b' : 'f');
					GameManager.game.canvas.style.setProperty('background-color', background);
					this.styleSheet['.gameFocusOverlay'] = {
						'background-color': GameManager.game.canvas.style.getPropertyValue('background-color').replace(/[,]/g, '').replace(/(?=\))/, '/90%'),
						color: '#'.padEnd(7, this.storage.get('theme') == 'midnight' ? 'd' : this.storage.get('theme') == 'dark' ? 'eb' : '2d')
					}

					// this.scene.track.powerups.forEach(p => p.outline = /^(dark|midnight)$/i.test(this.storage.get('theme')) ? '#FBFBFB' : '#000');
					this.scene.message.color = /^#(0|3){3,6}$/.test(this.scene.message.color) && /^(dark|midnight)$/i.test(this.storage.get('theme')) ? '#ccc' : '#333';
					this.scene.message.outline = background;
					let gray = '#'.padEnd(7, /^(dark|midnight)$/i.test(this.storage.get('theme')) ? '6' : '9');
					this.scene.score.best_time.color = gray;
					this.scene.score.best_time_title.color = gray;
					let color = '#'.padEnd(7, this.storage.get('theme') == 'midnight' ? 'd' : this.storage.get('theme') == 'dark' ? 'f' : '0');
					this.scene.score.goals.color = color;
					this.scene.score.time.color = color;
					this.scene.score.time_title.color = gray;
					if (this.scene.hasOwnProperty('campaignScore')) {
						this.scene.campaignScore.container.color = color;
						this.scene.campaignScore.container.children.forEach(medal => {
							medal.color = color;
							// medal.children.forEach(element => {
							// 	element.color = color;
							// });
						});
					}

					if (this.scene.hasOwnProperty('raceTimes')) {
						this.scene.raceTimes.container.color = color;
						// this.scene.raceTimes.raceList.forEach((race) => {
						// 	race.children.forEach(element => {
						// 		element.color = color;
						// 	});
						// });
					}

					GameSettings.physicsLineColor = '#'.padEnd(7, this.storage.get('theme') == 'midnight' ? 'c' : this.storage.get('theme') == 'dark' ? 'fd' : '0');
					GameSettings.sceneryLineColor = '#'.padEnd(7, this.storage.get('theme') == 'midnight' ? '4' : this.storage.get('theme') == 'dark' ? '6' : 'a');
					this.scene.toolHandler.options.gridMinorLineColor = '#'.padEnd(7, this.storage.get('theme') == 'midnight' ? '20282e' : this.storage.get('theme') == 'dark' ? '25' : 'e');
					this.scene.toolHandler.options.gridMajorLineColor = '#'.padEnd(7, this.storage.get('theme') == 'midnight' ? '161b20' : this.storage.get('theme') == 'dark' ? '3e' : 'c');
				}

				case 'isometricGrid': {
					this.scene.redraw();
					break;
				}
			}
		}

		this.refresh();
	}

	refresh() {
		let keymap = this.storage.get('keymap');
		for (let key in keymap) {
			this.scene.playerManager.firstPlayer._gamepad.keymap[key.charCodeAt()] = keymap[key];
		}

		for (const player of this.scene.playerManager._players) {
			if (player._user.u_id != this.scene.playerManager.firstPlayer._user.u_id) continue;
			player._baseVehicle.color = this.storage.get('bikeFrameColor') != '#000000' && this.storage.get('bikeFrameColor') || '#'.padEnd(7, this.storage.get('theme') == 'midnight' ? 'C' : this.storage.get('theme') == 'dark' ? 'FB' : '0');
		}
	}

	draw() {
		this.storage.get('inputDisplay') && this.drawInputDisplay(GameManager.game.canvas);
	}

	drawInputDisplay(canvas = document.createElement('canvas')) {
		const ctx = canvas.getContext('2d');
		const color = (condition => condition ? (t => '#'.padEnd(7, t == 'midnight' ? '4' : t == 'dark' ? '0' : 'f'))(this.storage.get('theme')) : fill);
		const fill = (t => '#'.padEnd(7, t == 'midnight' ? 'd' : t == 'dark' ? 'f' : '0'))(this.storage.get('theme'));
		const gamepad = this.scene.playerManager.getPlayerByIndex(this.scene.camera.focusIndex)._gamepad.downButtons;
		const size = parseInt(this.storage.get('inputDisplaySize'));
		const offset = {
			x: size,
			y: canvas.height - size * 10
		}

		ctx.save();
		ctx.fillStyle = fill;
		ctx.lineCap = 'round';
		ctx.lineJoin = 'round';
		ctx.lineWidth = size / 2;
		ctx.strokeStyle = fill;

		let borderRadius = size / 2;
		let buttonSize = size * 4;

		ctx.beginPath();
		ctx.roundRect(offset.x, offset.y, buttonSize, buttonSize, borderRadius);
		ctx.stroke();
		gamepad.z && ctx.fill();
		ctx.beginPath();
		ctx.roundRect(offset.x + 5 * size, offset.y, buttonSize, buttonSize, borderRadius);
		ctx.stroke();
		gamepad.up && ctx.fill();
		ctx.beginPath();
		ctx.roundRect(offset.x, offset.y + 5 * size, buttonSize, buttonSize, borderRadius);
		ctx.stroke();
		gamepad.left && ctx.fill();
		ctx.beginPath();
		ctx.roundRect(offset.x + 5 * size, offset.y + 5 * size, buttonSize, buttonSize, borderRadius);
		ctx.stroke();
		gamepad.down && ctx.fill();
		ctx.beginPath();
		ctx.roundRect(offset.x + 10 * size, offset.y + 5 * size, buttonSize, buttonSize, borderRadius);
		ctx.stroke();
		gamepad.right && ctx.fill();

		ctx.lineWidth = size / 3;
		ctx.strokeStyle = color(gamepad.z);
		ctx.beginPath();
		ctx.moveTo(offset.x + 2.7 * size, offset.y + 3 * size);
		ctx.lineTo(offset.x + 1.2 * size, offset.y + 3 * size);
		ctx.lineTo(offset.x + 2.7 * size, offset.y + 1 * size);
		ctx.lineTo(offset.x + 1.2 * size, offset.y + 1 * size);
		ctx.stroke();
		ctx.strokeStyle = color(gamepad.up);
		ctx.beginPath();
		ctx.moveTo(offset.x + 6.2 * size, offset.y + 2.7 * size);
		ctx.lineTo(offset.x + 7 * size, offset.y + 1.2 * size);
		ctx.lineTo(offset.x + 7.8 * size, offset.y + 2.7 * size);
		ctx.stroke();
		ctx.strokeStyle = color(gamepad.left);
		ctx.beginPath();
		ctx.moveTo(offset.x + 2.5 * size, offset.y + 7.8 * size);
		ctx.lineTo(offset.x + 1.2 * size, offset.y + 7 * size);
		ctx.lineTo(offset.x + 2.5 * size, offset.y + 6.2 * size);
		ctx.stroke();
		ctx.strokeStyle = color(gamepad.down);
		ctx.beginPath();
		ctx.moveTo(offset.x + 6.2 * size, offset.y + 6.2 * size);
		ctx.lineTo(offset.x + 7 * size, offset.y + 7.8 * size);
		ctx.lineTo(offset.x + 7.8 * size, offset.y + 6.2 * size);
		ctx.stroke();
		ctx.strokeStyle = color(gamepad.right);
		ctx.beginPath();
		ctx.moveTo(offset.x + 11.5 * size, offset.y + 7.8 * size);
		ctx.lineTo(offset.x + 12.8 * size, offset.y + 7 * size);
		ctx.lineTo(offset.x + 11.5 * size, offset.y + 6.2 * size);
		ctx.stroke();
		ctx.restore();
	}

	initAccountManager() {
		let logout = document.querySelector("a.logout");
		logout.removeAttribute("id");
		logout.innerText = "Switch";
		logout.addEventListener("click", () => {
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
						children: (JSON.parse(localStorage.getItem("switcher-accounts")) ?? []).map((account) => this.constructor.createAccountContainer(account)),
						id: "accounts-container",
						style: {
							display: 'flex',
							flexDirection: 'column',
							gap: '0.4rem'
						}
					}),
					this.constructor.createElement("button", {
						className: "btn new-button button-type-2",
						innerText: "Add account",
						onclick() {
							if (document.querySelector("div#login-container")) {
								this.innerText = "Add account";
								this.classList.remove("moderator-remove-race");
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
											Application.Helpers.AjaxHelper.post("/auth/standard_login", { login: document.querySelector("#save-account-login")?.value, password: document.querySelector("#save-account-password")?.value }).done((response) => {
												if (response.result) {
													let accounts = JSON.parse(localStorage.getItem("switcher-accounts")) || [];
													if (accounts.find(({ login }) => login === response.data.user.d_name)) {
														return;
													}

													accounts.push({
														login: response.data.user.d_name,
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
								id: "login-container",
								style: {
									display: 'flex',
									flexDirection: 'column',
									gap: '0.4rem',
									marginTop: '1rem'
								}
							}));
							this.classList.add("moderator-remove-race");
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
					maxWidth: '360px',
					minWidth: '230px',
					overflow: 'hidden auto',
					padding: '2.5rem',
					position: 'fixed',
					width: '40vmin',
					zIndex: 1002
				}
			});

			document.body.append(overlay, container);
		});
	}

	achievements = null;
	achievementsContainer = null;
	countdown = null;
	countdownTimer = null;
	initAchievementsDisplay() {
		if (this.achievementsContainer) return;
		this.achievementsContainer = this.constructor.createElement('div', {
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
						borderBottom: '1px solid gray',
						color: 'white',
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
			className: 'simplemodal-container',
			style: {
				backgroundColor: 'rgb(27 82 100)',
				backgroundImage: 'linear-gradient(#1B5264,#143F4D)',
				borderRadius: '1rem',
				boxShadow: '0px 4px 8px 0px black',
				color: 'white',
				display: 'flex',
				flexDirection: 'column',
				gap: '0.6rem',
				margin: '0 10px',
				padding: '1.5rem',
				width: '-webkit-fill-available'
			}
		});

		this.refreshAchievements().then(response => {
			this.countdown.innerText = [String(Math.floor(response.time_left / 3600)).padStart(2, '0'), String(Math.floor((response.time_left % 3600) / 60)).padStart(2, '0'), String(Math.floor(response.time_left % 60)).padStart(2, '0')].join(':');
			this.countdownTimer = setInterval(() => {
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

		let refresh = this.refreshAchievements.bind(this);
		Application.Helpers.AjaxHelper._check_event_notification = function(e) {
            Object.getPrototypeOf(Application.Helpers.AjaxHelper)._check_event_notification.apply(this, arguments);
            if ('undefined' != typeof e.data && ('undefined' != typeof e.data.achievements_earned)) {
                Application.events.publish('achievementsEarned', e.data.achievements_earned);
                refresh(); // add animation? // refresh everything
            }

            // console.log('other', e);
            refresh() // only update percentages
        }
	}

	initBestDate() {
		Application.Helpers.AjaxHelper.get(location.pathname).done(({ user_track_stats: { best_date } = {}} = {}) => {
			document.querySelectorAll(`.track-leaderboard-race-row[data-u_id="${Application.settings.user.u_id}"]`).forEach(race => {
				race.setAttribute('title', best_date ?? 'Failed to load');
			});
		});
	}

	featuredGhosts = null
	initFeaturedGhosts() {
		const render_leaderboards = Application.Views.TrackView.prototype._render_leaderboards;
		Application.Views.TrackView.prototype._render_leaderboards = async function(n) {
			render_leaderboards.apply(this, arguments);
			lite.featuredGhosts ||= await fetch("https://raw.githubusercontent.com/calculamatrise/frhd-featured-ghosts/master/data.json").then(r => r.json());
			const matches = Object.fromEntries(Object.entries(lite.featuredGhosts).filter(e => Object.keys(e[1] = Object.fromEntries(Object.entries(e[1]).filter(([t]) => parseInt(t.split('/t/')[1]) == Application.router.current_view._get_track_id()))).length));
			for (const player in matches) {
				for (const ghost in matches[player]) {
					let name = ghost.split('/r/')[1];
					if (name.length > 15) {
						name = name.slice(0, 12) + "...";
					}

					const races = Array.from(document.getElementsByClassName("track-leaderboard-race"));
					for (const element of races.filter(({ innerText }) => name == innerText.toLowerCase())) {
						let color = [232, 169, 35];
						switch(matches[player][ghost]) {
							case 'fast': color = [120, 200, 200]; break;
							case 'vehicle': color = [240, 200, 80]; break;
							case 'trick': color = [160, 240, 40]; break;
						}

						const container = element.parentElement.parentElement;
						container.style.setProperty('background-color', `rgba(${color.join(',')},0.4)`);
						const actions = container.querySelector(".track-leaderboard-action");
						if (actions) {
							actions.setAttribute('class', 'core_icons core_icons-icon_featured_badge featured');
							actions.style.setProperty('width', '24px');
							for (const action of actions.children) {
								action.style.setProperty('opacity', 0);
							}
						}
					}
				}
			}
		}
		this.featuredGhostsLoaded = true;
	}

	initFriendsLastPlayed() {
		Application.Helpers.AjaxHelper.get(location.pathname).done(({ friends, is_profile_owner }) => {
			is_profile_owner || document.querySelectorAll('.friend-list-item-name').forEach(item => {
				item.after(this.constructor.createElement('div', {
					className: "friend-list-item-date",
					innerText: "Last Played " + friends.friends_data.find(({ d_name }) => d_name == item.innerText).activity_time_ago
				}));
			});
		});
	}

	initGhostPlayer() {
		this.replayGui = this.constructor.createElement('div', {
			style: {
				inset: 0,
				pointerEvents: 'none',
				position: 'absolute'
			}
		});
		this.replayGui.progress = this.replayGui.appendChild(this.constructor.createElement('progress', {
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
		let style = this.constructor.createElement('style', {
			textContent: `
				.ghost-player-progress::-webkit-progress-value {
					background-color: hsl(195deg 57% 25%);
				}

				.ghost-player-progress:hover {
					cursor: pointer;
					filter: brightness(1.25);
					height: 6px !important;
				}
			`
		});
		// create progress element
		this.constructor.waitForElm('#game-container > .gameGui').then(gameGui => {
			let shadowRoot = gameGui.attachShadow({ mode: 'open' });
			shadowRoot.appendChild(this.replayGui);
			shadowRoot.appendChild(style);
		});
	}

	refreshAchievements() {
		return fetch("/achievements?ajax").then(r => r.json()).then(response => {
			this.achievements.replaceChildren(...response.achievements.filter(a => !a.complete).sort((a, b) => b.tot_num - a.tot_num).slice(0, 3).map(this.constructor.createProgressElement.bind(this.constructor)));
			return response;
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
					className: "btn new-button button-type-1",
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

	static createProgressElement(achievement) {
		let container = this.createElement('div', {
			children: [
				this.createElement('a', {
					children: [
						this.createElement('b', {
							innerText: achievement.title
						}),
						this.createElement('h6', {
							innerText: achievement.desc,
							style: {
								color: 'darkgray',
								fontFamily: 'roboto_bold',
								margin: 0
							}
						})
					],
					href: '',
					style: {
						width: '-webkit-fill-available'
					}
				}),
				// achievement.coins
				this.createElement('span', {
					innerText: achievement.current, // achievement.progress // achievement.current + '/' + achievement.max
					style: {
						fontFamily: 'helsinki',
						fontSize: '2rem'
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
						for (const listener of options[attribute]) {
							element.addEventListener(attribute.slice(2), listener);
						}
					}
				} else if (/^style$/i.test(attribute)) {
					Object.assign(element[attribute.toLowerCase()], options[attribute]);
				}

				delete options[attribute];
			}
		}

		Object.assign(element, options);
		return typeof callback == 'function' && callback(element), element;
	}

	static waitForElm(selector) {
		return new Promise(resolve => {
			if (document.querySelector(selector)) {
				return resolve(document.querySelector(selector));
			}
	
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