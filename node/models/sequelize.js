const { DataTypes, Model } = require('sequelize');
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize({
  define: { timestamps: false },
  storage: './db.sqlite',
  dialect: 'sqlite'
});

module.exports.checkConnection = function () {
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

module.exports.Commodity = sequelize.define('Commodity', {
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

module.exports.Fragancia = sequelize.define('Fragancia', {
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

module.exports.FraganciaCommodity = sequelize.define('FraganciaCommodity', {
  Quantity: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0.0
  },
  Fragancia_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  Commodity_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'FraganciaCommodity'
});

//this.Commodity.belongsToMany(this.Fragancia, { through: this.FraganciaCommodity, foreignKey: 'commodity_id', sourceKey: 'id' });
//this.Fragancia.belongsToMany(this.Commodity, { through: this.FraganciaCommodity, foreignKey: 'fragancia_id', sourceKey: 'id' });
