import { EventEmitter } from 'events';
import BrowserClient from '../../browserClient/BrowserClient.client';
import fs from 'fs';
import path from 'path';
import { exec as execCB } from 'child_process';
import { promisify } from 'util';
import sleep from '../../utils/sleep';
import ArrowKeys from '../enums/ArrowKeys.enum';

const exec = promisify(execCB);
const Captcha = {
  active: undefined,
}

export default class CaptchaHandler {
  private browserClient: BrowserClient;
  private eventEmitter: EventEmitter;
  private previousCaptcha: string = '';
  private captchaDir: string = '';
  private pythonScriptPath = "C:\\Users\\alanm\\OneDrive\\Documentos\\Projetos\\rpgmobot\\src\\2captcha\\main.py"

  constructor(browserClient: BrowserClient, eventEmitter: EventEmitter, pause: boolean, resume: boolean) {
    this.browserClient = browserClient;
    this.eventEmitter = eventEmitter;
  }

  async checkForCaptcha() {
    const isCaptchaActive = await this.browserClient.evaluateFunctionWithArgsAndReturn(() => {
      return Captcha.active;
    });

    if (isCaptchaActive) {
      console.log("Found captcha")
      console.log("Pausing all other activities");
      // this.eventEmitter.emit('pause');
      await this.downloadCaptcha();
      await this.solveCaptcha();

      sleep(3000);

      this.browserClient.sendKeyPress(ArrowKeys.Escape);
      return;
    }

    console.log("No captcha found")
  }

  async downloadCaptcha() {    
    console.log("Getting captcha url");

    const imgSrc = await this.browserClient.evaluateFunctionWithArgsAndReturn(() => {
      return (document.querySelector('#captcha_img_div') as any).style.backgroundImage;
    });
    
    this.previousCaptcha = imgSrc;

    console.log("Processing");
    const base64Data = imgSrc.replace(/^url\("data:image\/jpeg;base64,/, "").replace(/"\)$/, "");
    const captchaDir = path.join(__dirname, '..', '..', '..', 'captchas');
    
    if (!fs.existsSync(captchaDir)) {
      fs.mkdirSync(captchaDir, { recursive: true });
    }
    
    const files = fs.readdirSync(captchaDir);
    const numFiles = files.length;
    
    const fileName = `captcha${numFiles + 1}.jpeg`;
    this.captchaDir = path.join(captchaDir, fileName);

    console.log("Downloading captcha")
    // Decode base64 data and create an image file from it
    fs.writeFile(this.captchaDir, base64Data, 'base64', function(err) {
      console.log("err is", err);
    });

    console.log("Finished download captcha");
  }

  async solveCaptcha() {
    const captchaResult = await this.getCaptchaResult() as any;
    console.log('captchaResult is:', captchaResult);
    
    try {
      console.log("trying to type in captcha")
      await this.browserClient.typeInPage('#captcha_input', captchaResult);

      console.log("waiting for submit button")
      // Wait for the submit button to appear
      await this.browserClient.getPage()!.waitForSelector('[onclick="Captcha.submit();"]');

      console.log("trying to submit")
      // Click the submit button
      await this.browserClient.getPage()!.click('#captcha_submit');
      await this.browserClient.getPage()!.click('[onclick="Captcha.submit();"]');
    } catch (e) {
      console.log("deu ruim", e)
    }
  }

  async getCaptchaResult() {
    try {
      console.log("trying to exec python script")
      const { stdout, stderr } = await exec(`python ${this.pythonScriptPath} ${this.captchaDir}`);

      console.log('stdout is:', stdout);
      console.log('stderr:', stderr);

      return stdout.trim();
    } catch {}
  }
}