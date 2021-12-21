import n from "../math/cartesian.js";
import r from "./mass.js";
import o from "./wheel.js";
import a from "./spring.js";
import Vehicle from "./vehicle.js";

let l = {
    BLOB: "blob_sound"
}

export default class extends Vehicle {
    constructor(t, e) {
        super(t);
        this.createMasses(e);
        this.createSprings();
        this.stopSounds();
    }
    vehicleName = "Blob";
    createMasses(t) {
        var e = [];
        e.push(new o(new n(t.x + 15,t.y + 40),this)),
        e.push(new o(new n(t.x + -15,t.y + 40),this)),
        e.push(new o(new n(t.x + -15,t.y + 10),this)),
        e.push(new o(new n(t.x + 15,t.y + 10),this));
        var i = new r(new n(0,0), this);
        i.vel = new n(0,0),
        this.m0 = e[0],
        this.m1 = e[1],
        this.m2 = e[2],
        this.m3 = e[3],
        this.head = i,
        this.masses = e,
        this.focalPoint = this.head
    }
    createSprings() {
        let t = this.masses
          , e = []
          , i = this.spring0 = new a(t[0],t[1],this)
          , s = this.spring1 = new a(t[1],t[2],this)
          , n = this.spring2 = new a(t[2],t[3],this)
          , r = this.spring3 = new a(t[3],t[0],this)
          , o = this.spring4 = new a(t[0],t[2],this)
          , h = this.spring5 = new a(t[1],t[3],this);
        e.push(i),
        e.push(s),
        e.push(n),
        e.push(r),
        e.push(o),
        e.push(h);
        for (var l in e)
            e[l].springConstant = .2,
            e[l].dampConstant = .2;
        this.springs = e
    }
    update() {
        if (this.crashed === !1 && (this.updateSound(),
        this.control()),
        this.explosion)
            this.explosion.update();
        else {
            let t = this.masses;
            for (const t of this.springs)
                t.update();
            for (const t of this.masses)
                t.update();
            if ((t[0].contact || t[1].contact || t[2].contact || t[3].contact) && (this.slow = !1),
            !this.slow) {
                this.control();
                for (const t of this.springs)
                    t.update();
                for (const t of this.masses)
                    t.update();
            }
            let r = 0,
                o = 0;
            for (const t of this.masses)
                r += t.pos.x,
                o += t.pos.y;
            this.head.pos.x = .25 * r,
            this.head.pos.y = .25 * o,
            this.head.vel = t[0].vel
        }
    }
    updateSound() {
        if (this.player.isInFocus()) {
            var t = this.scene.sound;
            t.play(l.BLOB, .4)
        }
    }
    stopSounds() {
        var t = this.scene.sound;
        t.stop(l.BLOB)
    }
    updateCameraFocalPoint() {}
    control() {
        var t, e, i = this.player.getGamepad(), s = i.isButtonDown("up"), n = i.isButtonDown("down"), r = i.isButtonDown("left"), o = i.isButtonDown("right"), a = i.isButtonDown("z"), h = this.masses, l = this.springs, c = h.length, u = l.length, p = this.dir;
        p = o ? 1 : -1;
        var d = o || r ? 1 : 0;
        for (n && (d = 0),
        t = c - 1; t >= 0; t--)
            h[t].motor += (d * p * 1 - h[t].motor) / 10,
            0 == d && (h[t].motor = 0),
            h[t].brake = n;
        var f = r ? 1 : 0;
        if (f += o ? -1 : 0,
        l[4].rotate(f / 9),
        l[5].rotate(f / 9),
        a || s)
            for (e = u - 1; e >= 0; e--)
                l[e].contract(30, 10);
        else
            for (e = u - 1; e >= 0; e--)
                l[e].contract(0, 1.5)
    }
    draw(self = this, alpha = this.player._opacity) {
        if (this.explosion)
            this.explosion.draw(1);
        else {
            var t = this.scene.game.canvas.getContext("2d")
                , e = self.masses || [self.m0, self.m1, self.m2, self.m3]
                , i = this.scene
                , s = i.camera.zoom
                , m = new n(e[0].pos.x, e[0].pos.y).toScreen(i)
                , r = new n(e[1].pos.x, e[1].pos.y).toScreen(i)
                , o = new n(e[2].pos.x, e[2].pos.y).toScreen(i)
                , a = new n(e[3].pos.x, e[3].pos.y).toScreen(i);
            t.globalAlpha = alpha,
            t.beginPath(),
            t.strokeStyle = window.lite.storage.get("theme") === "midnight" ? "#ccc" : window.lite.storage.get("theme") === "dark" ? "#fbfbfb" : "#000",
            t.fillStyle = window.lite.storage.get("theme") === "midnight" ? "#ccc" : window.lite.storage.get("theme") === "dark" ? "#fbfbfb" : "#000",
            t.lineWidth = 20 * s,
            t.lineCap = "round",
            t.moveTo(m.x, m.y),
            t.lineTo(r.x, r.y),
            t.lineTo(o.x, o.y),
            t.lineTo(a.x, a.y),
            t.lineTo(m.x, m.y),
            t.fill(),
            t.stroke(),
            t.globalAlpha = 1
        }
    }
    clone() {
        let t = 0;
        let e = lite.storage.get("snapshots");
        if (e < 1) return;
        for (const checkpoint in this.player._checkpoints) {
            if (checkpoint > this.player._checkpoints.length - (parseInt(e) + 1)) {
                try {
                    if (this.player._checkpoints[checkpoint] && this.player._checkpoints[checkpoint]._tempVehicle) {
                        this.draw(JSON.parse(this.player._checkpoints[checkpoint]._tempVehicle), e / 3e2 * ++t % 1);
                    }
                } catch(e) {
                    console.error(e, this.player._checkpoints, checkpoint)
                }
            }
        }
        t = 0;
        for (const checkpoint in this.player._cache) {
            if (checkpoint > this.player._cache.length - (parseInt(e) + 1)) {
                try {
                    if (this.player._cache[checkpoint] && this.player._cache[checkpoint]._tempVehicle) {
                        this.draw(JSON.parse(this.player._cache[checkpoint]._tempVehicle), e / 3e2 * ++t % 1);
                    }
                } catch(e) {
                    console.error(e, this.player._cache, checkpoint)
                }
            }
        }
    }
}