class CanvasPool {
	canvasPool = [];
	poolCap = 5e3;
	getCanvas(size) {
		size ??= 0;
		const canvas = this.canvasPool.pop() || new OffscreenCanvas(size, size);
		size !== 0 && setCanvasSize(canvas, size);
		return canvas
	}
	releaseCanvas(t) {
		this.canvasPool.length < this.poolCap && this.canvasPool.push(t)
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
		const { ctx, offscreen } = sector;
		if (!ctx || !offscreen) return;
		ctx.clearRect(0, 0, offscreen.width, offscreen.height);
		sector.ctx = null;
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
		let offscreen = sector.offscreen;
		if (!offscreen) {
			offscreen = grid.canvasPool.getCanvas();
			const computedSize = size * zoom | 0;
			setCanvasSize(offscreen, computedSize);
		}

		const ctx = offscreen.getContext('2d');
		ctx.clearRect(0, 0, offscreen.width, offscreen.height);
		ctx.lineCap = 'round';
		ctx.lineWidth = Math.max(2 * zoom, .5);

		const sendBitmap = async (partial = false) => postMessage({
			column,
			row,
			partial,
			bitmap: await snapshotCanvas(offscreen) // await createImageBitmap(offscreen) // offscreen.transferToImageBitmap()
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

		delete sector.sessionId;
		await sendBitmap(false);
		grid.clear(column, row);
		break;
	}

	case 'CLEAR_SECTOR': {
		const { sector: { column, row }} = data;
		grid.clear(column, row);
		break;
	}

	case 'CREATE_SECTOR':
		const { sector: { column, row, size, x, y }, physicsLines, sceneryLines, settings, zoom } = data;
		const existingSector = grid.get(column, row);
		existingSector?.timeout && existingSector.cancel();
		// const offscreen = existingSector?.offscreen || grid.canvasPool.getCanvas(); // new OffscreenCanvas(size, size);
		// const computedSize = size * zoom | 0;
		// setCanvasSize(offscreen, computedSize);
		// const ctx = existingSector?.ctx || offscreen.getContext('2d');
		// ctx.lineCap = 'round';
		// ctx.lineWidth = Math.max(2 * zoom, .5);
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
	const tmp = grid.canvasPool.getCanvas();
	setCanvasSize(tmp, offscreen.width, offscreen.height);
	tmp.getContext('2d').drawImage(offscreen, 0, 0);
	return createImageBitmap(tmp)
}