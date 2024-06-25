class InventoryManager {
	cache = {};
	inventory = {};
	loaded = new Set();
	constructor() {
		Object.defineProperty(this, 'cache', { enumerable: false });
	}
	getItem(t) {
		let e = t.classname
		  , i = t.script
		  , o = t.options
		  , a = t.type;
		this.inventory[e] || ('1' === a && (e = 'forward_cap',
		o = { back: 'white' }),
		this.loaded.has(i) || (this.loaded.add(i),
		GameManager.loadFile(i)));
		let h = this.generateID(a, e, o);
		return this.cache[h] ||= new this.inventory[e](o);
	}
	redraw() {
		let n = this.cache
		for (let t in n)
			n[t].setDirty()
	}
	generateID(t, e, i) {
		e = t + e;
		if (i)
			for (let s in i)
				i.hasOwnProperty(s) && (e += i[s]);
		return e
	}
	register(t, e) {
		this.inventory[t] = e
	}
	clear() {
		this.cache = {},
		this.inventory = {},
		this.loaded.clear()
	}
}

window.GameInventoryManager = new InventoryManager;