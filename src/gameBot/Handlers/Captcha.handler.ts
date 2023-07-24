import { EventEmitter } from 'events';
import BrowserClient from '../../browserClient/BrowserClient.client';
import fs from 'fs';
import path from 'path';

const Captcha = {
  active: undefined,
}

export default class CaptchaHandler {
  private browserClient: BrowserClient;
  private eventEmitter: EventEmitter;
  private pause: boolean;  
  private resume: boolean;
  private previousCaptcha: string = '';

  constructor(browserClient: BrowserClient, eventEmitter: EventEmitter, pause: boolean, resume: boolean) {
    this.browserClient = browserClient;
    this.eventEmitter = eventEmitter;
    this.pause = pause;
    this.resume = resume;
  }

  async checkForCaptcha() {
    const isCaptchaActive = await this.browserClient.evaluateFunctionWithArgsAndReturn(() => {
      return Captcha.active;
    });

    if (isCaptchaActive && this.previousCaptcha !== isCaptchaActive) {
      console.log("Found captcha")
      this.eventEmitter.emit('pause');
      await this.downloadCaptcha();
      return;
    }

    console.log("No captcha found")
  }

  async downloadCaptcha() {
    console.log("Pausing all other activities");
    
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
    
    console.log("Downloading captcha")
    // Decode base64 data and create an image file from it
    fs.writeFile(path.join(captchaDir, fileName), base64Data, 'base64', function(err) {
      console.log(err);
    });

    console.log("Finished download captcha");
  }
}