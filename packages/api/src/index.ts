import Hapi from '@hapi/hapi';
import Boom from '@hapi/boom';
import Joi from 'joi';
import Inert from '@hapi/inert';
import Vision from '@hapi/vision';
import HapiSwagger from 'hapi-swagger';
import { Transport } from '../../common/Transport';
import { StorageMethods } from '../../common/constants';
import { GetByIdPayload, CreateProductPayload, UpdateProductPayload } from '../../common/payloads/storage/product';
import PackageJSON from '../package.json';

(async () => {

    // Create server
    const server = Hapi.server({
        port: process.env.PORT ?? 3000,
        host: process.env.HOST ?? 'localhost',
    });

    const swaggerOptions: HapiSwagger.RegisterOptions = {
        info: {
            title: PackageJSON.name,
            version: PackageJSON.version,
        },
        grouping: 'tags',
    };

    const plugins = [
        {
            plugin: Inert,
        },
        {
            plugin: Vision,
        },
        {
            plugin: HapiSwagger,
            options: swaggerOptions,
        },
    ];

    // @ts-ignore
    await server.register(plugins);

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
        options: {
            tags: ['api', 'test'],
        },
    });

    server.route({
        method: 'GET',
        path: '/api/products',
        handler: async (request, h) => {
            return await transport.publish<null>(
                StorageMethods.Product.find,
                null
            );
        },
        options: {
            tags: ['api', 'products'],
        },
    });

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
            },
            tags: ['api', 'products'],
        },
    });

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
                }).options({ stripUnknown: true }),
            },
            tags: ['api', 'products'],
        },
    });

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
            },
            tags: ['api', 'products'],
        },
    });

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
            },
            tags: ['api', 'products'],
        },
    });


    await server.start();
    console.log(`Server running on ${server.info.uri}`);

})();

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

