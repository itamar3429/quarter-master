# server for Quarter Master application

## To run the server, execute the following code:

### For Development

```sh
$ npm ci # install the required dependencies
$ npm run dev
```

the commands will install the required dependencies and will run the code in dev mode

### For production

```sh
$ npm ci # install the required dependencies
$ npm run build
$ npm run start
```

the commands will install the required dependencies, build the code and run the program

## Required env args

```env
DB_HOST=
DB_PORT=
DB_USER=
DB_PASSWORD=
DB_DB=
NODE_ENV=
```

## required files

under the src folder,
add the following files
./src/ssh/private.key
./src/ssh/public.key

the files need to be compatible for RS256 algorithm
