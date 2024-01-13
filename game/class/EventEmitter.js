export default class {
	#events = null;
	#maxListeners = -1;
	defaultMaxListeners = 10;
	setMaxListeners(t) {
		if (typeof t != 'number' || 0 > t)
			throw TypeError("n must be a positive number");
		return this.#maxListeners = t,
			this
	}
	emit(t) {
		var e, i;
		if (this.#events && t === 'error' && (!this.#events.error || typeof this.#events.error == 'object' && this.#events.error !== null)) {
			if (e = arguments[1], e instanceof Error)
				throw e;
			throw TypeError('Unspecified "error" event.')
		}
		if (i = this.#events && this.#events[t], i === void 0)
			return !1;
		if (typeof i == 'function')
			i.apply(this, Array.prototype.slice.call(arguments, 1));
		else if (typeof i == 'object' && i !== null) {
			for (let s of i.values())
				s.apply(this, Array.prototype.slice.call(arguments, 1))
		}
		return !0
	}
	addListener(t, e) {
		if (typeof e != "function")
			throw TypeError("listener must be a function");
		if (this.#events || (this.#events = {}),
			this.#events.newListener && this.emit("newListener", t, typeof e.listener == "function" ? e.listener : e),
			this.#events[t] ? typeof this.#events[t] == 'object' && this.#events[t] !== null ? this.#events[t].add(e) : this.#events[t] = new Set([this.#events[t], e]) : this.#events[t] = e,
			this.#events[t] == 'object' && this.#events[t] !== null && !this.#events[t].warned) {
			var n = this.#maxListeners < 0 ? this.defaultMaxListeners : this.#maxListeners;
			n && n > 0 && this.#events[t].size > n && (this.#events[t].warned = !0,
			console.error("(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.", this.#events[t].size))
		}
		return this
	}
	on = this.addListener;
	once(t, e) {
		if (typeof e != 'function')
			throw TypeError("listener must be a function");
		var i = (...args) => {
			this.removeListener(t, i),
			e.apply(this, args)
		}
		return i.listener = e,
		this.on(t, i)
	}
	removeListener(t, e) {
		if (typeof e != 'function')
			throw TypeError("listener must be a function");
		if (!this.#events || !this.#events[t])
			return this;
		var i = this.#events[t];
		if (i === e || typeof i.listener == 'function' && i.listener === e)
			delete this.#events[t],
			this.#events.removeListener && this.emit('removeListener', t, e);
		else if (typeof i == 'object' && i !== null) {
			for (let s of i.values())
				if (s === e || typeof s.listener == 'function' && s.listener === e) {
					i.delete(s),
					i.size < 2 && (i.size === 0 ? delete this.#events[t] : this.#events[t] = this.#events[t].values().next().value),
					this.#events.removeListener && this.emit('removeListener', t, e);
					break
				}
		}
		return Object.keys(this.#events).length < 1 && (this.#events = null),
			this
	}
	removeAllListeners(t) {
		if (!this.#events)
			return this;
		if (!this.#events.removeListener)
			return arguments.length === 0 ? this.#events = null : this.#events[t] && delete this.#events[t],
				Object.keys(this.#events).length < 1 && (this.#events = null),
				this;
		var e;
		if (arguments.length === 0) {
			for (e in this.#events)
				'removeListener' !== e && this.removeAllListeners(e);
			return this.removeAllListeners('removeListener')
		}
		if (e = this.#events[t], typeof e == 'function')
			this.removeListener(t, e);
		else
			for (let i of e.values())
				this.removeListener(t, i);
		return delete this.#events[t],
			Object.keys(this.#events).length < 1 && (this.#events = null),
			this
	}
	listeners(t) {
		return this.#events && this.#events[t] ? typeof this.#events[t] == 'function' ? [this.#events[t]] : Array.from(this.#events[t]) : []
	}
	listenerCount(t) {
		return this.#events && this.#events[t] ? typeof this.#events[t] == 'function' ? 1 : this.#events[t].size : 0
	}
}