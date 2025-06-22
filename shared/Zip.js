class Zip {
	files = new Map();
	name = null;
	constructor(name) {
		name && (this.name = name.replace(/(\.zip)?$/, '.zip'))
	}

	async blob() {
		return new File([await this.constructor.compress(this.files)], this.name, { type: 'application/zip' })
	}

	newFile(name, data, { destinationFolder = '', extension, lastModified = Date.now() } = {}) {
		if (typeof arguments[0] == 'object') return this.newFile(name.name, ...arguments);

		if (typeof data.arrayBuffer == 'function') {
			return data.arrayBuffer().then(buff => this.newFile(name, buff, Object.assign({}, arguments[2], data)));
		}

		let fullPath = ((destinationFolder && destinationFolder.replace(/\/?$/, '/')) + (name ?? 'New File.' + (extension ?? 'txt')))
			.replace(/^\/?/, '');
		let array = new Uint8Array(typeof data == 'string' ? Array.prototype.map.call(data, t => t.charCodeAt()) : data);
		array.path = fullPath;
		array.name = name.split('/').pop();
		array.extension = array.name?.replace(/^[^.]+/, '');
		array.lastModified = new Date(lastModified);
		this.files.set(fullPath, array);
		return array.buffer
	}

	static async compress(files) {
		const LOCAL_FILE_HEADER_SIGNATURE = 0x04034b50
			, CENTRAL_DIR_SIGNATURE = 0x02014b50
			, EOCD_SIGNATURE = 0x06054b50
			, encoder = new TextEncoder();

		let localChunks = []
		  , centralChunks = []
		  , offset = 0;

		for (let [name, data] of files.entries()) {
			if (data instanceof File) {
				name = data.name;
				data = new Uint8Array(await data.arrayBuffer());
			}
			const nameBytes = encoder.encode(name)
				, extraBytes = new Uint8Array(0)
				, crc32Val = CRC32.calc(data)
				, modTimeDate = (() => {
				const d = new Date();
				const dosTime = ((d.getHours() & 0x1F) << 11)
					| ((d.getMinutes() & 0x3F) << 5)
					| ((Math.floor(d.getSeconds() / 2) & 0x1F));
				const dosDate = (((d.getFullYear() - 1980) & 0x7F) << 9)
					| (((d.getMonth() + 1) & 0x0F) << 5)
					| ((d.getDate()) & 0x1F);
				return { dosTime, dosDate };
			})();

			const lfHeader = new ArrayBuffer(30 + nameBytes.length + extraBytes.length);
			const dv = new DataView(lfHeader);

			let p = 0;
			dv.setUint32(p, LOCAL_FILE_HEADER_SIGNATURE, true); p += 4; // signature
			dv.setUint16(p, 20, true); p += 2; // version needed
			dv.setUint16(p, 0, true); p += 2; // flags
			dv.setUint16(p, 0, true); p += 2; // compression method (0 = store)
			dv.setUint16(p, modTimeDate.dosTime, true); p += 2; // modTime
			dv.setUint16(p, modTimeDate.dosDate, true); p += 2; // modDate
			dv.setUint32(p, crc32Val, true); p += 4; // CRC32
			dv.setUint32(p, data.length, true); p += 4; // compSize
			dv.setUint32(p, data.length, true); p += 4; // uncompSize
			dv.setUint16(p, nameBytes.length, true); p += 2; // nameLen
			dv.setUint16(p, extraBytes.length, true); p += 2; // extraLen

			// write filename
			new Uint8Array(lfHeader, p, nameBytes.length).set(nameBytes);
			p += nameBytes.length;
			// write extra
			new Uint8Array(lfHeader, p, extraBytes.length).set(extraBytes);

			localChunks.push(new Uint8Array(lfHeader), data);

			const cdHeader = new ArrayBuffer(46 + nameBytes.length + extraBytes.length);
			const cd = new DataView(cdHeader);
			p = 0;
			cd.setUint32(p, CENTRAL_DIR_SIGNATURE, true); p += 4; // central dir sig
			cd.setUint16(p, 20, true); p += 2; // version made by
			cd.setUint16(p, 20, true); p += 2; // version needed
			cd.setUint16(p, 0, true); p += 2; // flags
			cd.setUint16(p, 0, true); p += 2; // method
			cd.setUint16(p, modTimeDate.dosTime, true); p += 2; // modTime
			cd.setUint16(p, modTimeDate.dosDate, true); p += 2; // modDate
			cd.setUint32(p, crc32Val, true); p += 4; // CRC32
			cd.setUint32(p, data.length, true); p += 4; // compSize
			cd.setUint32(p, data.length, true); p += 4; // uncompSize
			cd.setUint16(p, nameBytes.length, true); p += 2; // nameLen
			cd.setUint16(p, extraBytes.length, true); p += 2; // extraLen
			cd.setUint16(p, 0, true); p += 2; // commentLen
			cd.setUint16(p, 0, true); p += 2; // diskStart
			cd.setUint16(p, 0, true); p += 2; // internalAttrs
			cd.setUint32(p, 0, true); p += 4; // externalAttrs
			cd.setUint32(p, offset, true); p += 4; // localHeaderOffset

			// write name & extra
			new Uint8Array(cdHeader, p, nameBytes.length).set(nameBytes);
			// p+=nameBytes.length; // no extra bytes in CD
			centralChunks.push(new Uint8Array(cdHeader));

			// advance offset
			offset += lfHeader.byteLength + data.length;
		}

		const allLocalLen = localChunks.reduce((sum, c) => sum + c.byteLength, 0);
		const allCdLen = centralChunks.reduce((sum, c) => sum + c.byteLength, 0);
		const eocdLen = 22;

		const out = new Uint8Array(allLocalLen + allCdLen + eocdLen);
		let ptr = 0;
		for (let c of localChunks) { out.set(c, ptr); ptr += c.byteLength; }
		for (let c of centralChunks) { out.set(c, ptr); ptr += c.byteLength; }

		const dv = new DataView(out.buffer, ptr);
		dv.setUint32(0, EOCD_SIGNATURE, true); ptr += 4;
		dv.setUint16(4, 0, true); ptr += 2; // disk
		dv.setUint16(6, 0, true); ptr += 2; // cd disk
		dv.setUint16(8, centralChunks.length, true); ptr += 2; // entries on this disk
		dv.setUint16(10, centralChunks.length, true); ptr += 2; // total entries
		dv.setUint32(12, allCdLen, true); ptr += 4; // cd size
		dv.setUint32(16, allLocalLen, true); ptr += 4; // cd offset
		dv.setUint16(20, 0, true); ptr += 2; // commentLen
		return new Blob([out], { type: 'application/zip' })
	}

	static async decompress(input) {
		if (!(input instanceof Uint8Array)) {
			if (input instanceof Blob)
				input = new Uint8Array(await input.arrayBuffer());
			else if (input instanceof ArrayBuffer)
				input = new Uint8Array(input);
			else if (ArrayBuffer.isView(input))
				input = new Uint8Array(input.buffer, input.byteOffset, input.byteLength);
			else
				throw new TypeError('Expected Uint8Array, Blob, ArrayBuffer or TypedArray');
		}

		const view = new DataView(input.buffer, input.byteOffset, input.byteLength)
			, files = new Map();

		const EOCD_SIG = 0x06054b50;
		let eocd = -1;
		for (let i = input.length - 22; i >= 0; i--) {
			if (view.getUint32(i, true) === EOCD_SIG) {
				eocd = i;
				break;
			}
		}
		if (eocd < 0)
			throw new Error('EOCD not found');

		const totalEntries = view.getUint16(eocd + 10, true)
			, cdOffset = view.getUint32(eocd + 16, true);

		let ptr = cdOffset;
		for (let e = 0; e < totalEntries; e++) {
			if (view.getUint32(ptr, true) !== 0x02014b50)
				throw new Error(`Bad CD sig @${ptr}`);

			const nameLen = view.getUint16(ptr + 28, true)
				, extraLen = view.getUint16(ptr + 30, true)
				, commentLen = view.getUint16(ptr + 32, true)
				, localOff = view.getUint32(ptr + 42, true)
				, fname = new TextDecoder()
				.decode(input.subarray(ptr + 46, ptr + 46 + nameLen));

			ptr += 46 + nameLen + extraLen + commentLen;

			if (view.getUint32(localOff, true) !== 0x04034b50)
				throw new Error(`Bad LFH sig @${localOff}`);

			const flags = view.getUint16(localOff + 6, true)
				, method = view.getUint16(localOff + 8, true)
				, nameLen2 = view.getUint16(localOff + 26, true)
				, extraLen2 = view.getUint16(localOff + 28, true);
			let compSize = view.getUint32(localOff + 18, true)
			  , uncompSize = view.getUint32(localOff + 22, true);

			const dataStart = localOff + 30 + nameLen2 + extraLen2;
			let dataEnd = dataStart + compSize;

			if (flags & 0x08) {
				const DD_SIG = 0x08074b50;
				let dd = dataStart;
				while (dd + 12 <= input.length) {
					if (view.getUint32(dd, true) === DD_SIG) {
						compSize = view.getUint32(dd + 8, true);
						uncompSize = view.getUint32(dd + 12, true);
						dataEnd = dataStart + compSize;
						break;
					}
					dd++;
				}

				if (dataEnd + 8 <= input.length && uncompSize === 0) {
					compSize = view.getUint32(dataEnd, true);
					uncompSize = view.getUint32(dataEnd + 4, true);
					dataEnd = dataStart + compSize;
				}
			}

			if (dataEnd > input.length)
				throw new Error(`Data overruns buffer for "${fname}"`);

			const raw = input.subarray(dataStart, dataEnd);
			let out;
			switch (method) {
			case 0:
				out = raw; // Stored - no compression
				break;
			case 8:
				try {
					out = await this.inflateRaw(raw);
				} catch (err) {
					throw new Error(`Failed to inflate "${fname}": ${err.message}`);
				}
				break;
			default:
				throw new Error(`Unsupported method ${method} for "${fname}"`);
			}

			files.set(fname, new File([out], fname));
		}

		return files
	}

	static async inflateRaw(input) {
		const stream = new Response(input).body;
		const ds = new DecompressionStream('deflate-raw');
		const decompressedStream = stream.pipeThrough(ds);
		const result = await new Response(decompressedStream).arrayBuffer();
		return new Uint8Array(result)
	}
}

Object.defineProperty(self, 'Zip', {
	value: Zip,
	writable: true
});

const CRC32 = Object.defineProperties({
	table: new Uint32Array(256)
}, {
	lookup: {
		value: function lookup(id) {
			id &= 0xFF;
			if (this.table[id]) return this.table[id];
			let value = id;
			for (let i = 0; i < 8; i++)
				value = (value & 1) ? (0xEDB88320 ^ (value >>> 1)) : (value >>> 1);
			return this.table[id] = value;
		}
	},
	calc: {
		value: function calc(buf) {
			let crc = -1;
			for (let byte of buf)
				crc = (crc >>> 8) ^ this.lookup(crc ^ byte);
			return ((-1 ^ crc) >>> 0) >>> 0;
		}
	},
	hex: {
		value: function hex(buf) {
			let num = this.calc(buf);
			return num.toString(16).padStart(8, '0');
		}
	}
});