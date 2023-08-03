chrome.storage.local.get(({ enabled, settings }) => {
	if (enabled) {
		sessionStorage.setItem("lite", JSON.stringify(settings));
		// document.head.appendChild(Object.assign(document.createElement("script"), {
		//     src: chrome.runtime.getURL(/*"/game/class/Lite.js"), //*/ "/game/class/Game.js"),
		//     type: 'module'
		// }));
	}
});

chrome.storage.local.onChanged.addListener(function ({ settings }) {
	if (settings) {
		postMessage({
			action: 'updateStorage',
			storage: settings.newValue
		});
	}
});