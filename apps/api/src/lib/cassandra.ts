import cassandra from "cassandra-driver";

export const client = new cassandra.Client({
  contactPoints: [process.env.CASSANDRA_HOST ?? "localhost"],
  localDataCenter: process.env.CASSANDRA_DC ?? "datacenter1",
  keyspace: undefined,
});

const KEYSPACE = "url_shortener";

export async function connectCassandra(): Promise<void> {
  await client.connect();
  console.log("[cassandra] connected");

  await client.execute(`
    CREATE KEYSPACE IF NOT EXISTS ${KEYSPACE}
    WITH replication = {
      'class': 'SimpleStrategy',
      'replication_factor': '1'
    }
  `);

  await client.execute(`USE ${KEYSPACE}`);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS url (
      shortcode TEXT PRIMARY KEY,
      long_url  TEXT,
      created_at TIMESTAMP
    )
  `);

  console.log("[cassandra] keyspace & table ready");
}
