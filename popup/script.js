import Storage from "./utils/Storage.js";
import defaults from "../defaults.js";

const storage = Storage(defaults);
storage.onstorage = function(settings) {
    chrome.storage.session.get(({ connected }) => {
        if (connected) {
            chrome.tabs.query({}, function(tabs) {
                tabs.forEach(function(tab) {
                    if (tab.hasOwnProperty("url") && tab.url.match(/https?:\/\/(.+)?fr(.+)?hd(\..+)?\.com/gi)) {
                        chrome.tabs.sendMessage(tab.id, {
                            action: "updateStorage",
                            storage: settings
                        });
                    }
                });
            });
        }
    });
    restoreSettings(settings);
}

function restoreSettings(data) {
    for (const item in data) {
        let element = document.getElementById(item);
        if (element) {
            switch(item) {
                case "cc":
                    element.parentElement.style.setProperty("background-color", (element.value = data[item] || "#000000") + "33");
                    element.addEventListener("input", function(event) {
                        storage.set(item, this.value);
                    });
                    break;

                case "di_size":
                    element.parentElement.querySelector(".name").innerText = `Input display size (${element.value = data[item]})`;
                    element.addEventListener("input", function(event) {
                        storage.set(item, this.value);
                    });
                    break;

                case "snapshots":
                    element.parentElement.querySelector(".name").innerText = `Snapshot Count (${element.value = data[item]})`;
                    element.addEventListener("input", function(event) {
                        storage.set(item, this.value);
                    });
                    break;

                default:
                    element.checked = data[item];
            }
        } else if (item === "theme") {
            element = document.getElementById(data[item]);
            if (element) {
                element.checked = true;
            }
        }
    }
}

function setState(enabled) {
    let state = document.querySelector("lite-state");
    state.classList[enabled ? "add" : "remove"]("enabled");
    state.innerText = enabled ? "Enabled" : "Disabled";
}

restoreSettings(storage);
chrome.storage.local.get(({ enabled }) => setState(enabled));

document.body.addEventListener("click", function(event) {
    switch(event.target.tagName) {
        case "LITE-OPTION":
            if (event.target.classList.contains("disabled")) {
                break;
            }
            
            const input = event.target.firstElementChild;
            if (input) {
                switch(input.id) {
                    case "cc":
                        input.click();
                        break;

                    case "di_size":
                    case "snapshots":
                        break;

                    case "light":
                    case "midnight":
                    case "dark":
                    case "darker":
                        storage.set("theme", input.id);
                        break;

                    default:
                        storage.set(input.id, !storage.get(input.id));
                        break;
                }
            }

            break;

        case "LITE-STATE":
            chrome.runtime.sendMessage({ action: "toggleEnabled" }, setState);
            break;
    }
});

document.querySelector("lite-option#reset").addEventListener("click", function() {
    if (confirm(`Are you sure you'd like to reset all your settings?`)) {
        storage.reset();
        alert("Your settings have successfully been reset.");
    }
});

document.querySelector("lite-tabs").addEventListener("click", function(event) {
    if (event.target.classList.contains("notification")) {
        chrome.storage.local.set({
            notification: false
        });

        event.target.classList.remove("notification");
    }

    document.querySelectorAll("lite-content").forEach(function(element) {
        element.style.setProperty("display", "none");
    });

    document.querySelector("lite-content." + event.target.innerText.replace(/\s+.+/gi, '').toLowerCase()).style.setProperty("display", "block");
});

document.addEventListener("mousedown", function(event) {
    this.documentElement.style.setProperty("--offsetX", event.offsetX);
    this.documentElement.style.setProperty("--offsetY", event.offsetY);
});