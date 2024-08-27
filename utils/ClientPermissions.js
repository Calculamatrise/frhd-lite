export default class ClientPermissions {
	static #events = new Map();
	static #temp = new WeakSet();
	static _setPermissions(permissions) {
		this.permissions.clear();
		for (const [permission, hasPermission] of Object.entries(permissions))
			hasPermission && this.permissions.add(permission);
		this.isAdmin = this.permissions.has('admin');
		this.isModerator = this.permissions.has('moderator')
	}

	static addListener(event, listener, { once } = {}) {
		if (event !== 'change') throw new TypeError("Unrecognized event: '" + event + "'");
		else if (typeof listener != 'function') throw new TypeError("Listener must be of type: function");
		let events = this.#events.get(event);
		events || (events = new Set(),
		this.#events.set(event, events),
		once && this.#temp.add(listener));
		return events.add(listener).size
	}

	static isAdmin = null;
	static isModerator = null;
	static permissions = new Set();
	static equals(permissions) {
		for (let [permission, hasPermission] of Object.entries(permissions)) {
			if (hasPermission !== this.permissions.has(permission)) {
				return false;
			}
		}

		return true
	}

	static async fetch({ force } = {}) {
		return new Promise((resolve, reject) => {
			chrome.storage.session.get(async ({ clientPermissions = null }) => {
				if (!force && clientPermissions !== null) {
					this._setPermissions(clientPermissions);
					resolve(clientPermissions);
					return;
				}

				const user = await fetch("https://www.freeriderhd.com/account/settings?ajax")
					.then(r => r.json().then(({ user }) => user))
					.catch(reject);
				if (!user) return reject("User not found.");
				this._setPermissions(clientPermissions = {
					admin: user.admin || /^(?:blacktux|(pre)?calculus)$/.test(user.u_name),
					moderator: user.moderator || /^(?:blacktux|(pre)?calculus|ness)$/.test(user.u_name)
				});
				for (const [permission, hasPermission] of Object.entries(clientPermissions)) {
					hasPermission && this.permissions.add(permission);
				}
				chrome.storage.session.set({ clientPermissions }),
				resolve(clientPermissions)
			})
		})
	}

	static emit(event, ...args) {
		let events = this.#events.get(event);
		let combined = new Set(this.#events.get(event));
		typeof this['on' + event] == 'function' && combined.add(this['on' + event]);
		for (let listener of combined) {
			this.#temp.has(listener) && events.delete(listener),
			listener.apply(this, args)
		}
	}

	static async verify(permissions) {
		if (this.isAdmin === null) {
			await this.fetch();
		}

		for (let permission of permissions) {
			if (!this.permissions.has(permission)) {
				return Promise.resolve(false);
			}
		}

		return Promise.resolve(true)
	}
}

chrome.storage.session.onChanged.addListener(({ clientPermissions }) => {
	clientPermissions && !ClientPermissions.equals(clientPermissions) && ClientPermissions.emit('change', clientPermissions.newValue)
})