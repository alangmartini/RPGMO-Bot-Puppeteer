import { Page } from 'puppeteer';

export default class PuppeteerConfigs {
  static makeUndetectable = async (page: Page) => {
    await page.evaluateOnNewDocument(() => {
      delete (navigator as any).__proto__.webdriver;
    });
  
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537');
  }
  
  static setViewport = async (page: Page) => {
    await page.setViewport({
      width: 1520,
      height: 620,
    });
  }
  
  static setHeaders = async (page: Page) => {
    await page.setJavaScriptEnabled(true);
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9'
    });
  }
  
  static disableWebGLAndRendererStrings = async (page: Page) => {
    await page.evaluateOnNewDocument(() => {
      const getParameter = (WebGLRenderingContext as any).getParameter;
      WebGLRenderingContext.prototype.getParameter = function(parameter) {
        // UNMASKED_VENDOR_WEBGL
        if (parameter === 37445) {
          return 'Intel Open Source Technology Center';
        }
        // UNMASKED_RENDERER_WEBGL
        if (parameter === 37446) {
          return 'Mesa DRI Intel(R) Ivybridge Mobile ';
        }
        return getParameter(parameter);
      };
    });  
  }
  
  static mockMimiPlugins = async (page: Page) => {
    await page.evaluateOnNewDocument(() => {
      (navigator as any).__defineGetter__('plugins', function(){
        // This can be modified to return a specific plugin array if needed
        return [1, 2, 3, 4, 5];
      });
      (navigator as any).__defineGetter__('mimeTypes', function(){
        // This can be modified to return a specific mimeTypes array if needed
        return [1, 2, 3, 4, 5];
      });
    });  
  }

  static applyConfigs = async (page: Page) => {
    page.browserContext().overridePermissions('https://data.mo.ee', ['geolocation', 'notifications']);
    await PuppeteerConfigs.makeUndetectable(page);
    await PuppeteerConfigs.setViewport(page);
    await PuppeteerConfigs.setHeaders(page);
    await PuppeteerConfigs.disableWebGLAndRendererStrings(page);
    await PuppeteerConfigs.mockMimiPlugins(page);
  }
}