export default class {
    constructor() {
        this.start = null;
        this.end = null;
        this.verticies = [];
    }
    start = null;
    end = null;
    verticies = [];
    build(t) {
        var e = t.pop();
        this.start = e.p1,
        this.end = e.p2,
        this.verticies.push(e);
        for (var i = t.length, s = i - 1; s >= 0; s--) {
            var n = t[s]
                , r = n.p1
                , o = n.p2;
            this.start.x === o.x && this.start.y === o.y ? (this.verticies.unshift(n),
            this.start = n.p1,
            t.splice(s, 1)) : this.end.x === r.x && this.end.y === r.y && (this.verticies.push(n),
            this.end = n.p2,
            t.splice(s, 1))
        }
    }
}