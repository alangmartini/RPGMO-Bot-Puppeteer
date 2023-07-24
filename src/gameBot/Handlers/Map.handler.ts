import BrowserClient from '../../browserClient/BrowserClient.client';

const obj_g = (a: any) => { console.log(a) };
const current_map = 0;
const on_map = {
  0: [[]]
}

export interface MapObject {
  "id": 525,
  "b_i": 17,
  "b_t": "1",
  "i": 83,
  "j": 38,
  "map": 0,
  "params": {
      "desc": "My items are safe in there. Can be used to access market that enables trading with other players."
  },
  "name": "Chest",
  "img": {
      "sheet": "1",
      "x": 10,
      "y": 14
  },
  "blocking": true,
  "type": 6,
  "activities": [
      "Access",
      "Inspect"
  ],
  "temp": {}
}

export default class MapHandler {
  private browserClient: BrowserClient;
  public currentMap: MapObject[] = [];

  constructor(browserClient: BrowserClient) {
    this.browserClient = browserClient;
  }

  evalGetCurrentMapDirect(): any {
    let algo: any = [];
    on_map[current_map].forEach((arrayX) => {
        arrayX.forEach((object) => {
            if (object !== false) {
                algo.push(object);
            }
        })
    });

    return algo.map((item: any) => obj_g(item)).filter((item: any) => item.id !== -1)
  }

  async scanMapDirect() {
    const map: MapObject[] = await this.browserClient.evaluateFunctionWithArgsAndReturn(this.evalGetCurrentMapDirect);

    this.currentMap = map;
  }
}
