import defaults from "./constants/defaults.js";

const excludeMatches = [
	"*://*/*\?ajax*",
	"*://*/*&ajax*",
	"*://*.com/*api/*"
];
const documentUrlPatterns = [
	"*://frhd.kanoapps.com/*",
	"*://www.freeriderhd.com/*"
];
const moduleScript = {
	excludeMatches,
	id: "mod",
	js: [
		"game/mod.js",
		"game/modules/player.js"
		// modules
	],
	matches: documentUrlPatterns,
	runAt: "document_end",
	world: "MAIN"
};
const contentScripts = [{
	excludeMatches,
	id: "connection-broker",
	js: ["broker.js", "game/renderer/inject.js"],
	matches: documentUrlPatterns,
	runAt: "document_end"
}, {
	excludeMatches,
	id: "game",
	js: [
		"shared/Zip.js",
		"game/assets/elements/ContextMenu.js",
		"game/main.js"
	],
	matches: documentUrlPatterns,
	runAt: "document_start",
	world: "MAIN"
}, {
	excludeMatches,
	id: "ext",
	js: [
		"game/ThirdPartyScriptManager.js",
		"game/ThirdPartyStyleManager.js",
		// "game/mod.js"
	],
	matches: documentUrlPatterns,
	runAt: "document_end",
	world: "MAIN"
}, moduleScript];

chrome.runtime.onMessageExternal.addListener(function(message, sender, sendResponse) {
	let res = "418 I'm a teapot";
	if (/^manifest/i.test(message)) {
		let manifest = chrome.runtime.getManifest();
		/^manifest\.version$/i.test(message) && (res = { version: manifest.version })
	}
	sendResponse(res)
});

chrome.runtime.onInstalled.addListener(function() {
	chrome.storage.local.get(({ enabled, settings }) => {
		enabled !== undefined && setState({ enabled });
		chrome.storage.local.set({
			enabled: enabled ?? true,
			badges: true,
			settings: Object.assign(defaults, settings)
		})
	})
});

chrome.runtime.onStartup.addListener(function() {
	self.dispatchEvent(new ExtendableEvent('activate'))
});

chrome.runtime.onUpdateAvailable.addListener(async function() {
	await chrome.storage.session.set({ updateAvailable: true });
	await chrome.action.setBadgeBackgroundColor({ color: '#b87c14' });
	chrome.action.setBadgeText({ text: '1' })
});

chrome.storage.local.onChanged.addListener(function({ enabled, settings }) {
	enabled && setState({ enabled: enabled.newValue });
	settings && updateModuleScript(settings.newValue)
});

self.addEventListener('activate', function() {
	chrome.storage.local.get(({ enabled }) => enabled || updateIcon(enabled))
});

async function setState({ enabled = true }) {
	if (enabled) {
		await chrome.scripting.registerContentScripts(contentScripts);
		await chrome.storage.local.get(({ settings }) => updateModuleScript(settings));
		await createContextMenuOptions();
	} else {
		await chrome.scripting.unregisterContentScripts();
		await chrome.contextMenus.removeAll();
	}

	await chrome.declarativeNetRequest.updateEnabledRulesets({
		[(enabled ? 'en' : 'dis') + 'ableRulesetIds']: enabled ? ["frhd-assets"] : await chrome.declarativeNetRequest.getEnabledRulesets()
	});

	return updateIcon(enabled)
}

function updateIcon(enabled = true) {
	const path = size => `/icons/${enabled ? '' : 'disabled/'}icon_${size}.png`;
	return chrome.action.setIcon({
		path: {
			16: path(16),
			48: path(48),
			128: path(128)
		}
	})
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
	return chrome.storage.local.get(async ({ settings }) => {
		const options = {
			accountManager: { checked: settings.accountManager, title: 'Account Manager', type: 'checkbox' },
			achievementMonitor: { checked: settings.achievementMonitor, title: 'Achievement Monitor', type: 'checkbox' },
			featuredGhostsDisplay: { checked: settings.featuredGhostsDisplay, title: 'Highlight Featured Races', type: 'checkbox' }
		}
		for (const option in options) {
			await chrome.contextMenus.create(Object.assign({
				contexts: ['page'],
				documentUrlPatterns,
				id: option,
				type: 'normal'
			}, options[option]))
		}
	})
}

async function updateModuleScript(settings) {
	const scripts = moduleScript.js;
	for (const module in settings) {
		switch (module) {
		case 'accountManager':
		case 'achievementMonitor':
		case 'featuredGhostsDisplay':
			break;
		default:
			continue;
		}

		const enabled = settings[module];
		const path = `game/modules/${module}.js`;
		if (enabled) {
			scripts.push(path);
		} else if (scripts.includes(path)) {
			scripts.splice(scripts.indexOf(path), 1);
		}
	}

	return chrome.scripting.updateContentScripts([moduleScript])
}