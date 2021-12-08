let events = new Map();

function deepMerge(original, object) {
    for (const key in object) {
        if (object.hasOwnProperty(key)) {
            if (typeof original[key] === "object" && typeof object[key] === "object") {
                deepMerge(original[key], object[key]);

                continue;
            }

            original[key] = object[key];
        }
    }

    return original;
}

export default class {
    constructor({ name, defaults }) {
        if (name !== void 0 && (typeof name === "string" || typeof name === "number")) {
            this.$name = name;
        }

        this.$defaults = defaults;

        if (typeof this.createIcon === "function") {
            this.icon = document.body.appendChild(this.constructor.createElement("div", this.createIcon()));
        }

        if (typeof this.createInterface === "function") {
            this.interface = document.body.appendChild(this.constructor.createElement("div", this.createInterface()));
        }

        // this.load();

        // let loc = location.pathname;
        // window.addEventListener("popstate", window.onclick = () => {
		// 	if (location.pathname != loc) {
		// 		loc = location.pathname;

        //         this.load();
                
		// 		this.childLoad();
		// 	}
		// });

        this.storage = this.storage || {};
    }

    $name = "default";
    
    $defaults = {};
    
    get game() {
        if ((window || {}).hasOwnProperty("GameManager") && window.GameManager.hasOwnProperty("game") && typeof window.GameManager.game === "object") {
            return window.GameManager.game;
        }
        
        return null;
    }

    get storage() {
        localStorage.getItem(this.$name) ?? (this.storage = this.$defaults);

        self = this;

        return Object.defineProperties(JSON.parse(localStorage.getItem(this.$name)), {
            has: {
                value(key) {
                    return this.hasOwnProperty(key);
                }
            },
            get: {
                value(key) {
                    if (this[key] !== void 0)
                        return this[key];

                    return null;
                }
            },
            set: {
                value(key, value) {
                    if (typeof value === "object") {
                        self.storage = {
                            [key]: deepMerge(this[key], value)
                        }
                    }

                    self.emit("storageUpdate", key, self.storage.get(key), value);

                    self.storage = {
                        [key]: value
                    }

                    return self.storage.get(key);
                }
            },
            delete: {
                value(key) {
                    const deleted = delete this[key];
                    if (deleted) {
                        self.storage = this;

                        return true;
                    }
                    
                    return false;
                }
            },
            reset: {
                value() {
                    localStorage.removeItem(self.$name);

                    self.emit("storageReset");
                    
                    return self.storage;
                }
            }
        });
    }

    set storage(items) {
        localStorage.setItem(this.$name, JSON.stringify(Object.assign(this.$defaults, JSON.parse(localStorage.getItem(this.$name)) ? deepMerge(JSON.parse(localStorage.getItem(this.$name)), items) : items)));

        return this.storage;
    }

    on(event, listener = function() {}) {
        if (typeof event !== "string") {
            throw new Error("Event name must be of type String.");
        } else if (typeof listener !== "function") {
            throw new Error("Event listener must be of type Function.");
        }

        return !!events.set(event, listener.bind(this));
    }

    emit(event, ...args) {
        if (typeof event === "string" && events.has(event)) {
            let listener = events.get(event);
            if (typeof listener === "function") {
                return !!listener(...args);
            }
        }
    }

    load() {
        let wait = setInterval(() => {
            if (this.game) {
                // Rebinding the game loop.
                if (typeof this.update === "function") {
                    createjs.Ticker.removeAllEventListeners("tick");
                    this.emit("ready");
                    createjs.Ticker.on("tick", (() => {
                        this.game.currentScene.update(),
                        this.update(),
                        this.game.tickCount++;
                    }).bind(this.game));
                }

                clearInterval(wait);
            }
        });
    }

    /**
     * 
     * @param {element} element 
     * @param {attributes} attributes 
     * @returns arbitrary
     */
    static createElement(element, attributes) {
        return Object.assign(document.createElement(element), attributes);
    }
}