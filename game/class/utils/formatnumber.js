export default function(t) {
	t = parseInt(t, 10);
	let e = t % 6e4 / 1e3;
	return Math.floor(t / 6e4) + ":" + e.toFixed(2).padStart(5, 0)
}