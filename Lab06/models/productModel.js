const { dynamoDB } = require('../config/aws');

const TABLE_NAME = "Products";

const Product = {
    getAll: async() => {
        const params = { TableName: TABLE_NAME };
        const data = await dynamoDB.scan(params).promise();
        return data.Items;
    },

    create: async(product) => {
        const params = {
            TableName: TABLE_NAME,
            Item: product
        };
        return dynamoDB.put(params).promise();
    },

    getById: async(id) => {
        const params = {
            TableName: TABLE_NAME,
            Key: { ID: id }
        };
        const data = await dynamoDB.get(params).promise();
        return data.Item;
    },

    update: async(product) => {
        const params = {
            TableName: TABLE_NAME,
            Item: product
        };
        return dynamoDB.put(params).promise();
    },

    delete: async(id) => {
        const params = {
            TableName: TABLE_NAME,
            Key: { ID: id }
        };
        return dynamoDB.delete(params).promise();
    }
};

module.exports = Product;