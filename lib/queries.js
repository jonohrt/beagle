const MIGRATION_TABLE = 'migrations';
const VERSION_COLUMN = 'version';

export async function migrationsTableExists(client) {
  let { rows } = await client.query(
    `SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = $1);`,
    [ MIGRATION_TABLE ]
  );

  return rows[0].exists;
}

export async function createMigrationsTable(client) {
  client.query(`CREATE TABLE ${ MIGRATION_TABLE } (${ VERSION_COLUMN } TEXT NOT NULL);`);
}

export async function readMigrations(client) {
  return (await client.query(`SELECT * FROM ${ MIGRATION_TABLE }`)).rows;
}
