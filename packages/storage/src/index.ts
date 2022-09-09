import { StorageMethods } from "../../common/constants";
import { Transport } from "../../common/Transport";
import * as ProductController from './controllers/Product.controller'
import * as TestController from './controllers/Test.controller'
import { initializeDB } from "./repository";

export const transport = new Transport();

(async () => {
  try {
    await initializeDB();

    await transport.connect();

    // Test
    transport.subscribe(StorageMethods.Test.find, TestController.find)

    // Product
    transport.subscribe(StorageMethods.Product.find, ProductController.find);
    transport.subscribe(StorageMethods.Product.findOneById, ProductController.findOneById);
    transport.subscribe(StorageMethods.Product.createOne, ProductController.createOne);
    transport.subscribe(StorageMethods.Product.updateOne, ProductController.updateOne);
    transport.subscribe(StorageMethods.Product.deleteOne, ProductController.deleteOne);

  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
