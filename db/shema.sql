CREATE DATABASE bike_trip;

USE bike_trip;

CREATE TABLE users(
    user_id INT NOT NULL AUTO_INCREMENT,
    user_name VARCHAR(55),
    user_email VARCHAR(55),
    user_hash_p VARCHAR(250),
    role_id INT NOT NULL,
    FOREIGN KEY (role_id) REFERENCES role_types(role_id),
    PRIMARY KEY (user_id)
);

CREATE TABLE role_types(
    role_id INT NOT NULL,
    role_name VARCHAR(50),
    PRIMARY KEY (role_id)
);