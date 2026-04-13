export default function(ctx) {
	const { downButtons } = this.scene.playerManager.getPlayerByIndex(this.scene.camera.focusIndex)._gamepad

	let size = parseInt(this.storage.get('inputDisplaySize')) + 3;
	if (this.storage.get('relativeUISize')) {
		const base = 1500
			, current = (screen.width + screen.height) / 2;
		size *= current / base;
	}

	const offset = {
		x: size,
		y: ctx.canvas.height - size * 10 - GameSettings.inset.bottom
	};

	ctx.save(),
	ctx.fillStyle = GameSettings.physicsLineColor,
	ctx.globalAlpha = this.storage.get('inputDisplayOpacity'),
	// ctx.globalCompositeOperation = 'xor', // rect stroke/fill overlap
	ctx.lineWidth = size / 2,
	ctx.strokeStyle = GameSettings.physicsLineColor;

	let borderRadius = size / 2
		, buttonSize = size * 4;

	ctx.beginPath(),
	ctx.roundRect(offset.x, offset.y, buttonSize, buttonSize, borderRadius),
	downButtons.z && ctx.fill(),
	ctx.stroke(),
	ctx.beginPath(),
	ctx.roundRect(offset.x + 5 * size, offset.y, buttonSize, buttonSize, borderRadius),
	downButtons.up && ctx.fill(),
	ctx.stroke(),
	ctx.beginPath(),
	ctx.roundRect(offset.x, offset.y + 5 * size, buttonSize, buttonSize, borderRadius),
	downButtons.left && ctx.fill(),
	ctx.stroke(),
	ctx.beginPath(),
	ctx.roundRect(offset.x + 5 * size, offset.y + 5 * size, buttonSize, buttonSize, borderRadius),
	downButtons.down && ctx.fill(),
	ctx.stroke(),
	ctx.beginPath(),
	ctx.roundRect(offset.x + 10 * size, offset.y + 5 * size, buttonSize, buttonSize, borderRadius),
	downButtons.right && ctx.fill(),
	ctx.stroke();

	ctx.globalCompositeOperation = 'xor', // destination-out
	ctx.lineWidth = size / 3,
	ctx.beginPath(),
	ctx.moveTo(offset.x + 2.7 * size, offset.y + 3 * size),
	ctx.lineTo(offset.x + 1.2 * size, offset.y + 3 * size),
	ctx.lineTo(offset.x + 2.7 * size, offset.y + 1 * size),
	ctx.lineTo(offset.x + 1.2 * size, offset.y + 1 * size),
	ctx.moveTo(offset.x + 6.2 * size, offset.y + 2.7 * size),
	ctx.lineTo(offset.x + 7 * size, offset.y + 1.2 * size),
	ctx.lineTo(offset.x + 7.8 * size, offset.y + 2.7 * size),
	ctx.moveTo(offset.x + 2.5 * size, offset.y + 7.8 * size),
	ctx.lineTo(offset.x + 1.2 * size, offset.y + 7 * size),
	ctx.lineTo(offset.x + 2.5 * size, offset.y + 6.2 * size),
	ctx.moveTo(offset.x + 6.2 * size, offset.y + 6.2 * size),
	ctx.lineTo(offset.x + 7 * size, offset.y + 7.8 * size),
	ctx.lineTo(offset.x + 7.8 * size, offset.y + 6.2 * size),
	ctx.moveTo(offset.x + 11.5 * size, offset.y + 7.8 * size),
	ctx.lineTo(offset.x + 12.8 * size, offset.y + 7 * size),
	ctx.lineTo(offset.x + 11.5 * size, offset.y + 6.2 * size),
	ctx.stroke(),
	ctx.restore()
}