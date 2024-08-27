export default function (...t) {
	let options = t.pop();
	let points = [];
	let length = t.reduce((sum, point, i) => sum += point.delta(t[(i < 1 ? t.length : i) - 1]), 0) / t.length;
	// let length = (i.delta(e) + e.delta(t)) / 2;
	let minDistance = 2;
	let breakLength = Math.max(minDistance, options.breakLength * 100);
	for (let s = 0; s < length; s += breakLength) {
		let n = s / length;
		let [pointX, pointY] = multiCurve(n, ...t);

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
	let e = t[0];
	if (points[0] !== e.x || points[1] !== e.y) {
		points.unshift(e.x, e.y);
	}

	// Ensure the end point is included
	let i = t.at(-1);
	if (points[points.length - 2] !== i.x || points[points.length - 1] !== i.y) {
		points.push(i.x, i.y);
	}

	return points
}

function binomialCoefficient(n, k) {
	if (Number.isNaN(n) || Number.isNaN(k)) return NaN;
	if (k < 0 || k > n) return 0;
	if (k === 0 || k === n) return 1;
	if (k === 1 || k === n - 1) return n;
	if (n - k < k) k = n - k;

	let res = n;
	for (let i = 2; i <= k; i++) res *= (n - i + 1) / i;
	return Math.round(res)
}

function multiCurve(t, ...points) {
	let p = points.length - 1;
	return [
		points.reduce((sum, { x }, i) => sum += binomialCoefficient(p, i) * (1 - t) ** (p - i) * t ** i * x, 0),
		points.reduce((sum, { y }, i) => sum += binomialCoefficient(p, i) * (1 - t) ** (p - i) * t ** i * y, 0)
	]
}