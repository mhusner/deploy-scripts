const fs = require('fs');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const config = require('../config');

const s3 = new S3Client({ region: config.aws.region });

async function uploadBackup(filePath) {
  const key = `db/${new Date().toISOString().slice(0, 10)}/billing.dump`;
  await s3.send(new PutObjectCommand({
    Bucket: config.aws.bucket,
    Key: key,
    Body: fs.createReadStream(filePath),
    ServerSideEncryption: 'AES256',
  }));
  return key;
}

module.exports = { uploadBackup };
