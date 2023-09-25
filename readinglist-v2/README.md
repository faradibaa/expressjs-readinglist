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

# Improve
- Make it more clean and try to add error-handling

# Errors
- If the database is not exist, the error message will be
> throw err; // Unhandled 'error' event