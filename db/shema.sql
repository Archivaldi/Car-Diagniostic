CREATE DATABASE car_diagnostic;

USE car_diagnostic;

CREATE TABLE users
(
    user_id INT NOT NULL
    AUTO_INCREMENT,
    user_name VARCHAR
    (255),
    user_p_hash VARCHAR
    (255),
PRIMARY KEY
    (user_id)
);

    CREATE TABLE car_data
    (
        car_id INT NOT NULL
        AUTO_INCREMENT,
        user_id INT NOT NULL
        car_name VARCHAR
        (255),
     car_model VARCHAR
        (255),
        car_make VARCHAR
        (255),
     car_year INT NOT NULL
     PRIMARY KEY
        (car_id),
        FOREIGN KEY user_id REFERENCES users
        (user_id)
 );