class Zip {
	#compressed = new Map();
	#zip = new Map();
	name = null;
	constructor(name) {
		name && (this.name = name.replace(/(\.zip)?$/, '.zip'));
	}
	static dec2bin = (dec, size) => dec.toString(2).padStart(size, '0');
	static str2dec = str => Array.prototype.map.call(str, t => t.charCodeAt());
	static str2hex = str => this.str2dec(str).map(x => x.toString(16).padStart(2, '0'));
	static hex2buf = hex => new Uint8Array(hex.split(' ').map(x => parseInt(x, 16)));
	static bin2hex = bin => parseInt(bin.slice(8), 2).toString(16).padStart(2, '0') + ' ' + parseInt(bin.slice(0, 8), 2).toString(16).padStart(2, '0');
	static reverse = hex => {
		let hexArray = new Array();
		for (let i = 0; i < hex.length; i = i + 2)
			hexArray[i] = hex[i] + '' + hex[i + 1];
		return hexArray.filter(a => a).reverse().join(' ');
	}
	static crc32 = r => {
		for (var a, o = [], c = 0; c < 256; c++) {
			a = c;
			for (var f = 0; f < 8; f++)
				a = 1 & a ? 3988292384 ^ a >>> 1 : a >>> 1;
			o[c] = a;
		}
		for (var n = -1, t = 0; t < r.length; t++)
			n = n >>> 8 ^ o[255 & (n ^ r[t])];
		return this.reverse(((-1 ^ n) >>> 0).toString(16).padStart(8, '0'));
	}
	static lastModifiedBinaryToHex(lastModified) {
		let lastMod = new Date(lastModified);
		let hour = this.dec2bin(lastMod.getHours(), 5);
		let minutes = this.dec2bin(lastMod.getMinutes(), 6);
		let seconds = this.dec2bin(Math.round(lastMod.getSeconds() / 2), 5);
		let year = this.dec2bin(lastMod.getFullYear() - 1980, 7);
		let month = this.dec2bin(lastMod.getMonth() + 1, 4);
		let day = this.dec2bin(lastMod.getDate(), 5);
		return this.bin2hex(`${hour}${minutes}${seconds}`) + ' ' + this.bin2hex(`${year}${month}${day}`)
	}
	newFile(name, data, { destinationFolder = '', extension, lastModified = Date.now() } = {}) {
		if (typeof arguments[0] == 'object')
			return this.newFile(name.name, ...arguments);
		if (typeof data.arrayBuffer == 'function')
			return data.arrayBuffer().then(buff => this.newFile(name, buff, Object.assign({}, arguments[2], data), Array.prototype.slice.call(arguments, 3)));
		let fullPath = ((destinationFolder && destinationFolder.replace(/\/?$/, '/')) + (name ?? 'New File.' + (extension ?? 'txt'))).replace(/^\/?/, '');
		let array = Array.from(new Uint8Array(typeof data == 'string' ? this.constructor.str2dec(data) : data));
		array.path = fullPath;
		let paths = fullPath.split('/');
		array.name = paths.pop();
		array.extension = array.name?.replace(/^[^.]+/, '');
		array.lastModified = new Date(lastModified);
		// let folder = this.#zip, folderName = array.name;
		// while (folderName = paths.shift())
		// 	folder.has(folderName) || folder.set(folderName, new Map());
		// folder.set(folderName, array);
		this.#zip.set(fullPath, array);
		return !0
	}
	async fetchAndZip(response, options = null) {
		if (Array.isArray(arguments[0])) {
			for (const argument of arguments[0])
				this.fetchAndZip(argument, Array.prototype.slice.call(arguments, 1));
			return
		} else if (!(response instanceof Response))
			return this.fetchAndZip(await fetch(response), arguments[Math.max(1, arguments.length - 1)])
			.catch(e => (console.warn('fetchAndZip:', e.message ?? 'Something went wrong!'), !1));
		return this.newFile(response.url.replace(/^.+\//, ''), await response.arrayBuffer(), Object.assign({
			destinationFolder: new URL(response.url.replace(/\/[^/]+$/, '')).pathname,
			lastModified: response.headers.get('Last-Modified')
		}, options));
	}
	blob() {
		return this.compress({ force: true }),
		new Blob(Array.from(this.#compressed.entries()).flat(), { type: 'application/zip' })
	}
	compress({ force } = {}) {
		if (this.#compressed.size < 1 || this.#compressed.size !== this.#zip.size || force) {
			this.#compressed.clear();
			let centralDirectoryFileHeader = [];
			let directoryInit = 0;
			let offSetLocalHeader = '00 00 00 00';
			for (const [name, file] of this.#zip.entries()) {
				let lastModified = this.constructor.lastModifiedBinaryToHex(file.lastModified);
				let crc = this.constructor.crc32(file);
				let size = this.constructor.reverse(parseInt(file.length).toString(16).padStart(8, '0'));
				let nameFile = this.constructor.str2hex(file.path).join(' ');
				let nameSize = this.constructor.reverse(file.path.length.toString(16).padStart(4, '0'));
				let fileHeader = `50 4B 03 04 14 00 00 00 00 00 ${lastModified} ${crc} ${size} ${size} ${nameSize} 00 00 ${nameFile}`;
				let fileHeaderBuffer = this.constructor.hex2buf(fileHeader);
				directoryInit += fileHeaderBuffer.length + file.length;
				centralDirectoryFileHeader.push(`50 4B 01 02 14 00 14 00 00 00 00 00 ${lastModified} ${crc} ${size} ${size} ${nameSize} 00 00 00 00 00 00 01 00 20 00 00 00 ${offSetLocalHeader} ${nameFile}`);
				offSetLocalHeader = this.constructor.reverse(directoryInit.toString(16).padStart(8, '0'));
				this.#compressed.set(fileHeaderBuffer, new Uint8Array(file));
			}
			let entries = this.constructor.reverse(this.#compressed.size.toString(16).padStart(4, '0'));
			let dirSize = this.constructor.reverse(centralDirectoryFileHeader.length.toString(16).padStart(8, '0'));
			let dirInit = this.constructor.reverse(directoryInit.toString(16).padStart(8, '0'));
			let centralDirectory = `50 4b 05 06 00 00 00 00 ${entries} ${entries} ${dirSize} ${dirInit} 00 00`;
			this.#compressed.set(this.constructor.hex2buf(centralDirectoryFileHeader.join(' ')), this.constructor.hex2buf(centralDirectory));
		}
		return this.#compressed
	}
}