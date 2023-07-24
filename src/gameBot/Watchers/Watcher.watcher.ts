import { EventEmitter } from 'events';
import sleep from '../../utils/sleep';

class Watcher {
  private isRunning: boolean = false;
  private pause: boolean = false;

  constructor(private eventEmitter: EventEmitter,
    private watcherName: string,
    private interval: number,
    private task: () => Promise<void>) {
      this.eventEmitter.on('pause', () => this.pause = true);
      this.eventEmitter.on('resume', () => {
        this.pause = false;
        this.run();
      });
  }

  async run() {
    if (this.isRunning) return;
    this.isRunning = true;

    while (!this.pause) {
      await this.task();
      await sleep(this.interval);
    }

    this.eventEmitter.emit('resume');
    this.isRunning = false;
  }
}