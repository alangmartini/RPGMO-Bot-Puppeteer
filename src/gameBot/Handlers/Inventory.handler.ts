import BrowserClient from '../../browserClient/BrowserClient.client';
import sleep from '../../utils/sleep';

const players: any = [];

const Chest = {
  deposit_all: () => {}
}

const Inventory = {
  is_full: (player: any) => {}
}


export default class InventoryHandler {
  private browserClient: BrowserClient;

  constructor(browserClient: BrowserClient) {
    this.browserClient = browserClient;
  }

  evalGetCurrentInventory() {
    return Inventory.is_full(players[0]);
  }

  async checkInventoryIsFull() {
    const inventoryIsFull: boolean = await this.browserClient.evaluateFunctionWithArgsAndReturn(this.evalGetCurrentInventory);

    return inventoryIsFull;
  }

  evalStashChest() {
    Chest.deposit_all();
  }

  async stashChest() {
    await this.browserClient.evaluateFunctionWithArgsAndReturn(this.evalStashChest);
    await sleep(2000);
  }
}