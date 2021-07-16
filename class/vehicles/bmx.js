import s from "../math/cartesian.js";
import n from "./mass.js";
import h from "./ragdoll.js";
import r from "./spring.js";
import Vehicle from "./vehicle.js";
import a from "./wheel.js";

let d = {
    BIKE_GROUND: "bike_ground",
    BIKE_AIR: "bike_air",
    BIKE_FALL_1: "bike_fall_1",
    BIKE_FALL_2: "bike_fall_2",
    BIKE_FALL_3: "bike_fall_3"
}

export default class extends Vehicle {
    constructor(t, e, i, s) {
        super(t);
        super.init(t);
        this.createMasses(e, s);
        this.createSprings();
        this.updateCameraFocalPoint();
        this.stopSounds();
        -1 === i && this.swap();
    }
    vehicleName = "BMX";
    masses = null;
    springs = null;
    cosmetics = null;
    slow = !1;
    pedala = 0;
    cosmeticHead = null;
    cosmeticRearWheel = null;
    cosmeticFrontWheel = null;
    swapped = !1;
    ragdoll = null;
    createMasses(t, e) {
        this.masses = [];
        var i = new n(new s(t.x,t.y - 36), this)
            , r = new a(new s(t.x + 21,t.y + 3), this)
            , o = new a(new s(t.x + -21,t.y + 3), this);
        i.drive = this.createRagdoll.bind(this),
        o.radius = 11.7,
        r.radius = 11.7,
        i.radius = 14,
        i.vel.equ(e),
        o.vel.equ(e),
        r.vel.equ(e),
        this.masses.push(i),
        this.masses.push(o),
        this.masses.push(r),
        this.head = i,
        this.frontWheel = r,
        this.rearWheel = o
    }
    createSprings() {
        this.springs = [];
        var t = new r(this.head,this.rearWheel,this)
            , e = new r(this.rearWheel,this.frontWheel,this)
            , i = new r(this.frontWheel,this.head,this);
        e.lrest = 42,
        e.leff = 42,
        e.springConstant = .35,
        e.dampConstant = .3,
        t.lrest = 45,
        t.leff = 45,
        t.springConstant = .35,
        t.dampConstant = .3,
        i.lrest = 45,
        i.leff = 45,
        i.springConstant = .35,
        i.dampConstant = .3,
        this.springs.push(t),
        this.springs.push(e),
        this.springs.push(i),
        this.rearSpring = t,
        this.chasse = e,
        this.frontSpring = i
    }
    createRagdoll() {
        this.ragdoll = new h(this.getStickMan(),this),
        this.ragdoll.zero(this.head.vel, this.rearWheel.vel),
        this.ragdoll.dir = this.dir,
        this.rearWheel.motor = 0,
        this.rearWheel.brake = !1,
        this.frontWheel.brake = !1,
        this.head.collide = !1,
        this.updateCameraFocalPoint(),
        this.player.isInFocus() && this.playBailSound(),
        this.dead()
    }
    stopSounds() {
        var t = this.scene.sound;
        t.stop(d.BIKE_AIR),
        t.stop(d.BIKE_GROUND)
    }
    playBailSound() {
        var t = this.scene.sound
            , e = Math.min(this.speed / 50, 1)
            , i = Math.floor(3 * Math.random()) + 1;
        switch (i) {
        case 1:
            t.play(d.BIKE_FALL_1, e);
            break;
        case 2:
            t.play(d.BIKE_FALL_2, e);
            break;
        case 3:
            t.play(d.BIKE_FALL_3, e)
        }
    }
    updateCameraFocalPoint() {
        this.focalPoint = this.ragdoll ? this.ragdoll.head : this.head
    }
    getStickMan() {
        var t = this.dir
            , e = this.head
            , i = this.frontWheel
            , n = this.rearWheel
            , r = this.pedala
            , o = i.pos.sub(n.pos)
            , a = e.pos.sub(i.pos.add(n.pos).factor(.5))
            , h = new s(o.y * t,-o.x * t)
            , l = {};
        l.head = n.pos.add(o.factor(.35)).add(a.factor(1.2)),
        l.lHand = l.rHand = n.pos.add(o.factor(.8)).add(h.factor(.68));
        var c = l.head.sub(l.lHand);
        c = new s(c.y * t,-c.x * t),
        l.lElbow = l.rElbow = l.head.add(l.lHand).factor(.5).add(c.factor(130 / c.lenSqr())),
        l.waist = n.pos.add(o.factor(.2)).add(h.factor(.5));
        var u = new s(6 * Math.cos(r),6 * Math.sin(r));
        return l.lFoot = n.pos.add(o.factor(.4)).add(h.factor(.05)).add(u),
        c = l.waist.sub(l.lFoot),
        c = new s(-c.y * t,c.x * t),
        l.lKnee = l.waist.add(l.lFoot).factor(.5).add(c.factor(160 / c.lenSqr())),
        l.rFoot = n.pos.add(o.factor(.4)).add(h.factor(.05)).sub(u),
        c = l.waist.sub(l.rFoot),
        c = new s(-c.y * t,c.x * t),
        l.rKnee = l.waist.add(l.rFoot).factor(.5).add(c.factor(160 / c.lenSqr())),
        l
    }
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
            this.ragdoll ? this.ragdoll.update() : this.updateDrawHeadAngle()
        }
        this.updateCameraFocalPoint()
    }
    updateSound() {
        if (this.player.isInFocus()) {
            this.updateSpeed();
            var t = Math.min(this.speed / 50, 1)
                , e = this.scene.sound;
            this.rearWheel.contact || this.frontWheel.contact ? (e.play(d.BIKE_GROUND, t),
            e.stop(d.BIKE_AIR)) : (e.play(d.BIKE_AIR, t),
            e.stop(d.BIKE_GROUND))
        }
    }
    stopSounds() {
        var t = this.scene.sound;
        t.stop(d.BIKE_AIR),
        t.stop(d.BIKE_GROUND)
    }
    swap() {
        this.dir = -1 * this.dir,
        this.chasse.swap();
        var t = this.rearSpring.leff;
        this.rearSpring.leff = this.frontSpring.leff,
        this.frontSpring.leff = t
    }
    control() {
        var t = this.gamepad
            , e = t.isButtonDown("up")
            , i = t.isButtonDown("down")
            , s = t.isButtonDown("left")
            , n = t.isButtonDown("right")
            , r = t.isButtonDown("z")
            , o = e ? 1 : 0
            , a = this.rearWheel;
        a.motor += (o - a.motor) / 10,
        r && !this.swapped && (this.swap(),
        this.swapped = !0),
        r || (this.swapped = !1),
        e && (this.pedala += this.rearWheel.speed / 5),
        a.brake = i,
        i && this.frontSpring.contract(-10, 10),
        this.frontWheel.brake = this.dir > 0 && n && i ? !0 : this.dir < 0 && s && i ? !0 : !1;
        var h = s ? 1 : 0;
        h += n ? -1 : 0,
        this.rearSpring.contract(5 * h * this.dir, 5),
        this.frontSpring.contract(5 * -h * this.dir, 5),
        this.chasse.rotate(h / 6),
        !h && e && (this.rearSpring.contract(-7, 5),
        this.frontSpring.contract(7, 5))
    }
    draw() {
        if (this.explosion)
            this.explosion.draw();
        else {
            var t = this.scene.game.canvas.getContext("2d");
            if (t.imageSmoothingEnabled = !0,
            t.webkitImageSmoothingEnabled = !0,
            t.mozImageSmoothingEnabled = !0,
            this.settings.developerMode)
                for (var e = this.masses, i = e.length, s = i - 1; s >= 0; s--)
                    e[s].draw();
            this.drawBikeFrame()
        }
    }
    clone() {
        if (this.explosion)
            this.explosion.draw();
        else {
            this.cloneBikeFrame()
        }
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
    drawBikeFrame(self = this, alpha = this.player._opacity) {
        var t = this.scene
          , rearWheel = new s(self.rearWheel.pos.x, self.rearWheel.pos.y)
          , frontWheel = new s(self.frontWheel.pos.x, self.frontWheel.pos.y)
          , head = new s(self.head.pos.x, self.head.pos.y)
          , e = rearWheel.toScreen(t)
          , i = frontWheel.toScreen(t)
          , n = head.toScreen(t)
          , r = alpha
          , o = i.sub(e)
          , l = self.dir
          , a = new s((i.y - e.y) * l,(e.x - i.x) * l)
          , h = self.pedala
          , c = t.camera.zoom
          , u = t.game.canvas.getContext("2d");
        u.globalAlpha = r,
        u.strokeStyle = window.lite.getVar("cc") || (window.lite.getVar("dark") ? "#fdfdfd" : "#000"),
        u.lineWidth = 3 * c,
        u.lineCap = "round",
        u.lineJoin = "round",
        u.beginPath(),
        u.fillStyle = "rgba(200,200, 200, 0.2)",
        u.arc(i.x, i.y, 10.5 * c, 0, 2 * Math.PI, !1),
        u.fill(),
        u.stroke(),
        u.beginPath(),
        u.arc(e.x, e.y, 10.5 * c, 0, 2 * Math.PI, !1),
        u.fill(),
        u.stroke();
        var p = e.add(o.factor(.3)).add(a.factor(.25))
        , d = e.add(o.factor(.4)).add(a.factor(.05))
        , f = e.add(o.factor(.84)).add(a.factor(.42))
        , v = e.add(o.factor(.84)).add(a.factor(.37));
        u.beginPath(),
        u.strokeStyle = window.lite.getVar("cc") || (window.lite.getVar("dark") ? "#fdfdfd" : "#000"),
        u.moveTo(e.x, e.y),
        u.lineTo(p.x, p.y),
        u.lineTo(f.x, f.y),
        u.moveTo(v.x, v.y),
        u.lineTo(d.x, d.y),
        u.lineTo(e.x, e.y),
        u.stroke(),
        u.beginPath(),
        u.strokeStyle = window.lite.getVar("cc") || (window.lite.getVar("dark") ? "#fdfdfd" : "#000"),
        u.lineWidth = Math.max(1 * c, .5),
        u.arc(d.x, d.y, 3 * c, 0, 2 * Math.PI, !1),
        u.stroke();
        var g = new s(6 * Math.cos(h) * c,6 * Math.sin(h) * c)
        , m = d.add(g)
        , y = d.sub(g);
        u.beginPath(),
        u.moveTo(m.x, m.y),
        u.lineTo(y.x, y.y),
        u.stroke();
        var w = e.add(o.factor(.25)).add(a.factor(.4))
        , x = e.add(o.factor(.17)).add(a.factor(.38))
        , _ = e.add(o.factor(.3)).add(a.factor(.45));
        u.beginPath(),
        u.strokeStyle = window.lite.getVar("cc") || (window.lite.getVar("dark") ? "#fdfdfd" : "#000"),
        u.lineWidth = 3 * c,
        u.moveTo(x.x, x.y),
        u.lineTo(_.x, _.y),
        u.moveTo(d.x, d.y),
        u.lineTo(w.x, w.y);
        var b = e.add(o.factor(1)).add(a.factor(0))
        , T = e.add(o.factor(.97)).add(a.factor(0))
        , C = e.add(o.factor(.8)).add(a.factor(.48));
        u.moveTo(b.x, b.y),
        u.lineTo(T.x, T.y),
        u.lineTo(C.x, C.y);
        var k = e.add(o.factor(.86)).add(a.factor(.5))
        , S = e.add(o.factor(.82)).add(a.factor(.65))
        , P = e.add(o.factor(.78)).add(a.factor(.67));
        u.moveTo(C.x, C.y),
        u.lineTo(k.x, k.y),
        u.lineTo(S.x, S.y),
        u.lineTo(P.x, P.y),
        u.stroke(),
        u.strokeStyle = window.lite.getVar("dark") ? "#fdfdfd" : "#000";
        if (self.crashed) {
            self.ragdoll.draw && self.ragdoll.draw();
        } else {
            a = n.sub(e.add(o.factor(.5)));
            var M = p.add(o.factor(-.1)).add(a.factor(.3))
            , A = m.sub(M)
            , D = new s(A.y * l,-A.x * l);
            D = D.factor(c * c);
            var I = M.add(A.factor(.5)).add(D.factor(200 / A.lenSqr()))
            , E = m.add(A.factor(.12)).add(D.factor(50 / A.lenSqr()));
            A = y.sub(M),
            D = new s(A.y * l,-A.x * l),
            D = D.factor(c * c);
            var O = M.add(A.factor(.5)).add(D.factor(200 / A.lenSqr()))
            , z = y.add(A.factor(.12)).add(D.factor(50 / A.lenSqr()));
            u.strokeStyle = window.lite.getVar("dark") ? "#fdfdfda5" : "#000000a5",
            u.lineWidth = 6 * c,
            u.beginPath(),
            u.moveTo(y.x, y.y),
            u.lineTo(O.x, O.y),
            u.lineTo(M.x, M.y),
            u.stroke(),
            u.lineWidth = 4 * c,
            u.beginPath(),
            u.moveTo(y.x, y.y),
            u.lineTo(z.x, z.y),
            u.stroke(),
            u.lineWidth = 6 * c,
            u.strokeStyle = window.lite.getVar("dark") ? "#fdfdfd" : "#000",
            u.beginPath(),
            u.moveTo(m.x, m.y),
            u.lineTo(I.x, I.y),
            u.lineTo(M.x, M.y),
            u.stroke(),
            u.lineWidth = 6 * c,
            u.beginPath(),
            u.moveTo(m.x, m.y),
            u.lineTo(E.x, E.y),
            u.stroke();
            var j = p.add(o.factor(.05)).add(a.factor(.9));
            u.lineWidth = 8 * c,
            u.beginPath(),
            u.moveTo(M.x, M.y),
            u.lineTo(j.x, j.y),
            u.stroke();
            var L = p.add(o.factor(.15)).add(a.factor(1.05));
            o = j.sub(P),
            a = new s(o.y * l,-o.x * l),
            a = a.factor(c * c);
            var B = P.add(o.factor(.4)).add(a.factor(130 / o.lenSqr()));
            u.lineWidth = 5 * c,
            u.beginPath(),
            u.moveTo(j.x, j.y),
            u.lineTo(B.x, B.y),
            u.lineTo(P.x, P.y),
            u.stroke();
            var R = GameInventoryManager.getItem(window.lite.getVar("cr") ? window.lite.head : this.cosmetics.head);
            R.draw(u, L.x, L.y, self.drawHeadAngle, c, this.dir),
            u.globalAlpha = 1
        }
    }
    cloneBikeFrame() {
        //this.player._checkpoints = this.player._checkpoints.slice(-101);
        let t = lite.getVar("snapshots");
        let e = 0;
        if (t < 1) return;
        for (const checkpoint in this.player._checkpoints) {
            if (checkpoint > this.player._checkpoints.length - (parseInt(t) + 1)) {
                try {
                    if (this.player._checkpoints[checkpoint] && this.player._checkpoints[checkpoint]._baseVehicle) {
                        this.drawBikeFrame(JSON.parse(this.player._checkpoints[checkpoint]._baseVehicle), t / 3e2 * ++e % 1);
                    }
                } catch(e) {
                    console.error(e, this.player._checkpoints, checkpoint)
                }
            }
        }
        e = 0;
        for (const checkpoint in this.player._cache) {
            if (checkpoint > this.player._cache.length - (parseInt(t) + 1)) {
                try {
                    if (this.player._cache[checkpoint] && this.player._cache[checkpoint]._baseVehicle) {
                        this.drawBikeFrame(JSON.parse(this.player._cache[checkpoint]._baseVehicle), t / 3e2 * ++e % 1);
                    }
                } catch(e) {
                    console.error(e, this.player._cache, checkpoint)
                }
            }
        }
    }
}