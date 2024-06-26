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

        if(Object.keys(req.query).length === 0) {
            sql = `SELECT * FROM ${table_name};`;
            errorMessage = "Your reading list is empty. It's time to start your reading journey!";
        }
        else if(title && author) {
            sql = `SELECT * FROM ${table_name} WHERE title = '${title}' AND author = '${author}'`;
            errorMessage = `Book(s) with title ${title} by ${author} was not found.`;
        }
        else if(title) {
            sql = `SELECT * FROM ${table_name} WHERE title = '${title}'`;
            errorMessage = `Book(s) with title ${title} was not found.`;
        }
        else if(author) {
            sql = `SELECT * FROM ${table_name} WHERE author = '${author}'`;
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
        let paramQuery = [];

        const { title, author, publisher, total_page, current_page, status } = req.body;

        // all parameters should be sent
        if(req.body.title === undefined || 
            req.body.author === undefined || 
            req.body.publisher === undefined || 
            req.body.total_page === undefined || 
            req.body.current_page === undefined || 
            req.body.status === undefined) {
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
            response(201, "", "New book has successfully added to the list!", res);
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
        if(req.body.title === undefined || 
            req.body.author === undefined || 
            req.body.publisher === undefined || 
            req.body.current_page === undefined || 
            req.body.status === undefined) {
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
            response(200, "", `Data of book ${title} by author ${author} and publised by ${publisher} has been successfully updated!`, res);
        }
        else {
            throwError(`Failed to update data. ${title} by author ${author} and publised by ${publisher} was not found.`, 400);
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

        // delete data based on ID
        if(id) {
            sql = `DELETE FROM ${table_name} WHERE id = ?`;
            paramQuery = [id];

            const result = await dbQuery(sql, paramQuery);

            if(result?.affectedRows > 0) {
                message = `Book with ID ${id} has been successfully deleted!`;
            }
            else {
                throwError(`Failed to delete book with ID ${id}`);
            }
        }
        else if(title && author) {
            sql = `SELECT COUNT(*) as count FROM ${table_name} WHERE title = ? AND author = ?;`;
            paramQuery = [title, author];

            const result = await dbQuery(sql, paramQuery);

            // if there is just ONE book with given title and author
            if(result[0].count === 1) {
                sql = `DELETE FROM ${table_name} WHERE title = ? AND author = ?;`;

                const nextResult = await dbQuery(sql, paramQuery);
                
                if(nextResult?.affectedRows > 0) {
                    message = "Data has been successfully deleted!";
                }
            }
            // if there is just MORE THAN ONE book with given title and author
            else if(result[0].count > 1) {
                sql = `SELECT * FROM ${table_name} WHERE title = ? AND author = ?;`;

                const nextResult = await dbQuery(sql, paramQuery);

                message = `There is more than one book with same title and author. Please choose based on ID.`;

                return response(200, JSON.stringify(nextResult, null, 2), message, res);
            }
            else {
                throwError(`There is no book with title ${title} and author name ${author}`, 404);
            }
        }
        else {
            throwError("Please provide the ID of the book you want to deleted, or you can provide the title and author name of the book.", 400);
        }
        
        response(200, "", message, res);
    }
    catch(error) {
        next(error);
    }
});

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    console.error(err);
    response(statusCode, "", message, res);
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});