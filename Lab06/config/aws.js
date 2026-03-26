const AWS = require('aws-sdk');
require('dotenv').config();

const awsConfig = {
    accessKeyId: (process.env.AWS_ACCESS_KEY_ID || "").trim(),
    secretAccessKey: (process.env.AWS_SECRET_ACCESS_KEY || "").trim(),
    region: (process.env.AWS_REGION || "").trim()
};
// Thêm dòng này để tắt việc tự động tìm metadata service
AWS.config.ec2MetadataServiceEndpointMode = 'disabled';
// Cấu hình trực tiếp vào Instance
const s3 = new AWS.S3(awsConfig);
const dynamoDB = new AWS.DynamoDB.DocumentClient(awsConfig);

module.exports = { s3, dynamoDB };