class CanvasPool {
	canvasPools = new Map();
	poolCap = 5e3;
	getCanvas(size) {
		if (!this.canvasPools.has(size)) {
			this.canvasPools.set(size, []);
		}

		const pool = this.canvasPools.get(size);
		return pool.pop() || new OffscreenCanvas(size, size)
	}

	getConfiguredCanvas(size, config) {
		const canvas = this.getCanvas(size);
		this.constructor.getConfiguredCtx(canvas, config);
		return canvas
	}

	releaseCanvas(canvas) {
		const size = canvas.width;
		if (!this.canvasPools.has(size)) {
			this.canvasPools.set(size, []);
		}

		const pool = this.canvasPools.get(size);
		if (pool.length < this.poolCap) {
			const ctx = canvas.getContext('2d');
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			pool.push(canvas)
		}
	}

	static getConfiguredCtx(canvas, config) {
		const ctx = canvas.getContext('2d');
		if (!canvas._ctxConfigured && config instanceof Object) {
			ctx.lineCap = 'round';
			ctx.lineJoin = 'round';
			for (const key in config) {
				const val = config[key];
				switch (key) {
				case 'zoom':
					ctx.lineWidth = Math.max(2 * val, .5);
					continue;
				}

				ctx[key] = val;
			}
			Object.defineProperty(canvas, '_ctxConfigured', { value: true });
		}
		return ctx
	}
}

class Grid {
	canvasPool = new CanvasPool();
	sectors = {};
	_column(x, { createIfNotExists } = {}) {
		let column = this.sectors[x];
		if (!column && createIfNotExists)
			column = (this.sectors[x] = {});
		return column ?? null
	}
	clear(x, y) {
		const sector = this.get(x, y);
		if (!sector) return;
		sector?.timeout && sector.cancel();
		const { offscreen } = sector;
		if (!offscreen) return;
		this.canvasPool.releaseCanvas(offscreen);
		sector.offscreen = null
	}
	create(x, y, data) {
		return !this.has(x, y) && this.set(x, y, data)
	}
	has(x, y) {
		return null !== this.get(x, y)
	}
	get(x, y) {
		const column = this._column(x);
		return column?.[y] ?? null
	}
	set(x, y, data) {
		const column = this._column(x, { createIfNotExists: true });
		return column[y] = data
	}
	update(x, y, data) {
		const sector = this.get(x, y);
		return sector && this.set(x, y, Object.assign(sector, data))
	}
}

Object.defineProperty(self, 'grid', {
	value: new Grid(),
	writable: true
});

addEventListener('message', async function({ data }) {
	switch (data.type) {
	case 0: // ping
		return postMessage({ type: 1 });
	case 'CACHE_SECTOR': {
		const { sector: { column, row, size, x, y }, settings, zoom } = data;
		const sector = grid.get(column, row);
		if (!sector) return console.warn(`Sector not found (${column}, ${row})`);

		const { physicsLines, sceneryLines } = sector;
		const computedSize = size * zoom | 0;
		const offscreen = grid.canvasPool.getConfiguredCanvas(computedSize, { zoom });
		const ctx = offscreen.getContext('2d');
		sector.offscreen = offscreen;

		const sendBitmap = async (partial = false) => postMessage({
			column,
			row,
			partial,
			bitmap: await snapshotCanvas(ctx.canvas) // await createImageBitmap(offscreen) // offscreen.transferToImageBitmap()
		});
		const sendBitmapUpdate = () => sendBitmap(true);

		const sessionId = crypto.randomUUID();
		sector.sessionId = sessionId;

		await drawLinesInChunks(ctx, {
			lines: sceneryLines,
			strokeColor: settings.sceneryLineColor,
			zoom,
			offsetX: x,
			offsetY: y,
			sector,
			sessionId
		}, sendBitmapUpdate);

		await drawLinesInChunks(ctx, {
			lines: physicsLines,
			strokeColor: settings.physicsLineColor,
			zoom,
			offsetX: x,
			offsetY: y,
			sector,
			sessionId
		}, sendBitmapUpdate);

		await sendBitmap(false);
		grid.clear(column, row);
		delete sector.sessionId;
		break;
	}

	case 'CLEAR_SECTOR': {
		const { sector: { column, row }} = data;
		grid.clear(column, row);
		break;
	}

	case 'CREATE_SECTOR':
		const { sector: { column, row, size, x, y }, physicsLines, sceneryLines, settings } = data;
		grid.clear(column, row);
		grid.set(column, row, {
			physicsLines,
			sceneryLines,
			settings,
			size,
			x, y
		})
	}
});

function drawLinesInChunks(ctx, {
	lines,
	offsetX,
	offsetY,
	sector,
	sessionId,
	strokeColor,
	timeout,
	zoom,
	chunkSize = 100,
	progressEvery = 1
}, onChunkDrawn) {
	return new Promise((resolve, reject) => {
		try {
			const len = lines.length
			let index = 0
			  , chunkCount = 0;
			strokeColor && (ctx.strokeStyle = strokeColor);
			const drawChunk = () => {
				if (sector.sessionId !== sessionId) return reject('Cancelled');

				const end = Math.min(index + chunkSize, len);
				ctx.beginPath();
				for (; index < end; index++) {
					const { p1: s, p2: n } = lines[index];
					ctx.moveTo((s.x - offsetX) * zoom, (s.y - offsetY) * zoom);
					ctx.lineTo((n.x - offsetX) * zoom, (n.y - offsetY) * zoom);
				}

				ctx.stroke();

				const complete = index >= len;
				if (++chunkCount % progressEvery === 0 || complete) {
					onChunkDrawn?.();
				}

				if (!complete) {
					const timeoutId = setTimeout(drawChunk, 0);
					sector.timeout = timeoutId;
					sector.cancel = () => {
						clearTimeout(timeoutId);
						delete sector.timeout;
						delete sector.sessionId
					};
					timeout?.(timeoutId);
				} else {
					delete sector.timeout;
					resolve();
				}
			};
			drawChunk();
		} catch (err) {
			reject(err)
		}
	})
}

function setCanvasSize(canvas, width, height) {
	height ??= width;
	const widthMismatch = width !== canvas.width
		, heightMismatch = height !== canvas.height;
	widthMismatch && (canvas.width = width);
	heightMismatch && (canvas.height = height);
	return widthMismatch || heightMismatch
}

// Bug 3: await createImageBitmap(offscreen) can still flicker
// If you're trying to incrementally preview drawing progress, this can still cause visual flickering due to how createImageBitmap reads current GPU buffer state.
// Fix suggestion:
// Use the same snapshot(offscreen) strategy mentioned earlier:
function snapshotCanvas(offscreen) {
	const tmp = grid.canvasPool.getCanvas(offscreen.width);
	tmp.getContext('2d').drawImage(offscreen, 0, 0);
	return createImageBitmap(tmp)
}