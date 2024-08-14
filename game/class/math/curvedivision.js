export default function (t, e, i, options) {
	let points = [];
	let length = (i.delta(e) + e.delta(t)) / 2;
	let minDistance = 2;
	let breakLength = Math.max(minDistance, options.breakLength * 100);
	for (let s = 0; s < length; s += breakLength) {
		let n = s / length;
		let pointX = (1 - n) ** 2 * t.x + 2 * (1 - n) * n * parseFloat(e.x) + n ** 2 * parseFloat(i.x);
		let pointY = (1 - n) ** 2 * t.y + 2 * (1 - n) * n * parseFloat(e.y) + n ** 2 * parseFloat(i.y);

		// Calculate distance from the last point if it exists
		if (points.length > 0) {
			let lastPointX = points[points.length - 2];
			let lastPointY = points[points.length - 1];
			let distance = Math.sqrt((pointX - lastPointX) ** 2 + (pointY - lastPointY) ** 2);

			// Only add the point if it's beyond minDistance
			if (distance < minDistance) {
				continue;
			}
		}

		points.push(pointX, pointY);
	}

	// Ensure the start point is included
	if (points[0] !== t.x || points[1] !== t.y) {
		points.unshift(t.x, t.y);
	}

	// Ensure the end point is included
	if (points[points.length - 2] !== i.x || points[points.length - 1] !== i.y) {
		points.push(i.x, i.y);
	}

	return points
}