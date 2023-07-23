import Orchestrator from './Orchestrator';
import BrowserClient from './browserClient/BrowserClient.client';
import ArrowKeys from './gameBot/enums/ArrowKeys.enum';

(async () => {
  const orchestrator: Orchestrator = new Orchestrator();

  await orchestrator.init();
  // const browserClient = new BrowserClient();

  // await browserClient.init();
  // await browserClient.config();

  // await browserClient.goto('https://data.mo.ee/loader.html');

  // const page = browserClient.getPage();
})();


// StatusHandler -> to andando? to com inv cheio?
// MapStatus -> tem mob raro? onde estão as coisas
// MovementHandler -> realizar movimentos
// Player handler? -> pegar informações do player
// Orchestrator -> orquestrar tudo

