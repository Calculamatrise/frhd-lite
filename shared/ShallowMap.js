export default class {
	constructor(object = null) {
		if (typeof object != 'object') {
			throw new TypeError("object not iterable");
		}

		Object.assign(this, object)
	}

	/**
	 * 
	 * @param {string} key
	 * @returns {boolean}
	 */
	has(key) {
		return key in this
	}

	/**
	 * 
	 * @param {string} key
	 * @returns {any} arbitrary
	 */
	get(key) {
		return this[key] ?? null
	}

	/**
	 * 
	 * @param {string} key
	 * @param {any} value arbitrary
	 */
	set(key, value) {
		if (typeof key != 'string' && typeof key != 'number') {
			throw new TypeError("Key must be of type string.");
		}

		this[key] = value
	}

	/**
	 * 
	 * @param {string} key
	 * @returns {boolean}
	 */
	delete(key) {
		if (this.has(key)) {
			return delete this[key];
		}

		return false
	}
}