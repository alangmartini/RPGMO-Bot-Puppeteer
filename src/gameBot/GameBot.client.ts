import BrowserClient from '../browserClient/BrowserClient.client';
import RpgMOSelectors from '../browserClient/enums/RpgMOSelectors.enum';
import dotenv from 'dotenv';
import PageHandler from './Handlers/Page.handler';
import LoginHandler from './Handlers/Login.handler';
import InjectionHandler from './Handlers/Injection.handler';

dotenv.config();

class GameBot {
  private browserClient: BrowserClient;
  private loginHandler: LoginHandler;
  private pageHandler: PageHandler;
  private injectionHandler: InjectionHandler;

  constructor(browserClient: BrowserClient) {
    this.browserClient = browserClient;
    this.pageHandler = new PageHandler(this.browserClient);
    this.loginHandler = new LoginHandler(this.browserClient, this.pageHandler);
    this.injectionHandler = new InjectionHandler(this.browserClient);
  }

  async login() {
    await this.browserClient.getPage()?.waitForSelector(RpgMOSelectors.WORLD_OPTIONS, { visible: true, timeout: 10000 });
    
    await this.loginHandler.login();
    
    await this.pageHandler.verifyIsLogged();

    await this.injectionHandler.modifyCaptchaShow();
  }
}



export default GameBot;


