class StrongMap {
    constructor(object) {
        if (typeof object !== "object") {
            throw new TypeError("object not iterable");
        }

        Object.assign(this, object);
    }

    /**
     * 
     * @param {String} key 
     * @returns {Boolean} 
     */
    has(key) {
        return this.hasOwnProperty(key);
    }

    /**
     * 
     * @param {String} key 
     * @returns {any} arbitrary
     */
    get(key) {
        if (this.has(key)) {
            return this[key];
        }

        return null;
    }

    /**
     * 
     * @param {String} key 
     * @param {any} value arbitrary
     */
    set(key, value) {
        if (typeof key !== "string" && typeof key !== "number") {
            throw new TypeError("Key must be of type string.");
        }

        this[key] = value;
    }

    /**
     * 
     * @param {String} key 
     * @returns {Boolean} 
     */
    delete(key) {
        if (this.has(key)) {
            return delete this[key];
        }

        return false;
    }
}

class Storage extends StrongMap {
    constructor(name, defaults) {
        super(Object.assign(defaults, JSON.parse(localStorage.getItem(name))));
        Storage.prototype.save = function() {
            localStorage.setItem(name, JSON.stringify(this));
        }

        Storage.prototype.reset = function() {
            localStorage.setItem(name, JSON.stringify(defaults));
        }

        this.save();
    }

    clone() {
        return JSON.parse(JSON.stringify(this));
    }
}

/**
 * 
 * @param {String} name storage identification
 * @param {Object} defaults storage skeleton defaults
 */
export default function(name, defaults = null) {
    let storage = new Storage(name, defaults);
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