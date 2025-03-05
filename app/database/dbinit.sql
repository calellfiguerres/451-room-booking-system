CREATE TABLE Admin (
    ID VARCHAR(255) PRIMARY KEY,
    firstName VARCHAR(255) NOT NULL,
    lastName VARCHAR(255) NOT NULL
);


CREATE TABLE Student (
    ID VARCHAR(255) PRIMARY KEY,
    roomID VARCHAR(255) REFERENCES Room(ID),
    firstName VARCHAR(255) NOT NULL,
    lastName VARCHAR(255) NOT NULL,
);


CREATE TABLE Room (
    ID VARCHAR(255) PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    Description TEXT,
    Location VARCHAR(255) NOT NULL
);


CREATE TABLE RoomRequest (
    requestID INT PRIMARY KEY,
    studentId VARCHAR(255) REFERENCES Student(ID),
    roomId VARCHAR(255) REFERENCES Room(ID),
    openDate DATE NOT NULL,
    closeDate DATE NOT NULL
);


CREATE TABLE MaintenanceRequest (
    requestID INT PRIMARY KEY,
    studentId VARCHAR(255) REFERENCES Student(ID),
    roomId VARCHAR(255) REFERENCES Room(ID),
    Description TEXT,
    openDate DATE NOT NULL,
    closeDate DATE NOT NULL
);


CREATE TABLE RoommateRequest (
    requestID INT PRIMARY KEY,
    requesterId VARCHAR(255) REFERENCES Student(ID),
    requesteeId VARCHAR(255) REFERENCES Student(ID),
    Message TEXT,
    sendDate DATE NOT NULL
);


CREATE TABLE AdminRoomRequestManagement (
    managementID VARCHAR(255) PRIMARY KEY,
    adminID VARCHAR(255) REFERENCES Admin(ID),
    requestID INT REFERENCES RoomRequest(requestID)
);
