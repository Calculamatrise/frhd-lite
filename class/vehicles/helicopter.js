import s from "../math/cartesian.js";
import n from "./mass.js";
import r from "./spring.js";
import Vehicle from "./vehicle.js";
import a from "./prop.js";

let c = {
    HELICOPTER: "helicopter"
}

export default class extends Vehicle {
    constructor(t, e) {
        super();
        super.init(t);
        this.createMasses(e);
        this.createSprings();
        this.createCockpit();
        this.updateCameraFocalPoint();
        this.stopSounds();
        -1 === i && this.swap()
    }
    vehicleName = "Helicopter";
    vehicleUpdate = this.update;
    vehicleDraw = this.draw;
    masses = null;
    springs = null;
    slow = !1;
    swapped = !1;
    createCockpit() {
        var t = document.createElement("canvas");
        this.canvasCockpit = t
    }
    drawCockpit(self = this) {
        var t = this.canvasCockpit
            , e = self.masses || [self.head, self.mass2, self.mass3, self.mass4, self.mass5]
            , i = this.scene
            , s = i.camera.zoom
            , n = e[0].radius * s * .9
            , r = 50 * s
            , o = 50 * s;
        t.width = r,
        t.height = o;
        var a = 0
            , h = 0
            , l = Math.max(2 * s, 1)
            , c = t.getContext("2d");
        c.save(),
        c.translate(r / 2, o / 2),
        c.scale(1.3, 1),
        c.beginPath(),
        c.arc(0, 0, n, 0, 1.5 * Math.PI, !1),
        c.lineTo(a, h),
        c.lineTo(a + n, h),
        c.closePath(),
        c.restore(),
        c.fillStyle = window.lite.storage.get("theme") === "midnight" ? "#ccc" : window.lite.storage.get("theme") === "dark" ? "#fff" : "#000",
        c.fill(),
        c.lineWidth = l,
        c.strokeStyle = window.lite.storage.get("theme") === "midnight" ? "#ccc" : window.lite.storage.get("theme") === "dark" ? "#fff" : "#000",
        c.stroke(),
        c.save(),
        c.translate(r / 2, o / 2),
        c.scale(1.3, 1),
        c.beginPath(),
        c.arc(a, h, n, 0, 1.5 * Math.PI, !0),
        c.restore(),
        c.lineWidth = l,
        c.strokeStyle = window.lite.storage.get("theme") === "midnight" ? "#ccc" : window.lite.storage.get("theme") === "dark" ? "#fff" : "#000",
        c.stroke()
    }
    createMasses(t) {
        var e = [];
        e.push(new a(new s(t.x + 0,t.y + 18),this));
        var i = new n(new s(t.x + -17,t.y + 42), this)
            , r = new n(new s(t.x + 17,t.y + 42), this)
            , o = new n(new s(t.x + -40,t.y + 15), this)
            , h = new n(new s(t.x + 40,t.y + 15), this);
        e.push(i),
        e.push(r),
        e.push(o),
        e.push(h),
        e[0].radius = 18,
        e[1].radius = 8,
        e[2].radius = 8,
        e[3].grav = !1,
        e[4].grav = e[4].collide = !1,
        e[1].friction = .2,
        e[2].friction = .2,
        this.head = e[0],
        this.mass2 = e[1],
        this.mass3 = e[2],
        this.mass4 = e[3],
        this.mass5 = e[4],
        this.rotor = 0,
        this.rotor2 = 0,
        this.dir = 1;
        var l = this;
        e[3].drive = this.head.drive = function() {
            l.explode()
        }
        ,
        this.focalPoint = e[0],
        this.masses = e
    }
    createSprings() {
        var t = this.masses
            , e = [];
        e.push(new r(t[0],t[1],this)),
        e.push(new r(t[2],t[0],this)),
        e.push(new r(t[2],t[1],this)),
        e.push(new r(t[0],t[3],this)),
        e.push(new r(t[1],t[3],this)),
        e.push(new r(t[0],t[4],this)),
        e.push(new r(t[2],t[4],this)),
        this.spring1 = e[0],
        this.spring2 = e[1],
        this.spring3 = e[2],
        this.spring4 = e[3],
        this.spring5 = e[4],
        this.spring6 = e[5],
        this.spring7 = e[6],
        e[0].leff = e[4].lrest = 30,
        e[1].leff = e[4].lrest = 30,
        e[2].leff = e[4].lrest = 35,
        e[4].leff = e[4].lrest = 35,
        e[6].leff = e[4].lrest = 35;
        for (var i in e)
            e[i].dampConstant = .4;
        for (var i in e)
            e[i].springConstant = .5;
        this.springs = e
    }
    updateCameraFocalPoint() {}
    update() {
        if (this.crashed === !1 && (this.updateSound(),
        this.control()),
        this.explosion)
            this.explosion.update();
        else {
            for (var t = this.springs, e = t.length, i = e - 1; i >= 0; i--)
                t[i].update();
            for (var s = this.masses, n = s.length, r = n - 1; r >= 0; r--)
                s[r].update();
            if ((this.masses[1].contact || this.masses[2].contact) && (this.slow = !1),
            this.slow === !1) {
                this.crashed === !1 && this.control();
                for (var i = e - 1; i >= 0; i--)
                    t[i].update();
                for (var r = n - 1; r >= 0; r--)
                    s[r].update()
            }
            this.updateCockpitAngle()
        }
    }
    updateSound() {
        if (this.player.isInFocus()) {
            var t = this.scene.sound
                , e = Math.min(this.head.motor, 1);
            t.play(c.HELICOPTER, e)
        }
    }
    stopSounds() {
        var t = this.scene.sound;
        t.stop(c.HELICOPTER)
    }
    swap() {
        var t = this.dir
            , e = this.springs
            , i = this.masses;
        t = -1 * t,
        e[2].swap();
        var n = new s(0,0)
            , r = new s(0,0)
            , o = new s(0,0);
        n.equ(i[3].pos),
        r.equ(i[3].old),
        o.equ(i[3].vel),
        i[3].pos.equ(i[4].pos),
        i[3].old.equ(i[4].old),
        i[3].vel.equ(i[4].vel),
        i[4].pos.equ(n),
        i[4].old.equ(r),
        i[4].vel.equ(o),
        this.dir = t
    }
    control() {
        var t = this.player.getGamepad()
            , e = t.isButtonDown("up")
            , i = (t.isButtonDown("down"),
        t.isButtonDown("back"))
            , s = t.isButtonDown("left")
            , n = t.isButtonDown("right")
            , r = t.isButtonDown("z")
            , o = this.masses
            , a = this.springs;
        r && !this.swapped && (this.swap(),
        this.swapped = !0),
        r || (this.swapped = !1);
        var h = o[1].pos.add(o[2].pos).factor(.5);
        h = o[0].pos.sub(h),
        h = h.factor(1 / h.len()),
        o[0].angle.equ(h);
        var l = e ? 1 : 0;
        o[0].motor += (l - o[0].motor) / 10;
        var c = s ? 1 : 0;
        c += n ? -1 : 0,
        a[2].rotate(c / 6),
        i && (this.scene.restartTrack = !0)
    }
    updateCockpitAngle() {
        var t = this.masses
            , e = t[0].pos
            , i = t[3].pos
            , s = e.x
            , n = e.y
            , r = i.x
            , o = i.y
            , a = s - r
            , l = n - o;
        this.cockpitAngle = -(Math.atan2(a, l) - Math.PI / 2)
    }
    draw(self = this, alpha) {
        if (this.explosion)
            this.explosion.draw(1);
        else {
            var t = this.scene.game.canvas.getContext("2d");
            t.imageSmoothingEnabled = !0,
            t.webkitImageSmoothingEnabled = !0,
            t.mozImageSmoothingEnabled = !0,
            t.globalAlpha = alpha || this.player._opacity;
            var e = self.masses || [self.head, self.mass2, self.mass3, self.mass4, self.mass5]
                , i = self.dir
                , n = self.rotor
                , r = self.rotor2
                , o = this.scene
                , a = o.camera.zoom;
            var h = new s(e[1].pos.x, e[1].pos.y).add(e[2].pos).factor(.5);
            h = new s(e[0].pos.x, e[0].pos.y).sub(h).factor(a);
            var l = new s(-h.y * i,h.x * i)
                , c = new s(e[0].pos.x, e[0].pos.y).toScreen(o);
            n += .5 * e[0].motor + .05,
            n > 6.2831 && (n -= 6.2831),
            r += .5,
            r > 6.2831 && (r -= 6.2831),
            self.rotor = n,
            self.rotor2 = r,
            t.strokeStyle = window.lite.storage.get("theme") === "midnight" ? "#ccc" : window.lite.storage.get("theme") === "dark" ? "#fff" : "#000",
            t.lineWidth = 5 * a,
            t.beginPath(),
            t.moveTo(c.x + .5 * h.x, c.y + .5 * h.y),
            t.lineTo(c.x + .8 * h.x, c.y + .8 * h.y),
            t.stroke(),
            t.lineWidth = 3 * a,
            t.beginPath();
            var u = .9 * Math.cos(n);
            t.moveTo(c.x + .9 * h.x + l.x * u, c.y + .8 * h.y + l.y * u),
            t.lineTo(c.x + .9 * h.x - l.x * u, c.y + .8 * h.y - l.y * u),
            t.stroke();
            var p = new s(e[1].pos.x, e[1].pos.y).toScreen(o)
                , d = new s(e[2].pos.x, e[2].pos.y).toScreen(o);
            t.lineWidth = 4 * a,
            t.stokeStyle = "#666666",
            t.beginPath(),
            t.moveTo(p.x - .2 * l.x - .1 * h.x, p.y - .2 * l.y - .1 * h.y),
            t.lineTo(p.x - .25 * h.x, p.y - .25 * h.y),
            t.lineTo(d.x - .25 * h.x, d.y - .25 * h.y),
            t.lineTo(d.x + .2 * l.x - .1 * h.x, d.y + .2 * l.y - .1 * h.y),
            t.stroke(),
            t.lineWidth = 3 * a,
            t.beginPath(),
            t.moveTo(p.x - .2 * h.x, p.y - .2 * h.y),
            t.lineTo(c.x, c.y),
            t.lineTo(d.x - .2 * h.x, d.y - .2 * h.y),
            t.stroke(),
            t.lineWidth = 6 * a,
            t.stokeStyle = "#000000",
            t.beginPath();
            var f = new s(e[3].pos.x, e[3].pos.y).toScreen(o);
            t.moveTo(c.x, c.y),
            t.lineTo(f.x, f.y),
            t.lineTo(c.x - .1 * h.x, c.y - .3 * h.y),
            t.stroke(),
            t.lineWidth = 2 * a,
            t.stokeStyle = "#000000",
            t.beginPath();
            var v = 7 * a
                , g = new s(v * Math.sin(-r),v * Math.cos(-r));
            t.moveTo(f.x + g.x, f.y + g.y),
            t.lineTo(f.x - g.x, f.y - g.y),
            t.moveTo(f.x - g.y, f.y + g.x),
            t.lineTo(f.x + g.y, f.y - g.x),
            t.stroke(),
            t.beginPath(),
            t.lineWidth = 2 * a,
            t.arc(f.x, f.y, e[3].radius * a, 0, 2 * Math.PI, !1),
            t.stroke();
            this.drawCockpit(self);
            var m = this.canvasCockpit
                , y = m.width
                , w = m.height
                , x = c.x + 5 * a * self.dir
                , _ = c.y + 2 * a
                , b = 0
                , T = 0
                , C = y
                , k = w
                , S = b * a - C / 2
                , P = T * a - k / 2
                , M = self.cockpitAngle
                , A = -1 === i
                , D = this.cosmetics
                , I = GameInventoryManager.getItem(D.head)
                , E = self.cockpitAngle;
            I.draw(t, x + 5 * a * i, _ - 5 * a, E, .7 * a, i),
            t.translate(x, _),
            t.rotate(M),
            A && t.scale(1, -1),
            t.drawImage(m, S, P, C, k),
            A && t.scale(1, -1),
            t.rotate(-M),
            t.translate(-x, -_),
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