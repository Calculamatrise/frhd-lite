// forgot what I was going to do with this
// onmessage = function() {}

onload = onfocus = function() {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        switch(request.action) {
            case "getStorage":
                sendResponse(JSON.parse(localStorage.getItem("lite")));

                break;

            case "resetSettings":
                localStorage.setItem("lite", JSON.stringify({
                    cr: false,
                    cc: false,
                    dark: false,
                    di: true,
                    di_size: 10,
                    feats: true,
                    isometric: false,
                    snapshots: 10
                }));

                sendResponse(JSON.parse(localStorage.getItem("lite")));

                break;

            case "setStorageItem":
                localStorage.setItem("lite", JSON.stringify(Object.assign(JSON.parse(localStorage.getItem("lite")), {
                    [request.item]: request.data
                })));

                sendResponse(JSON.parse(localStorage.getItem("lite")));

                break;

            case "toggleStorageItem":
                localStorage.setItem("lite", JSON.stringify(Object.assign(JSON.parse(localStorage.getItem("lite")), {
                    [request.item]: !JSON.parse(localStorage.getItem("lite"))[request.item]
                })));

                sendResponse(JSON.parse(localStorage.getItem("lite")));

                break;
        }

        postMessage({ action: "update" }, location.origin);

        return true;
    });
}

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
				src: `chrome-extension://${chrome.runtime.id}/class/Game.js`,//*/"https://calculamatrise.github.io/frhd/lite/class/Game.js",
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