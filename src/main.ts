import Orchestrator from './Orchestrator';

(async () => {
  const orchestrator: Orchestrator = new Orchestrator();

  await orchestrator.init();
})();

