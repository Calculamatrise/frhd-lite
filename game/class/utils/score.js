import Component from "../interfaces/component.js";
import GUI from "../interfaces/gui.js";
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
	update() {
		let t = this.scene
		  , e = t.state.paused
		  , i = format(1e3 * ((t.camera.focusIndex > 0 ? t.playerManager.getPlayerByIndex(t.camera.focusIndex)._gamepad.playbackTicks : null) ?? t.ticks) / t.settings.drawFPS)
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