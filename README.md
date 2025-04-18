# MSU Tutoring Protal

## Description
A Tutoring Portal for TA tutoring that
- Take the attendance of both students and TAs
- Report infomation like how many students have taken advantage of TA tutoring, which course have the most tutor attendance, how often a TA is present for a session scheduled, etc for statistical analysis
- Informs students on tutoring session information
- Informs TAs on how many student plan to go to tutoring sessions
- Have Facial recognition clock in for TAs.

## Development Plan
### Overview
Use Stack consisting of React, Express js, Node, and Supabase(database) for the application. Maybe have to change database as I might need to transfer to a local school database. 

Better looking frontend UI will come a little later in development, just going to make it look visually OK first and functional as a base.

## Getting Started
- [x] Create the Development Environment and project folder.
- [x] Create some of the react fontend formatting and create some sample data, via json files, for the site to display. 
    - Example: created the weekly sessions view and displayed information about each session, including TA attendance.

While creating this more requirements should be gathered which will make it easier to understand the full scale of the project.

## Frontend(React)
- [x] Create components for TA/Professor Login and Student Checkin
- [x] Create navigation between components
- [x] Add login session Token Authorization
- [ ] Create Dashboard 
- [ ] Finish styling the UI
- [ ] Add custom animations 


## Backend(Express)
Integrate a backend with express and research how requests are made and how to display sample data through the backend to the client.

Understanding the backend will allow me to later easily understand how to intergrate a database into this project
- [x] Create some routes for JSON files to be read by client.
- [ ] Create the routes to the database (stop using json files)

## Database and Facial Recogntion
Research databases and python Facial recognition package (DeepFace). These two things will integrate together since face data or face images will need to be stored on the database.
- [x] Set up SupaBase Database
- [x] Create Supabase Bucket for TA face images
- [ ] Set up authorization for each account role.

## What is left to do?
-   Need more data transfering routes for uploading data to database.
-   Dashboard for Professors/Admin
-   Reports should be able to get generated on the Professor/Admin side
-   Facial recognition integration
-   Add login session Token Authorization
-   Create Dashboard 
-   Finish styling the UI
-   Add custom animations 
-   Set up authorization for Each account role.





