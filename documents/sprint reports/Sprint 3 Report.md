# Sprint 3 Report (April 5 2025 to Apr 27 2025)

## Sprint Video
https://youtu.be/6QTBeHOto7E

## What's New (User Facing)
* Students can now receive real time booking updates
* The notifications include auto notifications for booking confirmations etc
* For admin, the website can now aggregate data to generate reports on room occupancy, etc
* Students can now apply for a room reservation

## Work Summary (Developer Facing)
This sprint we focused on making our booking system more interactive with real-time updates and adding some admin capabilities. We built a notification system that pings students instantly when their booking status changes - this was tricky because we had to rework how our backend handles these events. For the admin side, we created reports that show room occupancy data, which meant writing some complex queries that took longer than expected to optimize. We also finished the room reservation application flow and connected it to our new notification system so everything works together smoothly. We learned that when multiple database tables need to be updated at once, we need to be really careful about transactions or things can get messy! Our git workflow got better too - fewer merge headaches this time around.

## Unfinished Work
N/A

## Completed Issues/User Stories
Here are links to the issues that we completed in this sprint:
* https://github.com/calellfiguerres/451-room-booking-system/issues/26
* https://github.com/calellfiguerres/451-room-booking-system/issues/13
* https://github.com/calellfiguerres/451-room-booking-system/issues/8
* https://github.com/calellfiguerres/451-room-booking-system/issues/35

## Code Files for Review
Please review the following code files, which were actively developed during this
sprint, for quality:
* [Aaron's PR](if completed put url here)
* [Josh's PR](https://github.com/calellfiguerres/451-room-booking-system/pull/43)
* [Grace's PR](https://github.com/calellfiguerres/451-room-booking-system/pull/44)
* [Leo's PR](https://github.com/calellfiguerres/451-room-booking-system/pull/42)

## Retrospective Summary
Here's what went well:
* Got the notification system working faster than we thought we would
* Everyone actually did code reviews this time and caught some bugs early
* We documented our SQL stuff so future-us won't be totally confused

Here's what we'd like to improve:
* Some of us (no names!) underestimated how long our tasks would take
* Need more tests because we still had some weird edge case bugs pop up

Here are changes we plan to implement in the next sprint:
* N/A