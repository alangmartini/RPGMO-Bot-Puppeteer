import BrowserClient from '../browserClient/BrowserClient.client';
import RpgMOSelectors from '../browserClient/enums/RpgMOSelectors.enum';
import dotenv from 'dotenv';
import PageHandler from './Handlers/Page.handler';
import LoginHandler from './Handlers/Login.handler';

dotenv.config();

class GameBot {
  private browserClient: BrowserClient;
  private loginHandler: LoginHandler;
  private pageHandler: PageHandler;

  constructor(browserClient: BrowserClient) {
    this.browserClient = browserClient;
    this.pageHandler = new PageHandler(this.browserClient);
    this.loginHandler = new LoginHandler(this.browserClient, this.pageHandler);
  }

  async login() {
    const selector = await this.browserClient.getPage()?.waitForSelector(RpgMOSelectors.WORLD_OPTIONS, {visible: true, timeout: 10000});
    console.log('selector is:', selector);
    
    await this.loginHandler.login();
  }
}

export default GameBot;


