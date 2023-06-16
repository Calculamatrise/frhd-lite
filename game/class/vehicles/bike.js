import Vector from "../math/cartesian.js";
import h from "./ragdoll.js";
import r from "./spring.js";
import Vehicle from "./vehicle.js";

let d = {
    BIKE_GROUND: "bike_ground",
    BIKE_AIR: "bike_air",
    BIKE_FALL_1: "bike_fall_1",
    BIKE_FALL_2: "bike_fall_2",
    BIKE_FALL_3: "bike_fall_3"
}

export default class extends Vehicle {
    pedala = 0;
    swapped = !1;
    ragdoll = null;
    createSprings() {
        this.springs = [];
        var t = new r(this.head,this.rearWheel,this)
          , e = new r(this.rearWheel,this.frontWheel,this)
          , i = new r(this.frontWheel,this.head,this);
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
            , h = new Vector(o.y * t,-o.x * t)
            , l = {};
        l.head = n.pos.add(o.factor(.35)).add(a.factor(1.2)),
        l.lHand = l.rHand = n.pos.add(o.factor(.8)).add(h.factor(.68));
        var c = l.head.sub(l.lHand);
        c = new Vector(c.y * t,-c.x * t),
        l.lElbow = l.rElbow = l.head.add(l.lHand).factor(.5).add(c.factor(130 / c.lenSqr())),
        l.waist = n.pos.add(o.factor(.2)).add(h.factor(.5));
        var u = new Vector(6 * Math.cos(r),6 * Math.sin(r));
        return l.lFoot = n.pos.add(o.factor(.4)).add(h.factor(.05)).add(u),
        c = l.waist.sub(l.lFoot),
        c = new Vector(-c.y * t,c.x * t),
        l.lKnee = l.waist.add(l.lFoot).factor(.5).add(c.factor(160 / c.lenSqr())),
        l.rFoot = n.pos.add(o.factor(.4)).add(h.factor(.05)).sub(u),
        c = l.waist.sub(l.rFoot),
        c = new Vector(-c.y * t,c.x * t),
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
    draw() {
        if (this.explosion)
            this.explosion.draw(1);
        else {
            let t = this.scene.game.canvas.getContext("2d");
            if (t.imageSmoothingEnabled = !0,
            t.webkitImageSmoothingEnabled = !0,
            t.mozImageSmoothingEnabled = !0,
            this.settings.developerMode)
                for (var e = this.masses, i = e.length, s = i - 1; s >= 0; s--)
                    e[s].draw();

            if (window.lite.storage.get("trail")) {
                let e = 0;
                for (const snapshot in window.lite.snapshots) {
                    if (window.lite.snapshots[snapshot] && window.lite.snapshots[snapshot]._baseVehicle) {
                        let vehicle = JSON.parse(window.lite.snapshots[snapshot]._baseVehicle);
                        // if (vehicle.ragdoll) {
                        //     vehicle.scene = this.scene;
                        //     delete vehicle.ragdoll.dir;
                        //     delete vehicle.ragdoll.drawHeadAngle;
                        //     vehicle.ragdoll = new h(window.lite.snapshots[snapshot].stickMan, vehicle);
                        //     vehicle.ragdoll.zero(new Vector(vehicle.head.vel.x, vehicle.head.vel.y), new Vector(vehicle.rearWheel.vel.x, vehicle.rearWheel.vel.y)),
                        //     vehicle.ragdoll.dir = vehicle.dir;

                        //     vehicle.ragdoll.draw();
                        // }

                        this.drawBikeFrame(vehicle, window.lite.snapshots.length / (window.lite.snapshots.length * 200) * ++e % 1);
                    }
                }
            }

            this.drawBikeFrame()
        }
    }
    clone() {
        //this.player._checkpoints = this.player._checkpoints.slice(-101);
        let t = lite.storage.get("snapshots");
        let e = 0;
        if (t < 1) return;
        for (const checkpoint in this.player._checkpoints) {
            if (checkpoint > this.player._checkpoints.length - (parseInt(t) + 1)) {
                if (this.player._checkpoints[checkpoint] && this.player._checkpoints[checkpoint]._baseVehicle) {
                    this.drawBikeFrame(JSON.parse(this.player._checkpoints[checkpoint]._baseVehicle), t / 3e2 * ++e % 1);
                }
            }
        }
        e = 0;
        for (const checkpoint in this.player._cache) {
            if (checkpoint > this.player._cache.length - (parseInt(t) + 1)) {
                if (this.player._cache[checkpoint] && this.player._cache[checkpoint]._baseVehicle) {
                    this.drawBikeFrame(JSON.parse(this.player._cache[checkpoint]._baseVehicle), t / 3e2 * ++e % 1);
                }
            }
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
}