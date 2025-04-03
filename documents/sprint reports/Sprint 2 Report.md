# Sprint 2 Report
Video Link:

## What's New (User Facing)
* Room Reservation System - Students can now reserve rooms based on their preferences
* Roommate Request Management - Students can specify and manage roommate preferences
* Advanced Room Search - Added ability to search for rooms based on specific criteria
* Notification System - Students receive booking confirmations and important updates
* Notification Dashboard - Students can view a list of all their notifications
* Maintenance Request Tracking - Students can submit and monitor repair requests

## Work Summary (Developer Facing)
This sprint focused on enhancing the user experience by implementing core booking functionalities and communication features. We successfully built the reservation system with a roommate preference mechanism that allows students to coordinate their housing arrangements. The team implemented a robust search algorithm that filters rooms based on multiple criteria including room type, facilities, and availability. We integrated a notification system to keep students informed about their booking status and maintenance updates. The primary challenge was synchronizing the real-time updates across the database to ensure accurate availability information. We learned the importance of transaction management in SQL to maintain data integrity when multiple users interact with the booking system simultaneously.

## Unfinished Work
All planned user stories for this sprint were completed successfully. The maintenance request feature and booking history view were carried over from the previous sprint and have now been fully implemented.

## Completed Issues/User Stories
Here are links to the issues that we completed in this sprint:
* https://github.com/calellfiguerres/451-room-booking-system/issues/6
* https://github.com/calellfiguerres/451-room-booking-system/issues/12
* https://github.com/calellfiguerres/451-room-booking-system/issues/30
* https://github.com/calellfiguerres/451-room-booking-system/issues/10
* https://github.com/calellfiguerres/451-room-booking-system/issues/9
* https://github.com/calellfiguerres/451-room-booking-system/issues/26
* Josh's issue

## Incomplete Issues/User Stories
Here are links to issues we worked on but did not complete in this sprint:
* There were no incomplete issues in this sprint.

## Code Files for Review
Please review the following code files, which were actively developed during this
sprint, for quality:
* [Reservations & reservation history](https://github.com/calellfiguerres/451-room-booking-system/pull/25)
* [Maintenance requests](https://github.com/calellfiguerres/451-room-booking-system/pull/27)
* [Notifications](https://github.com/calellfiguerres/451-room-booking-system/pull/31)
* [Search rooms](https://github.com/calellfiguerres/451-room-booking-system/pull/32)
* [Aaron's PR](link)
* [Calell's PR](link)
* [Josh's PR](link)

## Retrospective Summary
Here's what went well:
* Team collaboration was strong with clear communication channels
* Database schema design proved effective for implementing complex booking relationships
* Transaction management implementation prevented data inconsistencies
* Feature implementation was completed on schedule

Here's what we'd like to improve:
* Code review process could be more thorough to catch edge cases earlier
* Better documentation of SQL queries for maintainability
* Test coverage for database operations needs expansion

Here are changes we plan to implement in the next sprint:
* Develop admin dashboard for managing room assignments and approvals
* Implement data analytics for room occupancy reporting
* Real time booking updates
