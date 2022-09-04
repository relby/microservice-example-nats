import { AppDataSource } from "../repository"
import { Product } from "../repository/entities/Product.entity"
import { GetByIdPayload, CreateProductPayload, UpdateProductPayload } from "../../common/payloads/storage/product"

const productRepo = AppDataSource.getRepository(Product)

export const find = async (): Promise<Product[]> => {
  return await productRepo.find();
}

export const findOneById = async ({ id }: GetByIdPayload): Promise<Product | null> => {
  return await productRepo.findOneBy({ id });
}

export const createOne = async (payload: CreateProductPayload): Promise<Product> => {
  const product = new Product();
  Object.assign(product, payload);
  return await productRepo.save(product);
}

export const updateOne = async (payload: UpdateProductPayload): Promise<Product | null> => {
  const { id } = payload;
  const product = await productRepo.findOneBy({ id });
  if (!product) return null;
  Object.assign(product, payload);
  return await productRepo.save(product);
}

export const deleteOne = async (payload: GetByIdPayload): Promise<Product | null> => {
  const { id } = payload;
  const product = await productRepo.findOneBy({ id });
  if (!product) return null;
  return await productRepo.remove(product);
}
