require('dotenv').config(); // Dòng này cực kỳ quan trọng để đọc file .env
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { S3Client } = require("@aws-sdk/client-s3");

const config = {
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
};

const ddbClient = new DynamoDBClient(config);
const s3Client = new S3Client(config);

module.exports = { ddbClient, s3Client };