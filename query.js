const { query } = require('express');
var colors = require('./colors');
var settings = {}
var util = require('util');
const email = require('./email');

/* Initialize settings */
settings.sql = 0;
settings.delay = 0;
settings.table = "";

var getCurrDate = function() {
    var settings_ = require('./settings.json');
    var d = new Date();
    if (settings_.timeAdjust < 0) {
        if ((d.getHours() + settings_.timeAdjust) < 0) {
            settings.timeAdjust += 24;
        }
    }
    d.setHours(d.getHours() + settings_.timeAdjust);
    return d;
}

var getDate = function(date) {
    var d = {};
    d.years = date.getUTCFullYear() - 1970;
    d.months = date.getUTCMonth();
    d.days = date.getUTCDate() - 1;
    d.weeks = d.days / 7;
    d.hours = ("0" + date.getHours()).slice(-2);
    d.minutes = ("0" + date.getMinutes()).slice(-2);
    d.seconds = date.getSeconds();
    return d;
};

var timeToDate = function(date1, date2) {
    var diff = new Date(date2.getTime() - date1.getTime());
    var d = {};
    d.years = diff.getUTCFullYear() - 1970;
    d.months = diff.getUTCMonth();
    d.days = diff.getUTCDate() - 1;
    d.hours = diff.getUTCHours();
    d.minutes = diff.getUTCMinutes();
    d.seconds = diff.getUTCSeconds();
    d.milliseconds = diff.getUTCMilliseconds();
    d.time = diff.getTime();

    return d;
}

var setup = function(connect, table, delay) {
    settings.sql = connect;
    settings.table = table;
    settings.delay = delay;
}

var birthdays = {};
var querySuccess;
var checkDates = function() {
    //#region Query
    querySuccess = false;

    settings.sql.query("SELECT * FROM " + settings.table + ";", (err, rows) => {
        if (err) {
            console.log("%sMySQL Error: %s%s", colors.getColor(8), colors.getColor(10), err.sqlMessage);
            return;
        }
        colors.setColor(0);
        rows.forEach((v, k) => {
            let date = new Date(v.date);
            let now = getCurrDate();
            let years = date.getUTCFullYear();
            date.setFullYear(now.getUTCFullYear());
            let next_bday = timeToDate(now, date);

            if (next_bday.time < 0) {
                date.setFullYear(now.getUTCFullYear() + 2);
                next_bday = timeToDate(now, date);
            }

            birthdays[k] = {
                id: v.id,
                name: v.name,
                birthday: v.date,
                next: next_bday.time,
                years: now.getUTCFullYear() - years
            };
        });
        querySuccess = true;


        /* Debug time
        console.log(next_bday);
        console.log(next_bday.months + " months, " + next_bday.days + " days, " + next_bday.hours + " hours.");
        console.log("%s milliseconds.", next_bday.time);
        */
    });
    //#endregion

    setTimeout(() => {
        if (!querySuccess) setTimeout(checkDates, 1000);

        var sortable = [];
        for (var v in birthdays) {
            sortable.push([
                ['id', birthdays[v].id],
                ['name', birthdays[v].name],
                ['birthday', birthdays[v].birthday],
                ['next', birthdays[v].next],
                ['years', birthdays[v].years]
            ]);
        }
        sortable = sortable.sort(function(a, b) { return a[3][1] - b[3][1]; });

        sortable.forEach((v, k) => {
            let time = v[3][1];
            let years, months, days, hours, minutes, seconds, ms;
            let date = new Date(v[2][1]);
            let days_in_month = new Date(date.getUTCFullYear(), date.getUTCMonth(), 0).getDate();

            seconds = Math.floor((time / 1000) % 60);
            minutes = Math.floor((time / (1000 * 60)) % 60);
            hours = Math.floor((time / (1000 * 60 * 60)) % 24);
            days = Math.floor((time / (1000 * 60 * 60 * 24)) % days_in_month);
            months = Math.floor((time / (1000 * 60 * 60 * 24 * days_in_month)) % 12);
            years = Math.floor(time / 31556952000);

            hours = ("0" + hours).slice(-2);
            minutes = ("0" + minutes).slice(-2);
            seconds = ("0" + seconds).slice(-2);

            console.log("%s%s %stime till birthday: %s%s years, %s months, %s days %s:%s:%s", colors.getColor(11), v[1][1], colors.getColor(12), colors.getColor(9), years, months, days, hours, minutes, seconds);
            colors.getColor(0);

            if (years == 0 && months == 0) {
                let send = function() {
                    email.sendEmail(`El cumpleaños de ${v[1][1]} se acerca! - ${days} días, ${hours} horas.`, `El cumpleaños de ${v[1][1]} será en ${days} días, ${hours} horas.\n
                    Fecha de nacimiento: ${v[2][1]}\n
                    Edad a cumplir: ${v[4][1]} años\n
                    Fecha: ${date.toLocaleDateString('es-MX')}`, `
                        <div style="text-align:center;">
                            <h1>El cumpleaños de ${v[1][1]} será en ${days} días, ${hours} horas.</h1>
                            <h3>Fecha de nacimiento: ${v[2][1]}</h3>
                            <h3>Edad a cumplir: ${v[4][1]} años</h3>
                            <h3>Fecha: ${date.toLocaleDateString('es-MX')}</h3>
                        </div>
                        `);

                    console.log("Correo enviado, cumpleaños de %s cercano.", v[1][1]);
                }
                switch (days) {
                    case 7:
                        send();
                        break;
                    case 3:
                        send();
                        break;
                    case 1:
                        send();
                        break;
                }

                if (days == 0) {
                    lastReminder(send, hours, minutes);
                }
            }
        });

    }, 1000);

    //#region Auto run
    if (settings.delay.enableEveryX) { // Run every X milliseconds
        setTimeout(checkDates, settings.delay.everyXMilliseconds);
    } else { // Run every day at X hour
        let now = getCurrDate();
        //now.setHours(1); // Force time, debug only
        //now.setMinutes(59); // Force time, debug only
        //now.setSeconds(55); // Force time, debug only
        let next = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        next = now - next;
        next = new Date(next);
        next.setUTCFullYear(now.getFullYear());
        next.setUTCDate(now.getDate());
        next.setUTCMonth(now.getMonth());
        next.setUTCHours(settings.delay.atXHour);
        next.setHours(settings.delay.atXHour);
        next.setUTCMinutes(0);
        next.setMinutes(0);
        next.setUTCSeconds(0);
        next.setSeconds(0);
        next.setUTCMilliseconds(0);
        next.setMilliseconds(0);

        var time_to_run = timeToDate(now, next);
        if (time_to_run.time <= 0) {
            next.setDate(next.getDate() + 1);
            time_to_run = timeToDate(now, next);
        }

        setTimeout(checkDates, time_to_run.time);
        console.log("Next run in %s milliseconds (%s:%s:%s) (%s).", time_to_run.time, time_to_run.hours, time_to_run.minutes, time_to_run.seconds, next.toString());
    }
    //#endregion
};

var lastReminder = function(send, hours, minutes) {
    var stop = false;
    if (minutes == "00")
        switch (hours) {
            case "12":
                send();
                break;
            case "03":
                send();
                break;
            case "01":
                send();
                break;
            case "00":
                stop = true;
                send();
                break;
        }
    if (!stop)
        setInterval(() => {
            lastReminder(send, hours, minutes);
        }, 60000);
}

module.exports = {
    getDate,
    checkDates,
    setup,
    getCurrDate
};