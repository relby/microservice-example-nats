# Тестовое задание №2 для backend стажировки в IT-компании Lad

## [Описание задачи](https://hibrain.ru/news/zadachi-dlya-backend-stazhirovki)
## Решение:
Реализованы два микросервиса api и storage. Где api - это простой сервер на hapijs,
основная задача которого - принимать запросы от клиента и направлять их в микросервис storage 
с помощью системы обмена сообщениями NATS, а storage - сервис для приема
запросов от микросервиса api.

Дополнительно я реалировал сущность Product и простейшие CRUD операции над ней. Что-бы лучше понять typeorm.

## Старт приложения:
Установка зависимостей
```console
$ npm ci
$ npm --prefix ./packages/api ci
$ npm --prefix ./packages/storage ci
```
Сборка проекта
```console
$ npm run build
```
Запуск (Unix-like системы)
```console
$ npm start
```
Запуск (Windows)
```console
$ npm run start:win
```

### или можно запустить через [docker](https://docker.com)
Создание docker образов (api, storage, postres и nats)
```console
$ docker-compose build
```
Запуск контейнеров
```console
$ docker-compose up -d
```
## Routes:
|Method|Route|Description|
|---|---|---|
|GET|/api/test|Get all Test entities from the datebase|
|GET|/api/products|Get all Products entities from the datebase|
|GET|/api/products/{id}|Get a specific Product by id|
|POST|/api/products|Create a Product|
|PUT|/api/products/{id}|Update a Product by id|
|DELETE|api/products/{id}|Delete Product by id|