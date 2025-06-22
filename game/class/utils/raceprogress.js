import GUI from "../interfaces/gui.js";
import Component from "../interfaces/component.js";
import Cartesian from "../math/cartesian.js";

export default class extends GUI {
	bar = new Component({
		background: 'hsl(53deg 95% 59% / 85%)',
		border: 'round',
		borderRadius: '100%',
		color: 'white',
		data: {
			delta: 0,
			oldDelta: 0,
			progress: 0
		},
		height: '100% - 4',
		x: 2,
		y: 2,
		// text: '0/0',
		// textAlign: 'center',
		// textBaseline: 'middle',
		width: 0
	}, this.container);
	progress = new Component({
		color: 'white',
		height: '100%',
		text: '0/0',
		textAlign: 'center',
		textBaseline: 'middle',
		width: '100%'
	}, this.container);
	steps = new Component({
		height: '100%',
		width: '100%'
	}, this.container);
	constructor(t) {
		super(t, {
			background: 'hsl(0deg 0% 50% / 75%)',
			borderWidth: 2,
			borderRadius: '100%',
			// font: { size: 12 },
			// padding: 2,
			verticalAlign: 'bottom',
			x: 60,
			y: 32
		}),
		this.sprite = t.assets.getResult("targets_icon"),
		this.resize()
	}
	// draw(t) {
	// 	super.draw(t),
	// 	t.beginPath();
	// 	let p = (500 - Math.min(500, Math.min(this.bar.delta, this.bar.oldDelta))) / 100 // grow bar closer you get
	// 	, i = t.canvas.width / 3 + p / 2
	// 	, s = t.canvas.width / 2 - i / 2 - p / 2
	// 	, n = t.canvas.height - 16 - p / 2
	// 	, r = Math.min(9, Math.max(6, t.canvas.height / 12)) + p / 2
	// 	, o = r / 2;
	// 	t.roundRect(s, n, i, r, o),
	// 	t.fillStyle = 'hsl(0deg 0% 50% / 75%)',
	// 	t.fill(),
	// 	t.lineWidth = 2,
	// 	t.strokeStyle = t.fillStyle,
	// 	t.stroke(),
	// 	t.beginPath(),
	// 	t.roundRect(s + o / 6, n + o / 6, Math.max(0, Math.min(i, i * this.bar.progress)) - o / 3, r - o / 3, o * 3),
	// 	t.fillStyle = 'hsl(53deg 95% 59% / 85%)',
	// 	t.fill();
	// 	if (lite.storage.get('raceProgressSteps') && Math.max(this.scene.track.targets.length, lite.storage.get('raceProgressMin')) > 1) {
	// 		t.fillStyle = 'hsl(0deg 0% 30% / 10%)',
	// 		t.beginPath();
	// 		for (let l = 1, p = Math.min(10, Math.max(this.scene.track.targets.length, lite.storage.get('raceProgressMin'))), a = p - 1, w = i / a; l < p; l++) {
	// 			t.arc(s + (w * l) / (1 + 1 / a), n + r / 2, r / 3, 0, 2 * Math.PI),
	// 			t.fill();
	// 		}
	// 	}
	// 	t.fillStyle = 'white',
	// 	t.font = (1.8 * r) + 'px helsinki',
	// 	t.textAlign = 'center',
	// 	t.textBaseline = 'middle',
	// 	t.fillText(this.bar.delta <= 500 && (!this.bar.oldDelta || !(this.bar.oldDelta <= 250)) ? Math.floor(this.bar.delta) + 'm' : this.scene.score.goals.text, s + i / 2, n + r / 2 + .5)
	// }
	resize() {
		let t = this.scene.game.canvas
		  , e = Math.min(12, Math.max(8, t.height / 8));
		this.container.width = t.width / 3,
		this.container.x = t.width / 2 - this.container.width / 2,
		this.container.y = t.height - 1.5 * e - 8,
		this.container.height = e
		// this.progress.width = this.container.width
		// this.bar.height = e

		// if (lite.storage.get('raceProgressSteps') && Math.max(this.scene.track.targets.length, lite.storage.get('raceProgressMin')) > 1) {
		// 	console.log(this.steps, this.scene.track)
		// }
	}
	update(t) {
		if (!this.enabled) return;
		let e = this.scene.track
		  , i = t._powerupsConsumed.targets
		  , s = i.length / e.targetCount
		  , n = e.targets.find(t => t.id == (typeof i.at == 'function' ? i.at(-1) : i[i.length - 1])) || { x: 0, y: 0 }
		  , p = new Cartesian(n.x, n.y) // anchor point A
		  , x = e.targets.length <= 1 ? e.targets : Array(...(t._tempVehicle || t._baseVehicle).masses).map(t => e.targets.filter(t => !i.includes(t.id)).sort((a, b) => new Cartesian(a.x, a.y).sub(t.pos).len() - new Cartesian(b.x, b.y).sub(t.pos).len())[0])
		  , q = x.sort((a, b) => p.sub(new Cartesian(a.x, a.y).len()) - p.sub(new Cartesian(b.x, b.y).len()))[0] // next target
		  , v = q && new Cartesian(q.x, q.y)
		  , w = (q && p.sub(v).len()) ?? 0 // len from previous target
		  , y = (q && Math.min(...(t._tempVehicle || t._baseVehicle).masses.map(t => v.sub(t.pos).len() /* - ~~t.radius / 2*/).sort((a, b) => a - b))) ?? 0 // distance to next target
		  , d = Math.min(1, Math.max(0, (w - y) / w)) * 100 / e.targetCount
		  , m = i.length > 0 && Array(...(t._tempVehicle || t._baseVehicle).masses).map(t => new Cartesian(n.x, n.y).sub(t.pos).len()).sort((a, b) => a - b)[0];
		s += d / 100,
		this.bar.data.oldDelta = m ?? null,
		this.bar.data.delta = y,
		this.bar.data.progress = s;
		let scale = Math.max(1, Math.min(1.5, (500 - Math.min(500, Math.min(this.bar.data.delta, this.bar.data.oldDelta))) / 250));
		this.container.scale.x = scale,
		this.container.scale.y = scale,
		this.bar.width = (this.container.width - 4) * s,
		// this.bar.setDirty(),
		this.progress.text = y <= 500 && (!this.bar.oldDelta || !(this.bar.oldDelta <= 250)) ? Math.floor(y) + 'm' : (i.length + '/' + e.targetCount),
		// this.progress.setDirty()
		this.redraw()
	}
}