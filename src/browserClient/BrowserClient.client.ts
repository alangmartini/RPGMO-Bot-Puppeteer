import * as puppeteer from 'puppeteer';
import PuppeteerConfigs from './configs/PuppeteerConfigs.handler';
import ArrowKeys from '../gameBot/enums/ArrowKeys.enum';

export default class BrowserClient implements IBrowserClient{
  private browser: puppeteer.Browser | null;
  private page: puppeteer.Page | null;

  constructor() {
    this.browser = null;
    this.page = null;
  }

  async init() {
    this.browser = await puppeteer.launch({
      headless: false,
      args: ['--enable-webgl', '--enable-features=WebRTC',  "--disable-notifications"]
    });
    this.page = await this.browser.newPage();
  }

  async config() {
    await PuppeteerConfigs.applyConfigs(this.page!);
  }

  async goto(url: string) {
    await this.page!.goto(url);
  }

  async evaluateFunction(fn: () => void): Promise<any> {
    return await this.page!.evaluate(fn);
  }

  async evaluateFunctionWithArgs(fn: (...args: any[]) => void, ...args: any[]) {
    await this.page!.evaluate(fn, ...args);
  }

  async evaluateFunctionWithArgsAndReturn(fn: (...args: any[]) => any, ...args: any[]) {
    return await this.page!.evaluate(fn, ...args);
  }

  async sendKeyPress(key: ArrowKeys) {
    this.page!.keyboard.down(key);
    setTimeout(() => this.page!.keyboard.up(key), 100);
  }

  async typeInPage(selector: string,text: string) {
    await this.page!.waitForSelector(selector);
    await this.page!.focus(selector);
    await this.page!.keyboard.type(text);
  }

  async selectOption(selector: string, value: string) {
    await this.page!.select(selector, value);
  }

  async waitTillTextContentMatches(selector: string, text: string) {
    await this.page!
      .waitForFunction(
        (connectionSelector: string, text: string) => document.querySelector(connectionSelector)!.textContent === text,
        { timeout: 10000 },
        selector, text
      );
  }

  async click(selector: string) {
    await this.page!.click(selector);
  }
  
  async close() {
    await this.browser!.close(); 
  }

  getPage(): puppeteer.Page | null {
    return this.page;
  }
}

