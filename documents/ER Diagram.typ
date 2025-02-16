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
      #text(fill: gray)[_*Database Model and ER Diagram*_]
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

#align(center)[
  #v(1in)

  #text(size: 36pt)[*Room Booking System \ for Student Dormitories*]

  #v(0.25in)

  #text(size: 24pt, fill: rgb("#666666"), font: "Georgia")[_Database Model and ER Diagram_]

  #v(0.5in)

  // White Spring Ranch
  // #image("images/WSR.png")

  #v(1in)

  Grace Anderson \
  Leo Curdi \
  Josh Evans \
  Calell Figuerres \
  Aaron Howe

  #v(0.5in)
  
  #strong[#datetime.today().display("[month repr:long] [day], [year]")]
]

#pagebreak()

= User Stories
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

= Entities
- User (abstract)
- Student (concrete version of User)
- Admin (concrete version of User)
- Room
- Maintenance Request
- Room Request
- Roommate Request

= Relationships
- A `Student` lives in `Room` (many-to-one; partial participation)
- A `Student` makes `Room Request`s (one-to-many; partial participation)
- `Room Request`s request a single `Room` (one-to-one; total participation)
- A `Student` makes `Maintenance Request`s (many-to-many; partial participation)
- `Maintenance Request`s request maintenance for a single `Room` (one-to-one; total participation)
- `Admin`s manage `Room Request`s (many-to-many; total participation)
- `Student`s make and manage `Roommate Request`s (many-to-many; partial participation)

= ER Diagram

#figure(
  image("images/451-er-diagram.png"),
  caption: [ER diagram showing the relationships and entities described above]
)

= Justification
There were multiple entities in our project: most obviously are `Student`s and `Admin`s (ideally with their common attributes put into an abstract `User`). Alongside the actual users, there were also the "things" these users handle: `Student`s book and live inside of `Room`s, make `Room Request`s to try and get a certain `Room` they want, make `Maintenance Request`s when the room they're living in has something break (e.g., a light), and also make `Roommate Request`s when they want to live in a specific `Room` with someone. Lastly, the `Admin`s managed all of these requests.

As alluded to before, there are also multiple relationships that each entity has with at least some of the others. Most pertinently is that `Student`s would be living in a `Room`; however, not every `Student` does live in a `Room` (e.g., some end up living off-campus), but those that do live in exactly one `Room` (though `Room`s can have multiple occupants); hence, this is a many-to-one relationship with only partial participation. Then, `Student`s make requests for a `Room` via `Room Request`s; `Student`s can make multiple `Room Request`s, but not every `Student` will make one (e.g., again, they decide to live off-campus). Thus, `Student`s and `Room Request`s have a one-to-many relationship with partial participation. `Room Request`s themselves on request a single `Room`, but each `Room Request` _will_ request one and only one; thus, this is a one-to-one relationship with total participation.

In addition to requesting and living in `Room`s, `Student`s can also make `Maintenance Request`s for the room they live in; much like `Room Request`s, `Student`s can make as many `Maintenance Request`s as necessary but some `Student`s may not make any (e.g., nothing breaks in their room), thus this is a many-to-many relationship with partial participation. Similarly, `Student`s can make many `Roommate Request`s (but some may not make any), thus there is a many-to-many relationship with partial participation.

Lastly, `Admin`s manage (approve/decline) the `Room Request`s that `Student`s make, but any available `Admin` can do that and all `Room Request`s will (eventually) be approved or declined, thus there is a many-to-many relationship with total participation.