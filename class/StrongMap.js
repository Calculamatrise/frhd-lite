export default class StrongMap {
    constructor(object = null) {
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