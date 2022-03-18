import StrongMap from "../../class/StrongMap.js";

class Storage extends StrongMap {
    constructor(defaults = {}) {
        super(defaults);
        this.constructor.prototype.reset = function() {
            chrome.storage.local.set({ settings: defaults });
            if (typeof this.onstorage === "function") {
                this.onstorage(this);
            }
        }

        chrome.storage.local.get(({ settings }) => {
            Object.assign(this, settings);
            this.save();
        });

        this.save();
    }

    save() {
        chrome.storage.local.set({ settings: this });
        if (typeof this.onstorage === "function") {
            this.onstorage(this);
        }
    }
}

export default function(defaults) {
    let storage = new Storage(defaults);
    return storage = new Proxy(storage, {
        get(target, property) {
            if (typeof target[property] === "object" && target[property] !== null) {
                return new Proxy(target[property] = new StrongMap(target[property]), this);
            }

            return target[property];
        },
        set(target, property, value) {
            target[property] = value;
            storage.save();
            return true;
        }
    });
}