import AjaxHelper from "../../utils/AjaxHelper.js";

const nav = document.body.querySelector('nav');
export const dashboard = document.createElement("label");
dashboard.classList.add('tab', 'ripple');
dashboard.innerText = 'Dashboard';
dashboard.setAttribute('for', 'dashboard');
dashboard.addEventListener('click', function (event) {
	event.target.classList.remove("notification");
	if (event.shiftKey) {
		chrome.tabs.create({
			url: chrome.runtime.getURL('/dashboard/index.html')
		});
	}
});

nav.prepend(dashboard);

const dropdown = document.querySelector('.dropdown > main');
const maau = document.querySelector('#moderation-actions-against-users');
const search = document.querySelector('#query');
search.addEventListener('change', function () {
	chrome.storage.proxy.session.set('userCache', chrome.storage.proxy.session.get('userCache') ?? {});
	dropdown.replaceChildren();
	// Check if the user exists
	maau.style.setProperty('display', this.value.length > 2 ? 'block' : 'none');
});
search.addEventListener('input', async function () {
	maau.style.setProperty('display', 'none');
	dropdown.replaceChildren(...await AjaxHelper.userSearch(this.value, user => {
		this.value = user.d_name;
		this.dispatchEvent(new Event('change'));
	}));
});

const banUser = document.querySelector('#ban-user');
banUser.addEventListener('click', async function () {
	if (search.value.length < 1) {
		return alert("Specifiy a user for whom you wish to perform this action in the box above!");
	} else if (!confirm(`Are you sure you want to ban ${search.value}?`)) {
		return alert("Operation cancelled.");
	}

	this.classList.add('loading');
	await AjaxHelper.post("/moderator/ban_user", {
		u_id: chrome.storage.proxy.session.userCache.get(search.value.toLowerCase())
	}).catch(err => null);
	this.classList.remove('loading');
});

const unBanUser = document.querySelector('#unban-user');
unBanUser.addEventListener('click', async function () {
	if (search.value.length < 1) {
		return alert("Specifiy a user for whom you wish to perform this action in the box above!");
	}

	this.classList.add('loading');
	await AjaxHelper.post("/moderator/unban_user", {
		u_id: chrome.storage.proxy.session.userCache.get(search.value.toLowerCase())
	}).catch(err => null);
	this.classList.remove('loading');
});

const changeUsername = document.querySelector('#change-username');
changeUsername.addEventListener('click', async function () {
	if (search.value.length < 1) {
		return alert("Specifiy a user for whom you wish to perform this action in the box above!");
	}

	const newValue = prompt("Enter the new username", search.value);
	if (newValue === null) {
		return alert("Operation cancelled.");
	} else if (newValue === search.value) {
		return alert("No changes made.");
	} else if (!confirm(`Are you sure you want to change ${search.value}'s username to ${newValue}?`)) {
		return this.dispatchEvent(new MouseEvent('click'));
	}

	this.classList.add('loading');
	await AjaxHelper.post("/moderator/change_email", {
		u_id: chrome.storage.proxy.session.userCache.get(search.value.toLowerCase()),
		email: newValue
	}).catch(err => null);
	this.classList.remove('loading');
});

const changeEmail = document.querySelector('#change-email');
changeEmail.addEventListener('click', async function () {
	if (search.value.length < 1) {
		return alert("Specifiy a user for whom you wish to perform this action in the box above!");
	}

	const newValue = prompt("Enter the new email for " + search.value);
	if (newValue === null) {
		return alert("Operation cancelled.");
	} else if (newValue === search.value) {
		return alert("No changes made.");
	} else if (!/^[\w\.-]*@\w+(\.\w+)+$/.test(newValue) && !confirm(`The following email address may be invalid: ${newValue}. Would you like to continue?`)) {
		return this.dispatchEvent(new MouseEvent('click'));
	}

	this.classList.add('loading');
	await AjaxHelper.post("/moderator/change_username", {
		u_id: chrome.storage.proxy.session.userCache.get(search.value.toLowerCase()),
		username: newValue
	}).catch(err => null);
	this.classList.remove('loading');
});

const toggleOA = document.querySelector('#toggle-official-author');
toggleOA.addEventListener('click', async function () {
	if (search.value.length < 1) {
		return alert("Specifiy a user for whom you wish to perform this action in the box above!");
	}

	this.classList.add('loading');
	await AjaxHelper.post("/moderator/toggle_official_author/" + chrome.storage.proxy.session.userCache.get(search.value.toLowerCase())).catch(err => null);
	this.classList.remove('loading');
});