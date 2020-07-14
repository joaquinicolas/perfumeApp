const { readData } = require('.').Excel;
const { save, createCommodity } = require('.').DB;
import { checkConnection } from "./models/sequelize";
const insertCommodities = true,
    insertFragancias = false;

checkConnection()
    .then(() => {
        if (insertFragancias) {
            return readData();
        }
        return Promise.resolve([]);
    })
    .then((fragancias) => {
        const ops = fragancias.map(value => save(value));
        return Promise
            .all(ops)
            .then(() => console.log('All fragancias operations completed.'))
    })
    .then(() => {
        if (insertCommodities) {
            // TODO: read commodities.
        }
        return Promise.resolve([]);
    })
    .then(cs => {
        const ops = cs.map(val => createCommodity(val));
        return Promise
            .all(ops)
            .then(() => console.log('All commodities operations completed.'));
    })
    .catch(reason => {
        console.error('Unable to connect to database: ', reason);
    });



