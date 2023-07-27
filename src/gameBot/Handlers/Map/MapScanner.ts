import BrowserClient from '../../../browserClient/BrowserClient.client';
import MapObject from '../MapObject';
import { MapEvals } from './MapEvals';

export class MapScanner {
  private browserClient: BrowserClient;

  constructor(browserClient: BrowserClient) {
    this.browserClient = browserClient;
  }

  async scanMapObjects() {
    const map: MapObject[] = await this.browserClient.evaluateFunctionWithArgsAndReturn(MapEvals.getCurrentMapDirect);
    return map;
  }

  async scanMapGrid() {
    return await this.browserClient.evaluateFunctionWithArgsAndReturn(MapEvals.getMapAsGrid);
  }

  async getCurrentMap() {
    return await this.browserClient.evaluateFunctionWithArgsAndReturn(MapEvals.getCurrentMap);
  }

  async getWalkableMap(): Promise<boolean[][]> {
    return await this.browserClient.evaluateFunctionWithArgsAndReturn(MapEvals.getWalkableMap);
  }
}
