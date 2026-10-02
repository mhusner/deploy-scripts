const { execSync } = require('child_process');
const config = require('../src/config');
const { uploadBackup } = require('../src/services/s3Backup');

(async () => {
  const file = `/tmp/billing-${Date.now()}.dump`;
  const { host, port, user, database, password } = config.db;

  execSync(`pg_dump -Fc -h ${host} -p ${port} -U ${user} -d ${database} -f ${file}`, {
    env: { ...process.env, PGPASSWORD: password },
    stdio: 'inherit',
  });

  const key = await uploadBackup(file);
  console.log(`backup uploaded to s3://${config.aws.bucket}/${key}`);
})().catch((err) => {
  console.error('backup failed', err);
  process.exit(1);
});
