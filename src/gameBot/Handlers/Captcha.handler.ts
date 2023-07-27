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

// fazer apagar o texto ao escrever ok
// achar outra forma de fechar a janela ok
// dar preferencia para o pathfinding do jogo, e só então pro pathfinding do bot
// fazer um algoritimo queauto corrige o path caso a distancia atual e a distancia do próximo passo seja maior que 1
// fazer um algoritimo que descobre sozinho se o mob é do mapa 1 ou dois e qual caminho inter mapa ele deve fazer
  // provavelmente terei que utilizar a api do jogo que armazena a informação de todos os mobs.

export default class CaptchaHandler {
  private browserClient: BrowserClient;
  private eventEmitter: EventEmitter;
  private previousCaptcha: string = '';
  private captchaDir: string = '';
  private pythonScriptPath = "C:\\Users\\alanm\\OneDrive\\Documentos\\Projetos\\rpgmobot\\src\\2captcha\\main.py"

  constructor(browserClient: BrowserClient, eventEmitter: EventEmitter) {
    this.browserClient = browserClient;
    this.eventEmitter = eventEmitter;
  }

  async isCaptchaActive() {
    const isCaptchaActive = await this.browserClient.evaluateFunctionWithArgsAndReturn(() => {
      return Captcha.active;
    });

    return isCaptchaActive;
  }

  async checkForCaptcha() {
    const isCaptchaActive = await this.isCaptchaActive();

    if (isCaptchaActive) {
      this.eventEmitter.emit('pause');

      console.log("Found captcha")
      console.log("Pausing all other activities");
      await this.downloadCaptcha();
      try {
        await this.solveCaptcha();
      } catch (e) {
        console.log("deu ruim", e);
      }

      await sleep(1000);

      this.eventEmitter.emit('resume');
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
      await this.browserClient.getPage()!
        .$eval('#captcha_input', input => (input as any).value = '');
      await this.browserClient.getPage()!.type('#captcha_input', captchaResult);

  
      console.log("trying to submit")
      await this.browserClient.getPage()!.click("#captcha_holder > span:nth-child(5)");

      await sleep(1000);

      await this.browserClient.getPage()!.click("#captcha_bonus_assign_form > button");

      await sleep(1000);

      await this.browserClient.sendKeyPress(ArrowKeys.Escape);
    } catch (e) {
      console.log("deu ruim", e)
    }
  }

  async getCaptchaResult() {
    try {
      console.log("trying to exec python script")
      console.log('this.pythonScriptPath is:', this.pythonScriptPath);
      console.log('this.captchaDir is:', this.captchaDir);

      const { stdout, stderr } = await exec(`python ${this.pythonScriptPath} ${this.captchaDir}`);

      console.log('stdout is:', stdout);
      console.log('stderr:', stderr);

      return stdout.trim();
    } catch (e){
      console.log("something went wrong", e)
    }
  }
}