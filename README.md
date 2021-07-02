# BirthdatesNotifier
This is a NodeJS application that emails you when someone's birthday is near.

## Usage

#### Configuration
Head to settings.json, and configure it to your likings.
Example file:
```js
{
  "mysql":{
    "host": "MySQL Host",
    "user": "MySQL User",
    "password": "MySQL Pass",
    "db": "MySQL DB",
    "table": "birthdates"
  },
  "delay":{
    "enableEveryX": false, // If true, runs every X milliseconds, specified below.
    "everyXMilliseconds": 10000, // If above is true, check will run every 10 seconds.
    "atXHour": 2 // If enableEveryX is false, this will be used instead. Put 24 hour number here. This will be the hour when the check will be made. Default: 2 (2 a.m)
  },
  "SMTP":{
    "host": "SMTP Host",
    "port": 587, // 587 for plain or 465 for secure
    "secure": false,
    "user": "SMTP User",
    "password": "SMTP Auth Key",
    "to": "", // Where emails will be sent to. Currently it only can send emails to a single email.
    "from": "noreply@yourdomain.com" // Where emails will be sent from, make sure it's whitelisted in your SMTP provider.
  },
  "notifier":{ // WIP
    "hours":[ // When a birthday hits 0 days remaining, a loop will be ran and these values will be read.
      12,     // These will be the hours remaining at which extra emails will be sent to you
      5,      // Tbh don't know how to explain how this works.
      3,      // Basically, with this setup, when there's 12, 5, 3 or 1 hour remaining till your mate's birthday, an email will be sent.
      1       // Same for "minutes", once hours hit 0.
    ],
    "minutes":[
      30,
      5
    ]
  },
  "web": // If enabled, a web application at specified port will be created, where you will be able to check how much time is remaining from all your mate's birthdays.
    "enable": false, // WIP
    "port": 83
}
```
**Note: If you're copy pasting, remove every comment before pasting it to settings.json or app will crash.**

#### MySQL Database:
Now that you configured it to your likings, head to `birthdates.sql` file in this repository, and import it into your database.

#### Files uploading:
Lastly, go on your server that is cappable of running NodeJS and download the application files.
###### Git:
`git clone https://github.com/lRoberth/BirthdatesNotifier`
###### WGet:
`wget https://github.com/lRoberth/BirthdatesNotifier/archive/master.zip`
###### cURL
`curl -L https://github.com/lRoberth/BirthdatesNotifier/archive/master.zip`

Or manually download and upload through FTP


#### Start application:
###### NPM:
`npm start`
###### NodeJS:
`node app.js`

#### How it works:
- On start, scans the MySQL database and gets every table.
- Gets how much time remaining till closest birthday.
- If 
