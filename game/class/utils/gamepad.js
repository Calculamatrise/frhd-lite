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
		var e = {};
		for (var i in t)
			if (t[i] instanceof Array)
				for (var s in t[i])
					e[t[i][s]] = i;
			else
				e[t[i]] = i;
		this.keymap = e
	}
	handleButtonDown(t) {
		var e = this.getInternalCode(t.keyCode);
		"string" == typeof e && t.preventDefault(),
		this.setButtonDown(e)
	}
	handleButtonUp(t) {
		var e = this.getInternalCode(t.keyCode);
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
		for (var e = 0, i = t.length; i > e; e++)
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
		var e = 0;
		if (this.isButtonDown(t)) {
			e = 1;
			var i = this.tickDownButtons[t];
			i !== !0 && (e = i)
		}
		return e
	}
	getDownButtons() {
		var t = [];
		for (var e in this.tickDownButtons)
			this.tickDownButtons[e] && t.push(e);
		return t
	}
	reset(t) {
		(this.replaying || t) && (this.downButtons = {}),
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
		for (var t in this.downButtons)
			if (this.downButtons[t] === !0)
				return !0;
		return !1
	}
	updatePlayback() {
		var t = this.keysToPlay
		  , e = this.playback
		  , i = this.playbackTicks ?? this.scene.ticks;
		for (var s in t) {
			var n = t[s]
			  , r = n + "_up"
			  , o = n + "_down";
			if ("undefined" != typeof e[o] && "undefined" != typeof e[o][i]) {
				var a = e[o][i];
				this.setButtonDown(n, a)
			}
			"undefined" != typeof e[r] && "undefined" != typeof e[r][i] && this.setButtonUp(n)
		}
	}
	updateRecording() {
		var t = this.scene.ticks
		  , e = this.records
		  , s = this.tickDownButtons
		  , n = this.previousTickDownButtons;
		for (var o of this.keysToRecord) {
			var t = this.scene.ticks
			if ("undefined" != typeof s[o]) {
				var a = s[o]
				  , h = "undefined" != typeof n[o] && n[o];
				if (a !== h) {
					var l = o + "_up"
					  , c = o + "_down"
					  , u = l;
					a && (u = c);
					if (!a && e[c] && -1 !== e[c].indexOf(t)) {
						if (/^(backspace|enter)$/.test(o)) {
							t++;
						} else {
							e[c].splice(e[c].indexOf(t), 1),
							e[c].length || delete e[c];
							continue;
						}
					}

					e[u] || (e[u] = []),
					e[u].push(t)
				}
			}
		}
	}
	buttonWasRecentlyDown(t) {
		var e = this.records;
		this.replaying && (e = this.playback);
		var i = t + "_down"
		  , s = !1;
		if (e[i]) {
			var n = this.scene.ticks
			  , r = n
			  , o = e[i]
			  , a = -1;
			a = this.replaying ? "undefined" != typeof o[r] : o.indexOf(r),
			-1 !== a && (s = !0)
		}
		return s
	}
	getReplayString() {
		return JSON.stringify(this.records)
	}
	encodeReplayString(t) {
		var e = this.scene.settings
		  , i = {
				version: e.replayVersion
			};
		for (var s in t) {
			var n = t[s];
			i[s] = "";
			for (var r in n) {
				var o = n[r];
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