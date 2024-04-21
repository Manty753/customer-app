    CREATE DATABASE testdb;
    USE testdb;

    CREATE TABLE customer (
        id integer PRIMARY KEY AUTO_INCREMENT,
        company_name VARCHAR(255) NOT NULL,
        industry VARCHAR(255),
        created TIMESTAMP NOT NULL DEFAULT NOW()

    );

    INSERT INTO customer(company_name, industry)
    VALUES
    ('Kondor s.r.o.','metal-industry'),
    ('nlrealizace',"building-company");

    CREATE TABLE users (
        id integer PRIMARY KEY AUTO_INCREMENT,
        `name` VARCHAR(255),
        user_name VARCHAR(255) UNIQUE,
        `password` VARCHAR(255),
        password_confirm VARCHAR(255),
        company_id integer,
        `role` VARCHAR(255),
        created TIMESTAMP NOT NULL DEFAULT NOW(),
        FOREIGN KEY (company_id) REFERENCES customer(id) ON DELETE RESTRICT

    );
    CREATE TABLE admins (
        id integer PRIMARY KEY AUTO_INCREMENT,
        `name` VARCHAR(255),
        user_name VARCHAR(255) UNIQUE,
        `password` VARCHAR(255),
        password_confirm VARCHAR(255),
        `role` VARCHAR(255),
        created TIMESTAMP NOT NULL DEFAULT NOW()
    );

     CREATE TABLE services (
        id integer PRIMARY KEY AUTO_INCREMENT,
        company_id integer,
        user_id integer,
        `name` VARCHAR(255),
        created TIMESTAMP NOT NULL DEFAULT NOW(),
        FOREIGN KEY (company_id) REFERENCES customer(id) ON DELETE RESTRICT,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT

    );


 