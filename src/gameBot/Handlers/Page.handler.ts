import BrowserClient from '../../browserClient/BrowserClient.client';
import RpgMOSelectors from '../../browserClient/enums/RpgMOSelectors.enum';

// Game variables that are necessary so linter wont cry
const players: any[] = [];

export default class PageHandler {
  private browserClient: BrowserClient;
  private login_selector = RpgMOSelectors.LOGIN_INPUT;
  private username = process.env.RPGMO_USERNAME;
  
  constructor(browserClient: BrowserClient) {
    this.browserClient = browserClient;
  }

  evalIsLoginPage(LoginInputQuery: string) {
    return document.querySelector(LoginInputQuery) != null;
  }
  
  async verifyIsLoginPage() {
    const isLoginPage = await this.browserClient.evaluateFunctionWithArgsAndReturn(
      this.evalIsLoginPage, this.login_selector
    ) as boolean;

    if (!isLoginPage) {
      throw new Error('Not on login page');
    }
  }

  evalVerifyIsLogged(Username: string) {
    console.log("username is", Username)
    console.log("name is", players[0].name)
    return players[0].name === Username;
  }

  async verifyIsLogged() {
    const a = await this.browserClient.getPage()?.waitForSelector(RpgMOSelectors.WORLD_OPTIONS, { visible: false, timeout: 10000 });
    console.log('a is:', a);


    const isLogged = await this.browserClient.evaluateFunctionWithArgsAndReturn(
      this.evalVerifyIsLogged, this.username
      ) as boolean;
      
    console.log('isLogged is:', isLogged);
    if (!isLogged) {
      throw new Error('Not logged in');
    }
  }
}