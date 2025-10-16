const logDivEl = document.getElementById('log');
const startButtonEl = document.getElementById('start');
const stopButtonEl = document.getElementById('stop');
const urlInputEl = document.getElementById('url');
urlInputEl.focus();
const intervalInputEl = document.getElementById('interval');

function logger(text) {
    const textDivEl = document.createElement('div');
    textDivEl.textContent = text;
    logDivEl.appendChild(textDivEl);
    logDivEl.scrollTop = logDivEl.scrollHeight;
}

startButtonEl.onclick = function () {
    logDivEl.innerHTML = '';
    try {
        const url = new URL(urlInputEl.value);
        if (url.protocol !== 'http:' && url.protocol !== 'https:') {
            logger(`~[System] invalid protocol`);
            return;
        }
    } catch {
        logger(`~[System] invalid url`);
        return;
    }
    const interval = new Number(intervalInputEl.value);
    if (interval <= 2 || interval >= 3600) {
        logger(`~[System] invalid interval`);
        return;
    }
    window.manager.start(urlInputEl.value, interval);
    logger(`~[System] start bot in ${url.hostname} with ${interval}s`);
}

stopButtonEl.onclick = function () {
    logDivEl.innerHTML = '';
    const url = new URL(urlInputEl.value);
    window.manager.stop();
    logger(`~[System] stop bot in ${url.hostname}`);
}

window.manager.onMessage(function (value) {
    logger(value);
});