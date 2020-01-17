## Description

Prueba tecnica para Avantio

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start
```

## Database

La base de datos empleada es mongo -> URI = "mongodb://localhost:27017/dailytrends"

## Explanation

Para la realización del back se han empleado 3 modulos.

- app.modue -> Carga la aplicación
- database.module -> Se encarga de realizar la conexión contra el mongo
- articles.module -> El principal modulo de la aplicación

He intentado abstraer la aplicación en lo posible teniendo 2 servicios principales.

- articles.service -> Encargado de realizar toda la logica contra la base de datos
- scrapper.service -> Encargado de realizar el web scrapping


