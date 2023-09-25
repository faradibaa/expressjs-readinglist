import db from "./connection.js";

const dbQuery = (sql, params) => {
    return new Promise((resolve, reject) => {
        if(params) {
            db.query(sql, params, (err, results) => {
                if(err) return reject(err);
                resolve(results);
            });
        }
        
        db.query(sql, (err, results) => {
            if(err) return reject(err);
            resolve(results);
        });
    });
}

export default dbQuery;