import sleep from './sleep';

// Sleep a random amount of time
const sleepRandom = async () => {
  const min = 100;
  const max = 10000;
  const randomTime = Math.floor(Math.random() * (max - min + 1) + min);

  console.log("sleeping for", randomTime, "ms");
  await sleep(randomTime);
}

export default sleepRandom;