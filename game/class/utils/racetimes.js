import GUI from "../interfaces/gui.js";
import Component from "../interfaces/component.js";
import Container from "../interfaces/container.js";
import formatnumber from "./formatnumber.js";

export default class extends GUI {
	raceCount = 0;
	raceList = null;
	highlightedRace = null;
	raceOpacity = .3;
	raceYOffset = 20;
	mobileRaceXOffset = 72;
	maxRaces = 10;
	constructor(t) {
		super(t, {
			font: { size: 10 },
			x: 6,
			y: 32
		}),
		this.scene.game.settings.isCampaign && (this.container.y += 24),
		this.maxRaces = this.scene.settings.mobile ? 3 : 10,
		this.raceList = this.container.children
	}
	addRace(t, e) {
		if (this.raceCount < this.maxRaces) {
			let i = this.scene
			  , r = t.user
			  , o = t.race
			  , a = i.settings
			  , h = a.drawFPS
			  , u = new Container({
					alpha: this.raceOpacity,
					color: '#'.padEnd(7, /^midnight$/i.test(window.lite?.storage.get('theme')) ? 'd' : /^dark(er)?$/i.test(window.lite?.storage.get('theme')) ? 'f' : '0'),
					data: t,
					inline: true,
					textAlign: 'center',
					textBaseline: 'middle'
				}, this.container);
			a.mobile ? u.x = e * this.mobileRaceXOffset : u.y = e * this.raceYOffset,
			u.addChild(new Component({
				background: r.color,
				border: 'round',
				font: { size: 10 },
				radius: 8,
				text: r.d_name.charAt(0).toUpperCase(),
				textAlign: 'center'
			})),
			u.addChild(new Component({
				font: { size: 12 },
				text: formatnumber(parseInt(o.run_ticks) / h * 1e3),
				x: 4,
				y: 2
			})),
			u.addChild(new Component({
				font: { size: 12 },
				text: '0/' + i.track.targetCount,
				x: 4,
				y: 2
			})),
			this.raceCount++,
			this.redraw()
		}
	}
	centerContainer() {
		let t = this.scene
		  , e = t.screen
		  , i = this.container
		  , s = i.width;
		i.x = e.width / 2 / window.devicePixelRatio - s / 2;
		t.settings.isCampaign && (i.visible = !1),
		i.y = 40
	}
	clear() {
		this.container.children.splice(0);
		this.raceCount = 0,
		this.redraw()
	}
	highlightRace(t) {
		if (this.highlightedRace !== this.raceList[t]) {
			this.unhighlightRace();
			let e = this.raceList[t];
			e.alpha = 1,
			this.highlightedRace = e,
			this.redraw()
		}
	}
	unhighlightRace() {
		this.highlightedRace && (this.highlightedRace.alpha = this.raceOpacity,
		this.highlightedRace = null,
		this.redraw())
	}
	update() {
		if (this.raceCount > 0) {
			let t = this.scene.camera;
			t.focusIndex > 0 && t.focusIndex < this.maxRaces ? this.highlightRace(t.focusIndex - 1) : this.unhighlightRace()
		}
	}
}