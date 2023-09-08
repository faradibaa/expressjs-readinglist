# About Project
This project is a back-end app to store and manage reading list.
User can:
1. See overview of the list.
2. Check the details of a specific book in the list.
3. Add new book.
4. Update information of a specific book in the list.
5. And delete data in the reading list.

# Dependencies
- express
- mysql2
- dotenv

# Columns in Database
- id INT AUTO_INCREMENT PRIMARY KEY,
- title VARCHAR(255),
- author VARCHAR(255),
- publisher VARCHAR(255),
- total_page SMALLINT,
- current_page SMALLINT,
- status ENUM('TBR', 'Reading', 'Hold', 'Dropped')

# Code's Notes
- `db.query(query, callback)`: to do database query.
- `(results.length !== 0)`: **true** if the table is not empty.
- `(title && author)`, `(title)`, `(author)`: to check if there are title and author queries/
if there is just title or author query.
- `(Object.keys(req.query).length === 0)`: **true** if there is no sent query.

# Problems
1. When send HTTP request with *title* and *not accepted query*
> GET http://{{server}}/?title=Girls%20in%20The%20Dark&coba=ngawur
the expected response is
> 404, "Can't use this query.", "error"
but the real result is it show all data with that title.