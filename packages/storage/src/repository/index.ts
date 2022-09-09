import "reflect-metadata"
import { DataSource } from "typeorm"
import { Product } from "./entities/Product.entity"
import { Test } from "./entities/Test.entity"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? 5432),
    username: "postgres",
    password: process.env.DB_PASSWORD ?? 'admin',
    database: "postgres",
    synchronize: true,
    logging: false,
    entities: [Test, Product],
    migrations: [],
    subscribers: [],
})

export const initializeDB = async () => {
    try {
        await AppDataSource.initialize();
        console.log(`Database initialized`);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
