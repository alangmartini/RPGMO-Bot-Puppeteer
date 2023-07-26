import { EventEmitter } from 'events';
import sleep from '../../utils/sleep';

export default class Watcher {
  private isRunning: boolean = false;
  private pause: boolean = false;

  constructor(private eventEmitter: EventEmitter,
    private watcherName: string,
    private interval: number,
    private task: () => Promise<void>) {
      this.eventEmitter.on('pause', () => this.pause = true);
      this.eventEmitter.on('resume', () => this.pause = false);
  }

  async run() {
    if (this.isRunning) return;
    this.isRunning = true;
    console.log('running watcher, outside while:', this.pause);

    while (true) {
      if (this.pause) {
        await sleep(5000);
        continue
      }

      await this.task();
      await sleep(this.interval);
    }
  }
}