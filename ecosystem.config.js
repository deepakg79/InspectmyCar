module.exports = {
  apps: [
    {
      name: "inspectmycar",

      // Next.js production start
      script: "node_modules/.bin/next",
      args: "start -p 3000",

      // ⚠️ Cluster mode settings
      // Use either "max" OR a number, not both ambiguous configs
      instances: "max",
      exec_mode: "cluster",
      // Stability
      watch: false,
      autorestart: true,
      max_memory_restart: "500M",

      // Environment variables
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
