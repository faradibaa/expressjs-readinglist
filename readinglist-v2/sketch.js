import express from "express";
import bodyParser from "body-parser";
import response from "./response.js";
import dbQuery from "./dbQuery.js";
import throwError from "./throwError.js";

const app = express();
const port = 8000;

const table_name = "my_reading_list";

app.use(bodyParser.json());

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

                data = `There is more than one book with same title and author. Please choose based on ID.\n${JSON.stringify(nextResult, null, 2)}`;
                message = "success";
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
    response(statusCode, "", message, res);
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});