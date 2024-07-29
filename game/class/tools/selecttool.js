import Vector from "../math/cartesian.js";
import Tool from "./tool.js";
import Path from "../utils/path.js";

export default class Select extends Tool {
	name = 'select';
	passive = !1;
	active = !1;
	dashOffset = 0;
	p1 = null;
	p2 = null;
	travelDistance = 5;
	addedObjects = [];
	selectedElements = [];
	selectedSegments = [];
	constructor(t) {
		super(t);
		this.p1 = new Vector(0, 0),
		this.p2 = new Vector(0, 0),
		document.addEventListener('keydown', this.keyPress.bind(this))
	}
	press() {
		// if there is a selection, move it
		if (this.selectedElements.length > 0 && this.passive) return;
		let t = this.mouse.touch.real;
		this.passive = !1,
		this.active = !0,
		this.p1.x = t.x,
		this.p1.y = t.y,
		this.p2.x = t.x,
		this.p2.y = t.y
	}
	hold() {
		if (this.passive) {
			this.moveSelected(this.mouse.touch.real.sub(this.mouse.touch.old.real));
			return;
		}
		let t = this.mouse.touch.real;
		this.p2.x = t.x,
		this.p2.y = t.y
	}
	unselectElements() {
		for (let t of this.selectedElements) {
			t.highlight = false;
		}
		this.selectedElements = [],
		this.selectedSegments = []
	}
	moveSelected(t) {
		this.p1.inc(t),
		this.p2.inc(t);
		for (let e in this.selectedSegments) {
			if (this.selectedSegments.find(i => i.otherPortal == e)) {
				this.selectedSegments.splice(e, 1);
				continue;
			}
			this.selectedSegments[e].move(t.x, t.y);
			this.scene.track.undraw()
		}
	}
	fillSelected() {
		let min = Math.min(this.p1.y, this.p2.y)
		  , max = Math.max(this.p1.y, this.p2.y);
		for (let y = min; y < max; y++) {
			this.selectedSegments.push(this.scene.track.addPhysicsLine(this.p1.x, y, this.p2.x, y));
		}
		this.selectedElements.push(...this.selectedSegments);
		this.selectedSegments.length > 0 && this.toolhandler.addActionToTimeline({
			type: "add",
			objects: this.selectedSegments.flat()
		});
	}
	rotateSelected() {
		let x = (this.travelDistance || 0) * Math.PI / 180;
		let selectedSegments = this.selectedSegments;
		this.selectedSegments = [];
		for (let i of selectedSegments.filter(t => t.constructor.type == 'physics' || t.constructor.type == 'scenery')) {
			this.selectedSegments.push(this.scene.track[i.constructor.type == "physics" ? "addPhysicsLine" : "addSceneryLine"](Math.cos(x) * i.p1.x + Math.sin(x) * i.p1.y, -Math.sin(x) * i.p1.x + Math.cos(x) * i.p1.y, Math.cos(x) * i.p2.x + Math.sin(x) * i.p2.y, -Math.sin(x) * i.p2.x + Math.cos(x) * i.p2.y));
			i.removeAllReferences();
		}
	}
	copyAndPasteSelected() {
		for (let i of this.selectedSegments.filter(i => i.constructor.type == 'physics' || i.constructor.type == 'scenery'))
			this.scene.track['add' + (i.constructor.type == 'physics' ? 'Physics' : 'Scenery') + 'Line'](i.p1.x, i.p1.y, i.p2.x, i.p2.y)
	}
	release() {
		this.unselectElements();
		if (this.passive) {
			this.active = !1;
			this.passive = !1;
			this._reset && (this.toolhandler.setTool(this.toolhandler.previousTool),
			this._reset = !1)
			return;
		}
		for (let t of this.scene.track.select(this.p1, this.p2))
			this.intersectsLine(t.x ? t : t.p1, t.x ? t : t.p2) && this.selectedSegments.push(t)
		this.selectedElements = this.selectedSegments,
		this.active = !1,
		this.passive = !0,
		this.toolhandler.currentTool !== this.name && (this.toolhandler.setTool(this.name),
		this._reset = !0)
		// when action is completed, set currentTool to previousTool
	}
	keyPress(e) {
		if (!this.passive) return;
		e.preventDefault();
		switch(e.key) {
		case "=":
		case "+":
			this.travelDistance++;
			this.scene.message.show("Increased travel distance for the Select Tool - " + this.travelDistance, !1, "#000", "#FFF");
			break;
		case "-":
			this.travelDistance--;
			this.scene.message.show("Decreased travel distance for the Select Tool - " + this.travelDistance, !1, "#000", "#FFF");
			break;
		case "c":
			this.copyAndPasteSelected(e.key),
			this.scene.message.show("Copied selected area", !1, "#000000", "#FFFFFF");
			break;
		case "Delete":
			this.selectedElements.length > 0 && this.toolhandler.addActionToTimeline({
				type: "remove",
				objects: this.selectedElements.flatMap(t => t)
			});
			for (const t of this.selectedElements) {
				t.removeAllReferences()
			}
			this.reset();
			this.scene.message.show("Deleted selected area", !1, "#000", "#FFF");
			break;
		case "f":
			if (confirm("Are you sure you would you like to fill the selected area?"))
				this.fillSelected(),
				this.scene.message.show("Filled selected area", !1, "#000", "#FFF");
			break;
		case "r":
			this.rotateSelected(),
			this.scene.message.show("Rotated selected area", !1, "#000", "#FFF");
			break;
		case "`":
		case "Escape":
			this.reset()
		}
		this.timeout = setTimeout(() => this.scene.message.hide(), 1e3)
	}
	buildPaths(t) {
		for (let e = []; t.length > 0; ) {
			let i = new Path;
			i.build(t),
			e.push(i)
		}
	}
	intersectsLine(t, e) {
		let i = Math.min(this.p1.y, this.p2.y)
		  , s = Math.min(this.p1.x, this.p2.x)
		  , n = Math.max(this.p1.y, this.p2.y)
		  , r = Math.max(this.p1.x, this.p2.x)
		  , o = Math.abs(r - s)
		  , c = Math.abs(i - n)
		  , u = t.x
		  , p = e.x;
		if (t.x > e.x && (u = e.x,
		p = t.x),
		p > s + o && (p = s + o),
		s > u && (u = s),
		u > p)
			return !1;
		let d = t.y
		  , f = e.y
		  , v = e.x - t.x;
		if (Math.abs(v) > 1e-7) {
			let g = (e.y - t.y) / v
			  , m = t.y - g * t.x;
			d = g * u + m,
			f = g * p + m
		}
		d > f && ([f, d] = [d, f]);
		return f > i + c && (f = i + c),
		i > d && (d = i),
		d > f ? !1 : !0
	}
	toScreen(t, e) {
		let i = this.scene.camera
		  , s = this.scene.screen;
		return (t - i.position[e]) * i.zoom + s.center[e]
	}
	draw(e) {
		let t = this.scene;
		if (this.active || this.passive) {
			let i = this.p1.toScreen(t)
			, s = this.p2.toScreen(t)
			, n = s.x - i.x
			, r = s.y - i.y;
			e.save(),
			this.active ? (e.beginPath(),
			e.rect(i.x, i.y, n, r),
			e.fillStyle = "rgba(24, 132, 207, 0.2)",
			e.fill(),
			e.lineWidth = 2,
			e.strokeStyle = "rgba(24, 132, 207, 0.7)",
			e.stroke()) : this.passive && (e.strokeStyle = "rgba(24, 132, 207, 0.7)",
			e.lineWidth = 2,
			e.strokeRect(i.x, i.y, n, r)),
			e.restore()
		}
	}
	reset() {
		this.p1.x = 0,
		this.p1.y = 0,
		this.p2.x = 0,
		this.p2.y = 0,
		this.active = !1,
		this.passive = !1,
		this.unselectElements()
	}
	close() {
		super.close(),
		this.dashOffset = 0,
		this.selectedElements = null,
		this.p2 = null,
		this.p1 = null,
		this.active = !1,
		this.passive = !1
	}
}