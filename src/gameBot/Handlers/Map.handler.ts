import BrowserClient from '../../browserClient/BrowserClient.client';
import MapObject from './MapObject';

const obj_g = (a: any) => { console.log(a) };
const current_map = 0;
const on_map = {
  0: [[]]
}

class MapEvals {
  static getCurrentMapDirect(): any {
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

  static getMapAsGrid() {
    return on_map[current_map];
  }
}

export default class MapHandler {
  private browserClient: BrowserClient;
  public currentMap: MapObject[] = [];
  public mapAsGrid = [[]];

  constructor(browserClient: BrowserClient) {
    this.browserClient = browserClient;
  }

  async scanMapDirect() {
    const map: MapObject[] = await this.browserClient.evaluateFunctionWithArgsAndReturn(MapEvals.getCurrentMapDirect);

    this.currentMap = map;
  }

  async scanMapAsGrid() {
    this.mapAsGrid = await this.browserClient.evaluateFunctionWithArgsAndReturn(MapEvals.getMapAsGrid);    
  }

  async getMapAsGrid(): Promise<MapObject[][]> {
    await this.scanMapAsGrid();
    return this.mapAsGrid;
  }

  async getObjectsByName(objectName: string): Promise<MapObject[]> {
    // Updates current map
    await this.scanMapDirect();

    // Returns all objects with the same name
    return this.currentMap.filter((object) => object.name === objectName);
  }
}
