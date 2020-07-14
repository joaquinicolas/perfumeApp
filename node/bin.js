const { readData, readCommodities } = require('.').Excel;
const { save, createCommodity } = require('.').DB;
const { checkConnection } = require('./models/sequelize');
const insertCommodities = true,
    insertFragancias = true;

checkConnection()
    .then(() => {
        if (insertCommodities) {
            return readCommodities();
        }
        return Promise.resolve([]);
    })
    .then(cs => {
        if (cs.length > 0) {
            const ops = cs.map(val => createCommodity(val));
            return Promise
                .all(ops)
                .then(() => {
                    return Promise.resolve();
                });
        }
        return Promise.resolve();

    })
    .then(() => {
        if (insertFragancias) {
            return readData();
        }
        return Promise.resolve([]);
    })
    .then((fragancias) => {
        if (fragancias.length > 0) {
            const ops = fragancias.map(value => save(value));
            return Promise
                .all(ops)
                .then(() => {
                    return Promise.resolve();
                })
        }
        return Promise.resolve();
    })
    .then(() => {
        console.log("Operations completed.");
    })
    .catch(reason => {
        console.error('Unable to connect to database: ', reason);
    });



