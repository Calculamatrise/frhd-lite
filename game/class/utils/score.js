import Component from "../interfaces/component.js";
import GUI from "../interfaces/gui.js";
import Cartesian from "../math/cartesian.js";
import format from "./formatnumber.js";

export default class extends GUI {
	paused = !1;
	sprites = {};
	spriteSheet = {
		timer: [2, 2, 58, 58],
		timer_paused: [2, 62, 116, 118],
		target: [2, 2, 58, 58]
	}
	time = new Component({
		text: '0:00.00',
		font: { size: 16 },
		x: 23,
		y: 7
	}, this.container);
	time_title = new Component({
		text: 'TIME:',
		color: '#999',
		x: 24,
		y: 2
	}, this.container);
	timer_sprite = new Component({
		cached: true,
		image: {
			x: 2,
			y: 2,
			width: 58,
			height: 58
		},
		width: 24,
		height: 24
	}, this.container);
	best_time = new Component({
		text: '-- : --.--',
		color: '#999',
		font: { size: 14 },
		x: 95,
		y: 8
	}, this.container);
	best_time_title = new Component({
		text: 'BEST:',
		color: '#999',
		x: 96,
		y: 2
	}, this.container);
	goals = new Component({
		text: '0/0',
		font: { size: 16 },
		x: 185,
		y: 6
	}, this.container);
	target_sprite = new Component({
		cached: true,
		image: {
			x: 2,
			y: 2,
			width: 58,
			height: 58
		},
		x: 160,
		width: 24,
		height: 24
	}, this.container);
	constructor(t) {
		super(t, {
			font: { size: 8 },
			x: 6,
			y: 4
		}),
		this.sprites.timer = t.assets.getResult("time_icon"),
		this.sprites.target = t.assets.getResult("targets_icon"),
		this.timer_sprite.image.canvas = this.sprites.timer,
		this.target_sprite.image.canvas = this.sprites.target
	}
	draw(t) {
		super.draw(t);
		if (window.hasOwnProperty('lite') && lite.storage.get('experiments').raceProgress) {
			let e = this.scene.camera.playerFocus;
			if (e && this.scene.state.inFocus) {
				t.beginPath();
				let i = t.canvas.width / 3
				, s = t.canvas.width / 2 - i / 2
				, n = t.canvas.height - 16
				, r = Math.min(6, t.canvas.height / 12)
				, o = r / 2;
				t.roundRect(s, n, i, r, o),
				t.fillStyle = 'hsl(0deg, 0%, 50%)',
				t.fill(),
				t.lineWidth = 2,
				t.strokeStyle = t.fillStyle,
				t.stroke(),
				t.beginPath();
				let a = e._powerupsConsumed.targets
				, h = this.scene.track
				, u = a.length / h.targetCount
				, l = h.targets.find(t => t.id == (typeof a.at == 'function' ? a.at(-1) : a[a.length - 1])) || { x: 0, y: 0 }
				, p = new Cartesian(l.x, l.y) // anchor point A
				, q = h.targets.filter(t => !a.includes(t.id)).sort((a, b) => p.sub(new Cartesian(a.x, a.y)).len() - p.sub(new Cartesian(b.x, b.y)).len())[0] // next target
				, v = q && new Cartesian(q.x, q.y)
				, w = (q && p.sub(v).len()) ?? 0 // len from previous target
				, y = (q && Math.min(...(e._tempVehicle || e._baseVehicle).masses.map(t => v.sub(t.pos).len() /* - ~~t.radius / 2*/).sort((a, b) => a - b))) ?? 0 // distance to next target
				, d = Math.min(1, Math.max(0, (w - y) / w)) * 100 / h.targetCount;
				u += d / 100;
				t.roundRect(s, n, Math.max(0, Math.min(i, i * u)), r, o),
				t.fillStyle = '#FAE335',
				t.fill()
			}
		}
	}
	update() {
		let t = this.scene
		  , e = t.state.paused
		  , i = format(1e3 * ((null !== t.camera.playerFocus && t.camera.playerFocus._gamepad.playbackTicks || null) ?? t.ticks) / t.settings.drawFPS)
		  , s = t.playerManager.firstPlayer.getTargetsHit() + '/' + t.track.targetCount
		  , n = t.settings.isCampaign && t.settings.campaignData.user.best_time || t.settings.userTrackStats && t.settings.userTrackStats.best_time;
		this.paused !== e && (this.timer_sprite.image.y = e ? 62 : 2,
		this.container.cached = !1,
		this.paused = e);
		this.time.text !== i && (this.time.text = i,
		this.time.setDirty());
		this.goals.text !== s && (this.goals.text = s,
		this.goals.setDirty());
		n && this.best_time.text !== n && (this.best_time.text = n,
		this.best_time.setDirty());
		t.settings.mobile && this.centerContainer()
	}
	centerContainer() {
		let t = this.container
		  , e = t.width
		  , i = this.scene.screen;
		t.x = i.width / 2 / window.devicePixelRatio - e / 2,
		t.y = 10
	}
}