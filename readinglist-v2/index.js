import express from "express";
import bodyParser from "body-parser";
import response from "./response.js";
import dbQuery from "./dbQuery.js";
import throwError from "./throwError.js";

const app = express();
const port = 8000;

const table_name = "my_reading_list";

app.use(bodyParser.json());

app.get("/", async (req, res, next) => {
    try {
        const title = req.query.title;
        const author = req.query.author;

        let sql = "";
        let errorMessage = "";

        sql = `SELECT * FROM ${table_name} `;

        if(Object.keys(req.query).length === 0) {
            errorMessage = "Your reading list is empty. It's time to start your reading journey!";
        }
        else if(title && author) {
            sql += `WHERE title = '${title}' AND author = '${author}'`;
            errorMessage = `Book(s) with title ${title} by ${author} was not found.`;
        }
        else if(title) {
            sql += `WHERE title = '${title}'`;
            errorMessage = `Book(s) with title ${title} was not found.`;
        }
        else if(author) {
            sql += `WHERE author = '${author}'`;
            errorMessage = `Book(s) with author name ${author} was not found.`;
        }
        else {
            throwError("Query was not acceptable.", 400);
        }

        const result = await dbQuery(`${sql};`);
        if(result.length === 0) {
            throwError(errorMessage, 404);
        }
        response(200, result, "successfully received data from database", res);
    }
    catch(error) {
        next(error);
    }
});

app.post("/", async (req, res, next) => {
    try {
        let sql = "";

        const { title, author, publisher, total_page, current_page, status } = req.body;

        // all parameters should be sent
        if(!title || !author || !publisher || !total_page || !current_page || !status) {
            throwError("All required parameters must be provided.", 400);
        }

        // validation for total_page and current_page
        if(!Number.isInteger(total_page) || total_page < 0) {
            throwError("Invalid value for total_page", 400);
        }

        // validation for current_page
        if(!Number.isInteger(current_page) || current_page < 0 || current_page > total_page) {
            throwError("Invalid value for current_page", 400);
        }
        
        sql = `INSERT INTO ${table_name} (title, author, publisher, total_page, current_page, status)
                VALUES (?, ?, ?, ?, ?, ?);`;
        paramQuery = [title, author, publisher, total_page, current_page, status];

        const result = await dbQuery(sql, paramQuery);
        
        if(result?.affectedRows) {
            const data = {
                isSuccess: result.affectedRows,
                id: result.insertId,
            }
            response(201, data, "New book has successfully added to the list!", res);
        }
    }
    catch(error) {
        next(error);
    }
});

app.put("/", async (req, res, next) => {
    try {
        const { title, author, publisher, current_page, status } = req.body;

        // all parameters should be sent
        if(!title || !author || !publisher || !current_page || !status) {
            throwError("All required parameters must be provided.", 400);
        }

        // validation for current_page
        if(!Number.isInteger(current_page) || current_page < 0) {
            throwError("Invalid value for current_page", 400);
        }

        let sql = `UPDATE ${table_name}
                    SET current_page = ?, status = ?
                    WHERE title = ? AND author = ? AND publisher = ?;`;
        let paramQuery = [current_page, status, title, author, publisher];

        const result = await dbQuery(sql, paramQuery);

        if(result?.affectedRows > 0) {
            response(200, "", `Data of book ${title} by ${author} has been successfully updated!`, res);
        }
        else {
            throwError("Failed to update data.", 500);
        }
    }
    catch(error) {
        next(error);
    }
});

app.delete("/", async (req, res, next) => {
    try {
        const { id, title, author } = req.body;
        let sql = ``;
        let paramQuery = [];
        let data = "";
        let message = "";

        if(title && author) {
            sql = `SELECT COUNT(*) as count FROM ${table_name} WHERE title = ? AND author = ?;`;
            paramQuery = [title, author];

            const result = await dbQuery(sql, paramQuery);

            if(result[0].count === 1) {
                sql = `DELETE FROM ${table_name} WHERE title = ? AND author = ?;`;

                const nextResult = await dbQuery(sql, paramQuery);
                
                if(nextResult?.affectedRows) {
                    data = {
                        isDeleted: nextResult.affectedRows,
                    }
                }

                message = "Data has been successfully deleted!";
            }

            else if(result[0].count > 1) {
                sql = `SELECT * FROM ${table_name} WHERE title = ? AND author = ?;`;

                const nextResult = await dbQuery(sql, paramQuery);

                data = `There is more than one book with same title and author. Please choose based on ID.\n${JSON.stringify(nextResult)}`;
                message = "success";
            }
        }
        else if(id) {
            sql = `DELETE FROM ${table_name} WHERE id = ?`;
            paramQuery = [id];

            const result = await dbQuery(sql, paramQuery);

            if(result?.affectedRows) {
                data = {
                    isDeleted: result.affectedRows,
                }
            }
            message = "Data has been successfully deleted!";
        }
        response(200, data, message, res);
    }
    catch(error) {
        next(error);
    }
});

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    response(statusCode, "", message, res);
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});