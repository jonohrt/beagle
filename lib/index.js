import * as _ from 'lodash';
import yargs from 'yargs';

import up from './commands/up';
import down from './commands/down';
import all from './commands/all';
import list from './commands/list';
import generate from './commands/generate';

const YARGS_WRAP_WIDTH = 100;

// FIXME: This will eventually become the default behavior in Node.js. When that happens, the line
// below can be removed.
process.on('unhandledRejection', error => { throw error; });

function databaseYargs(commandYargs) {
  return commandYargs
    .describe('host', "The database's host.")
    .describe('port', "The database's port.")
    .describe('user', "The username used to connect to the database.")
    .describe('password', "The password used to connect to the database.")
    .describe('database', "The name of the database.")
    .demandOption([ 'host', 'port', 'user', 'password', 'database' ]);
}

function migrationsDirectoryYargs(commandYargs) {
  return commandYargs
    .describe('migrations-directory', "The directory that contains the migration files.")
    .demandOption([ 'migrations-directory' ]);
}

// Parse the options
let options = yargs
  .usage("Usage: $0 <command>\n\nTo see the available options for each command, run"
    + " '$0 <command> --help'.")
  .command(
    'up',
    "Runs the next pending migration.",
    _.flow([ databaseYargs, migrationsDirectoryYargs ])
  )
  .command(
    'down',
    "Rolls back the last completed migration.",
    _.flow([ databaseYargs, migrationsDirectoryYargs ])
  )
  .command(
    'all',
    "Runs all of the pending migrations.",
    _.flow([ databaseYargs, migrationsDirectoryYargs ])
  )
  .command(
    'list',
    "Lists all of the completed and pending migrations.",
    _.flow([ databaseYargs, migrationsDirectoryYargs ])
  )
  .command(
    'generate <name>',
    'Create a new pair of SQL migration files using the provided migration name.',
    migrationsDirectoryYargs
  )
  .demandCommand(1, 'You need to specify at least one command.')
  .wrap(YARGS_WRAP_WIDTH)
  .argv;

// Run the command
let command = options._[0];
let databaseOptions = _.pick(options, [ 'host', 'port', 'user', 'password', 'database' ]);
let { migrationsDirectory, name } = options;

switch (command) {
  case 'up':
    up(databaseOptions, migrationsDirectory);
    break;
  case 'down':
    down(databaseOptions, migrationsDirectory);
    break;
  case 'all':
    all(databaseOptions, migrationsDirectory);
    break;
  case 'list':
    list(databaseOptions, migrationsDirectory);
    break;
  case 'generate':
    generate(migrationsDirectory, name);
    break;
}
