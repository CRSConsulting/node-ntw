const cluster = require('cluster');

if (cluster.isMaster) {
  const numWorkers = require('os').cpus().length;

  console.log(`Master cluster setting up ${numWorkers} workers...`);

  for (let i = 0; i < numWorkers; i++) {
    cluster.fork();
  }

  cluster.on('online', (worker) => {
    console.log(`Worker ${worker.process.pid} is online`);
  });

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died with code: ${code}, and signal: ${signal}`);
    console.log('Starting a new worker');
    cluster.fork();
  });
} else {
  const app = require('express')();
  app.all('/*', (req, res) => { res.send(`process ${process.pid} says hello!`).end(); });

  const server = app.listen(8000, () => {
    console.log(`Process ${process.pid} is listening to all incoming requests`);
    setTimeout(() => { console.log('Hello'); }, 3000);
  });
}
