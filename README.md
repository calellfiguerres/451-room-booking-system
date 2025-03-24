# Room Booking System for Student Dormitories
## Team Members
- Grace Anderson
- Leo Curdi
- Josh Evans
- Calell Figuerres
- Aaron Howe

## How to Run
Setup the PGAdmin database
- create a .env in app/server
- put into the .env file:
    PORT=3007 # random port
  
    DB_HOST=localhost
  
    DB_PORT=5432
  
    DB_NAME=451-App
  
    DB_USER=postgres
  
    DB_PASSWORD=postgres
  
- Go into PGAdmin
- go to servers > postgreSQL > databases
- right click, create database
- call it '451-App', leave the owner as 'postgres'
- hit save
- make sure it was created
- done


To run the client:

```
cd app/client
npm install
npm run dev
```

To run the server:

```
cd app/server
npm install
npm run dev
```
