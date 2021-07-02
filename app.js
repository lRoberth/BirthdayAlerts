var settings = require('./settings.json');
var colors = require('./colors');
var mysql = require('mysql');
var query = require('./query');
var express = require('express');
var app = express();
app.listen(1337);

var connect = mysql.createConnection({
    host: settings.mysql.host,
    user: settings.mysql.user,
    password: settings.mysql.password,
    database: settings.mysql.db,
});

process.env.TZ = 'America/Monterrey';


console.log("%sMySQL: %sInitiating connection to host '%s'@'%s'...", colors.getColor(11), colors.getColor(12), settings.mysql.host, settings.mysql.user);
colors.setColor(0);
connect.connect((error) => {
    if (error) {
        var err = "";
        err = error.sqlMessage;
        if (!err)
            err = error.code;

        console.log("%sMySQL Error: %s%s", colors.getColor(8), colors.getColor(10), err);
        colors.setColor(0);
        return;
    }
    query.setup(connect, settings.mysql.table, settings.delay);
    console.log("%sMysQL: %sConnected successfully.", colors.getColor(11), colors.getColor(9));
    console.log("%sCurrent date is: %s%s", colors.getColor(11), colors.getColor(9), query.getCurrDate().toString());

    if (settings.delay.enableEveryX)
        console.log("%sQuery will be ran in: %s%s:00 (%s)", colors.getColor(11), colors.getColor(9), settings.delay.atXHour, );
    colors.setColor(0);
    query.checkDates();
});

app.get('/', function(req, res) {

});