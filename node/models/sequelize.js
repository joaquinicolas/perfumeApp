const { DataTypes, Model } = require('sequelize');
import { Sequelize } from "sequelize";
export const sequelize = new Sequelize({
  define: { timestamps: false },
  storage: './db.sqlite',
  dialect: 'sqlite'
});

export function checkConnection() {
  return sequelize
    .authenticate()
    .then(() => {
      console.log('Connection has been established successfully.');
      sequelize.sync({ force: true });
    })
    .then(() => {
      console.log('Database and tables created successfully.');
      return Promise.resolve();
    });
}

export const Commodity = sequelize.define('Commodity', {
  Description: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Cost: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0.0
  },
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: false,
    primaryKey: true
  }
}, {
  sequelize,
  modelName: 'Commodity'
});

export const Fragancia = sequelize.define('Fragancia', {
  Description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Cost: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0.0
  },
  Price: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0.0
  },
}, {
  sequelize,
  modelName: 'Fragancia'
});

export const FraganciaCommodity = sequelize.define('FraganciaCommodity', {
  ID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  Quantity: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0.0,
  }
});

Commodity.belongsToMany(Fragancia, { through: FraganciaCommodity });
Fragancia.belongsToMany(Commodity, { through: FraganciaCommodity });
FraganciaCommodity.belongsTo(Fragancia);
FraganciaCommodity.belongsTo(Commodity);
Fragancia.hasMany(FraganciaCommodity);
Commodity.hasMany(FraganciaCommodity);
