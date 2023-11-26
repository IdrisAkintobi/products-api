# Product API

## Description

This is a simple Node.js server application that uses the [NestJS](https://nestjs.com/) framework. The server exposes endpoints to perform CRUD operations on a product catalog.

## Requirements

-   [Node.js](https://nodejs.org/en/)
-   [NPM](https://www.npmjs.com/)

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Code Structure

```bash
./src
├── guards
│   └── auth.guard.ts
├── db
│   ├── schemas
│   │   ├── user.schema.ts
│   │   └── product.schema.ts
│   ├── repository
│   │   ├── user.repository.ts
│   │   └── product.repository.ts
│   └── db.module.ts
├── app.module.ts
├── types
│   ├── product.category.enum.ts
│   ├── configuration.service.interface.ts
│   └── config.schema.type.ts
├── swagger.open.api.ts
├── main.ts
├── exception
│   └── filters
│       └── error-exception-filter.ts
├── application
│   ├── auth
│   │   ├── dto
│   │   │   ├── login.dto.ts
│   │   │   └── register.dto.ts
│   │   ├── auth.module.ts
│   │   ├── auth.service.ts
│   │   └── auth.controller.ts
│   ├── products
│   │   ├── products.module.ts
│   │   ├── product.service.ts
│   │   ├── dto
│   │   │   ├── product.create.dto.ts
│   │   │   ├── product.pagination.dto.ts
│   │   │   ├── product.update.dto.ts
│   │   │   └── product.find.dto.ts
│   │   └── product.controller.ts
│   └── user
│       ├── dto
│       │   └── user.update.dto.ts
│       ├── user.module.ts
│       ├── user.service.ts
│       └── user.controller.ts
└── utils
    ├── logger.ts
    ├── config
    │   ├── config-schema.ts
    │   └── config.service.ts
    ├── util.module.ts
    └── resources
        ├── http-error.ts
        ├── http-response.ts
        ├── http-response-mapper.ts
        └── zod.error.parser.ts
```

## License

[MIT licensed](LICENSE)
