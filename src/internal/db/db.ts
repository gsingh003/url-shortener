import { Sequelize } from "sequelize";
import { config } from "../config/config";

const sql = new Sequelize(
    config.postgres.name,
    config.postgres.user,
    config.postgres.password,
    {
        host: config.postgres.host,
        dialect: "postgres",
        logging: false,
    }
);

export default sql;
