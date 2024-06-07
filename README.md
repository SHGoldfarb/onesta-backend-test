# onesta-backend-test

Small API to manage harvests information. The current version uses an in-memory database, so it will only persist until the server stops running.

## Requires

```
node: 22.x
yarn: ^1.22
```

## Install dependencies

```
yarn
```

## Run dev server

```
yarn dev
```

## Run tests

```
yarn test
```

#### Run tests in watch mode

```
yarn test:watch
```

## Build and run

TODO

## Environment variables

- `PORT`: Port to listen on. If empty it will use `7000`.
- `LOG_SQL`: `true` to log SQL queries to console. Useful for debugging.

## Endpoints

- `GET /fruits`: returns a list of all fruits in the database.
- `POST /fruits`: creates a fruit. The body must be the attributes in JSON format.
  | Attribute | Required | Default | Notes |
  |---|---|---|---|
  | `name` | Yes | | Must not be present in the database. |

- `GET /varieties`: returns a list of all varieties in the database.
- `POST /varieties`: creates a variety. The body must be the attributes in JSON format.
  | Attribute | Required | Default | Notes |
  |---|---|---|---|
  | `name` | Yes | | Must not be present in the database. |

- `GET /clients`: returns a list of all clients in the database.
- `POST /clients`: creates a client. The body must be the attributes in JSON format.
  | Attribute | Required | Default | Notes |
  |---|---|---|---|
  | `email` | Yes | | Must not be present in the database. |
  | `name` | | `null` | |
  | `lastName` | | `null` | |

- `GET /farms`: returns a list of all farms in the database.
- `POST /farms`: creates a farm. The body must be the attributes in JSON format.
  | Attribute | Required | Default | Notes |
  |---|---|---|---|
  | `name` | Yes | | Must not be present in the database. |

- `GET /farmers`: returns a list of all farmers in the database.
- `POST /farmers`: creates a farmer. The body must be the attributes in JSON format.
  | Attribute | Required | Default | Notes |
  |---|---|---|---|
  | `email` | Yes | | Must not be present in the database. |
  | `name` | | `null` | |
  | `lastName` | | `null` | |

- `GET /harvests`: returns a list of all harvests in the database.
- `POST /harvests`: creates a harvest. The body must be the attributes in JSON format.
  | Attribute | Required | Default | Notes |
  |---|---|---|---|
  | `fruitId` | Yes | | Must be present in the database. |
  | `varietyId` | Yes | | Must be present in the database. |
  | `clientId` | Yes | | Must be present in the database. |
  | `farmerId` | Yes | | Must be present in the database. |
  | `farmId` | Yes | | Must be present in the database. |

- `POST /harvests/bulk`: Creates multiple harvests from a `csv` file. The body must be the path to the `csv` file in JSON format.
  | Attribute | Required | Default | Notes |
  |---|---|---|---|
  | `csvPath` | Yes | | |

  The `csv` file must use `;` as separators. Each line should be a harvest. The first line will be ignored. Every line must contain:
  | Column | Required | Default | Notes |
  |---|---|---|---|
  | farmer email | Yes | | A new farmer will be created if it's not present in the database.
  | farmer name | | `null` | Must be consistent with the data already in the database.
  | farmer lastname | | `null` | Must be consistent with the data already in the database.
  | client email | Yes | | A new client will be created if it's not present in the database.
  | client name | | `null` | Must be consistent with the data already in the database.
  | client lastname | | `null` | Must be consistent with the data already in the database.
  | farm name | Yes | | A new farm will be created if it's not present in the database.
  | farm address | | `null` | Must be consistent with the data already in the database.
  | fruit name | Yes | | A new fruit will be created if it's not present in the database.
  | variety name | Yes | | A new variety will be created if it's not present in the database.

  If any of the harvests can't be created, the server will reply with code `400` and a list of harvests created and lines errored. An example `csv` file can be found in `./tests/resources/cosechas_clean.csv`.

TODO: DELETE endpoints? PUT endpoints?
