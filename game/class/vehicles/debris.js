import Mass from "./mass.js";

let l = [1, .7, .8, .9, .5, 1, .7, 1];
export default class extends Mass {
	angle = 6.2 * Math.random();
	color = "black";
	friction = .05;
	radius = 2 * Math.random() * 5;
	speed = 1 * Math.random() - 1 * Math.random();
	constructor(t, e, i) {
		super(t, e);
		this.color = i;
		this.pos.x = t.x + 5 * (Math.random() - Math.random());
		this.pos.y = t.y + 5 * (Math.random() - Math.random());
		this.old.equ(this.pos);
		this.vel.y = 11 * (Math.random() - Math.random());
		this.vel.x = 11 * (Math.random() - Math.random())
	}
	drive(t, e) {
		let i = this.vel
		  , s = this.pos;
		this.speed = (t * i.x + e * i.y) / this.radius,
		this.angle += this.speed;
		let n = -(t * i.x + e * i.y) * this.friction;
		s.x += t * n,
		s.y += e * n;
		let a = Math.sqrt(Math.pow(t, 2) + Math.pow(e, 2));
		if (a > 0) {
			let h = -e / a
			  , l = t / a
			  , c = .8 * (h * i.x + l * i.y);
			this.old.x += h * c,
			this.old.y += l * c
		}
	}
	fixedUpdate() {
		this.angle += this.speed,
		super.fixedUpdate()
	}
	draw(d) {
		let t = this.scene.screen
		  , e = this.scene.camera
		  , i = t.realToScreen(this.displayPos.x, "x")
		  , s = t.realToScreen(this.displayPos.y, "y")
		  , n = 0
		  , r = e.zoom
		  , o = this.angle
		  , c = l[0] * r * this.radius
		  , u = i + c * Math.cos(o)
		  , p = s + c * Math.sin(o)
		  , a = 2 * Math.PI;
		d.lineWidth = 1 * r,
		d.strokeStyle = this.color,
		d.beginPath(),
		d.moveTo(u, p),
		d.fillStyle = this.color;
		while (n++ < 8)
			c = l[n - 1] * r * this.radius,
			u = i + c * Math.cos(o + a * n / 8),
			p = s + c * Math.sin(o + a * n / 8),
			d.lineTo(u, p);
		d.fill(),
		d.stroke()
	}
}