const state = document.querySelector("lite-state");

function setState(enabled) {
    state.classList[enabled ? "add" : "remove"]("enabled");
    state.innerText = enabled ? "Enabled" : "Disabled";

    chrome.storage.local.get(function(data) {
        if (!data.notification) {
            chrome.storage.local.set({
                notification: true
            });

            let tabs = document.querySelector("lite-tabs");
            let changes = tabs && tabs.lastElementChild;
            if (changes) {
                changes.classList.add("notification");
            }
        }
    });
}

function restoreSettings(data) {
    for (const item in data) {
        let element = document.getElementById(item);
        if (element) {
            switch(item) {
                case "cc":
                    element.parentElement.style.setProperty("background-color", (element.value = data[item] || "#000000") + "33");
                    element.addEventListener("input", function(event) {
                        chrome.runtime.sendMessage({ action: "setStorageItem", item, data: this.value }, (response) => {
                            this.parentElement.style.setProperty("background-color", (this.value = response[item] || "#000000") + "33");
                        });
                    });
                    break;

                case "di_size":
                    element.parentElement.querySelector(".name").innerText = `Input display size (${element.value = data[item]})`;
                    element.addEventListener("input", function(event) {
                        chrome.runtime.sendMessage({ action: "setStorageItem", item, data: this.value }, (response) => {
                            element.parentElement.querySelector(".name").innerText = `Input display size (${this.value = response[item]})`;
                        });
                    });
                    break;

                case "snapshots":
                    element.parentElement.querySelector(".name").innerText = `Snapshot Count (${element.value = data[item]})`;
                    element.addEventListener("input", function(event) {
                        chrome.runtime.sendMessage({ action: "setStorageItem", item, data: this.value }, (response) => {
                            element.parentElement.querySelector(".name").innerText = `Snapshot Count (${this.value = response[item]})`;
                        });
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

chrome.runtime.sendMessage({ action: "getEnabled" }, setState);
chrome.runtime.sendMessage({ action: "getStorage" }, restoreSettings);

document.addEventListener("mousedown", function(event) {
    this.documentElement.style.setProperty("--offsetX", event.offsetX);
    this.documentElement.style.setProperty("--offsetY", event.offsetY);
});

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
                        chrome.runtime.sendMessage({ action: "setStorageItem", item: "theme", data: input.id }, (response) => {
                            input.checked = response["theme"] === input.id;
                        });
                        break;

                    default:
                        chrome.runtime.sendMessage({ action: "toggleStorageItem", item: input.id }, (response) => {
                            input.checked = response[input.id];
                        });
                        break;
                }
            }

            break;

        case "LITE-STATE":
            chrome.runtime.sendMessage({ action: "toggleEnabled" }, setState);
            break;
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

document.querySelector("lite-option#reset").addEventListener("click", function() {
    if (confirm(`Are you sure you'd like to reset all your settings?`)) {
        chrome.runtime.sendMessage({ action: "resetSettings" }, (response) => {
            restoreSettings(response);

            alert("Your settings have successfully been reset.");
        });
    }
});