-- Active: 1716911674694@@127.0.0.1@3306@qrt_master

create table battalion (
    battalion_id INT AUTO_INCREMENT PRIMARY KEY,
    battalion_name VARCHAR(200) NOT NULL UNIQUE
)

create table platoon (
    platoon_id INT AUTO_INCREMENT PRIMARY KEY,
    platoon_name VARCHAR(200) NOT NULL,
    battalion_id INT NOT NULL,
    CONSTRAINT battalion_platoon_name UNIQUE (battalion_id, platoon_name)
)

create table users (
    id int AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE,
    password VARCHAR(1000) NOT NULL,
    role ENUM(
        'platoon',
        'battalion',
        'admin'
    ) NOT NULL, -- platoon / battalion / admin
    level_id INT NOT NULL,
    created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted_date DATETIME NULL
)

create or replace view users_view as (
    SELECT
        id,
        username,
        role,
        level_id,
        battalion_name,
        platoon_id,
        platoon_name,
        battalion_id,
        created_date,
        deleted_date
    FROM (
            SELECT users.*, battalion.*, platoon.platoon_id, platoon.platoon_name
            FROM
                users
                INNER JOIN platoon ON platoon.platoon_id = level_id
                INNER JOIN battalion USING (battalion_id)
            where
                deleted_date IS NULL
                AND role = 'platoon'
            UNION ALL
            SELECT users.*, battalion.*, platoon.platoon_id, platoon.platoon_name
            FROM
                users
                INNER JOIN battalion ON battalion.battalion_id = level_id
                LEFT JOIN platoon USING (battalion_id)
            where
                deleted_date IS NULL
                AND role = 'battalion'
                OR (
                    role = 'admin'
                    AND level_id != 0
                )
            UNION ALL
            SELECT users.*, battalion.*, platoon.platoon_id, platoon.platoon_name
            FROM users
                INNER JOIN battalion ON TRUE
                LEFT JOIN platoon USING (battalion_id)
            where
                deleted_date IS NULL
                AND role = 'admin'
                AND level_id = 0
        ) a
)

create table soldiers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    f_name VARCHAR(50) NOT NULL,
    l_name VARCHAR(50) NOT NULL,
    personal_id VARCHAR(20) NOT NULL,
    department VARCHAR(50) NOT NULL,
    role VARCHAR(50) NOT NULL,
    platoon_id INT NOT NULL,
    created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted_date DATETIME NULL
)

create table soldier_activity (
    id INT AUTO_INCREMENT PRIMARY KEY,
    soldier_id INT NOT NULL,
    platoon_id INT NOT NULL,
    location VARCHAR(200) NOT NULL,
    note VARCHAR(1000) NULL,
    start_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    end_date DATETIME NULL
)

create table equipment (
    id INT AUTO_INCREMENT PRIMARY KEY,
    platoon_id INT NOT NULL,
    name VARCHAR(200) NOT NULL,
    type ENUM('controlled', 'regular') NOT NULL
)

create table equipment_registry (
    id INT AUTO_INCREMENT PRIMARY KEY,
    platoon_id INT NOT NULL,
    equipment_id INT NOT NULL,
    current_count INT NOT NULL,
    required_count INT NOT NULL,
    register_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted_date DATETIME NULL
)

create table controlled_equipment_registry (
    id INT AUTO_INCREMENT PRIMARY KEY,
    platoon_id INT NOT NULL,
    equipment_id INT NOT NULL,
    soldier_id INT NOT NULL,
    item_code VARCHAR(50) NOT NULL,
    register_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted_date DATETIME NULL
)

create table equipment_signing (
    id INT AUTO_INCREMENT PRIMARY KEY,
    soldier_id INT NOT NULL,
    platoon_id INT NOT NULL,
    equipment_id INT NOT NULL,
    start_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted_date DATETIME NULL
)

create table controlled_equipment_signing (
    id INT AUTO_INCREMENT PRIMARY KEY,
    soldier_id INT NOT NULL,
    platoon_id INT NOT NULL,
    equipment_id INT NOT NULL,
    start_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted_date DATETIME NULL
)