import "../inventorymanager.js";

export default GameInventoryManager.HeadClass = class {
	versions = {};
	createVersion() {
		let t = this.colors
		  , e = this.getVersions()
		  , i = "";
		for (let s in t)
			i += t[s];
		this.versionName = i,
		e[i] ||= {
			dirty: !0,
			canvas: document.createElement('canvas')
		}
	}
	draw(t, e, i, s, n, r) {
		let o = this.getCache(n)
		  , l = this.getScale()
		  , p = this.getBaseWidth() * n * l
		  , d = this.getBaseHeight() * n * l
		  , f = this.getDrawOffsetX() * n - p / 2
		  , v = this.getDrawOffsetY() * n - d / 2
		  , g = -1 === r;
		t.translate(e, i),
		t.rotate(s),
		g && t.scale(1, -1),
		t.drawImage(o, f, v, p, d),
		g && t.scale(1, -1),
		t.rotate(-s),
		t.translate(-e, -i)
	}
	getCache(t) {
		let e = this.getVersions();
		return e[this.versionName].dirty && this.cache(t),
		e[this.versionName].canvas
	}
	getVersions() {
		return this.versions
	}
	setDirty() {
		let t = this.getVersions();
		t[this.versionName].dirty = !0
	}
}