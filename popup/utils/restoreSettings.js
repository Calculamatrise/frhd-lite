export default function (data) {
	for (const item in data) {
		let element = document.getElementById(item);
		switch (item) {
			case 'bikeFrameColor':
				element.parentElement.style.setProperty('background-color', (element.value = data[item] || '#000000') + '33');
				element.value !== '#000000' && (element = document.querySelector(`#${item}-visible`)) && (element.checked = true);
				break;

			case 'inputDisplaySize':
				element.value = data[item];
				element.parentElement.classList[data.inputDisplay ? 'remove' : 'add']('disabled');
				element.parentElement.querySelector('.name').innerText = `Input display size (${element.value})`;
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