import { spawnSync } from 'node:child_process';
import process, { loadEnvFile } from 'node:process';

try {
  loadEnvFile('.env');
} catch (error) {
  if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
    process.stderr.write(
      'Missing .env. Copy .env.example to .env before running local development commands.\n',
    );
    process.exit(1);
  }

  throw error;
}

const pnpmCli = process.env.npm_execpath;

if (!pnpmCli) {
  process.stderr.write('Unable to locate pnpm. Run this workflow through a pnpm package script.\n');
  process.exit(1);
}

const pnpmArgs = process.argv.slice(2);

if (pnpmArgs.length === 0) {
  process.stderr.write('No pnpm arguments were provided.\n');
  process.exit(1);
}

const result = spawnSync(process.execPath, [pnpmCli, ...pnpmArgs], {
  stdio: 'inherit',
  env: process.env,
});

if (result.error) {
  throw result.error;
}

process.exit(result.status ?? 1);
