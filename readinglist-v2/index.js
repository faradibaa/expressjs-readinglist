import express from "express";
import bodyParser from "body-parser";
import response from "./response.js";
import db from "./connection.js";

const app = express();
const port = 8000;

const table_name = "my_reading_list";

app.use(bodyParser.json());

app.get("/", (req, res, next) => {
    try {
        let sql = `SELECT id, title, author, current_page FROM ${table_name};`;
        db.query(sql, (err, results) => {
            if(err) {
                throw err;
            }
            // if table is not empty
            if(results.length !== 0) {
                const title = req.query.title;
                const author = req.query.author;

                // show list based on title and author of the book
                if(title && author) {
                    sql = `SELECT * FROM ${table_name} WHERE title = '${title}' AND author = '${author}';`;
                    db.query(sql, (err, results) => {
                        response(200, results, "success", res);
                    });
                }
                // show list based on title
                else if(title) {
                    sql = `SELECT * FROM ${table_name} WHERE title = '${title}';`;
                    db.query(sql, (err, results) => {
                        response(200, results, "success", res);
                    });
                }
                // show list based on author
                else if(author) {
                    sql = `SELECT * FROM ${table_name} WHERE author = '${author}';`;
                    db.query(sql, (err, results) => {
                        response(200, results, "success", res);
                    });
                }
                // show overview (id, title, author) of all books in the list
                else if(Object.keys(req.query).length === 0) {
                    response(200, results, "success", res);
                }
                // tell client if the query can't be used
                // else {
                //     response(404, "Can't use this query.", "error", res);
                // }
            }
            // if table is empty
            else {
                response(200, "Your list is still empty. It's time to start your reading journey!", "success", res);
            }
        });
    }
    catch(err) {
        next(err);
    }
});

app.post("/", (req, res) => {
    try {
        const { title, author, publisher, total_page, current_page, status } = req.body;
        const sql = `INSERT INTO ${table_name} (title, author, publisher, total_page, current_page, status)
                    VALUES (?, ?, ?, ?, ?, ?);`;
        
        db.query(sql, [title, author, publisher, total_page, current_page, status], (err, results) => {
            if(results?.affectedRows) {
                const data = {
                    isSuccess: results.affectedRows,
                    id: results.insertId,
                }
                response(200, data, "New book has successfully added to the list!", res);
            }
        });
    }
    catch {
        next();
    }
});

app.put("/", (req, res) => {
    try {
        const { title, author, publisher, current_page, status } = req.body;

        const sql = `UPDATE ${table_name}
                    SET current_page = ?, status = ?
                    WHERE title = ? AND author = ? AND publisher = ?;`;

        db.query(sql, [current_page, status, title, author, publisher], (err, results) => {
            // if(err) response(500, "Invalid request", "error", res);
            if(results?.affectedRows) {
                const data = {
                    isSuccess: results.affectedRows,
                    info: results.info,
                }
                response(200, data, `Data of ${title} by ${author} has been successfully updated!`, res);
            }
            else {
                // response(404, `Book with title ${title} and author name ${author} was not found.`, "error", res);
            }
        });
    }
    catch {
        next();
    }
});

app.delete("/", (req, res) => {
    try {
        const { id, title, author } = req.body;
    let sql = ``;

    if(title && author) {
        sql = `SELECT COUNT(*) as count FROM ${table_name} WHERE title = ? AND author = ?;`;
        db.query(sql, [title, author], (err, results) => {
            // if there is just one data with the sent title and author
            if(results[0].count === 1) {
                sql = `DELETE FROM ${table_name} WHERE title = ? AND author = ?;`;
                db.query(sql, [title, author], (err, results) => {
                    if(err) response(500, "invalid", "error", res);
                    if(results?.affectedRows) {
                        const data = {
                            isDeleted: results.affectedRows,
                        }
                        response(200, data, "Data has been successfully deleted!", res);
                    }
                    // else {
                    //     response(404, `There is no book with title = ${title} and author ${author}`, "error", res);
                    // }
                });
            }
            // if there are more than one data of the sent title and author
            else if(results[0].count > 1) {
                sql = `SELECT * FROM ${table_name} WHERE title = ? AND author = ?;`;
                db.query(sql, [title, author], (err, results) => {
                    response(200, 
                            `There is more than one book with same title and author. Please choose based on ID.\n${JSON.stringify(results)}`,
                            "success", res);
                });
            }
            // else {
            //     response(404, `There is no book with title ${title} with author ${author}`, "error", res);
            // }
        });
    }
    else if(id) {
        sql = `DELETE FROM ${table_name} WHERE id = ?`;
        db.query(sql, [id], (err, results) => {
            if(err) response(500, "invalid", "error", res);
            if(results?.affectedRows) {
                const data = {
                    isDeleted: results.affectedRows,
                }
                response(200, data, "Data has been successfully deleted!", res);
            }
            // else {
            //     response(404, `There is no book with ID ${id}`, "error", res);
            // }
        });
    }
    }
    catch {
        next();
    }
});

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    response(statusCode, "error", message, res);
    next();
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});