const { spawnSync } = require('node:child_process');

function run(command, args) {
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    shell: process.platform === 'win32'
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

run('npx', ['prisma', 'generate']);

if (!process.env.DATABASE_URL) {
  console.log('Skipping prisma db push: DATABASE_URL is not set during install.');
  process.exit(0);
}

run('npx', ['prisma', 'db', 'push', '--skip-generate']);
