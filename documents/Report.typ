// Paper Setup
#set page(paper: "us-letter", margin: (x: 1in), 
  header: context [
    #if counter(page).get().first() > 1 [
      #h(1fr)
      #text(fill: gray)[_*Room Booking System for Student Dormitories*_]
    ]
  ],
  footer: context [
    #if counter(page).get().first() > 1 [
      #text(fill: gray)[_*Project Report*_]
      #h(1fr)
      #strong[#counter(page).display("1")]
    ]
  ]
)
#set text(size: 12pt, font: "Calibri")
#set par(justify: true)

#set heading(numbering: "I. 1. a. i.")
#show heading.where(level: 1): set text(size: 20pt, fill: rgb("#666666"), font: "Georgia", style: "italic", weight: "regular")
#show link: underline

// Functions
#let useCasesCount = counter("usecases")
#let usecase(
  title,
  actors: [
    - None
  ],
  precondition: [
    - precondition
  ],
  postcondition: [
    - postcondition
  ],
  basicpath: [
    + basic
    + path
  ],
  alternatepath: [
    - None
  ],
  related: [
    - None
  ],
  requirements: [
    - None
  ]
) = {
  useCasesCount.step()

  let useCaseID = "UC-" + context useCasesCount.display()

  set par(justify: false)
  [#underline[*#useCaseID:*] #title]

  table(
    columns: (20%, 80%),
    inset: 10pt,
    align: horizon,
    [*Actors*], actors,
    [*Pre-condition*], precondition,
    [*Post-condition*], postcondition,
    [*Basic Path*], basicpath,
    [*Alternative Path*], alternatepath,
    [*Related Requirements*], requirements
  )
}

#let functionalRequirementsCount = counter("functionalrequirements")
#let functionalrequirement(
  title, 
  description: [], 
  source: [],
  justification: []
) = {
  functionalRequirementsCount.step()
  set par(justify: false)

  let functionalRequirementID = "FR-" + context functionalRequirementsCount.display()

  [#underline[*#functionalRequirementID:*] #title]

  let rows = ();

  if description != [] {
    rows.push([*Description*])
    rows.push([#description])
  }

  if source != [] {
    rows.push([*Source*])
    rows.push([#source])
  }

  if justification != [] {
    rows.push([*Justification*])
    rows.push[#justification]
  }

  table(
    columns: (20%, 80%),
    inset: 10pt,
    align: horizon,
    // [*Description*], [#description],
    // [*Source*], [#source],
    // [*Priority*], [#prioritystring]
    ..rows
  )
}

// Title Page
#align(center)[
  #v(1in)

  #text(size: 36pt)[*Room Booking System \ for Student Dormitories*]

  #v(0.25in)

  #text(size: 24pt, fill: rgb("#666666"), font: "Georgia")[_Project Report_]

  #v(0.5in)

  // White Spring Ranch
  // #image("images/WSR.png")

  #v(0.5in)

  // Ryan Biggs \
  // Calell Figuerres \ 
  // Dillon Kamin \
  // Alexander Larsen
  
  #table(
    columns: (1.5in, 1in),
    stroke: none,
    [Grace Anderson], [11759304],
    [Leo Curdi], [11704166],
    [Josh Evans], [11802879],
    [Calell Figuerres], [11776119],
    [Aaron Howe], [11635434] 
  )
  
  // Grace Anderson (11759304) \
  // Leo Curdi (11704166) \
  // Josh Evans (11802879) \
  // Calell Figuerres (11776119) \
  // Aaron Howe (11635434)

  #v(0.75in)

  #strong[#datetime.today().display("[month repr:long] [day], [year]")]
 
  #v(0.75in)

  CptS 451 - Introduction to Database Systems \
  Parteek Kumar \
]

#pagebreak()

#heading(outlined: false, numbering: none)[Abstract]
Dormitory reservation software causes adverse effects on student bodies in higher education when lacking an efficient database management system. Many universities are seeing either a rising student enrollment, or seeing severe drops in enrollment, and either situation can be difficult to manage without a well-implemented, automated database. Our database management system follows a design structure that allows students to intuitively complete and submit applications for room reservations and gives administrative entities a system that's simple enough to easily navigate, and complex enough to have authoritative control. Our fullstack utilizes TypeScript for type safety and sound communication between the frontend and backend frameworks, React on the client-side, Express.js API with tRPC, and PostreSQL for databasement management. Our goal is to cut reservation assignment and processing time by at least half of what is currently shown by real-world data, and reduce conflict-causing errors such as double-reservations.

#pagebreak()

// Table of Contents
#heading(outlined: false, numbering: none)[Table of Contents]
#outline(
  title: none,
  indent: auto
)

#pagebreak()

= Introduction
Managing room bookings in student dorms can be a difficult, complex, and time consuming process. Our booking system for student dorms aims to streamline this process by giving an efficient, user friendly, and automated solution.  The system allows students to do all the tasks they need to do that are related with finding, scheduling and booking dorms all on the same platform.  The system also allows for admins to oversee all actions being made by students,

Our system is designed to enhance accessibility, reduce admin workload and improve the experience for students.  With many features like real time updates, automatic notifications, tracking, and more we are able to ensure a seamless booking process while maintaining the necessary regulations. This report details the design, development and implementations of our room booking system.  It will cover the functional and non-functional requirements, structure, and key feature that make is an effective solution. 

#pagebreak()

= Functional and Non-Functional Requirements
== Functional Requirements
#functionalrequirement(
  "Registration",
  description: [
    Users should be able to register with their academic credentials (ID, name, etc.)
  ],
  justification: [
    Key "root" in allowing rooms to be assigned to people in the first place (e.g., users are the ones completing actions on the website)
  ]
)

#functionalrequirement(
  "Administrator Designation",
  description: [
    Users should be able to be designated as system administrators who can approve/disapprove room bookings, room assignments, and occupancy reports.
  ],
  justification: [
    Key "root" in allowing rooms to be assigned to people in the first place (e.g., administrators are the ones to figure out room assignments at all)
  ]
)

#functionalrequirement(
  "Student Designation",
  description: [
    Users should be able to designated as students who can request certain rooms, make roommate requests, reserve lounges, submit maintenance requests, etc.
  ],
  justification: [
    Key "root" in allowing rooms to be assigned to people in the first place (e.g., students are the ones who want to be assigned to rooms)
  ]
)

#functionalrequirement(
  "Maintenance Request System",
  description: [
    Students must be able to submit and track maintenance requests for the room they've been assigned.
  ],
  justification: [
    Ensures proper room maintenance and student satisfaction
  ]
)

#functionalrequirement(
  "Room Search and Filtering",
  description: [
    Students must be able to search and filter rooms based on type, facilities, and availability
  ],
  justification: [
    Enables efficient room selection process and filtering based on student preferences
  ]
)

#functionalrequirement(
  "Real-time Booking Management",
  description: [
    System must handle room bookings in real-time with immediate availability updates
  ],
  justification: [
    Prevents double bookings, ensures data accuracy, and allows for a much snappier user experience
  ]
)

#functionalrequirement(
  "Roommate Requests",
  description: [
    Description: Students must be able to make and respond to roommate requests
  ],
  justification: [
    Facilitates student preferences and social arrangements
  ]
)

#functionalrequirement(
  "Booking History",
  description: [
    Users must be able to view their booking history and current reservations
  ],
  justification: [
    Users must be able to view their booking history and current reservations
  ]
)

#functionalrequirement(
  "Compliance Tracking",
  description: [
    System stores data related to each and every dorm room (names, safety compliance, max limit on occupancy, maintenance, etc.)
  ],
  justification: [
    Administrators must keep track of how each room is being used, whether rules are being violated (and, if so, how often they are)
  ]
)

#functionalrequirement(
  "Automated Notification System",
  description: [
    Website must send automatic notifications for booking confirmations, move in/out dates/times, maintenance updates, and inspections
  ],
  justification: [
    Ensures that students receive important communications in a reliable, effective, and timely manner, to prevent students from missing important dates and times
  ]
)

#functionalrequirement(
  "Data Analytics and Reporting",
  description: [
    Website should aggregate data to generate reports on room occupancy, bookings, and maintenance records
  ],
  justification: [
    Provides administrators with valuable insights necessary for critical decision making, planning, and optimization.
  ]
)

// #pagebreak()

== User Stories
+ As a user I want to register with my credentials
+ As a user I want to be designated as an admin who can approve/disapprove room bookings, etc.
+ As a user I want to be able to be designated as a student who requests certain rooms, etc.
+ As a student I want to be able to submit and track maintenance requests
+ As a student I want to be able to search and filter rooms based on criteria.
+ The system mush handle room bookings in real-time with immediate updates
+ As a student I want to make and respond to roommate requests
+ As a user I want to be able to view my booking history and current reservation
+ As the system it should store data related to each and every dorm room
+ As the website it should send auto notifications for booking confirmations
+ As the website, it should aggregate data to generate reports on room occupancy, etc.

== Non-Functional Requirements
+ *Secure* - the website should be reasonably secure, such as preventing user information from being leaked; at the same time, users should as be prevented from doing actions outside their "jurisdiction" (e.g., students shouldn't be allowed to handled administrator tasks).
  // - *Justification:* these are basic requirements of all websites centered around user authentication
+ *Responsive* - the website should be reasonably responsive and "snappy"; e.g., it should take as little time as possible for user pages to load or be updated after submitting data changes.
  // - *Justification:* snappier, more responsive websites provide better user experiences (and are, in general, easier to use compared to slower websites)
+ *Scalable* - the website should handle a reasonable number of current users, and be able to scale to handle high-traffic periods
  // - *Justification:* supports high-traffic periods like term start
+ *Data Validation* - website must validate all input data before processing
  // - *Justification:* maintains data integrity and prevents errors
+ *Error Resistant* - the website must provide clear error messages with suitable recovery options
  // - *Justification:* improves user experience during problems
+ *FERPA Compliant* - the website must abide by standard FERPA regulations
  // - *Justification:* required by all websites storing and handling data of students
+ *Reliable* - the system must have a high percentage uptime (99% or higher)
  // - *Justification:* given the critical nature of the application, ensures that users can always access the platform
+ *Auditable* - the system should log all key actions (e.g., bookings, cancellations, admin overrides) to an audit log for security and compliance purposes.
  // - *Justification:* helps in tracking issues, ensuring transparency, and maintaining accountability for changes made in the system.
+ *Configurable* - the system should allow administrators to configure certain parameters (e.g., booking limits, dorm policies, blackout dates) without requiring code changes.
  // - *Justification:* helps in describing and tracking exact building and room conditions, both for administrators to keep track of and for students to be aware of when reserving
+ *Accessible* - the website (particularly the frontend) should be usable by as many people as possible, from "regular" users who have no hearing or sight impediments, to blind or deaf users who would have a harder time using the website otherwise
  // - *Justification:* basic requirement for most online websites

#pagebreak()

= Database Design
== ER Diagram
#figure(
  image("images/451 proj er diagram revised.png"),
  caption: [ER Diagram describing the main entities in our project and the relationship each entity has with the others it interacts with.]
)

== Conversion Process
To convert our ER diagram into relational tables, we need to translate the entities and relationships: entities become tables, attributes become columns, primary keys and constraints are created to enforce the schema, and foreign keys are created to link relationships between entities.

The conversion process will vary based on different cardinalities for relationships:
- One-to-one: the foreign key can be placed in either of the tables.
- One-to-many / many-to-one: the foreign key should be placed in the table on the many side of the relationship, to avoid needing to create another table.
- Many-to-many: you need to create a new table to store the relationship, since both sides of the relationship could have many connections and thus need to reference an unbounded amount of foreign keys. Instead, the foreign key of the new table will point to the primary keys of the entities involved in the relationship.

#pagebreak()

== Tables (from ER Diagram)
=== Admin
#table(
  columns: (20%, 20%, 20%, 40%),
  [*Attribute*], [*Type*], [*Constraints*], [*Description*],
  [`ID`], [string], [Primary Key], [The admin's unique ID],
  [`firstName`], [string], [Not Null], [the first name of the admin],
  [`lastName`], [string], [Not Null], [the last name of the admin]
)

=== Student
#table(
  columns: (20%, 20%, 20%, 40%),
  [*Attribute*], [*Type*], [*Constraints*], [*Description*],
  [`ID`], [string], [Primary Key], [The student's unique ID],
  [`roomID`], [string], [Foreign Key], [the room the student is staying in],
  [`firstName`], [string], [Not Null], [the first name of the student],
  [`lastName`], [string], [Not Null], [the last name of the student]
)

=== Room
#table(
  columns: (20%, 20%, 20%, 40%),
  [*Attribute*], [*Type*], [*Constraints*], [*Description*],
  [`ID`], [string], [Primary Key], [The room's unique ID],
  [`name`], [string], [Not Null], [The name of the room],
  [`description`], [string], [Not Null], [A description of the room],
  [`location`], [string], [Not Null], [The location of the room]
)

=== Room Request
#table(
  columns: (20%, 20%, 20%, 40%),
  [*Attribute*], [*Type*], [*Constraints*], [*Description*],
  [`requestID`], [int], [Primary Key], [A unique ID for the request],
  [`studentID`], [string], [Foreign Key], [The ID of the student making the request],
  [`roomID`], [string], [Foreign Key], [The ID of the room being requested],
  [`openDate`], [Date], [Not Null], [The date when the request was created],
  [`closeDate`], [Date], [], [The date when the request was closed]
)

=== Maintenance Request
#table(
  columns: (20%, 20%, 20%, 40%),
  [*Attribute*], [*Type*], [*Constraints*], [*Description*],
  [`requestID`], [int], [Primary Key], [A unique ID for the request],
  [`studentID`], [string], [Foreign Key], [The ID of the student making the request],
  [`roomID`], [string], [Foreign Key], [The ID of the room being requested],
  [`description`], [string], [Not Null], [A description of the problem],
  [`openDate`], [Date], [Not Null], [The date when the request was created],
  [`closeDate`], [Date], [], [The date when the request was closed]
)

=== Roommate Request
#table(
  columns: (20%, 20%, 20%, 40%),
  [*Attribute*], [*Type*], [*Constraints*], [*Description*],
  [`requestID`], [int], [Primary Key], [A unique ID for the request],
  [`requesterID`], [string], [Foreign Key], [The ID of the person making the request],
  [`requesteeID`], [string], [Foreign Key], [The ID of the person being requested as a roommate],
  [`message`], [string], [], [An explanation of why they want to be roommates],
  [`sendDate`], [Date], [Not Null], [The date when the request was sent]
)

=== Admin Room Request Management
#table(
  columns: (20%, 20%, 20%, 40%),
  [*Attribute*], [*Type*], [*Constraints*], [*Description*],
  [`managementID`], [string], [Primary Key], [A unique ID for the management transaction],
  [`adminID`], [string], [Foreign Key], [The admin who's managing a room request],
  [`requestID`], [string], [Foreign Key], [The room request being managed]
)

#pagebreak()

== Relationships
=== Student lives in Room (M:1)
Many students can live in one room.

We model this by creating a foreign key `roomID` in the student table to store the room they are in.

=== Student makes Room Requests (1:M)
One student can make many room requests, but a room request belongs to one student. 

Put a foreign key `studentID` in the room request table to point toward the student who made the request.

=== Room Requests request a room (M:1)
One room request points towards one room, but a room can have many room requests at any given time.

Best option is to put a `roomID` foreign key in the room requests table to point towards the room being requested.

=== Student makes Maintenance Requests (M:M)
A student can make many maintenance requests, but each maintenance request belongs to one student.

To handle this, we'll add a `studentID` in the maintenance requests table for the student that made the request.

=== Maintenance Requests requests maintenance for a Room (M:1)
A maintenance request points to one room, but a room can have many maintenance requests at a given time.

To model this, we put the foreign key `roomID` into maintenance request table, pointing at the room it is requesting.

=== Admin manages Room Request (M:M)
One admin can manage many room requests, and one room request can be managed by many admin.

To handle this, we must create a separate table for the relationship (Admin Room Request Management). This table will store a management relationship instance, an `adminID` and a `requestID` as foreign keys to point to the admin doing the managing and the request being managed.

=== Student makes/manages Roommate Requests (M:1)
A student can make many roommate requests, but a request is only made by one student.

We need to put a foreign key for the student requesting the roommate and the student getting requested as foreign keys in the roommate request table to reference the students table.

#pagebreak()

== Table Creation Commands
```sql
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
    studentID VARCHAR(255) REFERENCES Student(ID),
    roomID VARCHAR(255) REFERENCES Room(ID),
    openDate DATE NOT NULL,
    closeDate DATE NOT NULL
);


CREATE TABLE MaintenanceRequest (
    requestID INT PRIMARY KEY,
    studentID VARCHAR(255) REFERENCES Student(ID),
    roomId VARCHAR(255) REFERENCES Room(ID),
    description TEXT,
    openDate DATE NOT NULL,
    closeDate DATE NOT NULL
);


CREATE TABLE RoommateRequest (
    requestID INT PRIMARY KEY,
    requesterId VARCHAR(255) REFERENCES Student(ID),
    requesteeID VARCHAR(255) REFERENCES Student(ID),
    Message TEXT,
    sendDate DATE NOT NULL
);


CREATE TABLE AdminRoomRequestManagement (
    managementID VARCHAR(255) PRIMARY KEY,
    adminID VARCHAR(255) REFERENCES Admin(ID),
    requestID INT REFERENCES RoomRequest(requestID)
);
```

== Redundancy Elimination and Data Normalization
Each column contains only one value. We created separate tables to represent many to many relationships, so that we never have to store many values within one column. This is vital for accessing and modifying the data within the tables.

Each table only contains data relevant to the entity or relationship the table is based on (aka the primary key). We don't have information about other entities or relationships within the table, and instead we only reference that information through foreign keys. A byproduct of this is that no data field is repeated anywhere in the schema and thus we only have one single source of truth for all data, ensuring data consistency and helping with data integrity.