const cron = require('node-cron')
const moment = require('moment')
const fs = require('fs')
const spawn = require('child_process').spawn

// You can adjust the backup frequency as you like, this case will run once a day
cron.schedule('* * * * *', () => {
  // Use moment.js or any other way to dynamically generate file name
  const fileName = `${process.env.DB_NAME}_${moment().format('YYYY_MM_DD')}.sql`;
  const wstream = fs.createWriteStream(`/Path/You/Want/To/Save/${fileName}`);
  console.log('---------------------');
  console.log('Running Database Backup Cron Job');
  const mysqldump = spawn('mysqldump', ['-u', process.env.DB_USER, `-p${process.env.DB_PASSWORD}`, process.env.DB_NAME])

  mysqldump
    .stdout
    .pipe(wstream)
    .on('finish', () => {
      console.log('DB Backup Completed!')
    })
    .on('error', (err) => {
      console.log(err)
    })
})

console.log('Waiting', `${process.env.DB_NAME}_${moment().format('YYYY_MM_DD')}.sql`);

