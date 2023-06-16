import keymap from "../../constants/keymap.js";
export default function restoreSettings(data) {
    for (const item in data) {
        let element = document.getElementById(item);
        switch(item) {
            case 'bikeFrameColor':
                element.parentElement.style.setProperty('background-color', (element.value = data[item] || '#000000') + '33');
                if (element.value !== '#000000' && (element = document.querySelector(`#${item}-visible`))) {
                    element.checked = true;
                }
                break;

            case 'inputDisplaySize':
                element.value = data[item];
                element.parentElement.classList[data.inputDisplay ? 'remove' : 'add']('disabled');
                element.parentElement.querySelector('.name').innerText = `Input display size (${element.value})`;
                break;

            case 'keymap': {
                const primaryKeys = new Set();
                for (const key in data[item] = Object.assign(Object.fromEntries(Object.entries(keymap).flatMap(([a, b]) => b.map(e => [e, a]))), data[item])) {
                    let row = element.querySelector(`#${data[item][key]}-key`);
                    if (row === null) {
                        row = document.createElement('tr');
                        row.setAttribute('id', data[item][key] + '-key');
                        let act = document.createElement('td');
                        act.innerText = data[item][key];
                        act.addEventListener('click', function() {
                            for (const index of Array.from({ length: 2 }, (_, i) => 2 + i)) {
                                const element = row.querySelector(`:nth-child(${index})`);
                                element !== null && chrome.storage.proxy.local.settings.keymap.delete(element.innerHTML);
                            }
                        });

                        let primary = document.createElement('td');
                        primary.dataset.id = 'primary';
                        primary.innerText = key ?? keymap[data[item][key]][0];
                        let alt = document.createElement('td');
                        alt.dataset.id = 'secondary';
                        alt.innerText = keymap[data[item][key]][1] ?? null;
                        for (const element of [primary, alt]) {
                            element.classList.add('keybind');
                            element.addEventListener('click', function(event) {
                                if (event.shiftKey) {
                                    chrome.storage.proxy.local.settings.keymap.delete(this.innerHTML);
                                    this.innerText = keymap[data[item][key]][this.dataset.id !== 'primary'] ?? '';
                                    this.classList.remove('alt');
                                    return;
                                }

                                this.setAttribute('tabIndex', '0');
                                this.focus();
                                this.classList.add('focused');
                            });
                            element.addEventListener('keypress', function(event) {
                                chrome.storage.proxy.local.settings.keymap.set(event.key, data[item][key]);
                                this.innerText = event.key.replace(' ', 'Space');
                                this.classList.remove('focused');
                                this.removeAttribute('tabIndex');
                            });
                        }

                        row.append(act, primary, alt);
                        element.appendChild(row);
                    }

                    const child = row.querySelector(`:nth-child(${2 + primaryKeys.has(data[item][key])})`);
                    if (child !== null) {
                        child.innerText = key ?? keymap[data[item][key]][primaryKeys.has(data[item][key])];
                        primaryKeys.add(data[item][key]);
                    }
                }
                break;
            }

            case 'snapshots':
                element.value = data[item];
                element.parentElement.classList[data.playerTrail ? 'remove' : 'add']('disabled');
                element.parentElement.querySelector(".name").innerText = `Snapshot count (${element.value})`;
                break;

            case 'theme': {
                if (element = document.getElementById(data[item])) {
                    element.checked = true;
                }
                break;
            }

            default: {
                if (element && element.type === 'checkbox') {
                    element.checked = data[item];
                }
            }
        }
    }
}