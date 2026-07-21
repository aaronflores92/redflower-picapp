// Creates a PostgreSQL connection Pool to run queries
import pg from 'pg';

import { config } from './env.js';

const { Pool } = pg;

export const pool = new Pool({
    connectionString: config.databaseUrl,
});