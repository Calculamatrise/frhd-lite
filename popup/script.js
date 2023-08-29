import "../utils/Storage.js";
import defaults from "../constants/defaults.js";

const state = document.querySelector('#state');
state.addEventListener('click', function () {
	if (this.classList.contains('update-available')) {
		return chrome.runtime.reload();
	}

	chrome.storage.proxy.local.set('enabled', !chrome.storage.proxy.local.get('enabled'));
});

chrome.storage.local.onChanged.addListener(function ({ enabled, settings }) {
	settings && restoreSettings(settings.newValue);
	enabled && setState(enabled.newValue);
});

chrome.storage.local.get(({ badges, enabled, settings }) => {
	for (const element of document.querySelectorAll('.notification')) {
		if (badges === false) {
			element.classList.remove('notification');
			continue;
		}

		element.addEventListener('click', function (event) {
			chrome.storage.local.set({ badges: false }).then(() => {
				event.target.classList.remove('notification');
			});
		});
	}

	restoreSettings(settings);
	setState(enabled);
});

chrome.storage.session.onChanged.addListener(function ({ isModerator }) {
	isModerator && (isModerator.newValue && import("./utils/moderation.js").then(({ dashboard }) => dashboard.classList[isModerator ? 'add' : 'remove']('notification')));
});

chrome.storage.session.get(async ({ isModerator = null, updateAvailable = false }) => {
	isModerator ??= await fetch("https://www.freeriderhd.com/account/settings?ajax").then(r => r.json()).then(async ({ user }) => {
		let isModerator = user && (user.admin || user.moderator || /^(blacktux|(pre)?calculus)$/.test(user.u_name));
		await chrome.storage.session.set({ isModerator });
		return isModerator;
	}).catch(console.warn);
	isModerator && import("./utils/moderation.js");
	if (updateAvailable) {
		state.classList.add('update-available');
		// chrome.action.setBadgeText({ text: '' });
	}
});

const resetSettings = document.querySelector('#reset-settings');
resetSettings.addEventListener('click', function () {
	if (confirm(`Are you sure you'd like to reset all your settings?`)) {
		chrome.storage.local.set({ settings: defaults }).then(() => {
			alert("Your settings have successfully been reset.");
		});
	}
});

for (const item in defaults) {
	let element = document.getElementById(item);
	switch (item) {
		case 'bikeFrameColor': {
			element.parentElement.addEventListener('focusout', function () {
				this.removeAttribute('tabindex');
			});
			element.addEventListener('click', function (event) {
				if (this.parentElement.hasAttribute('tabindex')) {
					event.preventDefault();
					this.parentElement.removeAttribute('tabindex');
					return;
				}

				this.parentElement.setAttribute('tabindex', '0');
				this.parentElement.focus();
			});
		}

		case 'inputDisplayOpacity':
		case 'inputDisplaySize':
		case 'snapshots': {
			element.addEventListener('input', function () {
				chrome.storage.proxy.local.settings.set(item, this.value);
				if (this.id === 'bikeFrameColor' && (element = document.querySelector(`#${item}-visible`)) !== null) {
					element.checked = this.value !== '#000000';
				}
			});
			break;
		}

		case 'keymap': {
			let action = document.querySelector('#keybind-action');
			action && action.addEventListener('change', function (event) {
				element.value && saveKeybind(element.value, event.target.value);
			});

			element.addEventListener('keyup', function (event) {
				this.value.length > 0 && (this.value = event.key.toUpperCase());
				action.value !== 'default' && saveKeybind(event.key, action.value);
			});

			function saveKeybind(key = element.value, value = action.value) {
				if (typeof key != 'string' || typeof value != 'string') return;
				chrome.storage.proxy.local.settings.keymap[key.toUpperCase()] = value;
				action && (action.value = 'default');
				element.value = null;
			}
			break;
		}

		case 'theme': {
			for (const theme of document.querySelectorAll("input[name='theme']")) {
				theme.addEventListener('input', function () {
					chrome.storage.proxy.local.settings.set(item, this.id);
				});
			}
			break;
		}

		default: {
			element && element.type === 'checkbox' && element.addEventListener('input', function () {
				chrome.storage.proxy.local.settings.set(this.id, !chrome.storage.proxy.local.settings.get(this.id));
			});
		}
	}
}

document.documentElement.addEventListener('pointerdown', function (event) {
	this.style.setProperty('--offsetX', event.offsetX);
	this.style.setProperty('--offsetY', event.offsetY);
});

function setState(enabled) {
	state.classList[enabled ? 'add' : 'remove']('enabled');
	return enabled;
}

function restoreSettings(data) {
	for (const item in data) {
		let element = document.getElementById(item);
		switch (item) {
			case 'bikeFrameColor':
				element.parentElement.style.setProperty('background-color', (element.value = data[item] || '#000000') + '33');
				element.value !== '#000000' && (element = document.querySelector(`#${item}-visible`)) && (element.checked = true);
				break;
			case 'inputDisplayOpacity':
			case 'inputDisplaySize':
				element.value = data[item];
				element.parentElement.classList[data.inputDisplay ? 'remove' : 'add']('disabled');
				let name = element.parentElement.querySelector('.name');
				name.textContent = name.textContent.replace(/(?<=\()([\d.]+)(?=\))/, element.value);
				break;
			case 'keymap': {
				let action = document.querySelector('#keybind-action');
				let entries = document.querySelector('#keybind-entries');
				let keymap = Object.entries(data[item]);
				entries.replaceChildren(...keymap.map(([key, value]) => {
					let wrapper = document.createElement('div');
					wrapper.classList.add('keybind-wrapper');
					let select = wrapper.appendChild(action.cloneNode(true));
					select.removeAttribute('id');
					select.disabled = true;
					select.value = value;
					// subject to change
					select.addEventListener('change', event => {
						if (event.target.value === 'remove') {
							delete chrome.storage.proxy.local.settings.keymap[key];
						}
					});
					select.replaceChildren(...Array.from(select.children).filter(opt => {
						return opt.value === select.value /*//*/ || opt.value === 'default';
					}));

					let remove = select.appendChild(document.createElement('option'));
					remove.innerText = 'Remove';
					remove.value = 'remove';
					//
					select.addEventListener('pointerenter', () => select.disabled = false);
					select.addEventListener('pointerleave', () => select.disabled = true);
					let input = wrapper.appendChild(document.createElement('input'));
					input.setAttribute('type', 'text');
					input.readOnly = true;
					input.value = key.toUpperCase();
					return wrapper;
				}));
				break;
			}

			case 'snapshots':
				element.value = data[item];
				element.parentElement.classList[data.playerTrail ? 'remove' : 'add']('disabled');
				element.parentElement.querySelector(".name").innerText = `Snapshot count (${element.value})`;
				break;
			case 'theme':
				(element = document.getElementById(data[item])) && (element.checked = true);
				break;
			default:
				element && element.type === 'checkbox' && (element.checked = data[item]);
		}
	}
}