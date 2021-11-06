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
    }
    $name = "default";
    $defaults = {};
    get scene() {
        if ((window || {}).hasOwnProperty("GameManager") && typeof window.GameManager.game === "object") {
            return window.GameManager.game.currentScene;
        }
        
        return null;
    }
    get storage() {
        localStorage.getItem(this.$name) ?? (this.storage = this.$defaults);

        self = this;

        return Object.defineProperties(JSON.parse(localStorage.getItem(this.$name)), {
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
                    
                    return self.storage;
                }
            }
        });
    }
    set storage(items) {
        localStorage.setItem(this.$name, JSON.stringify(JSON.parse(localStorage.getItem(this.$name)) ? deepMerge(JSON.parse(localStorage.getItem(this.$name)), items) : items));

        return this.storage;
    }
    static createElement(t, e) {
        return Object.assign(document.createElement(t), e);
    }
}