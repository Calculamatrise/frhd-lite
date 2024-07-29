import defaults from "./constants/defaults.js";

const documentUrlPatterns = [
	"*://frhd.kanoapps.com/*",
	"*://www.freeriderhd.com/*"
];
const contentScripts = [{
	excludeMatches: [
		"*://*/*\?ajax*",
		"*://*/*&ajax*",
		"*://*.com/*api/*"
	],
	id: "connection-broker",
	js: ["broker.js"],
	matches: documentUrlPatterns,
	runAt: "document_end"
}, {
	excludeMatches: [
		"*://*/*\?ajax*",
		"*://*/*&ajax*",
		"*://*.com/*api/*"
	],
	id: "game",
	js: ["game/main.js", "shared/Zip.js"],
	matches: documentUrlPatterns,
	runAt: "document_end",
	world: "MAIN"
}];

chrome.runtime.onMessageExternal.addListener(function(message, sender, sendResponse) {
	let res = "418 I'm a teapot";
	if (/^manifest/i.test(message)) {
		let manifest = chrome.runtime.getManifest();
		/^manifest\.version$/i.test(message) && (res = { version: manifest.version })
	}
	sendResponse(res)
});

chrome.runtime.onStartup.addListener(function() {
	self.dispatchEvent(new ExtendableEvent('activate'))
});

chrome.runtime.onUpdateAvailable.addListener(function() {
	chrome.storage.session.set({ updateAvailable: true }).then(() => {
		chrome.action.setBadgeText({ text: '1' })
	})
});

chrome.storage.local.onChanged.addListener(function({ enabled }) {
	enabled && setState({ enabled: enabled.newValue })
});

self.addEventListener('activate', function() {
	chrome.storage.local.get(({ enabled }) => {
		enabled || setState({ enabled })
	})
});

self.addEventListener('install', async function() {
	const scripts = await chrome.scripting.getRegisteredContentScripts();
	scripts.length == 0 && chrome.scripting.registerContentScripts(contentScripts);
	chrome.storage.local.get(({ enabled = true, settings }) => {
		chrome.storage.local.set({
			enabled,
			badges: true,
			settings: Object.assign(defaults, settings)
		})
	}),
	createContextMenuOptions()
}, { once: true });

async function setState({ enabled = true }) {
	const path = size => `/icons/${enabled ? '' : 'disabled/'}icon_${size}.png`
	chrome.action.setIcon({
		path: {
			16: path(16),
			48: path(48),
			128: path(128)
		}
	});

	enabled ? (chrome.scripting.getRegisteredContentScripts().then(scripts => scripts.length > 0 || chrome.scripting.registerContentScripts(contentScripts)),
	createContextMenuOptions()) : (chrome.scripting.unregisterContentScripts(),
	chrome.contextMenus.removeAll());
	chrome.declarativeNetRequest.updateEnabledRulesets({
		[(enabled ? 'en' : 'dis') + 'ableRulesetIds']: enabled ? ["frhd-assets"] : await chrome.declarativeNetRequest.getEnabledRulesets()
	});
}

chrome.contextMenus.onClicked.addListener(function(event) {
	chrome.storage.local.get(({ settings }) => {
		switch(event.menuItemId) {
		case 'accountManager':
		case 'achievementMonitor':
		case 'featuredGhostsDisplay':
			settings[event.menuItemId] = event.checked;
			chrome.storage.local.set({ settings })
		}
	})
});

function createContextMenuOptions() {
	chrome.storage.local.get(({ settings }) => {
		const options = {
			accountManager: { checked: settings.accountManager, title: 'Account Manager', type: 'checkbox' },
			achievementMonitor: { checked: settings.achievementMonitor, title: 'Achievement Monitor', type: 'checkbox' },
			featuredGhostsDisplay: { checked: settings.featuredGhostsDisplay, title: 'Highlight Featured Races', type: 'checkbox' }
		}
		for (const option in options) {
			chrome.contextMenus.create(Object.assign({
				contexts: ['page'],
				documentUrlPatterns,
				id: option,
				type: 'normal'
			}, options[option]))
		}
	})
}