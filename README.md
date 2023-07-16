# Quizzical - A Quiz Site

## To run the project, use commands `npm install`, `node app.js`
## Open `localhost:3000` on your browser to visit the site

### Before you run this project, please set up a `.env` file containing:
```
MYSQL_HOST=
MYSQL_USER=
MYSQL_PASSWORD=
MYSQL_DATABASE=
```

### If you are running this project for the first time,
you will have to initialize some tables in the SQL database you mentioned int eh `.env` file

To do so, simply use the command `node setup.js` when you run the project the first time. Thereafter, you can proceed as usual.
Or, you can use the MySQL Command Line to manually run the two commands given in the `setup.txt` file. Then you can run the project as usual