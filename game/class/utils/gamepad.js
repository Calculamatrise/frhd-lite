export default class {
	tickDownButtons = null;
	previousTickDownButtons = null;
	downButtons = null;
	paused = !1;
	keymap = null;
	records = null;
	keysToRecord = null;
	keysToPlay = null;
	recording = !1;
	playback = null;
	numberOfKeysDown = 0;
	tickNumberOfKeysDown = 0;
	replaying = !1;
	constructor(t) {
		this.scene = t;
		this.tickDownButtons = {};
		this.previousTickDownButtons = {};
		this.downButtons = {};
		this.keymap = {};
		this.records = {};
		this.numberOfKeysDown = 0;
		this.tickNumberOfKeysDown = 0;
	}
	listen() {
		document.onkeydown = this.handleButtonDown.bind(this);
		document.onkeyup = this.handleButtonUp.bind(this);
		window.onblur = this.handleBlur.bind(this);
		window.onfocus = this.handleFocus.bind(this);
	}
	unlisten() {
		this.downButtons = {};
		document.onkeydown = null;
		document.onkeyup = null;
	}
	pause() {
		this.paused = !0
	}
	unpause() {
		this.paused = !1
	}
	recordKeys(t) {
		this.keysToRecord = t;
		this.recording = !0;
	}
	loadPlayback(t, e) {
		this.keysToPlay = e;
		this.playback = t;
		this.replaying = !0;
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
		this.blurred = true;
		this.previousDownButtons = Object.assign({}, this.tickDownButtons);
	}
	handleFocus() {
		if (this.blurred) {
			this.tickDownButtons = Object.assign({}, this.previousDownButtons);
			this.downButtons = Object.fromEntries(Object.keys(this.tickDownButtons).map(key => [key, false]));
		}
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
		this.numberOfKeysDown--)
	}
	setButtonDown(t, e) {
		this.blurred = false;
		this.downButtons[t] || (this.onButtonDown && this.onButtonDown(t),
		this.downButtons[t] = e ? e : !0,
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
		if (!this.blurred) {
			this.previousTickDownButtons = Object.assign({}, this.tickDownButtons)
			this.tickDownButtons = Object.assign({}, this.downButtons);
		}

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
		let t = this.keysToPlay
		  , e = this.playback
		  , i = this.playbackTicks ?? this.scene.ticks;
		for (let s in t) {
			let n = t[s]
			  , r = n + "_up"
			  , o = n + "_down";
			if ("undefined" != typeof e[o] && "undefined" != typeof e[o][i]) {
				let a = e[o][i];
				this.setButtonDown(n, a)
			}
			"undefined" != typeof e[r] && "undefined" != typeof e[r][i] && this.setButtonUp(n)
		}
	}
	updateRecording() {
		let t = this.scene.ticks
		  , e = this.records
		  , s = this.tickDownButtons
		  , n = this.previousTickDownButtons;
		for (let o of this.keysToRecord) {
			if ("undefined" != typeof s[o]) {
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
		this.handleButtonUp = null,
		this.handleButtonDown = null,
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