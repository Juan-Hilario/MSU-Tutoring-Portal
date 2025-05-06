# MSU Tutoring Protal

## Description

A Tutoring Portal for TA tutoring that

-   Take the attendance of both students and TAs
-   Report infomation like how many students have taken advantage of TA tutoring, which course have the most tutor attendance, how often a TA is present for a session scheduled, etc for statistical analysis
-   Informs students on tutoring session information
-   Informs TAs on how many student plan to go to tutoring sessions
-   Have Facial recognition clock in for TAs.

## How to Run this Project

Firstly, node, npm, and python 3 need to be installed.

The Frontend or (client) has to be initialized with the `npm install` and then could be run with `npm run dev`.

The Backend or (server) has to be initialized with the `npm install` and then could be run with `npm run dev`.

The Facial recognition sever (deepface-server) has to be initialized with the `pip install requirements.txt` and then could be run with `python app.py`.

The Database should be running on Supabase but the project requires a `.env` file in the root of this project that contains the Supabase URL and api key. These are not uploaded here but can be given to whomever becomes in charge of this project or a new database could be made with a similar schema.

## Development Plan

### Overview

Use Stack consisting of React, Express js, Node, and Supabase(database) for the application. Maybe have to change database as I might need to transfer to a local school database.

Better looking frontend UI will come a little later in development, just going to make it look visually OK first and functional as a base.

## Getting Started

-   [x] Create the Development Environment and project folder.
-   [x] Create some of the react fontend formatting and create some sample data, via json files, for the site to display.
    -   Example: created the weekly sessions view and displayed information about each session, including TA attendance.

While creating this more requirements should be gathered which will make it easier to understand the full scale of the project.

## Frontend(React)

-   [x] Create components for TA/Professor Login and Student Checkin
-   [x] Create navigation between components
-   [x] Add login session Token Authorization
-   [x] Create Dashboard
-   [x] Finish Clock In page
-   [x] Finish styling the UI
-   [x] Add custom animations

## Backend(Express)

Integrate a backend with express and research how requests are made and how to display sample data through the backend to the client.

Understanding the backend will allow me to later easily understand how to intergrate a database into this project

-   [x] Create some routes for JSON files to be read by client.
-   [x] Create the routes to the database (stop using json files)

## Database and Facial Recogntion

Research databases and python Facial recognition package (DeepFace). These two things will integrate together since face data or face images will need to be stored on the database.

-   [x] Set up SupaBase Database
-   [x] Create Supabase Bucket for TA face images
-   [x] Set up authorization for each account role.
-   [x] Set up facial recognition to acutally go to the Clock in page
-   [x] Reports should be able to get generated on the Professor/Admin side

## What is left to do?

