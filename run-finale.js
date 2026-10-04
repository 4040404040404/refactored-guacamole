/**
 * Playwright Script to Execute the `finale()` Automation Workflow on a Single Site
 * + Processes one site at a time
 * + Detects stopping point and reports next site URL
 * + Out-of-context `#accept-btn` clicker
 *
 * Setup:
 *   npm init -y
 *   npm install playwright
 *   npx playwright install chromium
 *
 * Run:
 *   node run-finale.js https://zealous-river-220556.puter.site
 */

const { chromium } = require('playwright');

// Site chain mapping - each site knows the next one
const SITE_CHAIN_MAP = {
  'zealous-river-220556.puter.site': 'https://colorful-tv-258268.puter.site',
  'colorful-tv-258268.puter.site': 'https://jolly-road-702644.puter.site',
  'jolly-road-702644.puter.site': 'https://avid-mountain-909877.puter.site',
  'avid-mountain-909877.puter.site': 'https://smart-mountain-937000.puter.site',
  'smart-mountain-937000.puter.site': 'https://relaxed-crab-648834.puter.site',
  'relaxed-crab-648834.puter.site': 'https://victorious-square-662213.puter.site',
  'victorious-square-662213.puter.site': 'https://honest-bee-81788.puter.site',
  'honest-bee-81788.puter.site': 'https://kind-street-188208.puter.site',
  'kind-street-188208.puter.site': null, // Final site - no next
};

// Starting URL (pass any URL via CLI argument or TARGET_URL env var)
const TARGET_URL =
  process.argv[2] ||
  process.env.TARGET_URL ||
  'https://zealous-river-220556.puter.site';

console.log(`[Init] Processing: ${TARGET_URL}`);

let browser = null;
let stoppingPointReached = false;

const BROWSER_SCRIPT = () => {
  // ============================================================================
  // 1. OUT OF CONTEXT:
  //    - Stop execution when reaching a stopping point
  //    - Click document.querySelector("#accept-btn") independently
  // ============================================================================
  function stopAllTimersAndExecution() {
    const highestId = window.setTimeout(() => {}, 0);
    for (let i = 0; i <= highestId; i++) {
      window.clearTimeout(i);
      window.clearInterval(i);
    }
    window.stop();
  }

  // Check if current site is a stopping point (any site in the chain)
  const stoppingPoints = [
    'zealous-river-220556.puter.site',
    'colorful-tv-258268.puter.site',
    'jolly-road-702644.puter.site',
    'avid-mountain-909877.puter.site',
    'smart-mountain-937000.puter.site',
    'relaxed-crab-648834.puter.site',
    'victorious-square-662213.puter.site',
    'honest-bee-81788.puter.site',
    'kind-street-188208.puter.site',
  ];

  let isStoppingPoint = false;
  for (let point of stoppingPoints) {
    if (
      window.location.hostname === point ||
      window.location.href.includes(point)
    ) {
      isStoppingPoint = true;
      break;
    }
  }

  if (isStoppingPoint) {
    stopAllTimersAndExecution();
    return;
  }

  // Click #accept-btn out of context (immediately + periodic check)
  if (document.querySelector('#accept-btn')) {
    document.querySelector('#accept-btn').click();
  }

  setInterval(() => {
    let isCurrentStoppingPoint = false;
    for (let point of stoppingPoints) {
      if (
        window.location.hostname === point ||
        window.location.href.includes(point)
      ) {
        isCurrentStoppingPoint = true;
        break;
      }
    }

    if (isCurrentStoppingPoint) {
      stopAllTimersAndExecution();
      return;
    }

    if (document.querySelector('#accept-btn')) {
      document.querySelector('#accept-btn').click();
    }
  }, 2000);

  // ============================================================================
  // 2. ORIGINAL finale() SCRIPT
  // ============================================================================
  function finale() {
    (function () {
      const logContainer = document.createElement('div');
      logContainer.id = 'console-log-overlay';
      logContainer.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        width: 450px;
        height: 350px;
        background: rgba(20, 20, 20, 0.95);
        border: 2px solid #00ff00;
        border-radius: 8px;
        padding: 12px;
        font-family: 'Courier New', monospace;
        font-size: 12px;
        color: #00ff00;
        overflow-y: auto;
        z-index: 99999;
        box-shadow: 0 0 20px rgba(0, 255, 0, 0.5);
      `;

      const header = document.createElement('div');
      header.style.cssText = `
        font-weight: bold;
        margin-bottom: 10px;
        border-bottom: 1px solid #00ff00;
        padding-bottom: 5px;
        color: #00ff00;
      `;
      header.textContent = '📡 Console Logs & Coordinate Click';
      logContainer.appendChild(header);

      const logsDiv = document.createElement('div');
      logsDiv.id = 'console-logs-content';
      logsDiv.style.cssText = `
        max-height: 300px;
        overflow-y: auto;
      `;
      logContainer.appendChild(logsDiv);

      document.body.appendChild(logContainer);

      const originalLog = console.log;
      const originalError = console.error;
      const originalWarn = console.warn;
      const originalInfo = console.info;

      function addLogToDisplay(message, type = 'log') {
        const logEntry = document.createElement('div');
        const timestamp = new Date().toLocaleTimeString();
        const colors = {
          log: '#00ff00',
          error: '#ff0000',
          warn: '#ffaa00',
          info: '#00aaff',
        };

        logEntry.style.cssText = `
          color: ${colors[type]};
          margin-bottom: 4px;
          word-wrap: break-word;
          white-space: pre-wrap;
          padding: 2px 0;
          border-left: 2px solid ${colors[type]};
          padding-left: 6px;
        `;
        logEntry.textContent = `[${timestamp}] ${type.toUpperCase()}: ${message}`;
        logsDiv.appendChild(logEntry);
        logsDiv.scrollTop = logsDiv.scrollHeight;
      }

      console.log = function (...args) {
        originalLog.apply(console, args);
        addLogToDisplay(args.map((arg) =>
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' '), 'log');
      };

      console.error = function (...args) {
        originalError.apply(console, args);
        addLogToDisplay(args.map((arg) =>
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' '), 'error');
      };

      console.warn = function (...args) {
        originalWarn.apply(console, args);
        addLogToDisplay(args.map((arg) =>
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' '), 'warn');
      };

      console.info = function (...args) {
        originalInfo.apply(console, args);
        addLogToDisplay(args.map((arg) =>
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' '), 'info');
      };

      const selectors = [
        'button[aria-label="CONFIRM"]',
        'button.css-1nnj36',
        '[aria-label="CONFIRM"]',
      ];

      function clickByCoordinates(attempt = 1) {
        console.log(`🔄 Click attempt #${attempt}`);
        let element = null;
        let foundBy = '';

        for (let selector of selectors) {
          element = document.querySelector(selector);
          if (element) {
            foundBy = selector;
            break;
          }
        }

        if (!element) {
          console.error(`❌ Element not found`);
          return false;
        }

        console.log(`✓ Found: "${foundBy}"`);
        const rect = element.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;

        console.log(`🎯 Click: X=${Math.round(x)}, Y=${Math.round(y)}`);

        const event = new MouseEvent('mousemove', {
          bubbles: true,
          cancelable: true,
          view: window,
          clientX: x,
          clientY: y,
        });
        document.elementFromPoint(x, y)?.dispatchEvent(event);

        try {
          element.click();
          console.log(`✅ Clicked`);
          return true;
        } catch (e) {
          console.error(`Error: ${e.message}`);
          return false;
        }
      }

      setTimeout(() => { clickByCoordinates(1); }, 500);
      setTimeout(() => { clickByCoordinates(2); }, 1500);
      setTimeout(() => { clickByCoordinates(3); }, 3500);
    })();

    function initLinkvertise(id) {
      try {
        if (window.LinkvertiseLoader) {
          window.LinkvertiseLoader.Load(id);
          console.log(`Linkvertise initialized with ID: ${id}`);
        }
      } catch (e) {
        console.error(`Error: ${e.message}`);
      }
    }

    function getLinkvertiseId() {
      const scriptTag = document.querySelector('script[data-linkvertise-id]');
      if (scriptTag) {
        return scriptTag.getAttribute('data-linkvertise-id');
      }
      const scripts = Array.from(document.querySelectorAll('script'));
      for (let script of scripts) {
        if (script.textContent.includes('LinkvertiseLoader')) {
          const match = script.textContent.match(/(\d+)/);
          if (match) return match[1];
        }
      }
      return null;
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        const linkvertiseId = getLinkvertiseId();
        if (linkvertiseId) initLinkvertise(linkvertiseId);
      });
    } else {
      const linkvertiseId = getLinkvertiseId();
      if (linkvertiseId) initLinkvertise(linkvertiseId);
    }

    function link() {
      if (document.querySelector('body > a')) {
        document.querySelector('body > a').click();
      }
    }

    setTimeout(() => { next(); }, 2000);
    setTimeout(() => { link(); }, 4000);

    setTimeout(() => {
      if (document.querySelector('body > lv-root > div.layout.ng-star-inserted > div.main-container > div.content-wrapper > lv-link-detail-page > lv-main-content-layout > div > div.content > div > lv-link-content > div > div:nth-child(2) > lv-fullsize-result-component > lv-lib-card > div > div > div > div.lv-card__footer > div.--button-container > div.button-desktop > a > lv-lib-button > button')) {
        document.querySelector('body > lv-root > div.layout.ng-star-inserted > div.main-container > div.content-wrapper > lv-link-detail-page > lv-main-content-layout > div > div.content > div > lv-link-content > div > div:nth-child(2) > lv-fullsize-result-component > lv-lib-card > div > div > div > div.lv-card__footer > div.--button-container > div.button-desktop > a > lv-lib-button > button').click();
      }
    }, 20000);

    setTimeout(() => {
      if (document.querySelector('body > lv-root > div.layout.ng-star-inserted > div.main-container > div.content-wrapper > lv-access-page > lv-main-content-layout > div > div.content > div > lv-task-wait > lv-membership-selection-card > lv-lib-card > div > div > div > div.membership-plan-selection__plans > lv-membership-plan-option:nth-child(5) > div > div')) {
        document.querySelector('body > lv-root > div.layout.ng-star-inserted > div.main-container > div.content-wrapper > lv-access-page > lv-main-content-layout > div > div.content > div > lv-task-wait > lv-membership-selection-card > lv-lib-card > div > div > div > div.membership-plan-selection__plans > lv-membership-plan-option:nth-child(5) > div > div').click();
      }
    }, 30000);

    setTimeout(() => {
      if (document.querySelector('body > lv-root > div.layout.ng-star-inserted > div.main-container > div.content-wrapper > lv-access-page > lv-main-content-layout > div > div.content > div > lv-task-wait > lv-membership-selection-card > lv-lib-card > div > div > div > div.membership-plan-selection__button.membership-plan-selection__button--access.ng-star-inserted > lv-lib-button > button')) {
        document.querySelector('body > lv-root > div.layout.ng-star-inserted > div.main-container > div.content-wrapper > lv-access-page > lv-main-content-layout > div > div.content > div > lv-task-wait > lv-membership-selection-card > lv-lib-card > div > div > div > div.membership-plan-selection__button.membership-plan-selection__button--access.ng-star-inserted > lv-lib-button > button').click();
      }
    }, 40000);

    function skip() {
      if (document.querySelector('body > lv-root > div.layout.ng-star-inserted > div.main-container > div.content-wrapper > lv-access-page > lv-main-content-layout > div > div.content > div > lv-task-ad-experiment > lv-task-ad-stepper-line > lv-ad-step-nonskip > lv-fullsize-result-component > lv-lib-card > div > div > div > div.lv-card__body > lv-lib-carousel > div > div.skip-button.ng-star-inserted > lv-lib-chip > div')) {
        document.querySelector('body > lv-root > div.layout.ng-star-inserted > div.main-container > div.content-wrapper > lv-access-page > lv-main-content-layout > div > div.content > div > lv-task-ad-experiment > lv-task-ad-stepper-line > lv-ad-step-nonskip > lv-fullsize-result-component > lv-lib-card > div > div > div > div.lv-card__body > lv-lib-carousel > div > div.skip-button.ng-star-inserted > lv-lib-chip > div').click();
      }
    }

    setTimeout(() => { skip(); }, 70000);
    setTimeout(() => { skip(); }, 100000);
    setTimeout(() => { skip(); }, 130000);

    setTimeout(() => {
      (function () {
        const originalOpen = window.open;
        window.open = function (url, target, features) {
          if (url) {
            window.location.href = url;
            return null;
          }
          return originalOpen.apply(window, arguments);
        };

        const originalAnchorClick = HTMLAnchorElement.prototype.click;
        HTMLAnchorElement.prototype.click = function () {
          if (this.target === '_blank' && this.href) {
            window.location.href = this.href;
            return;
          }
          return originalAnchorClick.call(this);
        };

        const btn = document.querySelector('body > lv-root > div.layout.ng-star-inserted > div.main-container > div.content-wrapper > lv-success-page > lv-main-content-layout > div > div.content > div > lv-success-variant-a > div > lv-lib-card:nth-child(2) > div > div > div > div > lv-lib-button > button');

        if (!btn) {
          console.log('Button not found');
          return;
        }

        btn.click();

        setTimeout(() => {
          window.open = originalOpen;
          HTMLAnchorElement.prototype.click = originalAnchorClick;
        }, 1500);
      })();
    }, 150000);
  }

  setTimeout(() => {
    finale();
    setInterval(() => {
      finale();
    }, 200000);
  }, 20000);
};

function attachPageHandlers(targetPage, browser) {
  const checkUrlAndAccept = async () => {
    if (targetPage.isClosed()) return;

    const currentUrl = targetPage.url();
    const hostname = new URL(currentUrl).hostname;

    // Check if we've reached the stopping point for this site
    const stoppingPoints = Object.keys(SITE_CHAIN_MAP);
    if (stoppingPoints.includes(hostname)) {
      if (!stoppingPointReached) {
        stoppingPointReached = true;
        console.log(`[Playwright] ✅ Job complete for: ${hostname}`);
        
        const nextSiteUrl = SITE_CHAIN_MAP[hostname];
        if (nextSiteUrl) {
          console.log(`[Playwright] 📋 Next job will process: ${nextSiteUrl}`);
          console.log(`NEXT_SITE=${nextSiteUrl}`);
        } else {
          console.log(`[Playwright] 🎉 Chain complete!`);
          console.log(`CHAIN_FINISHED=true`);
        }

        await new Promise((resolve) => setTimeout(resolve, 2000));
        await browser.close().catch(() => {});
        process.exit(0);
      }
    }

    await targetPage
      .evaluate(() => {
        if (document.querySelector('#accept-btn')) {
          document.querySelector('#accept-btn').click();
        }
      })
      .catch(() => {});
  };

  targetPage.on('framenavigated', async (frame) => {
    if (frame === targetPage.mainFrame()) {
      await checkUrlAndAccept();
    }
  });

  targetPage.on('domcontentloaded', checkUrlAndAccept);
  targetPage.on('load', checkUrlAndAccept);

  targetPage.on('console', (msg) => {
    console.log(`[Browser ${msg.type().toUpperCase()}] ${msg.text()}`);
  });
}

(async () => {
  try {
    browser = await chromium.launch({
      headless: false,
      args: ['--disable-Popup-Blocking', '--no-sandbox', '--disable-setuid-sandbox'],
    });

    browser.on('disconnected', () => {
      console.log('[Playwright] Browser disconnected.');
      process.exit(0);
    });

    const context = await browser.newContext({
      viewport: { width: 1366, height: 768 },
    });

    await context.addInitScript(BROWSER_SCRIPT);

    context.on('page', (newPage) => {
      attachPageHandlers(newPage, browser);
    });

    const page = await context.newPage();
    attachPageHandlers(page, browser);

    console.log(`[Playwright] Navigating to: ${TARGET_URL}`);
    await page.goto(TARGET_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  } catch (err) {
    console.error('[Playwright] Fatal error:', err);
    process.exit(1);
  }
})();
