import "../../utils/Storage.js";
import AjaxHelper from "../../utils/AjaxHelper.js";
import ClientPermissions from "../utils/ClientPermissions.js";

ClientPermissions.verify(['moderator']).then(isModerator => init(!isModerator));

let response = document.querySelector('body > pre');
let main = document.querySelector('body > main');
function init(replace) {
	replace ? (document.body.replaceChildren(response)) : document.body.replaceChildren(main);
	document.body.style.removeProperty('display')
}

setupSection(document.querySelector('section[caption="featured ghosts"]'), ['check-features']);
setupSection(document.querySelector('section[caption="tracks"]'), ['add-to-totd', 'feature-track', 'hide-track', 't_title']);
setupSection(document.querySelector('section[caption="users"]'), ['change-u_mailbox', 'change-u_name', 'u_name']);

function setupSection(section, identifiers) {
	for (let id of identifiers) {
		let element = section.querySelector('#' + id);
		if (!element) {
			console.warn('No element exists with the id "' + id + '"');
			continue;
		}

		switch (id) {
		case 'add-to-totd': {
			let t_id = section.querySelector('#t_title');
			let dialog = section.querySelector('#add-totd');
			let lives = section.querySelector('#lives');
			let refillCost = section.querySelector('#refill-cost');
			let gems = section.querySelector('#gems');
			let date = section.querySelector('#date');
			dialog.addEventListener('close', async function(event) {
				if (event.target.returnValue !== 'default') return;
				this.classList.add('loading');
				await AjaxHelper.post("/moderator/add_track_of_the_day", {
					t_id: t_id.value,
					lives: lives.valueAsNumber,
					rfll_cst: refillCost.valueAsNumber,
					gems: gems.valueAsNumber,
					d_ts: Math.floor(date.valueAsDate.getTime() / 1e3)
				}).then(res => {
					if (res.result !== true || res.result === false) {
						throw new Error(res.msg ?? "Something went wrong! Please try again.");
					}

					setResult({
						result: true,
						message: res.msg || JSON.stringify(res, null, 4)
					})
				}).catch(err => {
					setResult({
						result: false,
						message: err.message
					})
				});
				this.classList.remove('loading')
			}, { passive: true });
			element.addEventListener('click', function() {
				date.min = new Date().toISOString().slice(0, 10);
				date.valueAsDate = new Date();
				dialog.showModal()
			}, { passive: true });
			break;
		}

		case 'change-u_mailbox': {
			let u_name = section.querySelector('#u_name');
			let n_mailbox = section.querySelector('#n_mailbox');
			element.addEventListener('click', async function() {
				if (!n_mailbox.reportValidity()) {
					return;
				}

				this.classList.add('loading');
				await AjaxHelper.post("/moderator/change_email", {
					u_id: (chrome.storage.proxy.session.userCache ||= new Map()).get(u_name.value.toLowerCase()),
					email: n_mailbox.value
				}).then(res => {
					if (res.result !== true || res.result === false) {
						throw new Error(res.msg ?? "Something went wrong! Please try again.");
					}

					setResult({
						result: true,
						message: res.msg || JSON.stringify(res, null, 4)
					});
				}).catch(err => {
					setResult({
						result: false,
						message: err.message
					});
				});
				this.classList.remove('loading');
			}, { passive: true });
			break;
		}

		case 'change-u_name': {
			let u_name = section.querySelector('#u_name');
			let n_name = section.querySelector('#n_name');
			element.addEventListener('click', function() {
				this.classList.add('loading');
				chrome.storage.session.get(async ({ userCache }) => {
					await AjaxHelper.post("/moderator/change_username", {
						u_id: (chrome.storage.proxy.session.userCache ||= new Map()).get(u_name.value.toLowerCase()),
						username: n_name.value
					}).then(async res => {
						if (res.result === false || res.result !== true) {
							throw new Error(res.msg ?? "Something went wrong! Please try again.");
						}

						chrome.storage.proxy.session.userCache.set(n_name.value.toLowerCase(), chrome.storage.proxy.session.userCache.get(u_name.value.toLowerCase()));
						userCache.delete(u_name.value.toLowerCase());
						chrome.storage.session.set({ userCache }).then(() => {
							search.value = n_name.value;
							setResult({
								result: true,
								message: res.msg || JSON.stringify(res, null, 4)
							});
						});
					}).catch(err => {
						setResult({
							result: false,
							message: err.message
						});
					});
					this.classList.remove('loading');
				});
			}, { passive: true });
			break;
		}

		case 'check-features': {
			let progress = section.querySelector('progress');
			let dialog = section.querySelector('#featured-ghosts');
			let stolen = section.querySelector('#stolen-ghosts');
			let textarea = dialog.querySelector('#data');
			element.addEventListener('click', async function() {
				this.classList.add('loading');
				await fetch("https://raw.githubusercontent.com/Calculamatrise/frhd-featured-ghosts/master/data.json")
				.then(r => r.json())
				.then(async data => {
					let categories = [];
					auto.checked && categories.push('auto');
					fast.checked && categories.push('fast');
					vehicle.checked && categories.push('vehicle');
					other.checked && categories.push('other');
					let surpassed = [];
					let parsedData = Object.values(data).flatMap(races => Object.keys(races));
					let filteredData = Object.fromEntries(Object.entries(data).map(([player, races]) => [player, Object.fromEntries(Object.entries(races).filter(([,type]) => type !== 'trick' && categories.includes(type)))]));
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

								return r.track_leaderboard
							});
							let [username] = /(?<=\/r\/)[^/]+/.exec(feature);
							let victim = leaderboard.find(entry => entry.user && entry.user.u_name === username);
							let index = leaderboard.indexOf(victim);
							if (index > 0) {
								let thief = leaderboard[index - 1];
								let thiefRaceURL = 'frhd.co/t/' + t_id + '/r/' + thief.user.u_name;
								if (thief.run_time > "0:05.00" && (ties.checked || thief.run_time < victim.run_time) && parsedData.indexOf(thiefRaceURL) === -1) { // add unsure section? // && (!ties.checked || entry.run_time)
									let [thiefMain] = !data[thief.user.d_name] && Object.entries(data).find(([,races]) => Object.keys(races).find(race => race.match(new RegExp('/r/' + thief.user.u_name + '$', 'i')))) || [];
									surpassed.push({
										thief: {
											displayName: thiefMain || thief.user.d_name,
											raceURL: thiefRaceURL
										},
										tied: thief.run_time == victim.run_time,
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

							textarea.value = modifications > 0 && JSON.stringify(data, null, 4) || null
						}, { passive: true });
						// let link = label.appendChild(document.createElement('a'));
						// link.setAttribute('href', record.thief.raceURL.replace(/^(https?)?:?(\/{2})?/, 'https://'));
						// link.setAttribute('target', '_blank');
						// link.innerText = record.victim.displayName + "'s feature was stolen by " + record.thief.displayName // record.victim.raceURL;
						let victim = label.appendChild(document.createElement('a'));
						victim.setAttribute('href', 'https://frhd.co/u/' + record.victim.displayName);
						victim.setAttribute('target', '_blank');
						victim.innerText = record.victim.displayName;
						label.append("'s ");
						let link = label.appendChild(document.createElement('a'));
						link.setAttribute('href', record.thief.raceURL.replace(/^(https?)?:?(\/{2})?/, 'https://'));
						link.setAttribute('target', '_blank');
						link.innerText = 'feature';
						label.append(" was " + (record.tied ? 'tied' : 'stolen') + " by ");
						let thief = label.appendChild(document.createElement('a'));
						thief.setAttribute('href', 'https://frhd.co/u/' + record.thief.displayName);
						thief.setAttribute('target', '_blank');
						thief.innerText = record.thief.displayName;
						return label
					}));
					progress.style.setProperty('display', 'none');
					dialog.showModal()
				}).catch(err => {
					setResult({
						result: false,
						message: err.message
					})
				});
				this.classList.remove('loading')
			}, { passive: true });
			break;
		}

		case 'feature-track': {
			let t_id = section.querySelector('#t_title');
			element.addEventListener('click', async function() {
				this.classList.add('loading');
				await AjaxHelper.get("/track_api/feature_track/" + t_id.value + "/1").then(res => {
					if (res.result !== true || res.result === false) {
						throw new Error(res.msg ?? "Something went wrong! Please try again.");
					}

					setResult({
						result: true,
						message: res.msg || JSON.stringify(res, null, 4)
					});
				}).catch(err => {
					setResult({
						result: false,
						message: err.message
					});
				});
				this.classList.remove('loading');
			}, { passive: true });
			break;
		}

		case 'hide-track': {
			let t_id = section.querySelector('#t_title');
			element.addEventListener('click', async function() {
				this.classList.add('loading');
				await AjaxHelper.get("/moderator/hide_track/" + t_id.value).then(res => {
					if (res.result !== true || res.result === false) {
						throw new Error(res.msg ?? "Something went wrong! Please try again.");
					}

					setResult({
						result: true,
						message: res.msg || JSON.stringify(res, null, 4)
					})
				}).catch(err => {
					setResult({
						result: false,
						message: err.message
					})
				});
				this.classList.remove('loading')
			}, { passive: true });
			break;
		}

		case 't_title': {
			let dropdown = section.querySelector('#t_title-search-results');
			element.addEventListener('input', async function() {
				dropdown.replaceChildren(...await AjaxHelper.trackSearch(this.value, track => {
					this.value = parseInt(track.slug);
					dropdown.replaceChildren()
				}))
			}, { passive: true });
			break;
		}

		case 'u_name': {
			let dropdown = section.querySelector('#u_name-search-results');
			element.addEventListener('input', async function() {
				dropdown.replaceChildren(...await AjaxHelper.userSearch(this.value, data => {
					this.value = data.d_name;
					dropdown.replaceChildren()
				}))
			}, { passive: true })
		}
		}
	}

	let result = section.querySelector('#result');
	function setResult(options = {}) {
		result.classList[options.result ? 'add' : 'remove']('success'),
		result.classList[options.result ? 'remove' : 'add']('error'),
		result.innerText = String(options.message)
	}
}