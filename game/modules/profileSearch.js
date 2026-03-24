FreeRiderLite.modules.set('profileSearch', async function() {
	if (!location.pathname.match(/^\/u\//i)) return;
	const container = await this.constructor.waitForElm('.tab_buttons');
	if (!container) return;
	const modContainer = container.querySelector('.mod-container') || container.appendChild(this.constructor.createElement('div.mod-container'));
	const details = modContainer.appendChild(this.constructor.createElement('details.sort-filter', {
		children: [
			this.constructor.createElement('summary.new-button.button-type-1', {
				innerText: 'Sort & Filter'
			}),
			this.constructor.createElement('main', {
				children: [
					this.constructor.createElement('search', {
						children: [
							this.constructor.createElement('input', {
								type: 'search',
								name: 'query',
								placeholder: 'Search',
								oninput: () => updateTracks(details)
							})
						]
					}),
					this.constructor.createElement('div.opts', {
						children: [
							this.constructor.createElement('label', {
								children: [
									this.constructor.createElement('input', {
										disabled: true,
										type: 'checkbox',
										name: 'completed',
										onchange: () => updateTracks(details)
									})
								],
								innerText: 'Hide completed',
								style: { opacity: .5 }
							}),
							this.constructor.createElement('label', {
								children: [
									this.constructor.createElement('select', {
										children: [
											this.constructor.createElement('option', {
												checked: true,
												innerText: 'Select an author…',
												value: 'default'
											}),
											...Array.from(new Set(Array.from(document.querySelectorAll('.panels .author')).map(n => n.textContent.trim())))
												.sort()
												.map(author =>
													this.constructor.createElement('option', {
														innerText: author,
														value: author
													})
												)
										],
										name: 'author',
										onchange: () => updateTracks(details)
									})
								],
								innerText: 'Filter by author',
								multiple: true
							}),
							this.constructor.createElement('label', {
								children: [
									this.constructor.createElement('input', {
										type: 'checkbox',
										name: 'titles',
										onchange: () => updateTracks(details)
									})
								],
								innerText: 'Only search titles'
							}),
							this.constructor.createElement('label', {
								children: [
									this.constructor.createElement('select', {
										children: [
											this.constructor.createElement('option', {
												innerText: 'Sort by…',
												value: 'default'
											}),
											this.constructor.createElement('option', {
												innerText: 'Alphabet',
												value: 'alpha'
											}),
											this.constructor.createElement('option', {
												disabled: true,
												innerText: 'Date',
												value: 'date'
											}),
											this.constructor.createElement('option', {
												disabled: true,
												innerText: 'Rating',
												value: 'rating'
											}),
											this.constructor.createElement('option', {
												disabled: true,
												innerText: 'Size',
												value: 'size'
											}),
											this.constructor.createElement('option', {
												innerText: 'Time',
												value: 'time'
											})
										],
										name: 'sort',
										onchange() {
											const label = this.closest('label')
												, nextLabel = label.nextElementSibling
												, checkbox = nextLabel.querySelector('input');
											checkbox.disabled = this.value === 'default';
											updateTracks(details)
										}
									})
								],
								innerText: 'Sort by'
							}),
							this.constructor.createElement('label', {
								children: [
									this.constructor.createElement('input', {
										type: 'checkbox',
										name: 'reverse',
										disabled: true,
										onchange: () => updateTracks(details)
									})
								],
								innerText: 'Sort descending'
							})
						]
					}),
					this.constructor.createElement('button.new-button.button-type-1.danger', {
						disabled: true,
						innerText: 'Clear',
						onclick() {
							this.disabled = true;
							for (const input of details.querySelectorAll('input[type="checkbox"], select')) {
								if (input instanceof HTMLInputElement) {
									switch (input.type) {
									case 'checkbox':
										input.checked = false
									}
								} else if (input instanceof HTMLSelectElement) {
									input.value = 'default';
									input.dispatchEvent(new Event('change'))
								}
							}
						}
					})
				]
			})
		]
	}))
});

function updateTracks(details) {
	const inputs = Array.from(details.querySelectorAll('input, select'));
	const clearFilters = details.querySelector('button:last-child');
	clearFilters.disabled = !inputs.filter(i => !i.disabled).some(input => input.checked ?? input.value !== 'default');

	const search = new Map(inputs.map(input => [input.name, ((input.type === 'checkbox' || input.type === 'radio') ? input.checked : null) ?? input.value ?? input.innerText]));

	const activePanel = document.querySelector('.tab-panel.active ul')
		, tracks = Array.from(activePanel.children)
		.filter(n => n.querySelector('.trackTile'));
	for (const node of tracks)
		node.style.removeProperty('display');

	let filtered = Array.from(tracks);

	const author = search.get('author')?.toLowerCase();
	if (author !== 'default') {
		filtered = filtered.filter(n => author === n.querySelector('.author').textContent.trim().toLowerCase());
	}

	const query = search.get('query');
	if (query?.length > 0) {
		const onlySearchTitles = search.get('titles');
		const lowerQuery = query.toLowerCase();
		filtered = filtered.filter(n => {
			const title = n.querySelector('.name').textContent.toLowerCase()
				, author = n.querySelector('.author').textContent.toLowerCase();
			return !onlySearchTitles && author.includes(lowerQuery) || title.includes(lowerQuery)
		});
	}

	const sort = search.get('sort');
	if (sort !== 'default') {
		switch (sort) {
		case 'alpha':
			filtered.sort((a, b) => {
				const titleA = a.querySelector('.name')
					, titleB = b.querySelector('.name');
				const diff = titleA.textContent.localeCompare(titleB.textContent);
				return diff
			});
			break;
		case 'time':
			filtered.sort((a, b) => {
				const timeA = a.querySelector('.bestTime')
					, timeB = b.querySelector('.bestTime');
				const diff = timeA.textContent.localeCompare(timeB.textContent);
				return diff
			});
		}
	}

	const reverse = search.get('reverse');
	reverse && (filtered = filtered.reverse());

	for (const node of tracks.filter(node => !filtered.includes(node))) {
		node.style.setProperty('display', 'none');
		filtered.push(node);
	}

	activePanel.replaceChildren(...filtered)
}

FreeRiderLite.styleSheet
	.set('.tab_buttons', { position: 'relative' })
	.set('.tab_buttons > .mod-container', {
		bottom: 0,
		display: 'flex',
		gap: '.35em',
		justifyContent: 'flex-end',
		padding: '.5em',
		pointerEvents: 'none',
		position: 'absolute',
		right: 0,
		top: 0,
		width: '100%',
		zIndex: 5
	})
	.set('.tab_buttons > .mod-container > *', { pointerEvents: 'all' })
	.set('.tab_buttons > .mod-container .sort-filter', {
		// backgroundColor: 'var(--bg-clr, white)',
		display: 'flex',
		flexDirection: 'column',
		minWidth: '250px',
		pointerEvents: 'none'
	})
	.set('.tab_buttons:has(.friends-tab.active) .sort-filter', { display: 'none' })
	// .set('.tab_buttons:not(:hover) .sort-filter:not(:hover)', { display: 'none' })
	.set('.tab_buttons .sort-filter input', { height: 'fit-content' })
	.set('.tab_buttons .sort-filter > summary', {
		'-webkit-user-select': 'none',
		fontSize: '.85em',
		height: '2.25em',
		lineHeight: '2.25em',
		marginLeft: 'auto',
		padding: '0 1em',
		pointerEvents: 'all',
		userSelect: 'none'
	})
	.set('.tab_buttons .sort-filter > main', {
		backdropFilter: 'brightness(.95) blur(.1em) contrast(2.5)',
		backgroundColor: 'var(--bg-clr, hsl(0deg 0% 50% / 15%))',
		border: '1px solid hsl(0 0% 50% / 12%)',
		borderRadius: '.75em',
		boxShadow: '0 2px .4em 0 hsl(0 0% 0% / 50%)',
		padding: '0 1em',
		pointerEvents: 'all',
		transition: 'padding 200ms ease',
		willChange: 'padding'
	})
	.set('.tab_buttons .sort-filter[open] > main', { padding: '.75em 1em' })
	.set('.tab_buttons .sort-filter > main > search > input[type="search"]', {
		marginBottom: '.85em',
		width: '100%'
	})
	.set('.tab_buttons .sort-filter > main > .opts', {
		display: 'flex',
		flexDirection: 'column',
		gap: '.35em'
	})
	.set('.tab_buttons .sort-filter > main > .opts > *', {
		'-webkit-user-select': 'none',
		alignItems: 'center',
		display: 'flex',
		gap: '.85em',
		justifyContent: 'space-between',
		userSelect: 'none'
	})
	.set('.tab_buttons .sort-filter > main > button:last-child', {
		'-webkit-user-select': 'none',
		marginTop: '.65em',
		userSelect: 'none',
		width: '100%'
	})
	.set('.tab_buttons .sort-filter > main > button:last-child:disabled', {
		opacity: .5,
		pointerEvents: 'none'
	});