const port = chrome.runtime.connect({ name: "lite" });
port.onMessage.addListener((message) => {
    sessionStorage.setItem("lite", JSON.stringify(message.storage));
});

chrome.runtime.onMessage.addListener((request) => {
    return postMessage(request), true;
});

try {
	chrome.storage.local.get(({ enabled }) => {
		if (!enabled) {
			return;
		}

		const interval = setInterval(() => {
			if (document.head) {
				clearInterval(interval);
			}

			document.head.appendChild(Object.assign(document.createElement("script"), {
				src: /*`chrome-extension://${chrome.runtime.id}/class/Lite.js`,//*/`chrome-extension://${chrome.runtime.id}/class/Game.js`,//*/"https://calculamatrise.github.io/frhd/lite/class/Game.js",
				type: "module"
			}));
		});
	});
} catch(error) {
	console.error("Lite Error: ", error);
}

// import(`chrome-extension://${chrome.runtime.id}/class/Game.js`/*"https://calculamatrise.github.io/frhd/lite/class/Game.js"*/).then(t => {
//     setTimeout(() => {
//         if (!GameManager.game) {
//             GameManager.handleComplete(),
//             clearInterval(e)
//         }
//     }, 500);
// });