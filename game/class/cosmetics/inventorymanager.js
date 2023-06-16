let s = {},
    n = {},
    r = {};

class GameInventoryManager {
    getItem(t) {
        let e = t.classname
          , i = t.script
          , o = t.options
          , a = t.type;
        s[e] || ("1" === a && (e = "forward_cap",
        o = {
            back: "white"
        }),
        r[i] || (r[i] = !0,
        GameManager.loadFile(i)));
        let h = this.generateID(a, e, o);
        return n[h] || (n[h] = new s[e](o)), n[h];
    }
    redraw() {
        for (const t in n)
            n.hasOwnProperty(t) && n[t].setDirty()
    }
    generateID(t, e, i) {
        e = t + e;
        if (i)
            for (const s in i)
                i.hasOwnProperty(s) && (e += i[s]);
        return e
    }
    register(t, e) {
        s[t] = e
    }
    clear() {}
}

window.GameInventoryManager = new GameInventoryManager;