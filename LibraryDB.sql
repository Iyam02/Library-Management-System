CREATE DATABASE LibrayDB;
USE LibraryDB;

-- Genre Table
CREATE TABLE Genres (
    genre_id INT AUTO_INCREMENT PRIMARY KEY,
    genre_name VARCHAR(100) UNIQUE NOT NULL
);

-- Books Table
CREATE TABLE Books (
    book_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    genre_id INT NOT NULL,
    book_no VARCHAR(100) UNIQUE NOT NULL,
    published_year INT,                         
    genre VARCHAR(50),                          
    available_copies INT,                       
    CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    FOREIGN KEY (genre_id) REFERENCES Genres(genre_id)
);

-- Members Table
CREATE TABLE Members (
    member_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    mobile VARCHAR(20),
    CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admin/Staff Table
CREATE TABLE Admins (
    admin_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    mobile VARCHAR(20),
    CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transactions Table
CREATE TABLE Transactions (
    transaction_id INT AUTO_INCREMENT PRIMARY KEY,
    book_id INT NOT NULL,
    member_id INT NOT NULL,
    borrow_date DATE,
    return_date DATE,
    return_status BOOLEAN DEFAULT 0,
    FOREIGN KEY (book_id) REFERENCES Books(book_id),
    FOREIGN KEY (member_id) REFERENCES Members(member_id),
    CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Fines Table
CREATE TABLE Fines (
    fine_id INT AUTO_INCREMENT PRIMARY KEY,
    transaction_id INT NOT NULL,
    fine_amount DECIMAL(5, 2) DEFAULT 0.00,
    FOREIGN KEY (transaction_id) REFERENCES Transactions(transaction_id)
);
-- Insert Data into Genres Table
INSERT INTO Genres (genre_name) VALUES
('Science Fiction'),
('Fantasy'),
('Mystery'),
('Biography'),
('Self-Help'),
('Romance');

-- Insert Data into Books Table
INSERT INTO Books (title, author, genre_id, book_no, published_year, genre, available_copies) VALUES
('Dune', 'Frank Herbert', 1, 'B001', 1965, 'Science Fiction', 5),
('The Hobbit', 'J.R.R. Tolkien', 2, 'B002', 1937, 'Fantasy', 3),
('The Da Vinci Code', 'Dan Brown', 3, 'B003', 2003, 'Mystery', 7),
('Steve Jobs', 'Walter Isaacson', 4, 'B004', 2011, 'Biography', 4),
('The Power of Habit', 'Charles Duhigg', 5, 'B005', 2012, 'Self-Help', 6),
('Pride and Prejudice', 'Jane Austen', 6, 'B006', 1813, 'Romance', 8);

-- Insert Data into Members Table
INSERT INTO Members (name, email, password, mobile) VALUES
('Alice Smith', 'alice@example.com', 'password123', '1234567890'),
('Bob Johnson', 'bob@example.com', 'password456', '0987654321'),
('Charlie Brown', 'charlie@example.com', 'password789', '1122334455'),
('Dana White', 'dana@example.com', 'password321', '5566778899');

-- Insert Data into Admins Table
INSERT INTO Admins (name, email, password, mobile) VALUES
('Eve Adams', 'eve@example.com', 'adminpass1', '9998887776'),
('Frank Moore', 'frank@example.com', 'adminpass2', '6665554443');

-- Insert Data into Transactions Table
INSERT INTO Transactions (book_id, member_id, borrow_date, return_date, return_status) VALUES
(1, 1, '2024-08-01', '2024-08-15', 1),
(2, 2, '2024-08-05', '2024-08-20', 1),
(3, 3, '2024-08-10', '2024-08-25', 0),
(4, 4, '2024-08-12', NULL, 0);

-- Inserting borrowed books
INSERT INTO Transactions (book_id, member_id, borrow_date, return_date, return_status)
VALUES (1, 5, NOW(), DATE_ADD(NOW(), INTERVAL 14 DAY), 0);

INSERT INTO Transactions (book_id, member_id, borrow_date, return_date, return_status)
VALUES (2, 5, NOW(), DATE_ADD(NOW(), INTERVAL 14 DAY), 0);
