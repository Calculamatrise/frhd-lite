chrome.webRequest.onBeforeRequest.addListener(({ url }) => {
    return {
		cancel: !0
	};
}, {
    urls: [
		'https://cdn.freeriderhd.com/free_rider_hd/assets/styles/combined/gui/combined.min.*.css',
		'https://cdn.freeriderhd.com/free_rider_hd/styles/application/frhd_app.min.*.css',
		'https://community.freeriderhd.com/css.php?css=xenforo,form,public&style*'
	],
    types: ['stylesheet']
}, ['blocking']);

setInterval(() => {
	console.log(1);
}, 1000);