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
        const element = document.getElementById(item);
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

                case "snapshots":
                    element.parentElement.querySelector(".name").innerText = `Snapshot Count (${element.value = data[item]})`;
                    element.addEventListener("input", function(event) {
                        chrome.runtime.sendMessage({ action: "setStorageItem", item, data: this.value }, (response) => {
                            element.parentElement.querySelector(".name").innerText = `Snapshot Count (${this.value = response[item]})`;
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

                default:
                    element.checked = data[item];
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
            const checkbox = event.target.firstElementChild;
            if (checkbox) {
                switch(checkbox.id) {
                    case "cc":
                        checkbox.click();
                        break;

                    case "snapshots":
                    case "di_size":
                        break;

                    default:
                        chrome.runtime.sendMessage({ action: "toggleStorageItem", item: checkbox.id }, (response) => {
                            checkbox.checked = response[checkbox.id];
                        });
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
    if (window.confirm(`Are you sure you'd like to reset all your settings?`)) {
        chrome.runtime.sendMessage({ action: "resetSettings" }, (response) => {
            window.alert("Your settings have successfully been reset.");

            restoreSettings(response);
        });
    }
});