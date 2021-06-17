!function() {
    if ("performance"in window == !1 && (window.performance = {}),
    Date.now = Date.now || function() {
        return (new Date).getTime()
    }
    ,
    "now"in window.performance == !1) {
        var t = window.performance.timing && window.performance.timing.navigationStart ? window.performance.timing.navigationStart : Date.now();
        window.performance.now = function() {
            return Date.now() - t
        }
    }
}();
var s = s || function() {
    var t = [];
    return {
        getAll: function() {
            return t
        },
        removeAll: function() {
            t = []
        },
        add: function(e) {
            t.push(e)
        },
        remove: function(e) {
            var i = t.indexOf(e);
            -1 !== i && t.splice(i, 1)
        },
        update: function(e) {
            if (0 === t.length)
                return !1;
            var i = 0;
            for (e = void 0 !== e ? e : window.performance.now(); i < t.length; )
                t[i].update(e) ? i++ : t.splice(i, 1);
            return !0
        }
    }
}();
s.Tween = function(t) {
    var e = t
      , i = {}
      , n = {}
      , r = {}
      , o = 1e3
      , a = 0
      , h = !1
      , l = !1
      , c = !1
      , u = 0
      , p = null
      , d = s.Easing.Linear.None
      , f = s.Interpolation.Linear
      , v = []
      , g = null
      , m = !1
      , y = null
      , w = null
      , x = null;
    for (var _ in t)
        i[_] = parseFloat(t[_], 10);
    this.to = function(t, e) {
        return void 0 !== e && (o = e),
        n = t,
        this
    }
    ,
    this.start = function(t) {
        s.add(this),
        l = !0,
        m = !1,
        p = void 0 !== t ? t : window.performance.now(),
        p += u;
        for (var o in n) {
            if (n[o]instanceof Array) {
                if (0 === n[o].length)
                    continue;
                n[o] = [e[o]].concat(n[o])
            }
            i[o] = e[o],
            i[o]instanceof Array == !1 && (i[o] *= 1),
            r[o] = i[o] || 0
        }
        return this
    }
    ,
    this.stop = function() {
        return l ? (s.remove(this),
        l = !1,
        null !== x && x.call(e),
        this.stopChainedTweens(),
        this) : this
    }
    ,
    this.stopChainedTweens = function() {
        for (var t = 0, e = v.length; e > t; t++)
            v[t].stop()
    }
    ,
    this.delay = function(t) {
        return u = t,
        this
    }
    ,
    this.repeat = function(t) {
        return a = t,
        this
    }
    ,
    this.yoyo = function(t) {
        return h = t,
        this
    }
    ,
    this.easing = function(t) {
        return d = t,
        this
    }
    ,
    this.interpolation = function(t) {
        return f = t,
        this
    }
    ,
    this.chain = function() {
        return v = arguments,
        this
    }
    ,
    this.onStart = function(t) {
        return g = t,
        this
    }
    ,
    this.onUpdate = function(t) {
        return y = t,
        this
    }
    ,
    this.onComplete = function(t) {
        return w = t,
        this
    }
    ,
    this.onStop = function(t) {
        return x = t,
        this
    }
    ,
    this.update = function(t) {
        var s, l, x;
        if (p > t)
            return !0;
        m === !1 && (null !== g && g.call(e),
        m = !0),
        l = (t - p) / o,
        l = l > 1 ? 1 : l,
        x = d(l);
        for (s in n) {
            var _ = i[s] || 0
              , b = n[s];
            b instanceof Array ? e[s] = f(b, x) : ("string" == typeof b && (b = _ + parseFloat(b, 10)),
            "number" == typeof b && (e[s] = _ + (b - _) * x))
        }
        if (null !== y && y.call(e, x),
        1 === l) {
            if (a > 0) {
                isFinite(a) && a--;
                for (s in r) {
                    if ("string" == typeof n[s] && (r[s] = r[s] + parseFloat(n[s], 10)),
                    h) {
                        var T = r[s];
                        r[s] = n[s],
                        n[s] = T
                    }
                    i[s] = r[s]
                }
                return h && (c = !c),
                p = t + u,
                !0
            }
            null !== w && w.call(e);
            for (var C = 0, k = v.length; k > C; C++)
                v[C].start(p + o);
            return !1
        }
        return !0
    }
}
,
s.Easing = {
    Linear: {
        None: function(t) {
            return t
        }
    },
    Quadratic: {
        In: function(t) {
            return t * t
        },
        Out: function(t) {
            return t * (2 - t)
        },
        InOut: function(t) {
            return (t *= 2) < 1 ? .5 * t * t : -.5 * (--t * (t - 2) - 1)
        }
    },
    Cubic: {
        In: function(t) {
            return t * t * t
        },
        Out: function(t) {
            return --t * t * t + 1
        },
        InOut: function(t) {
            return (t *= 2) < 1 ? .5 * t * t * t : .5 * ((t -= 2) * t * t + 2)
        }
    },
    Quartic: {
        In: function(t) {
            return t * t * t * t
        },
        Out: function(t) {
            return 1 - --t * t * t * t
        },
        InOut: function(t) {
            return (t *= 2) < 1 ? .5 * t * t * t * t : -.5 * ((t -= 2) * t * t * t - 2)
        }
    },
    Quintic: {
        In: function(t) {
            return t * t * t * t * t
        },
        Out: function(t) {
            return --t * t * t * t * t + 1
        },
        InOut: function(t) {
            return (t *= 2) < 1 ? .5 * t * t * t * t * t : .5 * ((t -= 2) * t * t * t * t + 2)
        }
    },
    Sinusoidal: {
        In: function(t) {
            return 1 - Math.cos(t * Math.PI / 2)
        },
        Out: function(t) {
            return Math.sin(t * Math.PI / 2)
        },
        InOut: function(t) {
            return .5 * (1 - Math.cos(Math.PI * t))
        }
    },
    Exponential: {
        In: function(t) {
            return 0 === t ? 0 : Math.pow(1024, t - 1)
        },
        Out: function(t) {
            return 1 === t ? 1 : 1 - Math.pow(2, -10 * t)
        },
        InOut: function(t) {
            return 0 === t ? 0 : 1 === t ? 1 : (t *= 2) < 1 ? .5 * Math.pow(1024, t - 1) : .5 * (-Math.pow(2, -10 * (t - 1)) + 2)
        }
    },
    Circular: {
        In: function(t) {
            return 1 - Math.sqrt(1 - t * t)
        },
        Out: function(t) {
            return Math.sqrt(1 - --t * t)
        },
        InOut: function(t) {
            return (t *= 2) < 1 ? -.5 * (Math.sqrt(1 - t * t) - 1) : .5 * (Math.sqrt(1 - (t -= 2) * t) + 1)
        }
    },
    Elastic: {
        In: function(t) {
            var e, i = .1, s = .4;
            return 0 === t ? 0 : 1 === t ? 1 : (!i || 1 > i ? (i = 1,
            e = s / 4) : e = s * Math.asin(1 / i) / (2 * Math.PI),
            -(i * Math.pow(2, 10 * (t -= 1)) * Math.sin(2 * (t - e) * Math.PI / s)))
        },
        Out: function(t) {
            var e, i = .1, s = .4;
            return 0 === t ? 0 : 1 === t ? 1 : (!i || 1 > i ? (i = 1,
            e = s / 4) : e = s * Math.asin(1 / i) / (2 * Math.PI),
            i * Math.pow(2, -10 * t) * Math.sin(2 * (t - e) * Math.PI / s) + 1)
        },
        InOut: function(t) {
            var e, i = .1, s = .4;
            return 0 === t ? 0 : 1 === t ? 1 : (!i || 1 > i ? (i = 1,
            e = s / 4) : e = s * Math.asin(1 / i) / (2 * Math.PI),
            (t *= 2) < 1 ? -.5 * i * Math.pow(2, 10 * (t -= 1)) * Math.sin(2 * (t - e) * Math.PI / s) : i * Math.pow(2, -10 * (t -= 1)) * Math.sin(2 * (t - e) * Math.PI / s) * .5 + 1)
        }
    },
    Back: {
        In: function(t) {
            var e = 1.70158;
            return t * t * ((e + 1) * t - e)
        },
        Out: function(t) {
            var e = 1.70158;
            return --t * t * ((e + 1) * t + e) + 1
        },
        InOut: function(t) {
            var e = 2.5949095;
            return (t *= 2) < 1 ? .5 * t * t * ((e + 1) * t - e) : .5 * ((t -= 2) * t * ((e + 1) * t + e) + 2)
        }
    },
    Bounce: {
        In: function(t) {
            return 1 - s.Easing.Bounce.Out(1 - t)
        },
        Out: function(t) {
            return 1 / 2.75 > t ? 7.5625 * t * t : 2 / 2.75 > t ? 7.5625 * (t -= 1.5 / 2.75) * t + .75 : 2.5 / 2.75 > t ? 7.5625 * (t -= 2.25 / 2.75) * t + .9375 : 7.5625 * (t -= 2.625 / 2.75) * t + .984375
        },
        InOut: function(t) {
            return .5 > t ? .5 * s.Easing.Bounce.In(2 * t) : .5 * s.Easing.Bounce.Out(2 * t - 1) + .5
        }
    }
},
s.Interpolation = {
    Linear: function(t, e) {
        var i = t.length - 1
          , n = i * e
          , r = Math.floor(n)
          , o = s.Interpolation.Utils.Linear;
        return 0 > e ? o(t[0], t[1], n) : e > 1 ? o(t[i], t[i - 1], i - n) : o(t[r], t[r + 1 > i ? i : r + 1], n - r)
    },
    Bezier: function(t, e) {
        for (var i = 0, n = t.length - 1, r = Math.pow, o = s.Interpolation.Utils.Bernstein, a = 0; n >= a; a++)
            i += r(1 - e, n - a) * r(e, a) * t[a] * o(n, a);
        return i
    },
    CatmullRom: function(t, e) {
        var i = t.length - 1
          , n = i * e
          , r = Math.floor(n)
          , o = s.Interpolation.Utils.CatmullRom;
        return t[0] === t[i] ? (0 > e && (r = Math.floor(n = i * (1 + e))),
        o(t[(r - 1 + i) % i], t[r], t[(r + 1) % i], t[(r + 2) % i], n - r)) : 0 > e ? t[0] - (o(t[0], t[0], t[1], t[1], -n) - t[0]) : e > 1 ? t[i] - (o(t[i], t[i], t[i - 1], t[i - 1], n - i) - t[i]) : o(t[r ? r - 1 : 0], t[r], t[r + 1 > i ? i : r + 1], t[r + 2 > i ? i : r + 2], n - r)
    },
    Utils: {
        Linear: function(t, e, i) {
            return (e - t) * i + t
        },
        Bernstein: function(t, e) {
            var i = s.Interpolation.Utils.Factorial;
            return i(t) / i(e) / i(t - e)
        },
        Factorial: function() {
            var t = [1];
            return function(e) {
                var i = 1;
                if (t[e])
                    return t[e];
                for (var s = e; s > 1; s--)
                    i *= s;
                return t[e] = i,
                i
            }
        }(),
        CatmullRom: function(t, e, i, s, n) {
            var r = .5 * (i - t)
              , o = .5 * (s - e)
              , a = n * n
              , h = n * a;
            return (2 * e - 2 * i + r + o) * h + (-3 * e + 3 * i - 2 * r - o) * a + r * n + e
        }
    }
}

export default s;