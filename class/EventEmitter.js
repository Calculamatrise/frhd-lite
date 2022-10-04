export default class {
    constructor() {
        this._events = this._events || {};
        this._maxListeners = this._maxListeners || void 0;
        this._events = void 0;
        this._maxListeners = void 0;
        this.defaultMaxListeners = 10;
    }

    setMaxListeners(t) {
        if (typeof t != "number" || 0 > t || isNaN(t))
            throw TypeError("n must be a positive number");
        return this._maxListeners = t,
        this
    }

    emit(t) {
        var e, i, n, a, h, l;
        if (this._events || (this._events = {}), t === "error" && (!this._events.error || typeof this._events.error == "object" && this._events.error !== null && !this._events.error.length)) {
            if (e = arguments[1], e instanceof Error)
                throw e;
            throw TypeError('Uncaught, unspecified "error" event.')
        }
        if (i = this._events[t], i === void 0)
            return !1;
        if (typeof i == "function")
            switch (arguments.length) {
            case 1:
                i.call(this);
                break;
            case 2:
                i.call(this, arguments[1]);
                break;
            case 3:
                i.call(this, arguments[1], arguments[2]);
                break;
            default:
                for (n = arguments.length,
                a = new Array(n - 1),
                h = 1; n > h; h++)
                    a[h - 1] = arguments[h];
                i.apply(this, a)
            }
        else if (typeof i == "object" && i !== null) {
            for (n = arguments.length,
            a = new Array(n - 1),
            h = 1; n > h; h++)
                a[h - 1] = arguments[h];
            for (l = i.slice(),
            n = l.length,
            h = 0; n > h; h++)
                l[h].apply(this, a)
        }
        return !0
    }

    addListener(t, e) {
        var n;
        if (typeof e != "function")
            throw TypeError("listener must be a function");
        if (this._events || (this._events = {}),
        this._events.newListener && this.emit("newListener", t, typeof e.listener == "function" ? e.listener : e),
        this._events[t] ? typeof this._events[t] == "object" && this._events[t] !== null ? this._events[t].push(e) : this._events[t] = [this._events[t], e] : this._events[t] = e,
        this._events[t] == "object" && this._events[t] !== null && !this._events[t].warned) {
            var n;
            n = this._maxListeners === void 0 ? i.defaultMaxListeners : this._maxListeners,
            n && n > 0 && this._events[t].length > n && (this._events[t].warned = !0,
            console.error("(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.", this._events[t].length),
            "function" == typeof console.trace && console.trace())
        }
        return this
    }

    on = this.addListener;
    once(t, e) {
        function i() {
            this.removeListener(t, i),
            n || (n = !0,
            e.apply(this, arguments))
        }
        if (typeof e != "function")
            throw TypeError("listener must be a function");
        var n = !1;
        return i.listener = e,
        this.on(t, i),
        this
    }

    removeListener(t, e) {
        var i, n, o, a;
        if (typeof e != "function")
            throw TypeError("listener must be a function");
        if (!this._events || !this._events[t])
            return this;
        if (i = this._events[t],
        o = i.length,
        n = -1,
        i === e || typeof i.listener == "function" && i.listener === e)
            delete this._events[t],
            this._events.removeListener && this.emit("removeListener", t, e);
        else if (typeof i == "object" && i !== null) {
            for (a = o; a-- > 0; )
                if (i[a] === e || i[a].listener && i[a].listener === e) {
                    n = a;
                    break
                }
            if (0 > n)
                return this;
            1 === i.length ? (i.length = 0,
            delete this._events[t]) : i.splice(n, 1),
            this._events.removeListener && this.emit("removeListener", t, e)
        }
        return this
    }

    removeAllListeners(t) {
        var e, i;
        if (!this._events)
            return this;
        if (!this._events.removeListener)
            return 0 === arguments.length ? this._events = {} : this._events[t] && delete this._events[t],
            this;
        if (0 === arguments.length) {
            for (e in this._events)
                "removeListener" !== e && this.removeAllListeners(e);
            return this.removeAllListeners("removeListener"),
            this._events = {},
            this
        }
        if (i = this._events[t], typeof i == "function")
            this.removeListener(t, i);
        else
            for (; i.length; )
                this.removeListener(t, i[i.length - 1]);
        return delete this._events[t],
        this
    }

    listeners(t) {
        var e;
        return e = this._events && this._events[t] ? typeof this._events[t] == "function" ? [this._events[t]] : this._events[t].slice() : []
    }

    listenerCount(t, e) {
        var i;
        return i = t._events && t._events[e] ? typeof t._events[e] == "function" ? 1 : t._events[e].length : 0
    }
}