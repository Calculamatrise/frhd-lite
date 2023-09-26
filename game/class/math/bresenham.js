export default function (t, e, i, a, h) {
	let l = []
	  , c = t
	  , u = e
	  , p = (a - e) / (i - t)
	  , d = i > t ? 1 : -1
	  , f = a > e ? 1 : -1
	  , v = 0;
	l.push(t, e),
	t % 300 == 0 && l.push(t - .5, e),
	e % 300 == 0 && l.push(t, e - .5);
	do {
		let g = Math.floor(c / h) == Math.floor(i / h)
		  , m = Math.floor(u / h) == Math.floor(a / h);
		if (g && m)
			break;
		let y = 0
		  , w = 0;
		y = Math.round(Math.floor(c / h + d) * h),
		0 > d && (y = Math.round(Math.ceil((c + 1) / h + d) * h) - 1),
		w = Math.round(e + (y - t) * p);
		let x = 0
		  , _ = 0;
		_ = Math.round(Math.floor(u / h + f) * h),
		0 > f && (_ = Math.round(Math.ceil((u + 1) / h + f) * h) - 1),
		x = Math.round(t + (_ - e) / p),
		Math.pow(y - t, 2) + Math.pow(w - e, 2) < Math.pow(x - t, 2) + Math.pow(_ - e, 2) ? (c = y,
		u = w,
		l.push(y, w),
		y % 300 == 0 && l.push(y - 1, w),
		w % 300 == 0 && l.push(y, w - 1)) : (c = x,
		u = _,
		l.push(x, _),
		x % 300 == 0 && l.push(x - .5, _),
		_ % 300 == 0 && l.push(x, _ - .5))
	} while (v++ < 5e3);
	return l;
}