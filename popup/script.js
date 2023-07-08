import "../utils/Storage.js";
import defaults from "../constants/defaults.js";
import restoreSettings from "./utils/restoreSettings.js";

chrome.storage.local.onChanged.addListener(function ({ enabled, settings }) {
	settings && restoreSettings(settings.newValue);
	enabled && setState(enabled.newValue);
});

chrome.storage.local.get(({ badges, enabled, settings }) => {
	for (const element of document.querySelectorAll(".notification")) {
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
	isModerator && (isModerator.newValue && import("./utils/modTools.js").then(({ dashboard }) => dashboard.classList[isModerator ? 'add' : 'remove']('notification')));
});

chrome.storage.session.get(async ({ isModerator = null }) => {
	if (isModerator !== null) {
		isModerator && import("./utils/modTools.js");
		return;
	}

	isModerator = await fetch("https://www.freeriderhd.com/account/settings").then(res => {
		if (!res.user) {
			throw new Error(res.msg ?? "Something went wrong! Please try again.");
		}

		return res.user.moderator;
	}).catch(err => false);
	chrome.storage.session.set({ isModerator });
});

const toggleState = document.querySelector('#state');
toggleState.addEventListener('click', function () {
	chrome.storage.proxy.local.set('enabled', !chrome.storage.proxy.local.get('enabled'));
});

const showAdvanced = document.querySelector('#advanced-options');
showAdvanced.addEventListener('change', function () {
	this.checked && this.parentElement.scrollIntoView({ behavior: "smooth" });
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
			element.addEventListener('click', function () {
				this.style.setProperty('display', 'block');
				if (this.parentElement.hasAttribute('tabindex')) {
					this.style.setProperty('display', 'none');
					setTimeout(() => this.style.setProperty('display', 'block'), 1);
					return this.parentElement.removeAttribute('tabindex');
				}

				this.parentElement.setAttribute('tabindex', '0');
				this.parentElement.focus();
			});
			break;
		}

		case 'inputDisplaySize':
		case 'snapshots': {
			element.addEventListener("input", function () {
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
				if (element.value) {
					chrome.storage.proxy.local.settings.keymap[element.value] = event.target.value;
					action && (action.value = 'default');
					element.value = null;
					return;
				}
			});

			element.addEventListener('keyup', function (event) {
				if (action.value !== 'default') {
					chrome.storage.proxy.local.settings.keymap[event.key] = action.value;
					action && (action.value = 'default');
					this.value = null;
					return;
				}

				this.value.length > 0 && (this.value = event.key.toUpperCase());
			});
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

function setState(enabled) {
	let state = document.querySelector('#state');
	state && state.classList[enabled ? 'add' : 'remove']('enabled');
	return enabled;
}

document.documentElement.addEventListener('pointerdown', function (event) {
	this.style.setProperty('--offsetX', event.offsetX);
	this.style.setProperty('--offsetY', event.offsetY);
});