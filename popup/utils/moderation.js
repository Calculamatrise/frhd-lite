import AjaxHelper from "../../utils/AjaxHelper.js";

const nav = document.body.querySelector('nav');
export const dashboard = document.createElement('label');
dashboard.classList.add('tab', 'ripple');
dashboard.innerText = 'Dashboard';
dashboard.setAttribute('for', 'dashboard');
dashboard.addEventListener('click', function (event) {
	event.target.classList.remove("notification");
	if (event.altKey) {
		chrome.tabs.create({
			url: chrome.runtime.getURL('/dashboard/index.html')
		});
	}
});

nav.prepend(dashboard);

setupSection(document.querySelector('.details:has(> #featured-ghosts-dashboard)'), ['check-features']);
setupSection(document.querySelector('.details:has(> #users-dashboard)'), ['change-uemail', 'change-uname', 'uname-add', 'uname-query']);

function setupSection(section, identifiers) {
	for (let id of identifiers) {
		let element = section.querySelector('#' + id);
		if (!element) {
			console.warn('No element exists with the id "' + id + '"');
			continue;
		}

		switch (id) {
			case 'check-features':
				let progress = section.querySelector('progress');
				let dialog = section.querySelector('#result');
				let stolen = section.querySelector('#stolen-ghosts');
				let textarea = dialog.querySelector('textarea');
				element.addEventListener('click', async function() {
					this.classList.add('loading');
					await fetch("https://raw.githubusercontent.com/Calculamatrise/frhd-featured-ghosts/master/data.json")
					.then(r => r.json())
					.then(async data => {
						let surpassed = [];
						let parsedData = Object.values(data).flatMap(races => Object.keys(races));
						let filteredData = Object.fromEntries(Object.entries(data).map(([player, races]) => [player, Object.fromEntries(Object.entries(races).filter(([,type]) => !/^(auto|other|trick)$/i.test(type)))]));
						progress.setAttribute('max', Object.values(filteredData).flatMap(races => Object.keys(races)).length);
						progress.style.removeProperty('value', 0);
						progress.style.removeProperty('display');
						for (let player in filteredData) {
							for (let feature in filteredData[player]) {
								let [t_id] = /(?<=\/t\/)\d+/.exec(feature);
								let leaderboard = await AjaxHelper.post('/track_api/load_leaderboard', { t_id }).then(r => {
									if (r.result !== true) {
										throw new Error(r.msg ?? "Something went wrong! Please try again.");
									}

									return r.track_leaderboard;
								});

								let [username] = /(?<=\/r\/)[^/]+/.exec(feature);
								let index = leaderboard.findIndex(entry => entry.user && entry.user.u_name === username);
								if (index > 0) {
									let thief = leaderboard[index - 1];
									let thiefRaceURL = 'frhd.co/t/' + t_id + '/r/' + thief.user.u_name;
									if (thief.run_time > "0:10.00" && parsedData.indexOf(thiefRaceURL) === -1) { // add unsure section?
										let [thiefMain] = !data[thief.user.d_name] && Object.entries(data).find(([,races]) => Object.keys(races).find(race => race.match(new RegExp('/r/' + thief.user.u_name + '$', 'i')))) || [];
										surpassed.push({
											thief: {
												displayName: thiefMain || thief.user.d_name,
												raceURL: thiefRaceURL
											},
											type: filteredData[player][feature],
											victim: {
												displayName: player,
												raceURL: feature
											}
										});
									}
								}

								progress.value++;
							}
						}

						let modifications = 0;
						stolen.replaceChildren(...surpassed.map(record => {
							let label = document.createElement('label');
							let input = label.appendChild(document.createElement('input'));
							input.setAttribute('type', 'checkbox');
							input.addEventListener('change', event => {
								if (event.target.checked) {
									(data[record.thief.displayName] ||= {})[record.thief.raceURL] = record.type;
									if (Object.keys(data[record.victim.displayName] > 1)) {
										delete data[record.victim.displayName][record.victim.raceURL];
									} else {
										delete data[record.victim.displayName];
									}

									modifications++
								} else {
									(data[record.victim.displayName] ||= {})[record.victim.raceURL] = record.type;
									if (Object.keys(data[record.thief.displayName] > 1)) {
										delete data[record.thief.displayName][record.thief.raceURL];
									} else {
										delete data[record.thief.displayName];
									}

									modifications--
								}

								textarea.value = modifications > 0 && JSON.stringify(data, null, 4) || null;
							});
							let link = label.appendChild(document.createElement('a'));
							link.setAttribute('href', record.thief.raceURL.replace(/^(https?)?:?(\/{2})?/, 'https://'));
							link.setAttribute('target', '_blank');
							link.innerText = record.victim.raceURL;
							return label;
						}));
						progress.style.setProperty('display', 'none');
						dialog.style.removeProperty('display');
					}).catch(err => {
						setResult({
							result: false,
							message: err.message
						});
					});

					this.classList.remove('loading');
				});
				break;
			case 'uname-add':
				let dropdown = section.querySelector('.dropdown > main');
				let query = section.querySelector('#uname-query');
				let users = section.querySelector('#users');
				let template = section.querySelector('#user-actions');
				element.addEventListener('click', async function() {
					this.classList.add('loading');
					await fetch('https://www.freeriderhd.com/u/' + query.value + '?ajax').then(r => r.json()).then(({ user }) => {
						if (!user || section.querySelector('details > summary[data-u_id="' + user.u_id + '"]')) return;
						createUserActions(user);
						chrome.storage.proxy.session.workingUsers ||= {};
						chrome.storage.proxy.session.workingUsers.set(user.u_id, user);
					});

					dropdown.replaceChildren();
					query.value = null;
					this.classList.remove('loading');
				});

				let workingUsers = chrome.storage.proxy.session.workingUsers;
				for (let id in workingUsers) {
					createUserActions(workingUsers[id]);
				}

				function createUserActions(user) {
					let actions = template.content.cloneNode(true);
					let summary = actions.querySelector('summary');
					summary.dataset.u_id = user.u_id;
					summary.prepend(user.d_name);
					let banned = actions.querySelector('#' + (user.banned ? '' : 'un') + 'ban-user');
					banned && banned.style.setProperty('display', 'none');
					let classic = actions.querySelector('#set-official-author');
					classic.innerText = (user.classic ? 'Re' : 'In') + 'voke Official Author';
					for (let div of users.children) {
						div.open = false;
					}
			
					users.appendChild(attachComponents(actions));
					summary.scrollIntoView({ behavior: 'smooth' });
				}
				break;
			case 'uname-query': {
				let add = section.querySelector('#uname-add');
				let dropdown = section.querySelector('.dropdown > main');
				element.addEventListener('input', async function() {
					dropdown.replaceChildren(...await AjaxHelper.userSearch(this.value, data => {
						this.value = data.d_name;
						add.click();
					}));
				});
				break;
			}
		}
	}

	let result = section.querySelector('#result');
	function setResult(options = {}) {
		result.classList[options.result ? 'add' : 'remove']('success');
		result.classList[options.result ? 'remove' : 'add']('error');
		result.innerText = String(options.message);
	}
}

function attachComponents(template) {
	let search = template.querySelector('summary');
	let remove = search.querySelector('button');
	remove.addEventListener('click', () => {
		chrome.storage.proxy.session.workingUsers.delete(search.dataset.u_id);
		search.parentElement.remove();
	});
	let dname = search.firstChild.textContent;
	let uname = dname.toLowerCase();
	let banUser = template.querySelector('#ban-user');
	banUser.addEventListener('click', async function () {
		if (!confirm(`Are you sure you want to ban ${dname}?`)) {
			return alert("Operation cancelled.");
		}

		this.classList.add('loading');
		await AjaxHelper.post("/moderator/ban_user", {
			u_id: chrome.storage.proxy.session.userCache.get(uname)
		}).then(res => {
			alert(res.msg);
			unBanUser.style.removeProperty('display');
			banUser.style.setProperty('display', 'none');
			chrome.storage.proxy.session.workingUsers[search.dataset.u_id].set('banned', true);
		}).catch(err => alert(err.message));
		this.classList.remove('loading');
	});

	let unBanUser = template.querySelector('#unban-user');
	unBanUser.addEventListener('click', async function () {
		this.classList.add('loading');
		await AjaxHelper.post("/moderator/unban_user", {
			u_id: chrome.storage.proxy.session.userCache.get(uname)
		}).then(res => {
			alert(res.msg);
			banUser.style.removeProperty('display');
			unBanUser.style.setProperty('display', 'none');
			chrome.storage.proxy.session.workingUsers[search.dataset.u_id].set('banned', false);
		}).catch(err => alert(err.message));
		this.classList.remove('loading');
	});

	let changeEmail = template.querySelector('#change-uemail');
	changeEmail.addEventListener('click', async function () {
		const newValue = prompt("Enter the new email for " + dname);
		if (newValue === null) {
			return alert("Operation cancelled.");
		} else if (newValue === dname) {
			return alert("No changes made.");
		} else if (!/^[\w\.-]*@\w+(\.\w+)+$/.test(newValue) && !confirm(`The following email address may be invalid: ${newValue}. Would you like to continue?`)) {
			return this.dispatchEvent(new MouseEvent('click'));
		}

		this.classList.add('loading');
		await AjaxHelper.post("/moderator/change_email", {
			u_id: chrome.storage.proxy.session.userCache.get(uname),
			email: newValue
		}).then(res => alert(res.msg)).catch(err => alert(err.message));
		this.classList.remove('loading');
	});

	let changeUsername = template.querySelector('#change-uname');
	changeUsername.addEventListener('click', async function () {
		const newValue = prompt("Enter the new username", dname);
		if (newValue === null) {
			return alert("Operation cancelled.");
		} else if (newValue === dname) {
			return alert("No changes made.");
		} else if (!confirm(`Are you sure you want to change ${dname}'s username to ${newValue}?`)) {
			return this.dispatchEvent(new MouseEvent('click'));
		}

		this.classList.add('loading');
		await AjaxHelper.post("/moderator/change_username", {
			u_id: chrome.storage.proxy.session.userCache.get(uname),
			username: newValue
		}).then(res => {
			if (res.result !== true && res.msg !== 'Username changed')
				throw new Error(res.msg || 'Something went wrong! Please try again.');

			alert(res.msg);
			chrome.storage.proxy.session.userCache.delete(uname);
			dname = newValue;
			uname = dname.toLowerCase();
			search.firstChild.textContent = dname;
			chrome.storage.proxy.session.userCache.set(uname, search.dataset.u_id);
			chrome.storage.proxy.session.workingUsers[search.dataset.u_id].set('d_name', dname);
			chrome.storage.proxy.session.workingUsers[search.dataset.u_id].set('u_name', uname);
		}).catch(err => {
			if (err.message == 'Username changed') {
				chrome.storage.proxy.session.userCache.delete(uname);
				dname = newValue,
				uname = dname.toLowerCase(),
				search.firstChild.textContent = dname;
				chrome.storage.proxy.session.userCache.set(uname, search.dataset.u_id);
				chrome.storage.proxy.session.workingUsers[search.dataset.u_id].set('d_name', dname);
				chrome.storage.proxy.session.workingUsers[search.dataset.u_id].set('u_name', uname);
			}

			alert(err.message);
		});
		this.classList.remove('loading');
	});

	let toggleOA = template.querySelector('#set-official-author');
	toggleOA.addEventListener('click', async function () {
		this.classList.add('loading');
		await AjaxHelper.post("/moderator/toggle_official_author/" + chrome.storage.proxy.session.userCache.get(uname)).then(res => {
			alert(res.msg);
			let isOA = /^in/i.test(toggleOA.innerText);
			toggleOA.innerText = isOA ? toggleOA.innerText.replace('In', 'Re') : toggleOA.innerText.replace('Re', 'In');
			chrome.storage.proxy.session.workingUsers[search.dataset.u_id].set('classic', !isOA);
		}).catch(err => alert(err.message));
		this.classList.remove('loading');
	});

	return template;
}