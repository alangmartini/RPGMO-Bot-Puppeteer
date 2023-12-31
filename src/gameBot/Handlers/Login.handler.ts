import BrowserClient from '../../browserClient/BrowserClient.client';
import ArrowKeys from '../enums/ArrowKeys.enum';
import RpgMOSelectors from '../enums/RpgMOSelectors.enum';
import PageHandler from './Page.handler';

const players: any[] = [];

export default class LoginHandler {
  private browserClient: BrowserClient;
  private pageHandler: PageHandler;
  private login_selector = RpgMOSelectors.LOGIN_INPUT;
  private password_selector = RpgMOSelectors.PASSWORD_INPUT; 

  constructor(browserClient: BrowserClient, pageHandler: PageHandler) {
    this.browserClient = browserClient;
    this.pageHandler = pageHandler;
  }

  async login() {
    if (this.browserClient.configs.login == null || this.browserClient.configs.password == null) {
      throw new Error('Missing username or password, set them in initializer.yaml file');
    }

    await this.browserClient.getPage()?.waitForSelector(RpgMOSelectors.WORLD_OPTIONS, { visible: true, timeout: 60000 });
  
    await this.browserClient.typeInPage(this.login_selector, this.browserClient.configs.username);
    await this.browserClient.typeInPage(this.password_selector, this.browserClient.configs.password);

    try {
      const worldOptions = await this.browserClient.evaluateFunctionWithArgsAndReturn(
        this.evalGetWorldOptions, RpgMOSelectors.WORLD_OPTIONS
        ) as string;
    
      if (worldOptions == null) {
        throw new Error('No worlds available');
      }

      if (typeof worldOptions !== 'string') {
        throw new Error('World options is not a string');
      }

      await this.browserClient.selectOption(RpgMOSelectors.WORLD_OPTIONS, worldOptions);
    } catch (e) {
      console.log("Something went wrong when grabbing world options, logging on world 1.");
    }

    // Wait for server to be updated
    console.log("Waiting for server to be conected");
    await this.browserClient.waitTillTextContentMatches(RpgMOSelectors.IS_CONNECTED, 'Conectado');

    // Click enter game button
    console.log("Clicking enter game button");
    await this.browserClient.click(RpgMOSelectors.ENTER_GAME_BUTTON);

    // Wait till login process end
    console.log("Waiting for login to finish");
    await this.browserClient.getPage()!.waitForFunction(
      (username) => players[0].name === username,
      { timeout: 55000 },
      this.browserClient.configs.username
    );

    console.log("Login finished");  
  }

  evalGetWorldOptions(WorldOptionsSelector: string) {
    const worldSelect = document.querySelector(WorldOptionsSelector);

    if (worldSelect == null) {
      // logic to just press submit
      return
    }

    const worldOptions: Element[] = Array.from(worldSelect.children);

    if (worldOptions.length === 0) {
      throw new Error('Couldnt make array out of worlds selector. Its probably empty?')
    }

    const nonPremiumWorlds = worldOptions
        .filter((option) => {
          if (option == null || option.textContent == null || (option as any).value == null) {
            return false;
          }

          return !option.textContent.includes('Premium')
        }) // Exclude premium worlds
        .map((option) => ({ // already filtered out nulls
            url: (option as any).value, // selection options
            players: Number((option as any).textContent!.match(/(\d+) online/)[1]), // Extract the player count from the option text
        }));

    const worldWithLeastPlayers = nonPremiumWorlds.reduce((minWorld, world) =>
        world.players < minWorld.players ? world : minWorld,
    nonPremiumWorlds[0]);

    return worldWithLeastPlayers.url;
  }
}
