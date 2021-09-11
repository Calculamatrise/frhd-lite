import "../cosmetics/heads/head.js";
import "../cosmetics/heads/forward_cap.js";

import s from "../math/cartesian.js";
import n from "./mass.js";
import h from "./ragdoll.js";
import r from "./spring.js";
import Vehicle from "../vehicles/vehicle.js";
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
        this.color = "rgba(0,0,0,1)";
        this.createMasses(e, s);
        this.createSprings();
        this.updateCameraFocalPoint();
        this.stopSounds();
        -1 === i && this.swap();
    }
    vehicleName = "MTB";
    masses = null;
    springs = null;
    cosmetics = null;
    slow = !1;
    pedala = 0;
    swapped = !1;
    ragdoll = null;
    crashed = !1;
    createMasses(t, e) {
        this.masses = [];
        var i = new n(new s(t.x + 2, t.y + -38), this)
          , r = new a(new s(t.x + 23, t.y), this)
          , o = new a(new s(t.x + -23, t.y), this);
        i.drive = this.createRagdoll.bind(this),
        o.radius = 14,
        r.radius = 14,
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
        e.lrest = 45,
        e.leff = 45,
        e.springConstant = .2,
        e.dampConstant = .3,
        t.lrest = 47,
        t.leff = 47,
        t.springConstant = .2,
        t.dampConstant = .3,
        i.lrest = 45,
        i.leff = 45,
        i.springConstant = .2,
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
        this.player.isInFocus() && this.playBailSound(),
        this.dead()
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
        this.chasse.swap();
        var t = this.rearSpring.leff;
        this.rearSpring.leff = this.frontSpring.leff,
        this.frontSpring.leff = t
    }
    control() {
        var t = this.gamepad
          , e = t.isButtonDown("up")
          , i = t.isButtonDown("down")
          , s = (t.isButtonDown("back"),
        t.isButtonDown("left"))
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
        this.frontWheel.brake = this.dir > 0 && n && i ? !0 : this.dir < 0 && s && i ? !0 : !1;
        var h = s ? 1 : 0;
        h += n ? -1 : 0,
        this.rearSpring.contract(5 * h * this.dir, 5),
        this.frontSpring.contract(5 * -h * this.dir, 5),
        this.chasse.rotate(h / 8),
        !h && e && (this.rearSpring.contract(-7, 5),
        this.frontSpring.contract(7, 5))
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
            this.drawBikeFrame()
        }
    }
    clone() {
        if (this.explosion)
            this.explosion.draw(1);
        else {
            this.cloneBikeFrame()
        }
    }
    drawBikeFrame(self = this, alpha = this.player._opacity) {
        var t = this.scene
            , frontWheel = new s(self.frontWheel.pos.x, self.frontWheel.pos.y)
            , rearWheel = new s(self.rearWheel.pos.x, self.rearWheel.pos.y)
            , head = new s(self.head.pos.x, self.head.pos.y)
            , e = frontWheel.toScreen(t)
            , i = rearWheel.toScreen(t)
            , n = head.toScreen(t)
            , r = t.camera.zoom
            , o = t.game.canvas.getContext("2d")
            , a = alpha
            , h = e.sub(i)
            , l = new s((e.y - i.y) * self.dir,(i.x - e.x) * self.dir)
            , c = h.factor(.5);
        i.addOut(c, c),
        n.subOut(c, c),
        o.globalAlpha = a,
        o.strokeStyle = window.inviolable.storage.get("cc") || (window.inviolable.storage.get("dark") ? "#fdfdfd" : "#000"),
        o.lineWidth = 3 * r,
        o.lineCap = "round",
        o.lineJoin = "round",
        o.beginPath(),
        o.fillStyle = "rgba(200,200, 200,0.2)",
        o.arc(e.x, e.y, 12.5 * r, 0, 2 * Math.PI, !1),
        o.fill(),
        o.stroke(),
        o.beginPath(),
        o.arc(i.x, i.y, 12.5 * r, 0, 2 * Math.PI, !1),
        o.fill(),
        o.stroke(),
        o.strokeStyle = "rgba(153, 153, 153,1)",
        o.fillStyle = "rgba(204, 204, 204,1)",
        o.lineWidth = 1,
        o.beginPath(),
        o.arc(e.x, e.y, 6 * r, 0, 2 * Math.PI, !1),
        o.fill(),
        o.stroke(),
        o.beginPath(),
        o.arc(i.x, i.y, 6 * r, 0, 2 * Math.PI, !1),
        o.fill(),
        o.stroke(),
        o.beginPath(),
        o.strokeStyle = window.inviolable.storage.get("cc") || (window.inviolable.storage.get("dark") ? "#fdfdfd" : "#000"),
        o.lineWidth = 5 * r,
        o.moveTo(i.x, i.y),
        o.lineTo(i.x + .4 * h.x + .05 * l.x, i.y + .4 * h.y + .05 * l.y),
        o.moveTo(i.x + .72 * h.x + .64 * c.x, i.y + .72 * h.y + .64 * c.y),
        o.lineTo(i.x + .46 * h.x + .4 * c.x, i.y + .46 * h.y + .4 * c.y),
        o.lineTo(i.x + .4 * h.x + .05 * l.x, i.y + .4 * h.y + .05 * l.y),
        o.stroke(),
        o.beginPath(),
        o.lineWidth = 2 * r,
        o.strokeStyle = window.inviolable.storage.get("cc") || (window.inviolable.storage.get("dark") ? "#fdfdfd" : "#000"),
        o.moveTo(i.x + .72 * h.x + .64 * c.x, i.y + .72 * h.y + .64 * c.y),
        o.lineTo(i.x + .43 * h.x + .05 * l.x, i.y + .43 * h.y + .05 * l.y),
        o.stroke(),
        o.beginPath(),
        o.lineWidth = 1 * r,
        o.moveTo(i.x + .46 * h.x + .4 * c.x, i.y + .46 * h.y + .4 * c.y),
        o.lineTo(i.x + .28 * h.x + .5 * c.x, i.y + .28 * h.y + .5 * c.y),
        o.stroke(),
        o.beginPath(),
        o.lineWidth = 2 * r,
        o.moveTo(i.x + .45 * h.x + .3 * c.x, i.y + .45 * h.y + .3 * c.y),
        o.lineTo(i.x + .3 * h.x + .4 * c.x, i.y + .3 * h.y + .4 * c.y),
        o.lineTo(i.x + .25 * h.x + .6 * c.x, i.y + .25 * h.y + .6 * c.y),
        o.moveTo(i.x + .17 * h.x + .6 * c.x, i.y + .17 * h.y + .6 * c.y),
        o.lineTo(i.x + .3 * h.x + .6 * c.x, i.y + .3 * h.y + .6 * c.y),
        o.stroke(),
        o.beginPath(),
        o.lineWidth = 3 * r,
        o.moveTo(e.x, e.y),
        o.lineTo(i.x + .71 * h.x + .73 * c.x, i.y + .71 * h.y + .73 * c.y),
        o.lineTo(i.x + .73 * h.x + .77 * c.x, i.y + .73 * h.y + .77 * c.y),
        o.lineTo(i.x + .7 * h.x + .8 * c.x, i.y + .7 * h.y + .8 * c.y),
        o.stroke(),
        o.beginPath(),
        o.lineWidth = 1 * r;
        var u = new s(6 * Math.cos(this.pedala) * r,6 * Math.sin(this.pedala) * r);
        o.moveTo(i.x + .43 * h.x + .05 * l.x + u.x, i.y + .43 * h.y + .05 * l.y + u.y),
        o.lineTo(i.x + .43 * h.x + .05 * l.x - u.x, i.y + .43 * h.y + .05 * l.y - u.y),
        o.stroke(),
        o.strokeStyle = window.inviolable.storage.get("dark") ? "#fdfdfd" : "#000";
        if (self.crashed)
            self.ragdoll.draw && self.ragdoll.draw();
        else {
            h.factorOut(.5, l),
            i.addOut(l, l),
            n.subOut(l, l);
            var p = h.factor(.3);
            p.x = i.x + p.x + .25 * l.x,
            p.y = i.y + p.y + .25 * l.y;
            var d = h.factor(.4);
            d.x = i.x + d.x + .05 * l.x,
            d.y = i.y + d.y + .05 * l.y;
            var f = d.add(u)
            , v = d.sub(u)
            , g = h.factor(.67);
            g.x = i.x + g.x + .8 * l.x,
            g.y = i.y + g.y + .8 * l.y;
            var m = h.factor(-.05);
            m.x = p.x + m.x + .42 * l.x,
            m.y = p.y + m.y + .42 * l.y;
            var y = f.sub(m)
            , w = y.lenSqr();
            c.x = y.y * this.dir,
            c.y = -y.x * this.dir,
            c.factorSelf(r * r);
            var x = y.factor(.5);
            x.x = m.x + x.x + c.x * (200 / y.lenSqr()),
            x.y = m.y + x.y + c.y * (200 / y.lenSqr());
            var _ = y.factor(.12);
            _.x = f.x + _.x + c.x * (50 / w),
            _.y = f.y + _.y + c.y * (50 / w),
            v.subOut(m, y),
            w = y.lenSqr(),
            c.x = y.y * this.dir,
            c.y = -y.x * this.dir,
            c.factorSelf(r * r);
            var b = y.factor(.5);
            b.x = m.x + b.x + c.x * (200 / w),
            b.y = m.y + b.y + c.y * (200 / w);
            var T = y.factor(.12);
            T.x = v.x + T.x + c.x * (50 / w),
            T.y = v.y + T.y + c.y * (50 / w),
            o.strokeStyle = window.inviolable.storage.get("dark") ? "#fdfdfda5" : "rgba(0,0,0," + .5 * a + ")",
            o.lineWidth = 6 * r,
            o.beginPath(),
            o.moveTo(v.x, v.y),
            o.lineTo(b.x, b.y),
            o.lineTo(m.x, m.y),
            o.stroke(),
            o.lineWidth = 4 * r,
            o.beginPath(),
            o.moveTo(v.x, v.y),
            o.lineTo(T.x, T.y),
            o.stroke(),
            o.lineWidth = 6 * r,
            o.strokeStyle = window.inviolable.storage.get("dark") ? "#fdfdfd" : "#000000",
            o.beginPath(),
            o.moveTo(f.x, f.y),
            o.lineTo(x.x, x.y),
            o.lineTo(m.x, m.y),
            o.stroke(),
            o.lineWidth = 4 * r,
            o.beginPath(),
            o.moveTo(f.x, f.y),
            o.lineTo(_.x, _.y),
            o.stroke();
            var C = h.factor(.1);
            C.x = p.x + C.x + .95 * l.x,
            C.y = p.y + C.y + .95 * l.y,
            o.lineWidth = 8 * r,
            o.beginPath(),
            o.moveTo(m.x, m.y),
            o.lineTo(C.x, C.y),
            o.stroke();
            var k = h.factor(.2);
            k.x = p.x + k.x + 1.09 * l.x,
            k.y = p.y + k.y + 1.09 * l.y,
            o.beginPath(),
            o.lineWidth = 2 * r,
            C.subOut(g, h);
            var S = h.lenSqr();
            l.x = h.y * self.dir,
            l.y = -h.x * self.dir,
            l.factorSelf(r * r);
            var P = h.factor(.3);
            P.x = g.x + P.x + l.x * (80 / S),
            P.y = g.y + P.y + l.y * (80 / S),
            o.lineWidth = 5 * r,
            o.beginPath(),
            o.moveTo(C.x, C.y),
            o.lineTo(P.x, P.y),
            o.lineTo(g.x, g.y),
            o.stroke();
            var A = GameInventoryManager.getItem(window.inviolable.storage.get("cr") ? window.inviolable.head : this.cosmetics.head);
            A.draw(o, k.x, k.y, self.drawHeadAngle, r, self.dir),
            o.globalAlpha = 1
        }
    }
    cloneBikeFrame() {
        // this.player._checkpoints = this.player._checkpoints.slice(-101);
        let t = inviolable.storage.get("snapshots");
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