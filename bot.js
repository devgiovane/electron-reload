const pupperteer = require('puppeteer');

const url = process.argv.at(2);
const interval = Number(process.argv.at(3)) * 1000;

(async () => {
    let intervalId = null;

    const browser = await pupperteer.launch({ 
        headless: false,
        defaultViewport: null,
        args: ['--start-maximized', '--no-sandbox']
    });

    try {
        const [ page ] = await browser.pages();
        await page.goto(url);
        page.on('dialog', async dialog => {
            console.log('~[Page] Dialog detected:', dialog.message());
            await dialog.accept();
        });
        console.log(`~[Page] Loaded with success`);
        console.log(`~[Page] You have 60 seconds to login`);
        setTimeout(() => {
            intervalId = setInterval(async () => {
                try {
                    await page.reload();
                    console.log(`~[Page] Reload page in ${new Date().toLocaleTimeString()}`);
                } catch (error) {
                    console.error(`~[Page] Error in reloading `, error.message);
                }
            }, interval);
        }, 60 * 1000);
    } catch {
        console.error(`~[Page] Internal error `, error.message);
        await cleanup();
    }

    async function cleanup() {
        console.log('~[Page] cleanup  process');
        if (intervalId) clearInterval(intervalId);
        if (browser) await browser.close();
        process.exit(0);
    }

    process.on('SIGTERM', cleanup);
    process.on('SIGINT', cleanup); 
    process.on('exit', cleanup);
})();

