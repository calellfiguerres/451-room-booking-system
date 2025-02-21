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

  #v(1in)

  // Ryan Biggs \
  // Calell Figuerres \ 
  // Dillon Kamin \
  // Alexander Larsen
  
  Grace Anderson \
  Leo Curdi \
  Josh Evans \
  Calell Figuerres \
  Aaron Howe

  #v(1in)

  // Parteek Kumar \
  // CptS 451 \
  
  // #v(0.5in)

  #strong[#datetime.today().display("[month repr:long] [day], [year]")]
]

#pagebreak()

#heading(outlined: false, numbering: none)[Abstract]
#lorem(100)

#pagebreak()

// Table of Contents
#heading(outlined: false, numbering: none)[Table of Contents]
#outline(
  title: none,
  indent: auto
)



#pagebreak()

= Introduction
#lorem(100)

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
#lorem(100)

== Tables (from ER Diagram)
#lorem(100)