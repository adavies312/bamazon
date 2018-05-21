 DROP DATABASE IF EXISTS bamazon_db;

 CREATE DATABASE bamazon_db;

 USE bamazon_db;

 CREATE TABLE products (
     item_id INT NOT NULL AUTO_INCREMENT,
     product_name VARCHAR(255),
     department_name VARCHAR(255),
     price INT,
     stock_quantity INT,
     PRIMARY KEY (item_id)
 );

 INSERT INTO products (product_name, department_name, price, stock_quantity)
 VALUES ("Monitor", "Electronics", 99, 173),
        ("Television", "Electronics", 250, 33),
        ("Video Game", "Video Games", 60, 77),
        ("Patio Table", "Home and Garden", 500, 22),
        ("Desk Chair", "Office Furniture", 120, 16),
        ("Painting", "Wall Decor", 72, 4),
        ("CD", "Music", 17, 50),
        ("Calculator", "Electronics", 82, 43),
        ("Towels", "Home and Garden", 20, 37),
        ("Blu Ray", "Movies", 18, 88);
 