CREATE DATABASE DispositivosDB;
GO

USE DispositivosDB;
GO

CREATE TABLE Dispositivos (
    id        INT IDENTITY(1,1) PRIMARY KEY,
    nombre    NVARCHAR(100) NOT NULL,
    ip        NVARCHAR(50)  NOT NULL,
    estado    NVARCHAR(50)  NOT NULL DEFAULT 'activo',
    tipo      NVARCHAR(50)  NOT NULL,
    fechaCreacion DATETIME      NOT NULL DEFAULT GETDATE()
);
GO

--Datos iniciales para prueba:
INSERT INTO Dispositivos (nombre, ip, estado, tipo)
VALUES ('PC-Oficina', '192.168.0.10', 'activo', 'pc'),
 ('Alejo Martinez', '192.168.0.25', 'activo', 'celular'),
 ('TV-Smart', '192.168.0.5', 'activo', 'Televisor'),
 ('Heladera-Smart', '192.168.0.5', 'inactivo', 'Heladera');
GO

CREATE TABLE totp_secrets (
    id          INT IDENTITY(1,1) PRIMARY KEY,
    email       NVARCHAR(255)   NOT NULL,
    app_name    NVARCHAR(100)   NOT NULL,
    secret      NVARCHAR(255)   NOT NULL,
    created_at  DATETIME2       NOT NULL DEFAULT GETUTCDATE(),
    updated_at  DATETIME2       NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT uq_email_app UNIQUE (email, app_name)
);

CREATE TABLE usuarios (
    id            INT IDENTITY(1,1) PRIMARY KEY,
    email         NVARCHAR(255) NOT NULL UNIQUE,
    password_hash NVARCHAR(255) NOT NULL,
    created_at    DATETIME2     NOT NULL DEFAULT GETUTCDATE()
);
SELECT * FROM Dispositivos