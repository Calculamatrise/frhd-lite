import "../utils/Storage.js";
import defaults from "../constants/defaults.js";

const state = document.querySelector('#state');
state.addEventListener('click', function(event) {
	if (this.classList.contains('update-available')) {
		return chrome.runtime.reload();
	} else if (event.altKey && event.shiftKey) {
		return window.open(chrome.runtime.getURL('dashboard/index.html'))
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
	case 'colorPalette':
		for (let element of document.querySelectorAll('[id^=' + item + ']:not([id$=-visible])')) {
			integrateLabelShortcut.call(element);
		}
		break;
	case 'cosmetics':
		let dialog = document.querySelector('dialog.prompt')
		  , skuInput = dialog.querySelector('input[type="text"]#skuid')
		  , dropdown = dialog.querySelector('.options')
		  , cosmetics;
		  skuInput.addEventListener('input', async () => {
			cosmetics || (cosmetics = await fetchCosmeticSkus());
			dropdown.replaceChildren(...cosmetics
				.filter(sku => sku.toLowerCase().includes(skuInput.value.toLowerCase()))
				.sort((a, b) => {
					if (a.toLowerCase().indexOf(skuInput.value.toLowerCase()) > b.toLowerCase().indexOf(skuInput.value.toLowerCase())) {
						return 1;
					} else if (a.toLowerCase().indexOf(skuInput.value.toLowerCase()) < b.toLowerCase().indexOf(skuInput.value.toLowerCase())) {
						return -1;
					}

					return a > b ? 1 : -1;
				})
				.slice(0, 15)
				.map(sku => {
					let element = document.createElement('button');
					element.classList.add('ripple'),
					element.style.setProperty('min-height', 'min-content'),
					element.style.setProperty('text-align', 'left'),
					element.innerText = sku.replace(/_/g, ' ').replace(/(?<!\w)\w/g, c => c.toUpperCase()),
					element.addEventListener('click', event => {
						event.preventDefault(),
						event.stopPropagation(),
						event.stopImmediatePropagation(),
						skuInput.value = sku,
						dropdown.replaceChildren()
					});
					return element
				})
			)
		}),
		dialog.addEventListener('close', ({ target }) => {
			switch (target.returnValue) {
			case 'cancel':
				return;
			default:
				chrome.storage.proxy.local.settings[item].set('head', skuInput.value),
				skuInput.value = null
			}
		});
		for (let element of document.querySelectorAll('[id^=' + item + ']')) {
			element.addEventListener('change', async ({ target }) => target.checked || (delete target.dataset.sku,
			chrome.storage.proxy.local.settings[item].delete(target.id.replace(/.+\./g, '')),
			chrome.storage.proxy.local.settings[item].set('options', {}),
			chrome.storage.proxy.local.settings[item].delete('options')), { passive: true }),
			element.addEventListener('click', async event => {
				if (!event.target.checked) return;
				event.preventDefault();
				// dialog.showModal();
				let value = event.target.checked || null;
				while (value === true) {
					let sku = prompt('Enter item SKU id:');
					if (sku === null) return;
					sku = sku.toLowerCase().replace(/\s+/g, '_');
					await fetch('https://cdn.kanoapps.com/free_rider_hd/assets/inventory/head/scripts/v5/' + sku + '.js').then(r => {
						if (!r.ok || r.status >= 400) return;
						value = sku,
						event.target.dataset.sku = sku,
						event.target.checked = true;
						return r.text().then(t => {
							let variable = t.match(/\w+(?==this\.colors)/g);
							if (!variable) return;
							let options = t.match(new RegExp('(?<=' + variable + '\\.)\\w+', 'g'));
							options && (options = Array.from(new Set(options))) || (options = []);
							chrome.storage.proxy.local.settings[item].set('options', Object.fromEntries(options.map(opt => [opt, null])))
						})
					})
				}
				chrome.storage.proxy.local.settings[item].set(event.target.id.replace(/.+\./g, ''), value)
			});
		}
		break;
	case 'filterDuplicatePowerups':
		element.addEventListener('input', event => {
			if (event.target.checked && !confirm("Are you sure you want to enable this feature? It may cause some of your ghosts to break!")) {
				event.preventDefault(),
				event.target.checked = false;
				return;
			}
			chrome.storage.proxy.local.settings.set(event.target.id, event.target.checked)
		});
		continue;
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
			}, { passive: true })
	}
	if (!element) continue;
	switch (element.type.toLowerCase()) {
	case 'checkbox':
		element.addEventListener('change', ({ target }) => {
			chrome.storage.proxy.local.settings.set(target.id, target.checked)
		}, { passive: true });
		break;
	case 'color':
		integrateLabelShortcut.call(element);
		break;
	case 'range':
		element.addEventListener('input', event => {
			chrome.storage.proxy.local.settings.set(item, parseFloat(event.target.value) || 0)
		}, { passive: true })
	}
}

const rippleCache = new WeakMap();
document.documentElement.addEventListener('pointerdown', function (event) {
	event.target.style.setProperty('--offsetX', event.offsetX);
	event.target.style.setProperty('--offsetY', event.offsetY);
	rippleCache.has(event.target) && clearTimeout(rippleCache.get(event.target));
	const timeout = setTimeout(() => {
		event.target.style.removeProperty('--offsetX', event.offsetX);
		event.target.style.removeProperty('--offsetY', event.offsetY);
		event.target.style.length === 0 && event.target.removeAttribute('style');
		rippleCache.delete(event.target)
	}, 1e3);
	rippleCache.set(event.target, timeout)
	// this.style.setProperty('--offsetX', event.offsetX);
	// this.style.setProperty('--offsetY', event.offsetY)
});

function setState(enabled) {
	state.classList[enabled ? 'add' : 'remove']('enabled');
	return enabled
}

function restoreSettings(data) {
	for (const item in data) {
		let element = document.getElementById(item);
		switch (item) {
		case 'colorPalette':
			for (let property in data[item]) {
				element = document.getElementById(item + '.' + property);
				element && (element.parentElement.style.setProperty('background-color', (element.value = data[item][property] || '#000000') + '33'),
				element.value !== '#000000' && (element = document.getElementById(item + '.' + property + '-visible')) && (element.checked = true));
			}
			break;
		case 'cosmetics':
			for (let property in data[item]) {
				switch (property) {
				case 'options':
					if (Object.keys(data[item][property]).length < 1) {
						for (let element of document.querySelectorAll('[for^="' + item + '.' + property + '."]')) {
							element.remove();
						}
						break;
					}
					let parentElement = document.querySelector('details[data-type="cosmetics"]');
					for (let option in data[item][property]) {
						let id = item + '.' + property + '.' + option;
						if (!(element = document.getElementById(id))) {
							let colorLabel = document.querySelector('label:has(> input[type="color"])');
							element = parentElement.appendChild(colorLabel.cloneNode(true)),
							element.style.setProperty('background-color', 'hsl(0deg 0% 0% / 20%)'),
							element.setAttribute('for', id);
							let checkbox = element.querySelector('input[type="checkbox"]');
							checkbox.setAttribute('id', id + '-visible'),
							checkbox.checked = false;
							let input = element.querySelector('input[type="color"]');
							input.setAttribute('id', id),
							input.value = null;
							let label = element.querySelector('span');
							label.textContent = option.replace(/^\w/, c => c.toUpperCase()) + ' colour',
							element = input,
							integrateLabelShortcut.call(element)
						}

						element && (element.parentElement.style.setProperty('background-color', (element.value = data[item][property][option] || '#000000') + '33'),
						element.value !== '#000000' && (element = document.getElementById(id + '-visible')) && (element.checked = true))
					}
					break;
				default:
					element = document.getElementById(item + '.' + property),
					element && (element.dataset.sku = data[item][property],
					element.checked = true)
				}
			}
			break;
		case 'inputDisplayOpacity':
		case 'inputDisplaySize':
		case 'raceProgressMin':
			element.parentElement.classList[data[item.replace(/[A-Z][^A-Z]+$/, '')] ? 'remove' : 'add']('disabled');
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
		case 'theme':
			(element = document.getElementById(data[item])) && (element.checked = true);
			continue;
		case 'developerMode':
			for (let dropdown of document.querySelectorAll('[data-type="experiments"]')) {
				dropdown.style[(data[item] ? 'remove' : 'set') + 'Property']('display', 'none');
			}
		}
		if (!element) continue;
		switch (element.type.toLowerCase()) {
		case 'checkbox':
			element.checked = data[item];
			break;
		case 'color':
			element.parentElement.style.setProperty('background-color', (element.value = data[item] || '#000000') + '33');
			element.value !== '#000000' && (element = document.querySelector(`#${item}-visible`)) && (element.checked = true);
			break;
		case 'range':
			element.value = data[item];
			var name = element.parentElement.querySelector('.name');
			name.dataset.value = element.value
		}
	}
}

async function fetchCosmeticSkus({ cache = true, force } = {}) {
	let entry = chrome.storage.proxy.session.get('cosmeticSkus');
	if (entry && !force) {
		return entry
	}

	entry = await fetch("https://cdn.kanoapps.com/free_rider_hd/assets/styles/combined/gui/combined.min.120.16.32.45.css")
	.then(r => r.text())
	.then(t => t.match(/(?<=head_icons_\d+\.head_icons_\d+-)\w+/g));
	cache && chrome.storage.proxy.session.set('cosmeticSkus', entry);
	return entry 
}

function integrateLabelShortcut() {
	this.parentElement.addEventListener('focusout', ({ target }) => target.removeAttribute('tabindex'), { passive: true }),
	this.addEventListener('click', event => {
		let t = event.target;
		if (t.parentElement.hasAttribute('tabindex')) {
			event.preventDefault();
			t.parentElement.removeAttribute('tabindex');
			return;
		}

		t.parentElement.setAttribute('tabindex', '0'),
		t.parentElement.focus()
	});
	let checkbox = this.parentElement.querySelector('input[type="checkbox"]');
	this.parentElement.addEventListener('contextmenu', event => {
		event.preventDefault();
		let object = chrome.storage.proxy.local.settings
		, subtree = this.id.split('.')
		, id = subtree.pop();
		while (subtree.length > 0) {
			object = object[subtree.shift()];
		}
		object.delete(id),
		checkbox.checked = !1
	}),
	this.addEventListener('input', ({ target }) => {
		let object = chrome.storage.proxy.local.settings
		, subtree = target.id.split('.')
		, id = subtree.pop();
		while (subtree.length > 0) {
			object = object[subtree.shift()];
		}
		object.set(id, target.value),
		checkbox.checked = !0
	}, { passive: true })
}