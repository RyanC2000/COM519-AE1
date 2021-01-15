# COM519 Advanced Database Systems AE1
GitHub Repository: https://github.com/RyanC2000/COM519-AE1
Hosted Web Application: https://obscure-gorge-73341.herokuapp.com/

Note: I had difficulties enabling Heroku to access the MongoDB Atlas-hosted database. As a result, the web application cannot be accessed. The application must be run locally in development mode. 

## Introduction

When working on a project, it is important to keep track of the composite tasks and goals to ensure the outcome is realised completely. Currently, I use a pen and notepad to record tasks and check them off as I go. However, this process lacks in having any dynamic ability to adjust the tasks I have written down if I have to change course, without ending up as messy scribbles. The purpose of this project was to implement a simply-designed, clutter-free task tracking to-do list space providing the capability to quickly update and modify tasks. 

I also wanted the application to provide a separate datastore for containing small notes of ideas that come to mind throughout work. When working on a project, I am often distracted by alternative ideas and thoughts that come to mind, which can result in a loss of focus on the current task at hand. The system provides a easily-accessible space for the user to jot those ideas down and carry on with work, without the thought interfering. 
## System Overview

### Functionality
The system's primary function is to allow the user to create, retrieve, update and delete their own task items, persisted within a NoSQL MongoDB database. Each user registers an individual user account, and records are exclusive to themselves - users cannot access records another user has made. 

The key views are the daily and weekly view of a users' tasks. The daily view retrieves the tasks a user has created, dated today, providing a single interface to the user's tasks to focus on. The weekly view provides a view of the current weeks' (Monday-Sunday) tasks, with the date provided against the task for visual of all of the upcoming tasks. 

Secondarily, the user can create, retrieve, update and delete their thoughts via the Thoughts page. This presents a list of all of their notes, regardless of date. 

### Additional Functionality (Not Implemented)
Unfortunately, I was unable to achieve all of the original plans for this project in the timeframe. Additional features were to include:
- Checkbox status of task completion in the daily and weekly views, that when checked, would Utilise Ajax to update the database dynamically, without the need for a page refresh. 
- A dashboard of task metrics. This would utilise data visualisation methods to provide charts for tasks per day in the week, daily progress and weekly progress. 

### System-level Diagram

## Key Design Decisions
I selected the Model-View-Controller architecture to implement this application, which abstracts the business logic and database interface awy from the front end. This allows for UI updates to be made seamlessly without affecting the structure of the backend. The structure is also popular and relatively intuitive, which would allow for other developers to quickly get up to speed on how the application is working if this example were to be worked on in a team. 

The application uses a NoSQL MongoDB database. The application could have been driven by either an SQL or NoSQL implementation, however, the flexibility allowed in the document structure of a NoSQL document drew me to learning and implementing it in this project. A SQL database may have been useful in expressing the relationship between the user collection and the thoughts and tasks collections, where they are associated by user ID. However, this was a simple implementation in NoSQL and functioned as required. 

## Database Design
The focus database holds 3 collections, namely:
- Tasks
- Thoughts
- Users

The main data held in a task is the text, the deadline date and the user id. The text contains the user input task description and is checked to ensure it is not null before being passed in. The deadline date is set as a date datatype, and cannot be null. The user id for each document created is obtained from the session, ensuring each record is stored attributed to the user who created it, and thus users cannot access other users' documents. 

The deadline element is used in the render of the daily and weekly pages. When the daily or weekly pages are loaded, the controller retrieves the records associated with the user, and within the date constraint applicable for daily/weekly. I incorporated Moment JS for calculation of date variables in order to easily check the records being retrieved. The daily page will filter and display records where the deadline date is greater than the start of the day, and less than the end of the day. The controller function for listing weekly tasks utilises Moment JS startOf and endOf functions to calculate the start and end of the week (in ISO format, i.e. setting Monday to day 1 and Sunday to day 7). It validates the task deadline date against the start and end of the week and presents the tasks for the current week. 

The thoughts collection has a similar record structure, containing text, a date and the user id. When the thoughts page is rendered, the controller returns the thoughts for the current user id. 

## Security and Scalability
Security may be a concern with the current method of retrieving user records described in the section above. If a hacker were able to hijack a user's session and steal their user id, they may be able to instantly retrieve the tasks and thoughts associated with this user ID. 

Scalability should not be an issue with the current model. The application is only designed for small to-do tasks so the 16MB limit on a document would be unlikely to pose an issue with storage capacity. The application would also not struggle to store documents within the collection of tasks, as an individual collection can contain 2^32 documents total. However, it is clear that housing all user documents within a single collection could slow the application down in retrieving the tasks and thoughts, which is counterintuitive when the entire purpose is to provide a quick and easy to-do list. It would perhaps be more suitable to create a collection for each individual user, and filter documents through there, so that a user doesn't have to wait for the application to check all the documents user ids', where the majority are not their own. 

## Conclusion and Reflection
To conclude, the application meets the requirements of being able to create, retrieve, update and delete documents within the MongoDB NoSQL database. It can authenticate users and also filter documents to the individual user, allowing multiple users to create personal documents, invisible to others. The application also provides a front-end to-do list, in 2 different formats, and a thoughts page for recording additional data. 

Before starting development, I opted to sketch some wireframe diagrams to visualise how the website would behave for the user. By considering the use cases, I was able to draft the web pages to contain all the functionality a user would need. This in turn, caused me to consider the database design and structure as I was working through the drawings, and made for a streamlined process of shaping the database design and controller functions based upon the front-end use cases. 

On the other hand, I wish I could have completed the data visualisation task for the dashboard. Populating different graphs and charts with data pulled from the database would be an interesting task and provide the user another view on their records compared to the current lists. 

Adding the task completion tickboxes was another unfortunate sacrifice. The aim was to save a boolean 'completed' value into each task document, set to false upon task creation. When retrieved, the controller would evaluate the state of the variable, and if false, would uncheck the checkbox, and if true, check it, so the user could keep better tabs on their tasks. The user would be able to interact with this checkbox, which would use an AJAX fetch request to update the document live. This would also be key in the data visualisation implementation above, as a graph of completed vs. not completed would require this variable. 