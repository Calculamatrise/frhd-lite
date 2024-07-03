import "../utils/Storage.js";
import defaults from "../constants/defaults.js";

const state = document.querySelector('#state');
state.addEventListener('click', function() {
	if (this.classList.contains('update-available')) {
		return chrome.runtime.reload();
	}

	chrome.storage.proxy.local.set('enabled', !chrome.storage.proxy.local.get('enabled'))
}, { passive: true });

chrome.storage.local.onChanged.addListener(({ enabled, settings }) => {
	settings && restoreSettings(settings.newValue),
	enabled && setState(enabled.newValue)
});

chrome.storage.local.get(({ badges, enabled, settings }) => {
	for (const element of document.querySelectorAll('.notification')) {
		if (badges === false) {
			element.classList.remove('notification');
			continue;
		}

		element.addEventListener('click', event => {
			chrome.storage.local.set({ badges: false }).then(() => {
				event.target.classList.remove('notification')
			})
		}, { passive: true });
	}

	restoreSettings(settings),
	setState(enabled)
});

chrome.storage.session.get(({ updateAvailable = false }) => {
	updateAvailable && state.classList.add('update-available') // chrome.action.setBadgeText({ text: '' });
});

const resetSettings = document.querySelector('#reset-settings');
resetSettings.addEventListener('click', () => {
	confirm(`Are you sure you'd like to reset all your settings?`) && chrome.storage.local.set({ settings: defaults }).then(() => {
		alert("Your settings have successfully been reset.")
	})
}, { passive: true });

for (const item in defaults) {
	let element = document.getElementById(item);
	switch (item) {
	case 'bikeFrameColor':
	case 'bikeTireColor':
		element.parentElement.addEventListener('focusout', event => event.target.removeAttribute('tabindex'), { passive: true });
		element.addEventListener('click', event => {
			let t = event.target;
			if (t.parentElement.hasAttribute('tabindex')) {
				event.preventDefault();
				t.parentElement.removeAttribute('tabindex');
				return;
			}

			t.parentElement.setAttribute('tabindex', '0'),
			t.parentElement.focus()
		});
		let checkbox = document.querySelector(`#${item}-visible`);
		element.parentElement.addEventListener('contextmenu', event => {
			event.preventDefault(),
			checkbox.checked = !1,
			chrome.storage.proxy.local.settings.set(item, null)
		});
		element.addEventListener('input', event => {
			chrome.storage.proxy.local.settings.set(item, event.target.value),
			checkbox.checked = event.target.value !== '#000000'
		}, { passive: true });
		break;
	case 'brightness':
	case 'inputDisplayOpacity':
	case 'inputDisplaySize':
	case 'snapshots':
		element.addEventListener('input', event => {
			chrome.storage.proxy.local.settings.set(item, event.target.value | 0)
		}, { passive: true });
		break;
	case 'keymap':
		let action = document.querySelector('#keybind-action');
		action && action.addEventListener('change', event => {
			element.value && saveKeybind(element.value, event.target.value);
		}, { passive: true });
		element.addEventListener('keyup', event => {
			event.target.value.length > 0 && (event.target.value = event.key.toUpperCase());
			action.value !== 'default' && saveKeybind(event.key, action.value)
		}, { passive: true });
		function saveKeybind(key = element.value, value = action.value) {
			if (typeof key != 'string' || typeof value != 'string') return;
			chrome.storage.proxy.local.settings.keymap[key.toUpperCase()] = value;
			action && (action.value = 'default');
			element.value = null
		}
		break;
	case 'theme':
		for (const theme of document.querySelectorAll("input[name='theme']"))
			theme.addEventListener('input', function() {
				chrome.storage.proxy.local.settings.set(item, this.id)
			}, { passive: true });
		break;
	default:
		element && element.type === 'checkbox' && element.addEventListener('input', ({ target }) => {
			chrome.storage.proxy.local.settings.set(target.id, target.checked)
		}, { passive: true })
	}
}

document.documentElement.addEventListener('pointerdown', function (event) {
	this.style.setProperty('--offsetX', event.offsetX),
	this.style.setProperty('--offsetY', event.offsetY)
});

function setState(enabled) {
	state.classList[enabled ? 'add' : 'remove']('enabled');
	return enabled
}

function restoreSettings(data) {
	for (const item in data) {
		let element = document.getElementById(item);
		switch (item) {
		case 'bikeFrameColor':
		case 'bikeTireColor':
			element.parentElement.style.setProperty('background-color', (element.value = data[item] || '#000000') + '33');
			element.value !== '#000000' && (element = document.querySelector(`#${item}-visible`)) && (element.checked = true);
			break;
		case 'inputDisplayOpacity':
		case 'inputDisplaySize':
			element.parentElement.classList[data.inputDisplay ? 'remove' : 'add']('disabled');
		case 'brightness':
			element.value = data[item];
			var name = element.parentElement.querySelector('.name');
			name.textContent = name.textContent.replace(/(?<=\()([\d.]+)(?=\))/, element.value);
			break;
		case 'keymap':
			var action = document.querySelector('#keybind-action')
			  , entries = document.querySelector('#keybind-entries')
			  , keymap = Object.entries(data[item]);
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
						delete chrome.storage.proxy.local.settings.keymap[key]
					}
				}, { passive: true });
				select.replaceChildren(...Array.from(select.children).filter(opt => {
					return opt.value === select.value /*//*/ || opt.value === 'default';
				}));
				let remove = select.appendChild(document.createElement('option'));
				remove.innerText = 'Remove';
				remove.value = 'remove';
				select.addEventListener('pointerenter', () => select.disabled = !1, { passive: true });
				select.addEventListener('pointerleave', () => select.disabled = !0, { passive: true });
				let input = wrapper.appendChild(document.createElement('input'));
				input.setAttribute('type', 'text');
				input.readOnly = true;
				input.value = key.toUpperCase();
				return wrapper;
			}));
			break;
		case 'snapshots':
			element.value = data[item];
			element.parentElement.classList[data.playerTrail ? 'remove' : 'add']('disabled');
			element.parentElement.querySelector(".name").innerText = `Snapshot count (${element.value})`;
			break;
		case 'theme':
			(element = document.getElementById(data[item])) && (element.checked = true);
			break;
		default:
			element && element.type === 'checkbox' && (element.checked = data[item])
		}
	}
}