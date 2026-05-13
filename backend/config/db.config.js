const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
        pool: {
            max: 10,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        define: {
            timestamps: true,
            underscored: true
        }
    }
);

const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Sequelize: Database connected successfully');
    } catch (err) {
        console.error('Sequelize: Database connection failed:', err.message);
    }
};

testConnection();

module.exports = sequelize;
