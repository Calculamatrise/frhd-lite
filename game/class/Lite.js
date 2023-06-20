window.lite = new class {
	featuredGhostsLoaded = false;
	loaded = false;
	storage = new Map(Object.entries(JSON.parse(sessionStorage.getItem('lite'))));
	snapshots = new class extends Array {
		push(...args) {
			if (this.length >= parseInt(lite.storage.get('snapshots'))) {
				this.splice(0, this.length - parseInt(lite.storage.get('snapshots')));
			}

			super.push(...args);
		}
	}

	constructor() {
		Application.events.subscribe('route', () => this.loaded = false);
		Application.events.subscribe('mainview.loaded', this.childLoad.bind(this));
		GameManager.on('stateChange', (state) => {
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
					this.storage = new Map(Object.entries(data.storage));
					break;
			}

			this.refresh();
		});
	}

	get game() {
		return GameManager.game;
	}

	get focusOverlay() {
		return this.game.gameContainer.querySelector(".gameFocusOverlay");
	}

	load() {
        this.snapshots.splice(0, this.snapshots.length);
        this.refresh();
        return true;
    }

	childLoad() {
		this.storage.get('featuredGhostsDisplay') && this.featuredGhostsLoaded || this.initFeaturedGhosts();
		this.storage.get('accountManager') && this.initAccountManager();
		location.pathname.match(/^\/u\//i) && this.initFriendsLastPlayed();
	}

	refresh() {
		let keymap = this.storage.get('keymap');
		this.game.currentScene.playerManager.firstPlayer._gamepad.setKeyMap(this.game.settings[(this.game.currentScene.hasOwnProperty('races') ? 'play' : 'editor') + 'Hotkeys']);
		for (let key in keymap) {
			this.game.currentScene.playerManager.firstPlayer._gamepad.keymap[key.charCodeAt()] = keymap[key];
		}

		this.game.currentScene.playerManager.firstPlayer._baseVehicle.color = this.storage.get("bikeFrameColor") || "#".padEnd(7, this.storage.get("theme") == "midnight" ? "C" : this.storage.get("theme") == "dark" ? "FB" : "0");
		// this.game.currentScene.message.color = (this.storage.get('theme') === 'midnight' || this.storage.get('theme') === 'dark') ? "#ccc" : "#333";
		this.game.currentScene.score.best_time.color = (this.storage.get('theme') === 'midnight' || this.storage.get('theme') === 'dark') ? "#888" : "#999";
		this.game.currentScene.score.best_time_title.color = (this.storage.get('theme') === 'midnight' || this.storage.get('theme') === 'dark') ? "#888" : "#999";
		this.game.currentScene.score.goals.color = this.storage.get('theme') === 'midnight' ? "#ddd" : this.storage.get('theme') === 'dark' ? "#fff" : "#000";
		this.game.currentScene.score.time.color = this.storage.get('theme') === 'midnight' ? "#ddd" : this.storage.get('theme') === 'dark' ? "#fff" : "#000";
		this.game.currentScene.score.time_title.color = (this.storage.get('theme') === 'midnight' || this.storage.get('theme') === 'dark') ? "#888" : "#999";
		if (this.game.currentScene.hasOwnProperty('raceTimes')) {
			this.game.currentScene.raceTimes.container.color = this.storage.get('theme') === 'midnight' ? "#ddd" : this.storage.get('theme') === 'dark' ? "#fff" : "#000";
			// this.game.currentScene.raceTimes.raceList.forEach((race) => {
			//     race.children.forEach(element => {
			//         element.color = this.storage.get('theme') === 'midnight' ? "#ddd" : this.storage.get('theme') === 'dark' ? "#fff" : "#000";
			//     });
			// });
		}

		if (this.game.currentScene.hasOwnProperty('campaignScore')) {
			this.game.currentScene.campaignScore.container.color = this.storage.get('theme') === 'midnight' ? "#ddd" : this.storage.get('theme') === 'dark' ? "#fff" : "#000";
			this.game.currentScene.campaignScore.container.children.forEach(medal => {
				medal.color = this.storage.get('theme') === 'midnight' ? "#ddd" : this.storage.get('theme') === 'dark' ? "#fff" : "#000";
				// medal.children.forEach(element => {
				//     element.color = this.storage.get('theme') === 'midnight' ? "#ddd" : this.storage.get('theme') === 'dark' ? "#fff" : "#000";
				// });
			});
		}

		this.game.settings.physicsLineColor = this.storage.get('theme') === 'midnight' ? "#ccc" : this.storage.get('theme') === 'dark' ? "#fdfdfd" : "#000";
		this.game.settings.sceneryLineColor = this.storage.get('theme') === 'midnight' ? "#444" : this.storage.get('theme') === 'dark' ? "#666" : "#aaa";
		this.game.currentScene.toolHandler.options.gridMinorLineColor = this.storage.get('theme') === 'midnight' ? "#20282e" : this.storage.get('theme') === 'dark' ? "#252525" : "#eee";
		this.game.currentScene.toolHandler.options.gridMajorLineColor = this.storage.get('theme') === 'midnight' ? "#161b20" : this.storage.get('theme') === 'dark' ? "#3e3e3e" : "#ccc";
		this.game.canvas.style.setProperty("background-color", this.storage.get('theme') === 'midnight' ? "#1d2328" : this.storage.get('theme') === 'dark' ? "#1b1b1b" : "#fff");
		if (this.focusOverlay) {
			this.focusOverlay.style.setProperty("background-color", this.storage.get('theme') === 'midnight' ? "#333b" : this.storage.get('theme') === 'dark' ? "#000b" : "#fffb");
		}

		this.game.currentScene.redraw();
	}

	update() {
		this.storage.get('inputDisplay') && this.drawInputDisplay(this.game.canvas);
	}

	drawInputDisplay(canvas = document.createElement('canvas')) {
		const ctx = canvas.getContext('2d');
		const color = (condition => condition ? (theme => '#' + (theme === 'midnight' ? '444' : theme === 'dark' ? '000' : 'fff'))(this.storage.get('theme')) : fill);
		const fill = (theme => '#' + (theme === 'midnight' ? 'ddd' : theme === 'dark' ? 'fff' : '000'))(this.storage.get('theme'));
		const gamepad = this.game.currentScene.playerManager._players[this.game.currentScene.camera.focusIndex]._gamepad.downButtons;
		const size = parseInt(this.storage.get('inputDisplaySize'));
		const offset = {
			x: size,
			y: canvas.height - size * 10
		}

		ctx.save();
		ctx.fillStyle = fill;
		ctx.font = size * 3 + 'px Arial';
		ctx.lineCap = 'round';
		ctx.lineJoin = 'round';
		ctx.lineWidth = size / 2;
		ctx.strokeStyle = fill;
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';

		ctx.beginPath();
		ctx.roundRect(offset.x, offset.y, size * 4, size * 4, 4);
		ctx.stroke();
		gamepad.z && ctx.fill();
		ctx.beginPath();
		ctx.roundRect(offset.x + 5 * size, offset.y, size * 4, size * 4, 4);
		ctx.stroke();
		gamepad.up && ctx.fill();
		ctx.beginPath();
		ctx.roundRect(offset.x, offset.y + 5 * size, size * 4, size * 4, 4);
		ctx.stroke();
		gamepad.left && ctx.fill();
		ctx.beginPath();
		ctx.roundRect(offset.x + 5 * size, offset.y + 5 * size, size * 4, size * 4, 4);
		ctx.stroke();
		gamepad.down && ctx.fill();
		ctx.beginPath();
		ctx.roundRect(offset.x + 10 * size, offset.y + 5 * size, size * 4, size * 4, 4);
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

		this.refreshAchievements().then(function(response) {
			this.countdown.innerText = [String(Math.floor(response.time_left / 3600)).padStart(2, '0'), String(Math.floor((response.time_left % 3600) / 60)).padStart(2, '0'), String(Math.floor(response.time_left % 60)).padStart(2, '0')].join(':');
			this.countdownTimer = setInterval(function() {
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

			waitForElm('#right_content').then((elm) => {
				elm.prepend(this.achievementsContainer);
			});
		});

		let refresh = this.refreshAchievements;
		Application.Helpers.AjaxHelper._check_event_notification = function(e) {
            Object.getPrototypeOf(Application.Helpers.AjaxHelper)._check_event_notification.apply(this, arguments);
            if ("undefined" != typeof e.data && ("undefined" != typeof e.data.achievements_earned)) {
                Application.events.publish("achievementsEarned", e.data.achievements_earned);
                refresh(); // add animation? // refresh everything
            }

            // console.log("other", e);
            refresh() // only update percentages
        }
	}

	featuredGhosts = null
	initFeaturedGhosts() {
		const render_leaderboards = Application.Views.TrackView.prototype._render_leaderboards;
		Application.Views.TrackView.prototype._render_leaderboards = async function(n) {
			render_leaderboards.apply(this, arguments);
			lite.featuredGhosts ||= await fetch("https://raw.githubusercontent.com/calculamatrise/frhd_featured_ghosts/master/data.json").then(r => r.json());
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
		Application.Helpers.AjaxHelper.get(location.pathname).done((response) => {
			if (document.querySelector(".friend-list.friends-all.active")) {
				for (const element of document.querySelector(".friend-list.friends-all.active").children) {
					if (element.querySelector(".friend-list-item-date") !== null) break;
					element.querySelector(".friend-list-item-info").appendChild(this.constructor.createElement("div", {
						className: "friend-list-item-date",
						innerText: "Last Played " + response.friends.friends_data.find((user) => user.d_name == element.querySelector(".friend-list-item-name.bold").innerText).activity_time_ago
					}));
				}
			}
		});
	}

	refreshAchievements() {
		return fetch("/achievements?ajax").then(r => r.json()).then(function(response) {
            this.achievements.replaceChildren(...response.achievements.filter(a => !a.complete).sort((a, b) => b.tot_num - a.tot_num).slice(0, 3).map(this.constructor.createProgressElement));
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

	static createProgressElement() {
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

	static createElement(type, options) {
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
}