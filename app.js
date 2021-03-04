require('dotenv').config();
const cron = require('node-cron');
const moment = require('moment');
const fs = require('fs');
const spawn = require('child_process').spawn;

// You can adjust the backup frequency as you like, this case will run once a day
cron.schedule('0 0 * * *', () => {
  const dbs = process.env.DB_NAMES.split(',');
  for (i = 0; i < dbs.length; i++) {
    let dbName = dbs[i].trim();

    const fileName = `${dbName}_${moment().format('YYYY_MM_DD_HH')}.sql`;
    const wstream = fs.createWriteStream(`${process.env.BACKUP_DIR}/${fileName}`);
    console.log('---------------------');
    console.log('Running Database Backup Cron Job');
    const mysqldump = spawn('mysqldump', ['-u', process.env.DB_USER, `-p${process.env.DB_PASSWORD}`, process.env.DB_NAME])

    mysqldump
      .stdout
      .pipe(wstream)
      .on('finish', () => {
        console.log(new Date(), 'DB Backup ${dbName} Completed!')
      })
      .on('error', (err) => {
        console.log(new Date(), err)
      });
  }
}, {
  timezone: "Asia/Jakarta"
});

console.log(new Date(), 'mysqlbackup running');