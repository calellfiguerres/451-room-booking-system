CREATE TABLE if not exists Room (
    ID VARCHAR(255) PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    Description TEXT,
    Location VARCHAR(255) NOT NULL
);

CREATE TABLE if not exists Admin (
    ID VARCHAR(255) PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    firstName VARCHAR(255) NOT NULL,
    lastName VARCHAR(255) NOT NULL
);

CREATE TABLE if not exists Student (
    ID VARCHAR(255) PRIMARY KEY,
    roomID VARCHAR(255) REFERENCES Room(ID),
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    firstName VARCHAR(255) NOT NULL,
    lastName VARCHAR(255) NOT NULL
);

create table if not exists Notifications (
    id varchar(255) primary key,
    studentId varchar(255) references Student(ID),
    content text
);

CREATE TABLE IF NOT EXISTS Session (
    ID VARCHAR(255) PRIMARY KEY,
    adminID VARCHAR(255) REFERENCES Admin(ID),
    studentID VARCHAR(255) REFERENCES Student(ID),
    CHECK (
        (adminID IS NOT NULL AND studentID IS NULL)
        OR
        (adminID IS NULL AND studentID IS NOT NULL)
    )
);

CREATE TABLE if not exists RoomRequest (
    requestID VARCHAR(255) PRIMARY KEY,
    studentId VARCHAR(255) REFERENCES Student(ID),
    roomId VARCHAR(255) REFERENCES Room(ID),
    openDate DATE NOT NULL,
    closeDate DATE NOT NULL
);


CREATE TABLE if not exists MaintenanceRequest (
    requestID INT PRIMARY KEY,
    studentId VARCHAR(255) REFERENCES Student(ID),
    roomId VARCHAR(255) REFERENCES Room(ID),
    Description TEXT,
    openDate DATE NOT NULL,
    closeDate DATE, -- made this nullable for requests that aren't closed yet
    status VARCHAR(20) NOT NULL DEFAULT 'open'
);


CREATE TABLE if not exists RoommateRequest (
    requestID VARCHAR(255) PRIMARY KEY,
    requesterId VARCHAR(255) REFERENCES Student(ID),
    requesteeId VARCHAR(255) REFERENCES Student(ID),
    Message TEXT,
    sendDate DATE NOT NULL
);


CREATE TABLE if not exists AdminRoomRequestManagement (
    managementID VARCHAR(255) PRIMARY KEY,
    adminID VARCHAR(255) REFERENCES Admin(ID),
    requestID VARCHAR(255) REFERENCES RoomRequest(requestID)
);

ALTER TABLE Room ADD COLUMN IF NOT EXISTS booked BOOLEAN DEFAULT false;
ALTER TABLE Room ADD COLUMN IF NOT EXISTS booked_by VARCHAR(255) DEFAULT NULL;

ALTER TABLE Notifications ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
