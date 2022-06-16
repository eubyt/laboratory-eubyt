# Projeto NestJS API de criação de posts 
Esse repositório é apenas um experimento e foi feito para praticar o uso do [NestJS](https://nestjs.com/) e [Docker](https://docker.com/).

## Rotas
Só existem 5 rotas nesse repositório que são de criação de conta e publicação de "tweet".

```
[POST] - /auth          (criação de conta)
[POST] - /auth/login    (logar em uma conta)
[GET]  - /tweet         (ver todos tweet)
[POST] - /tweet         (criar um novo twee)
```
As informações necessáris para passar no **body** de cada rota você pode entrar em **entity/dto**.

## Docker compose Install
```
docker-compose up -d
```

## Build and Install
```
yarn build
yarn start
```

## Start Dev
```
yarn start:dev
```

## Avisos
- O servidor é iniciado na porta 3000.



