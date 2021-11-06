try {
	chrome.storage.local.get(({ enabled }) => {
		if (!enabled) {
			return;
		}

		sessionStorage.setItem("lite_version", chrome.runtime.getManifest().version);
		const interval = setInterval(() => {
			if (document.head) {
				clearInterval(interval);
			}

			document.head.appendChild(Object.assign(document.createElement("script"), {
				src: `chrome-extension://${chrome.runtime.id}/class/Game.js`/*"https://calculamatrise.github.io/frhd/lite/class/Game.js"*/,
				type: "module"
			}));
		});
	});
} catch (error) {
	console.error("Lite Error:\n\n", error);
}

// import(`chrome-extension://${chrome.runtime.id}/class/Game.js`/*"https://calculamatrise.github.io/frhd/lite/class/Game.js"*/).then(t => {
//     setTimeout(() => {
//         if (!GameManager.game) {
//             GameManager.handleComplete(),
//             clearInterval(e)
//         }
//     }, 500);
// });