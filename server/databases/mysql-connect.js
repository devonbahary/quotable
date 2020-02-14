import { createPool } from "mysql";
import config from "../config";

const pool = createPool({
    connectionLimit: 10,
    ...config.mysql,
});

export default pool;