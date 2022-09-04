# Тестовое задание №2 для backend стажировки в IT-компании Lad

## [Описание задачи](https://hibrain.ru/news/zadachi-dlya-backend-stazhirovki)
## Решение:
TODO

## Старт приложения:
Установка зависимостей
```console
$ npm ci
$ npm --prefix ./packages/api ci
$ npm --prefix ./packages/storage ci
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
