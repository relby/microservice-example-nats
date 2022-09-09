import Hapi from '@hapi/hapi';
import Boom from '@hapi/boom';
import Joi from 'joi';
import { Transport } from '../../common/Transport';
import { StorageMethods } from '../../common/constants';
import { GetByIdPayload, CreateProductPayload, UpdateProductPayload } from '../../common/payloads/storage/product';

(async () => {

    // Create server
    const server = Hapi.server({
        port: process.env.PORT ?? 3000,
        host: process.env.HOST ?? 'localhost'
    });

    const transport = new Transport();
    await transport.connect();

    server.route({
        method: 'GET',
        path: '/api/test',
        handler: async (request, h) => {
            return await transport.publish<null>(
                StorageMethods.Test.find,
                null
            );
        },
    })

    server.route({
        method: 'GET',
        path: '/api/products',
        handler: async (request, h) => {
            return await transport.publish<null>(
                StorageMethods.Product.find,
                null
            );
        }
    })

    server.route({
        method: 'GET',
        path: '/api/products/{id}',
        handler: async (request, h) => {
            const id = request.params.id as number;
            const product = transport.publish<GetByIdPayload>(
                StorageMethods.Product.findOneById,
                { id }
            )
            if (!product) {
                return Boom.notFound(`Product with id = ${id} was not found`);
            }
            return product;

        },
        options: {
            validate: {
                params: Joi.object({
                    id: Joi.number().integer().min(1)
                })
            }
        }
    })

    server.route({
        method: 'POST',
        path: '/api/products',
        handler: async (request, h) => {
            const payload = request.payload as CreateProductPayload;
            return await transport.publish<CreateProductPayload>(
                StorageMethods.Product.createOne,
                payload
            )
        },
        options: {
            validate: {
                payload: Joi.object({
                    name: Joi.string(),
                    price: Joi.number(),
                    left: Joi.number().integer()
                }).options({ stripUnknown: true })
            }
        }
    })

    server.route({
        method: 'PUT',
        path: '/api/products/{id}',
        handler: async (request, h) => {
            const { id } = request.params;
            const payload = { ...request.payload as CreateProductPayload, id };
            const product = await transport.publish<UpdateProductPayload>(
                StorageMethods.Product.updateOne,
                payload
            )
            if (!product) {
                return Boom.notFound(`Product with id = ${id} was not found`);
            }
            return product;
        },
        options: {
            validate: {
                params: Joi.object({
                    id: Joi.number().integer().min(1)
                }),
                payload: Joi.object({
                    name: Joi.string(),
                    price: Joi.number(),
                    left: Joi.number().integer()
                }).options({ stripUnknown: true })
            }
        }
    })

    server.route({
        method: 'DELETE',
        path: '/api/products/{id}',
        handler: async (request, h) => {
            const { id } = request.params;
            const product = await transport.publish<GetByIdPayload>(
                StorageMethods.Product.deleteOne,
                { id }
            );
            if (!product) {
                return Boom.notFound(`Product with id = ${id} was not found`);
            }
            return product;

        },
        options: {
            validate: {
                params: Joi.object({
                    id: Joi.number().integer().min(1)
                })
            }
        }
    })


    await server.start()
    console.log(`Server running on ${server.info.uri}`);

})();

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

