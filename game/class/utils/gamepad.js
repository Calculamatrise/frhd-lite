import EventEmitter from "../EventEmitter.js";

export default class extends EventEmitter {
	tickDownButtons = {};
	previousTickDownButtons = {};
	downButtons = {};
	inactiveDownButtons = new Set();
	paused = !1;
	keymap = {};
	records = {};
	keysToRecord = null;
	keysToPlay = null;
	recording = !1;
	playback = null;
	numberOfKeysDown = 0;
	tickNumberOfKeysDown = 0;
	replaying = !1;
	constructor(t) {
		super(),
		Object.defineProperty(this, 'scene', { value: t, writable: true }),
		Object.defineProperty(this, 'inactiveDownButtons', { enumerable: false })
	}
	listen() {
		document.onkeydown = this.handleButtonDown.bind(this),
		document.onkeyup = this.handleButtonUp.bind(this),
		window.onblur = this.handleBlur.bind(this),
		window.onfocus = this.handleFocus.bind(this)
	}
	unlisten() {
		this.downButtons = {},
		document.onkeydown = null,
		document.onkeyup = null,
		window.onblur = null,
		window.onfocus = null
	}
	pause() {
		this.paused = !0
	}
	unpause() {
		this.paused = !1
	}
	recordKeys(t) {
		this.keysToRecord = t,
		this.recording = !0
	}
	loadPlayback(t, e) {
		this.keysToPlay = e,
		this.playback = t,
		this.replaying = !0
	}
	setKeyMap(t) {
		let e = {};
		for (let i in t)
			if (t[i] instanceof Array)
				for (let s of t[i])
					e[s] = i;
			else
				e[t[i]] = i;
		this.keymap = e
	}
	handleButtonDown(t) {
		let e = this.getInternalCode(t.keyCode);
		"string" == typeof e && t.preventDefault(),
		this.setButtonDown(e)
	}
	handleButtonUp(t) {
		let e = this.getInternalCode(t.keyCode);
		"string" == typeof e && t.preventDefault(),
		this.setButtonUp(e)
	}
	blurred = false;
	previousDownButtons = {};
	handleBlur() {
		this.blurred = true,
		this.previousDownButtons = Object.assign({}, this.tickDownButtons)
	}
	handleFocus() {
		this.blurred && (this.tickDownButtons = Object.assign({}, this.previousDownButtons),
		this.downButtons = Object.fromEntries(Object.keys(this.tickDownButtons).map(key => [key, false])))
	}
	getInternalCode(t) {
		return this.keymap[t] || t
	}
	setButtonsDown(t) {
		for (let e in t)
			this.setButtonDown(t[e])
	}
	setButtonUp(t) {
		this.blurred = false;
		this.downButtons[t] && (this.onButtonUp && this.onButtonUp(t),
		this.downButtons[t] = !1,
		this.inactiveDownButtons.delete(t),
		this.inactiveDownButtons.delete(t == 'left' ? 'right' : t == 'right' ? 'left' : null),
		this.emit('buttonUp', t),
		this.numberOfKeysDown--)
	}
	setButtonDown(t, e) {
		this.blurred = false;
		this.downButtons[t] || (this.onButtonDown && this.onButtonDown(t),
		this.downButtons[t] = e ? e : !0,
		e = t == 'left' ? 'right' : t == 'right' ? 'left' : null,
		e && this.downButtons[e] && this.inactiveDownButtons.add(e),
		this.emit('buttonDown', t),
		this.numberOfKeysDown++)
	}
	isButtonDown(t) {
		return this.tickDownButtons[t] > 0
	}
	getButtonDownOccurances(t) {
		let e = 0;
		if (this.isButtonDown(t)) {
			e = 1;
			let i = this.tickDownButtons[t];
			i !== !0 && (e = i)
		}
		return e
	}
	getDownButtons() {
		let t = [];
		for (let e in this.tickDownButtons)
			this.tickDownButtons[e] && t.push(e);
		return t
	}
	reset(t) {
		(this.replaying || t) && (this.downButtons = {},
		this.playbackTicks = 0),
		this.tickDownButtons = {},
		this.previousDownButtons = {},
		this.previousTickDownButtons = {},
		this.records = {}
	}
	update() {
		this.replaying && this.updatePlayback()
		!this.blurred && (this.previousTickDownButtons = Object.assign({}, this.tickDownButtons),
		this.tickDownButtons = window.hasOwnProperty('lite') && lite.storage.get('inputRollover') && this.recording ? Object.fromEntries(Object.entries(this.downButtons).map(([key, value]) => [key, value && this.inactiveDownButtons.has(key) ? false : value])) : Object.assign({}, this.downButtons));
		this.tickNumberOfKeysDown = this.numberOfKeysDown;
		this.recording && this.updateRecording()
	}
	areKeysDown() {
		for (let t in this.downButtons)
			if (this.downButtons[t] === !0)
				return !0;
		return !1
	}
	updatePlayback() {
		let t = this.playback
		  , e = this.playbackTicks ?? this.scene.ticks;
		for (let i of this.keysToPlay) {
			let s = i + "_up"
			  , n = i + "_down";
			if ("undefined" != typeof t[n] && "undefined" != typeof t[n][e]) {
				let a = t[n][e];
				this.setButtonDown(i, a)
			}
			"undefined" != typeof t[s] && "undefined" != typeof t[s][e] && this.setButtonUp(i)
		}
	}
	updateRecording() {
		let t = this.scene.ticks
		  , e = this.records
		  , s = this.tickDownButtons
		  , n = this.previousTickDownButtons;
		for (let o of this.keysToRecord.filter(t => 'undefined' != typeof s[t])) {
			let a = s[o]
			  , h = "undefined" != typeof n[o] && n[o];
			if (a !== h) {
				let l = o + "_up"
				  , c = o + "_down"
				  , u = l;
				a && (u = c);
				if (!a && e[c] && -1 !== e[c].indexOf(t)) {
					if (/^(backspace|enter)$/.test(o)) {
						e[u] || (e[u] = []),
						e[u].push(t + 1)
					} else {
						e[c].splice(e[c].indexOf(t), 1),
						e[c].length || delete e[c];
					}
				} else
					e[u] || (e[u] = []),
					e[u].push(t)
			}
		}
	}
	buttonWasRecentlyDown(t) {
		let e = this.records;
		this.replaying && (e = this.playback);
		let i = t + "_down"
		  , s = !1;
		if (e[i]) {
			let n = (this.replaying && this.playbackTicks) ?? this.scene.ticks
			  , o = e[i]
			  , a = -1;
			a = this.replaying ? "undefined" != typeof o[n] : o.indexOf(n),
			-1 !== a && (s = !0)
		}
		return s
	}
	getReplayString() {
		window.hasOwnProperty('lite') && lite.storage.get('showCustomizations') && Object.assign(this.records, lite._appendRecords());
		return JSON.stringify(this.records)
	}
	encodeReplayString(t) {
		let e = this.scene.settings
		  , i = {
				version: e.replayVersion
			};
		for (let s in t) {
			let n = t[s];
			i[s] = "";
			for (let r in n) {
				let o = n[r];
				i[s] += o.toString(32) + " "
			}
		}
		return i
	}
	close() {
		this.unlisten(),
		this.onButtonDown = null,
		this.onButtonUp = null,
		this.scene = null,
		this.tickDownButtons = null,
		this.downButtons = null,
		this.keymap = null,
		this.records = null,
		this.keysToRecord = null
	}
}