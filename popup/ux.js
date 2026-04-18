{

const rippleCache = new WeakMap();
document.documentElement.addEventListener('pointerdown', function (event) {
	event.target.style.setProperty('--offsetX', event.offsetX);
	event.target.style.setProperty('--offsetY', event.offsetY);
	rippleCache.has(event.target) && clearTimeout(rippleCache.get(event.target));
	const timeout = setTimeout(() => {
		event.target.style.removeProperty('--offsetX', event.offsetX);
		event.target.style.removeProperty('--offsetY', event.offsetY);
		event.target.style.length === 0 && event.target.removeAttribute('style');
		rippleCache.delete(event.target)
	}, 1e3);
	rippleCache.set(event.target, timeout)
})

}