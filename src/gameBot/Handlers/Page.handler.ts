import BrowserClient from '../../browserClient/BrowserClient.client';
import sleep from '../../utils/sleep';
import RpgMOSelectors from '../enums/RpgMOSelectors.enum';

// Game variables that are necessary so linter wont cry
const players: any[] = [];

export default class PageHandler {
  private browserClient: BrowserClient;
  private login_selector = RpgMOSelectors.LOGIN_INPUT;
  private username = process.env.RPGMO_USERNAME;
  
  constructor(browserClient: BrowserClient) {
    this.browserClient = browserClient;
  }

  async verifyIsLogged() {
    // Thow error if world options is not visible
    await this.browserClient.getPage()?.waitForSelector(RpgMOSelectors.WORLD_OPTIONS, { visible: false, timeout: 10000 });

    await sleep(5000);
  }
}