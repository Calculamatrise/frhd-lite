import Powerup from "../powerup.js";

export default class extends Powerup {
	color = '#dd45ec';
	hit = !1;
	id = crypto.randomUUID();
	otherPortal = null;
	name = 'teleport';
	prefix = 'W';
	recorded = !1;
	addOtherPortalRef(t) {
		this.otherPortal = t
	}
	collide(t) {
		let e = t.parent
		  , i = e.player
		  , s = i._powerupsConsumed.misc;
		if (-1 === s.indexOf(this.id)) {
			let n = t.pos.x - this.x
			  , o = t.pos.y - this.y
			  , a = Math.pow(n, 2) + Math.pow(o, 2);
			1e3 > a && i.isAlive() && (s.push(this.id),
			s.push(this.otherPortal.id),
			e.moveVehicle(this.otherPortal.x - this.x, this.otherPortal.y - this.y),
			i.isGhost() === !1 && (this.hit = !0,
			this.otherPortal.hit = !0,
			this.sector.powerupCanvasDrawn = !1,
			this.otherPortal.sector.powerupCanvasDrawn = !1,
			this.scene.sound.play('teleport_sound', .3),
			this.scene.message.show('Teleport Engaged', 50, this.color)))
		}
	}
	draw(t, e, i, s) {
		s.save(),
		s.globalAlpha = this.hit === !1 ? 1 : .2,
		super.draw(t, e, i, s),
		s.restore()
	}
	drawPowerup(t, e, i, s) {
		let n = this.outline;
		/^(dark(er)?|midnight)$/i.test(lite.storage.get('theme')) && (n = this.settings.physicsLineColor),
		i *= .64,
		s.save(),
		s.scale(i, i),
		s.translate(2.6, 3),
		s.fillStyle = this.color,
		s.strokeStyle = n,
		s.lineWidth = 5,
		s.beginPath(),
		s.moveTo(23.9052288, 5.91261647),
		s.bezierCurveTo(23.9052288, 5.91261647, 22.5543791, 5.13614588, 18.1099346, 5.04995765),
		s.bezierCurveTo(13.6479739, 5.05021647, 9.39411765, 6.99424, 5.93111111, 10.2266871),
		s.bezierCurveTo(2.88431373, 13.0698635, .969542484, 16.6517224, .241437908, 20.8723576),
		s.bezierCurveTo(.0837908497, 22.1227341, .0816993464, 22.1341224, .0796078431, 22.1452518),
		s.bezierCurveTo(.0929411765, 25.8184753, .118562092, 26.0470165, .145751634, 26.2752988),
		s.bezierCurveTo(.550457516, 29.6511341, 1.80196078, 32.7860047, 3.86601307, 35.59424),
		s.bezierCurveTo(4.76326797, 36.8153694, 6.27176471, 38.4928047, 7.6179085, 39.4864282),
		s.bezierCurveTo(7.6179085, 39.4864282, 13.4911111, 44.3481694, 22.5543791, 43.7872988),
		s.bezierCurveTo(16.5849673, 39.6461224, 15.7624837, 37.5460282, 15.7624837, 37.5460282),
		s.bezierCurveTo(16.4521569, 37.6208282, 18.1535948, 38.5391341, 21.868366, 38.5391341),
		s.bezierCurveTo(27.0628758, 38.5391341, 31.7535948, 36.2909929, 35.4330719, 32.0377459),
		s.bezierCurveTo(37.5739869, 29.5631341, 38.9739869, 26.6037459, 39.5941176, 23.2421459),
		s.lineTo(39.8856209, 21.2448047),
		s.bezierCurveTo(39.7975163, 18.0607576, 39.7695425, 17.8096988, 39.7394771, 17.5591576),
		s.bezierCurveTo(39.3355556, 14.1864282, 38.0845752, 11.0515576, 36.0215686, 8.24176941),
		s.bezierCurveTo(34.9975163, 6.84826353, 33.8019608, 5.59038118, 32.4675817, 4.50202824),
		s.bezierCurveTo(32.4675817, 4.50202824, 25.996732, -1.07536, 16.5653595, .558592941),
		s.bezierCurveTo(21.6393464, 2.28934588, 23.9052288, 5.91261647, 23.9052288, 5.91261647),
		s.stroke(),
        s.fill(),
		s.fillStyle = /^(dark(er)|midnight)?$/i.test(lite.storage.get('theme')) ? '#1e1e1e' : '#fefefe',
		s.beginPath(),
		s.moveTo(5.22875817, 24.6992965),
		s.lineTo(5.22875817, 23.0451553),
		s.bezierCurveTo(5.24078431, 22.97812, 5.25647059, 22.9113435, 5.26457516, 22.8437906),
		s.bezierCurveTo(5.30823529, 22.4770376, 5.33254902, 22.1071788, 5.39555556, 21.7440494),
		s.bezierCurveTo(5.9179085, 18.7173671, 7.26117647, 16.0988494, 9.5179085, 13.9930612),
		s.bezierCurveTo(12.7882353, 10.9404965, 16.6520261, 9.83428471, 21.0614379, 10.8020259),
		s.bezierCurveTo(23.1579085, 11.2619553, 24.9563399, 12.2887082, 26.3997386, 13.8804729),
		s.bezierCurveTo(27.8005229, 15.4251318, 28.5681046, 17.2482847, 28.8130719, 19.3033435),
		s.bezierCurveTo(29.0044444, 20.9103788, 28.7861438, 22.4467553, 28.0836601, 23.9122141),
		s.bezierCurveTo(26.5186928, 27.1764965, 23.3458824, 28.74652, 19.8862745, 27.9666847),
		s.bezierCurveTo(17.6018301, 27.4518847, 16.0658824, 25.7762612, 15.7793464, 23.4833435),
		s.bezierCurveTo(15.7513725, 23.2566141, 15.7422222, 23.0278141, 15.7233987, 22.7920259),
		s.bezierCurveTo(15.6826144, 22.7959082, 15.6577778, 22.7959082, 15.6345098, 22.8013435),
		s.bezierCurveTo(15.2580392, 22.8929671, 15.0844444, 23.1867318, 14.9532026, 23.5037906),
		s.bezierCurveTo(14.6407843, 24.2592965, 14.6128105, 25.0383553, 14.8180392, 25.8238847),
		s.bezierCurveTo(15.1252288, 26.9999788, 15.8075817, 27.9480494, 16.7301961, 28.7162376),
		s.bezierCurveTo(19.105098, 30.6939082, 21.8201307, 31.2356259, 24.7777778, 30.3869435),
		s.bezierCurveTo(27.9027451, 29.4903788, 30.1628758, 27.5002847, 31.6556863, 24.6703082),
		s.bezierCurveTo(33.1751634, 21.7893435, 33.4169935, 18.73652, 32.7003922, 15.5969906),
		s.bezierCurveTo(32.1134641, 13.0263553, 30.9056209, 10.7471553, 29.2807843, 8.67397882),
		s.bezierCurveTo(29.2345098, 8.61496706, 29.1887582, 8.55595529, 29.1427451, 8.49694353),
		s.bezierCurveTo(30.1487582, 9.31767294, 31.0295425, 10.2476259, 31.7918954, 11.2855082),
		s.bezierCurveTo(33.305098, 13.3460024, 34.2433987, 15.6329671, 34.5471895, 18.1681435),
		s.bezierCurveTo(34.5856209, 18.4903788, 34.6206536, 18.8131318, 34.6569935, 19.1356259),
		s.lineTo(34.6569935, 20.7897671),
		s.bezierCurveTo(34.6449673, 20.8565435, 34.629281, 20.92332, 34.620915, 20.9908729),
		s.bezierCurveTo(34.5644444, 21.4313906, 34.5309804, 21.8763082, 34.4501961, 22.3121671),
		s.bezierCurveTo(34.0122876, 24.6873906, 33.0475817, 26.8374376, 31.4616993, 28.6706847),
		s.bezierCurveTo(28.1134641, 32.5408729, 23.9121569, 34.11012, 18.8256209, 33.0287553),
		s.bezierCurveTo(16.5994771, 32.5553671, 14.72, 31.4287082, 13.2504575, 29.68372),
		s.bezierCurveTo(11.9879739, 28.1846141, 11.2983007, 26.4463553, 11.0705882, 24.5126847),
		s.bezierCurveTo(10.871634, 22.8236024, 11.1286275, 21.2212259, 11.9113725, 19.7042612),
		s.bezierCurveTo(13.5228758, 16.5810376, 16.6386928, 15.0982376, 19.9803922, 15.8646141),
		s.bezierCurveTo(22.303268, 16.3975318, 23.7997386, 18.0288965, 24.1079739, 20.3696965),
		s.bezierCurveTo(24.136732, 20.5899553, 24.1440523, 20.8128024, 24.1662745, 21.1008729),
		s.bezierCurveTo(24.343268, 20.9921671, 24.5147712, 20.9334141, 24.6146405, 20.8153906),
		s.bezierCurveTo(24.7620915, 20.6414612, 24.8909804, 20.4375082, 24.970719, 20.2255318),
		s.bezierCurveTo(25.28, 19.4032494, 25.2648366, 18.5688024, 24.9890196, 17.7405671),
		s.bezierCurveTo(24.5738562, 16.4935553, 23.7654902, 15.5263318, 22.715817, 14.7615082),
		s.bezierCurveTo(20.315817, 13.0147082, 17.6664052, 12.6334612, 14.8541176, 13.5207082),
		s.bezierCurveTo(11.8538562, 14.4672259, 9.67267974, 16.4187553, 8.23006536, 19.1622847),
		s.bezierCurveTo(6.68470588, 22.1014847, 6.45960784, 25.2078847, 7.22352941, 28.3996965),
		s.bezierCurveTo(7.82248366, 30.8996729, 9.0096732, 33.1206376, 10.5921569, 35.1438612),
		s.bezierCurveTo(10.6420915, 35.2083082, 10.692549, 35.2724965, 10.743268, 35.3364259),
		s.bezierCurveTo(9.97568627, 34.7698612, 8.83764706, 33.5606376, 8.09385621, 32.5486376),
		s.bezierCurveTo(6.57986928, 30.4886612, 5.6420915, 28.2016965, 5.33830065, 25.66652),
		s.bezierCurveTo(5.29960784, 25.3442847, 5.26535948, 25.0215318, 5.22875817, 24.6992965),
		s.fill(),
		s.restore()
	}
	erase(t, e) {
		let i = !1;
		if (!this.remove) {
			let s = Math.sqrt(Math.pow(t.x - this.x, 2) + Math.pow(t.y - this.y, 2));
			e >= s && (i = [this, this.otherPortal],
			this.removeAllReferences(),
			this.otherPortal.removeAllReferences())
		}
		return i
	}
	getCode() {
		let t = '';
		return this.recorded === !1 && this.otherPortal.recorded === !0 ? this.recorded = !0 : this.recorded === !1 && this.otherPortal.recorded === !1 ? (this.recorded = !0,
		t = super.getCode() + ' ' + this.otherPortal.x.toString(32) + ' ' + this.otherPortal.y.toString(32)) : this.recorded === !0 && this.otherPortal.recorded === !0 && (this.otherPortal.recorded = !1,
		t = super.getCode() + ' ' + this.otherPortal.x.toString(32) + ' ' + this.otherPortal.y.toString(32)),
		t
	}
	move(t, e) {
		this.otherPortal.x += parseInt(t) | 0,
		this.otherPortal.y += parseInt(e) | 0;
		return super.move(t, e)
	}
	static cache = Object.assign(this.createCache(), {
		width: 29,
		height: 32
	})
}