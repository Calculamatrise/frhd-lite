import "../../utils/Storage.js";
import AjaxHelper from "../../utils/AjaxHelper.js";

const result = document.querySelector('#result');
console.log(navigator.onLine)

const udropdown = document.querySelector('#u_name-search-results');
const u_name = document.querySelector('#u_name');
u_name.addEventListener('input', async function() {
    udropdown.replaceChildren(...await AjaxHelper.userSearch(this.value, user => {
        this.value = user.d_name;
        udropdown.replaceChildren();
    }));
});

const n_name = document.querySelector('#n_name');
const u_change = document.querySelector('#change-u_name');
u_change.addEventListener('click', function() {
    this.classList.add('loading');
    chrome.storage.session.get(async ({ userCache }) => {
        await AjaxHelper.post("/moderator/change_username", {
            u_id: chrome.storage.proxy.session.userCache.get(u_name.value.toLowerCase()),
            username: n_name.value
        }).then(async res => {
            if (res.result !== true || res.result === false) {
                throw new Error(res.msg ?? "Something went wrong! Please try again.");
            }

            chrome.storage.proxy.session.userCache.set(n_name.value.toLowerCase(), chrome.storage.proxy.session.userCache.get(u_name.value.toLowerCase()));
            userCache.delete(u_name.value.toLowerCase());
            chrome.storage.session.set({ userCache }).then(() => {
                search.value = n_name.value;
                setResult({
                    result: true,
                    message: res.msg || JSON.stringify(res, null, 4)
                });
            });
        }).catch(err => {
            setResult({
                result: false,
                message: err.message
            });
        });
        this.classList.remove('loading');
    });
});

const n_mailbox = document.querySelector('#n_mailbox');
const m_change = document.querySelector('#change-u_mailbox');
m_change.addEventListener('click', async function() {
    if (!n_mailbox.reportValidity()) {
        return;
    }

    this.classList.add('loading');
    await AjaxHelper.post("/moderator/change_email", {
        u_id: chrome.storage.proxy.session.userCache.get(u_name.value.toLowerCase()),
        email: n_mailbox.value
    }).then(res => {
        if (res.result !== true || res.result === false) {
            throw new Error(res.msg ?? "Something went wrong! Please try again.");
        }

        setResult({
            result: true,
            message: res.msg || JSON.stringify(res, null, 4)
        });
    }).catch(err => {
        setResult({
            result: false,
            message: err.message
        });
    });
    this.classList.remove('loading');
});

function setResult(options = {}) {
    result.classList[options.result ? 'add' : 'remove']('success');
    result.classList[options.result ? 'remove' : 'add']('error');
    result.innerText = String(options.message);
}