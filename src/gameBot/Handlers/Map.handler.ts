import BrowserClient from '../../browserClient/BrowserClient.client';
import MapObject from './MapObject';

const obj_g = (a: any) => { console.log(a) };
const current_map = 0;
const on_map = {
  0: [[]]
}

export default class MapHandler {
  private browserClient: BrowserClient;
  public currentMap: MapObject[] = [];
  public mapAsGrid = [[]];

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

  evalGetMapAsGrid() {
    return on_map[current_map];
  }

  async scanMapAsGrid() {
    this.mapAsGrid = await this.browserClient.evaluateFunctionWithArgsAndReturn(this.evalGetMapAsGrid);    
  }
}
