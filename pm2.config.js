module.exports = {
  apps: [{
    name: 'hackathon-backend',
    script: './bin/www',
    kill_timeout: 300000, // This is for gracefull shutdown, Wait 5min before sending SIGKILL, so that it can finish all the requests
    cwd: '',
    env: {
      NODE_ENV: 'development',
    },
    max_memory_restart: '250M',
  }],
};
