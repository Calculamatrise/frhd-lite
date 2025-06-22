{
	const expectingSender = 'frhd-lite/renderer';
	addEventListener('message', onmessage);
	function onmessage({ data }) {
		if (data.sender !== expectingSender) return;
		removeEventListener('message', onmessage);
		fetch(data.workerUrl)
			.then(res => res.text())
			.then(code => {
				const blob = new Blob([code], { type: 'application/javascript' });
				const workerUrl = URL.createObjectURL(blob);
				const worker = new Worker(workerUrl);
				worker.addEventListener('message', onmessage);
				worker.postMessage({ type: 0 });
				Object.defineProperty(globalThis, 'TrackRenderer', {
					value: worker,
					writable: true
				});
				if ('GameManager' in globalThis) {
					Object.defineProperty(GameManager, 'trackRenderer', {
						value: worker,
						writable: true
					})
				}

				function onmessage({ data }) {
					if (data.type !== 1) return;
					worker.removeEventListener('message', onmessage);
					URL.revokeObjectURL(workerUrl)
				}
			})
	}
}