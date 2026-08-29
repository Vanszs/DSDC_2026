module.exports = {
  apps: [
    {
      name: "ecohealth-pulse",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3300",
      cwd: "/home/vanszs/Documents/lomba/DSDC_2026",
      exec_mode: "fork",
      instances: 1,
      autorestart: true,
      env: {
        NODE_ENV: "production",
        PORT: 3300,
        DATABASE_URL: "postgres://vanszs:postgres@localhost:5432/ecohealth_db",
      },
    },
  ],
};
