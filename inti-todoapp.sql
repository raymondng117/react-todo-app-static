-- Create Database
CREATE DATABASE IF NOT EXISTS todoapp;

-- Use Database
USE todoapp;

-- Create Users Table
CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL
);

-- Create Todolists Table
CREATE TABLE IF NOT EXISTS todolists (
    list_id INT AUTO_INCREMENT PRIMARY KEY,
    list_name VARCHAR(100) NOT NULL,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

DROP TABLE todoitems;

-- Create Todoitems Table
CREATE TABLE IF NOT EXISTS todoitems (
    item_id INT AUTO_INCREMENT PRIMARY KEY,
    item_name VARCHAR(100) NOT NULL,
    list_id INT,
    user_id INT,
    status ENUM('todo', 'doing', 'done') DEFAULT 'todo',
    due_date DATE, -- Due date field (only date)
    complete_date DATE, -- Completion date field (only date)
    FOREIGN KEY (list_id) REFERENCES todolists(list_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);



-- Insert Sample Records into Users Table
INSERT INTO users (username, email, password)
VALUES
('user1', 'user1@example.com', '123'),
('user2', 'user2@example.com', '123'),
('user3', 'user3@example.com', '123');

-- Insert Sample Records into Todolists Table
INSERT INTO todolists (list_name, user_id)
VALUES
('Shopping List', 1),
('Work Tasks', 1),
('Personal Goals', 1),
('Work Tasks', 2),
('Personal Goals', 3);

-- Insert Sample Records into Todoitems Table
INSERT INTO todoitems (item_name, list_id, user_id, status, due_date, complete_date)
VALUES
('Milk', 1, 1, 'todo', STR_TO_DATE('2024-04-14', '%Y-%m-%d'), NULL),
('Eggs', 1, 1, 'doing', STR_TO_DATE('2024-04-15', '%Y-%m-%d'), NULL),
('Report Presentation', 2, 1, 'done', STR_TO_DATE('2024-04-16', '%Y-%m-%d'), STR_TO_DATE('2024-04-17', '%Y-%m-%d')),
('Meeting with Client', 2, 1, 'todo', STR_TO_DATE('2024-04-18', '%Y-%m-%d'), NULL),
('Exercise', 3, 1, 'doing', STR_TO_DATE('2024-04-19', '%Y-%m-%d'), NULL),
('Read a Book', 3, 1, 'done', STR_TO_DATE('2024-04-20', '%Y-%m-%d'), STR_TO_DATE('2024-04-21', '%Y-%m-%d')),
('Go for a Run', 3, 1, 'todo', STR_TO_DATE('2024-04-22', '%Y-%m-%d'), NULL),
('Write Code', 2, 1, 'doing', STR_TO_DATE('2024-04-23', '%Y-%m-%d'), NULL),
('Finish Project', 2, 1, 'done', STR_TO_DATE('2024-04-24', '%Y-%m-%d'), STR_TO_DATE('2024-04-25', '%Y-%m-%d')));

-- mariadb 10
INSERT INTO todoitems (item_name, list_id, user_id, status, due_date, complete_date)
VALUES
('Milk', 1, 1, 'todo', '2024-04-14', NULL),
('Eggs', 1, 1, 'doing', '2024-04-15', NULL),
('Report Presentation', 2, 1, 'done', '2024-04-16', '2024-04-17'),
('Meeting with Client', 2, 1, 'todo', '2024-04-18', NULL),
('Exercise', 3, 1, 'doing', '2024-04-19', NULL),
('Read a Book', 3, 1, 'done', '2024-04-20', '2024-04-21'),
('Go for a Run', 3, 1, 'todo', '2024-04-22', NULL),
('Write Code', 2, 1, 'doing', '2024-04-23', NULL),
('Finish Project', 2, 1, 'done', '2024-04-24', '2024-04-25');



