import "../utils/Storage.js";
import AjaxHelper from "../utils/AjaxHelper.js";
import defaults from "../constants/defaults.js";
import restoreSettings from "./utils/restoreSettings.js";

chrome.storage.local.onChanged.addListener(function({ enabled, settings }) {
    settings && restoreSettings(settings.newValue);
    enabled && setState(enabled.newValue);
});

chrome.storage.local.get(({ enabled, settings }) => {
    restoreSettings(settings);
    setState(enabled);
});

const navChildren = document.querySelectorAll('body > nav > div');
chrome.storage.session.onChanged.addListener(function({ isModerator }) {
    isModerator && (dashboard.classList[isModerator.newValue ? 'add' : 'remove']('notification'),
    dashboard.style.setProperty('display', isModerator.newValue ? 'block' : 'none'),
    navChildren.forEach(child => child.style.setProperty('display', isModerator.newValue ? 'flex' : 'block')));
});

chrome.storage.session.get(async ({ isModerator = null }) => {
    if (isModerator !== null) {
        isModerator && (dashboard.style.setProperty('display', 'block'),
        navChildren.forEach(child => child.style.setProperty('display', 'flex')));
        return;
    }

    isModerator = await AjaxHelper.get("/account/settings").then(res => {
        if (!res.user) {
            throw new Error(res.msg ?? "Something went wrong! Please try again.");
        }

        return res.user.moderator;
    }).catch(err => false);
    chrome.storage.session.set({ isModerator });
});

const toggleState = document.querySelector('#state');
toggleState.addEventListener('click', function() {
    chrome.storage.proxy.local.set('enabled', !chrome.storage.proxy.local.get('enabled'));
});

const dashboard = document.querySelector('#dashboard-href');
dashboard.addEventListener('click', function(event) {
    if (event.shiftKey) {
        chrome.tabs.create({
            url: `chrome-extension://${chrome.runtime.id}/dashboard/index.html`
        });
    }
});

const dropdown = document.querySelector('.dropdown > main');
const maau = document.querySelector('#moderation-actions-against-users');
const search = document.querySelector('#query');
search.addEventListener('change', function() {
    chrome.storage.proxy.session.set('userCache', chrome.storage.proxy.session.get('userCache') ?? {});
    dropdown.replaceChildren();
    maau.style.setProperty('display', this.value.length > 2 ? 'block' : 'none');
});
search.addEventListener('input', async function() {
    maau.style.setProperty('display', 'none');
    dropdown.replaceChildren(...await AjaxHelper.userSearch(this.value, user => {
        this.value = user.d_name;
        this.dispatchEvent(new Event('change'));
    }));
});

const banUser = document.querySelector('#ban-user');
banUser.addEventListener('click', async function() {
    if (search.value.length < 1) {
        return alert("Specifiy a user for whom you wish to perform this action in the box above!");
    } else if (!confirm(`Are you sure you want to ban ${search.value}?`)) {
        return alert("Operation cancelled.");
    }

    this.classList.add('loading');
    await AjaxHelper.post("/moderator/ban_user", {
        u_id: chrome.storage.proxy.session.userCache.get(search.value.toLowerCase())
    }).catch(err => null);
    this.classList.remove('loading');
});

const changeUsername = document.querySelector('#change-username');
changeUsername.addEventListener('click', async function() {
    if (search.value.length < 1) {
        return alert("Specifiy a user for whom you wish to perform this action in the box above!");
    }

    const newValue = prompt("Enter the new username", search.value);
    if (newValue === null) {
        return alert("Operation cancelled.");
    } else if (newValue === search.value) {
        return alert("No changes made.");
    } else if (!confirm(`Are you sure you want to change ${search.value}'s username to ${newValue}?`)) {
        return this.dispatchEvent(new MouseEvent('click'));
    }

    this.classList.add('loading');
    await AjaxHelper.post("/moderator/change_email", {
        u_id: chrome.storage.proxy.session.userCache.get(search.value.toLowerCase()),
        email: newValue
    }).catch(err => null);
    this.classList.remove('loading');
});

const changeEmail = document.querySelector('#change-email');
changeEmail.addEventListener('click', async function() {
    if (search.value.length < 1) {
        return alert("Specifiy a user for whom you wish to perform this action in the box above!");
    }

    const newValue = prompt("Enter the new email for " + search.value);
    if (newValue === null) {
        return alert("Operation cancelled.");
    } else if (newValue === search.value) {
        return alert("No changes made.");
    } else if (!/^[\w\.-]*@\w+(\.\w+)+$/.test(newValue) && !confirm(`The following email address may be invalid: ${newValue}. Would you like to continue?`)) {
        return this.dispatchEvent(new MouseEvent('click'));
    }

    this.classList.add('loading');
    await AjaxHelper.post("/moderator/change_username", {
        u_id: chrome.storage.proxy.session.userCache.get(search.value.toLowerCase()),
        username: newValue
    }).catch(err => null);
    this.classList.remove('loading');
});

const toggleOA = document.querySelector('#toggle-official-author');
toggleOA.addEventListener('click', async function() {
    if (search.value.length < 1) {
        return alert("Specifiy a user for whom you wish to perform this action in the box above!");
    }

    this.classList.add('loading');
    await AjaxHelper.post("/moderator/toggle_official_author/" + chrome.storage.proxy.session.userCache.get(search.value.toLowerCase())).catch(err => null);
    this.classList.remove('loading');
});

const showAdvanced = document.querySelector('#advanced-options');
showAdvanced.addEventListener('change', function() {
    this.checked && this.parentElement.scrollIntoView({ behavior: "smooth" });
});

const resetSettings = document.querySelector("#reset-settings");
resetSettings.addEventListener("click", function() {
    if (confirm(`Are you sure you'd like to reset all your settings?`)) {
        chrome.storage.local.set({ settings: defaults }).then(() => {
            alert("Your settings have successfully been reset.");
        });
    }
});

for (const item in defaults) {
    let element = document.getElementById(item);
    switch(item) {
        case 'bikeFrameColor':
            element.parentElement.addEventListener('focusout', function() {
                this.removeAttribute('tabindex');
            });
            element.addEventListener('click', function() {
                this.style.setProperty('display', 'block');
                if (this.parentElement.hasAttribute('tabindex')) {
                    this.style.setProperty('display', 'none');
                    setTimeout(() => this.style.setProperty('display', 'block'), 1);
                    return this.parentElement.removeAttribute('tabindex');
                }

                this.parentElement.setAttribute('tabindex', '0');
                this.parentElement.focus();
            });

        case 'inputDisplaySize':
        case 'snapshots': {
            element.addEventListener("input", function() {
                chrome.storage.proxy.local.settings.set(item, this.value);
                if (this.id === 'bikeFrameColor' && (element = document.querySelector(`#${item}-visible`)) !== null) {
                    element.checked = this.value !== '#000000';
                }
            });
            break;
        }

        case 'theme': {
            for (const theme of document.querySelectorAll("input[name='theme']")) {
                theme.addEventListener('input', function() {
                    chrome.storage.proxy.local.settings.set(item, this.id);
                });
            }
            break;
        }

        default: {
            element && element.type === 'checkbox' && element.addEventListener('input', function() {
                chrome.storage.proxy.local.settings.set(this.id, !chrome.storage.proxy.local.settings.get(this.id));
            });
        }
    }
}

function setState(enabled) {
    let state = document.querySelector("#state");
    if (state !== null) {
        state.classList[enabled ? "add" : "remove"]("enabled");
    }

    return enabled;
}

document.body.addEventListener("mousedown", function(event) {
    document.documentElement.style.setProperty("--offsetX", event.offsetX);
    document.documentElement.style.setProperty("--offsetY", event.offsetY);
});

window.addEventListener('focusout', handleShiftKey);
window.addEventListener('keydown', handleShiftKey);
window.addEventListener('keyup', handleShiftKey);
window.addEventListener('load', function() {
    chrome.storage.local.get(({ badges }) => {
        for (const element of document.querySelectorAll(".notification")) {
            if (badges === false) {
                element.classList.remove('notification');
                continue;
            }

            element.addEventListener('click', function(event) {
                if (event.target.disabled || event.target.classList.contains('disabled')) {
                    return;
                }

                chrome.storage.local.set({ badges: false }).then(() => {
                    event.target.classList.remove("notification");
                });
            });
        }
    });
});

window.addEventListener('pointerover', handleShiftKey);

function handleShiftKey(event) {
    event.shiftKey ? document.documentElement.dataset.shiftKey = true : delete document.documentElement.dataset.shiftKey;
}