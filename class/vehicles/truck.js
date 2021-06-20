import s from "../math/cartesian.js";
import n from "./mass.js";
import r from "./spring.js";
import Vehicle from "./vehicle.js";
import h from "./wheel.js";

let d = {
    TRUCK_GROUND: "truck_idle"
}

export default class extends Vehicle {
    constructor(t, e) {
        super(t);
        super.init(t);
        this.createMasses(e);
        this.createSprings();
        this.stopSounds();
        this.updateCameraFocalPoint();
        -1 === i && this.swap();
    }
    vehicleName = "TRUCK";
    masses = null;
    springs = null;
    cosmetics = null;
    slow = !1;
    pedala = 0;
    swapped = !1;
    crashed = !1;
    createMasses(t) {
        this.masses = [],
        this.masses.push(new n(new s(t.x - 15,t.y + 7), this)),
        this.masses.push(new n(new s(t.x + 15,t.y + 7), this)),
        this.masses[0].friction = .1,
        this.masses[1].friction = .1,
        this.masses.push(new h(new s(t.x - 20,t.y + 35),this)),
        this.masses.push(new h(new s(t.x + 20,t.y + 35),this)),
        this.masses[2].radius = this.masses[3].radius = 14,
        this.masses[0].radius = this.masses[1].radius = 7,
        this.head = this.masses[0],
        this.backMass = this.masses[1],
        this.rearWheel = this.masses[2],
        this.frontWheel = this.masses[3]
    }
    createSprings() {
        this.springs = [];
        var t = this.masses;
        this.springs.push(new r(t[0],t[1],this)),
        this.springs.push(new r(t[0],t[2],this)),
        this.springs.push(new r(t[1],t[3],this)),
        this.springs.push(new r(t[0],t[3],this)),
        this.springs.push(new r(t[1],t[2],this)),
        this.springs.push(new r(t[2],t[3],this)),
        this.springs[0].leff = this.springs[0].lrest = 30,
        this.springs[1].leff = this.springs[1].lrest = 30,
        this.springs[2].leff = this.springs[2].lrest = 30,
        this.springs[3].leff = this.springs[3].lrest = 45,
        this.springs[4].leff = this.springs[4].lrest = 45;
        for (var e in this.springs)
            this.springs[e].springConstant = .3
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
            if (this.rearWheel.contact && this.frontWheel.contact && (this.slow = !1),
            this.slow === !1) {
                this.crashed === !1 && this.control();
                for (var i = e - 1; i >= 0; i--)
                    t[i].update();
                for (var r = n - 1; r >= 0; r--)
                    s[r].update()
            }
            this.updateDrawHeadAngle(),
            this.updateCameraFocalPoint()
        }
    }
    updateSound() {
        if (this.player.isInFocus()) {
            var t = this.scene.sound;
            if (this.rearWheel.contact) {
                var e = Math.min(this.rearWheel.motor, 1);
                t.play(d.TRUCK_GROUND, e)
            } else if (this.frontWheel.contact) {
                var e = Math.min(this.frontWheel.motor, 1);
                t.play(d.TRUCK_GROUND, e)
            } else
                t.stop(d.TRUCK_GROUND)
        }
    }
    updateCameraFocalPoint() {
        this.focalPoint = 1 === this.dir ? this.head : this.backMass
    }
    stopSounds() {
        var t = this.scene.sound;
        t.stop(d.TRUCK_GROUND)
    }
    updateDrawHeadAngle() {
        var t = this.frontWheel.pos
            , e = this.rearWheel.pos
            , i = t.x
            , s = t.y
            , n = e.x
            , r = e.y
            , o = i - n
            , a = s - r;
        this.drawHeadAngle = -(Math.atan2(o, a) - Math.PI / 2)
    }
    swap() {
        this.dir = -1 * this.dir,
        this.springs[0].swap(),
        this.springs[5].swap()
    }
    control() {
        var t = this.gamepad
            , e = t.isButtonDown("up")
            , i = t.isButtonDown("down")
            , s = t.isButtonDown("left")
            , n = t.isButtonDown("right")
            , r = t.isButtonDown("z");
        r && !this.swapped && (this.swap(),
        this.swapped = !0),
        r || (this.swapped = !1);
        var o = e ? 1 : 0
            , a = this.rearWheel
            , h = this.frontWheel;
        a.motor += (.8 * o - a.motor) / 10,
        h.motor += (.8 * o - h.motor) / 10,
        a.brake = i,
        h.brake = i;
        var l = s ? 1 : 0;
        l += n ? -1 : 0;
        var c = this.springs;
        c[0].rotate(l / 8),
        c[5].rotate(l / 8)
    }
    draw() {
        if (this.explosion)
            this.explosion.draw(1);
        else {
            var t = this.scene.game.canvas.getContext("2d");
            if (t.imageSmoothingEnabled = !0,
            t.mozImageSmoothingEnabled = !0,
            t.oImageSmoothingEnabled = !0,
            t.webkitImageSmoothingEnabled = !0,
            this.settings.developerMode)
                for (var e = this.masses, i = e.length, s = i - 1; s >= 0; s--)
                    e[s].draw();
            t.globalAlpha = this.player._opacity,
            this.drawTruck(t),
            t.globalAlpha = 1
        }
    }
    drawTruck(t, self = this) {
        var e = this.scene
            , i = e.camera.zoom
            , n = GameInventoryManager.getItem(this.cosmetics.head)
            , p = self.masses || [self.head, self.backMass, self.rearWheel, self.frontWheel]
            , r = self.drawHeadAngle
            , o = self.dir
            , a = new s(self.frontWheel.pos.x, self.frontWheel.pos.y).toScreen(e)
            , h = new s(self.rearWheel.pos.x, self.rearWheel.pos.y).toScreen(e)
            , l = new s(self.head.pos.x, self.head.pos.y).toScreen(e)
            , c = new s(self.backMass.pos.x, self.backMass.pos.y).toScreen(e)
            , d = (p[1].pos.x - p[0].pos.x) * i
            , f = (p[1].pos.y - p[0].pos.y) * i
            , v = (.5 * (p[0].pos.x + p[1].pos.x) - .5 * (p[2].pos.x + p[3].pos.x)) * i
            , g = (.5 * (p[0].pos.y + p[1].pos.y) - .5 * (p[2].pos.y + p[3].pos.y)) * i;
        t.strokeStyle = window.lite.getVar("dark") ? "#fdfdfd" : "#000",
        t.lineWidth = 3 * i,
        t.lineCap = "round",
        t.lineJoin = "round";
        var m = c.x - l.x
            , y = c.y - l.y
            , w = Math.sqrt(Math.pow(m, 2) + Math.pow(y, 2))
            , x = m / w
            , _ = y / w;
        n.draw(t, c.x - .5 * x * i * 20, c.y - _ * i * 20 * .5, r, .45 * i, o),
        t.strokeStyle = window.lite.getVar("dark") ? "#bbb" : "#444",
        t.beginPath(),
        t.moveTo(l.x - .4 * d - .9 * v, l.y - .4 * f - .9 * g),
        t.lineTo(l.x + .8 * d - .9 * v, l.y + .8 * f - .9 * g),
        t.stroke(),
        t.closePath(),
        t.save(),
        t.fillStyle = window.lite.getVar("dark") ? "#888" : "#777",
        t.beginPath(),
        t.moveTo(l.x - .4 * d - .7 * v, l.y - .4 * f - .7 * g),
        t.lineTo(l.x - .4 * d - .7 * v, l.y - .4 * f - .7 * g),
        t.lineTo(l.x + 1.4 * d - .7 * v, l.y + 1.4 * f - .7 * g),
        t.lineTo(l.x + 1.35 * d - .2 * v, l.y + 1.35 * f - .2 * g),
        t.lineTo(l.x + .9 * d - .1 * v, l.y + .9 * f - .1 * g),
        t.lineTo(l.x + .5 * d - .1 * v, l.y + .5 * f - .1 * g),
        t.lineTo(l.x + .5 * d + .2 * v, l.y + .5 * f + .2 * g),
        t.lineTo(l.x - .35 * d + .2 * v, l.y - .35 * f + .2 * g),
        t.closePath(),
        t.fill(),
        t.save(),
        t.lineWidth = 2 * i,
        t.strokeStyle = window.lite.getVar("dark") ? "#bbb" : "#444",
        t.beginPath(),
        t.moveTo(l.x - .4 * d - .7 * v, l.y - .4 * f - .7 * g),
        t.lineTo(l.x - .35 * d + .2 * v, l.y - .35 * f + .2 * g),
        t.lineTo(l.x + .8 * d + .2 * v, l.y + .8 * f + .2 * g),
        t.lineTo(l.x + .9 * d - .1 * v, l.y + .9 * f - .1 * g),
        t.lineTo(l.x + 1.35 * d - .2 * v, l.y + 1.35 * f - .2 * g),
        t.lineTo(l.x + 1.4 * d - .7 * v, l.y + 1.4 * f - .7 * g),
        t.lineTo(l.x - .4 * d - .7 * v, l.y - .4 * f - .7 * g),
        t.closePath(),
        t.stroke(),
        t.strokeStyle = window.lite.getVar("dark") ? "#bbb" : "#444",
        t.lineWidth = i,
        t.beginPath(),
        t.moveTo(l.x + .5 * d - .1 * v, l.y + .5 * f - .1 * g),
        t.lineTo(l.x + .9 * d - .1 * v, l.y + .9 * f - .1 * g),
        t.lineTo(l.x + .8 * d + .2 * v, l.y + .8 * f + .2 * g),
        t.lineTo(l.x + .5 * d + .2 * v, l.y + .5 * f + .2 * g),
        t.lineTo(l.x + .5 * d - .1 * v, l.y + .5 * f - .1 * g),
        t.closePath(),
        t.stroke(),
        t.beginPath(),
        this.tire(t, h.x, h.y, 10 * i, i, self.rearWheel.angle),
        t.closePath(),
        t.beginPath(),
        this.tire(t, a.x, a.y, 10 * i, i, self.frontWheel.angle),
        t.closePath(),
        t.restore()
    }
    tire(t, e, i, s, n, r) {
        let a;
        for (t.beginPath(),
        t.arc(e, i, 10 * n, 0, 2 * Math.PI, !1),
        t.fillStyle = "#888888",
        t.fill(),
        t.lineWidth = 5.9 * n,
        t.strokeStyle = window.lite.getVar("dark") ? "#fdfdfd" : "#000",
        t.closePath(),
        t.stroke(),
        t.beginPath(),
        t.lineWidth = 2 * n,
        t.strokeStyle = window.lite.getVar("dark") ? "#fdfdfd" : "#000",
        a = 0,
        s += 3 * n; a++ < 8; )
            t.moveTo(e + s * Math.cos(r + 6.283 * a / 8), i + s * Math.sin(r + 6.283 * a / 8)),
            t.lineTo(e + s * Math.cos(r + 6.283 * (a + .5) / 8), i + s * Math.sin(r + 6.283 * (a + .5) / 8));
        for (t.stroke(),
        t.closePath(),
        t.beginPath(),
        t.lineWidth = 2 * n,
        t.strokeStyle = window.lite.getVar("dark") ? "#fdfdfd" : "#000",
        a = 0,
        s += -9 * n; a++ < 5; )
            t.moveTo(e + s * Math.cos(r + 6.283 * a / 5), i + s * Math.sin(r + 6.283 * a / 5)),
            t.lineTo(e + s * Math.cos(r + 6.283 * (a + .2) / 5), i + s * Math.sin(r + 6.283 * (a + .2) / 5));
        t.closePath(),
        t.stroke()
    }
    clone() {
        const t = this.scene.game.canvas.getContext("2d");
        let op = 0;
        for (const checkpoint in this.player._checkpoints) {
            if (checkpoint > this.player._checkpoints.length - 11) {
                t.globalAlpha = .03 * ++op,
                this.drawTruck(t, JSON.parse(this.player._checkpoints[checkpoint]._tempVehicle)),
                t.globalAlpha = 1
            }
        }
        op = 0;
        for (const checkpoint in this.player._cache) {
            if (checkpoint > this.player._cache.length - 11) {
                t.globalAlpha = .03 * ++op,
                this.drawTruck(t, JSON.parse(this.player._cache[checkpoint]._tempVehicle)),
                t.globalAlpha = 1
            }
        }
    }
}