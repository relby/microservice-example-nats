export interface GetByIdPayload {
  id: number
}

export interface CreateProductPayload {
  name?: string,
  price?: number,
  left?: number
}

export type UpdateProductPayload = GetByIdPayload & CreateProductPayload
