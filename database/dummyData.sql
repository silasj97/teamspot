USE TEAMSPOT;

#Populate User Table
INSERT INTO USERS VALUES (
  1,
  'jacobwilson',
  'jacob_w_88@yahoo.com',
  'password',
  'Jacob',
  'Wilson',
  'image.url',
  0
);
INSERT INTO USERS VALUES (
  2,
  'tomleamon',
  'toml@gmail.com',
  'password',
  'Tom',
  'Leamon',
  'image.url',
  0
);
INSERT INTO USERS VALUES (
  3,
  'smiguel',
  'smiguel@gmail.com',
  'password',
  'Nate',
  'Sanchez',
  'image.url',
  0
);
INSERT INTO USERS VALUES (
  4,
  'briurb',
  'brisby@gmail.com',
  'password',
  'Bri',
  'Urbina',
  'image.url',
  0
);
INSERT INTO USERS VALUES (
  5,
  'urvishap',
  'urvi123@gmail.com',
  'password',
  'Urvisha',
  'Patel',
  'image.url',
  0
);
INSERT INTO USERS VALUES (
  6,
  'silasJ',
  'silasjohn@gmail.com',
  'password',
  'Silas',
  'John',
  'image.url',
  1
);

#Populate team
INSERT INTO TEAM VALUES(
  1,
  "Group7"
);

#Populate teamMember
INSERT INTO TEAMMEMBER VALUES(
  1,
  6,
  1,
  1,
  "Silas"
);

INSERT INTO TEAMMEMBER VALUES(
  2,
  5,
  1,
  0,
  "Urvisha"
);

INSERT INTO TEAMMEMBER VALUES(
  3,
  4,
  1,
  0,
  "Bri"
);

INSERT INTO TEAMMEMBER VALUES(
  4,
  3,
  1,
  0,
  "Nate"
);

INSERT INTO TEAMMEMBER VALUES(
  5,
  2,
  1,
  0,
  "Tom"
);

INSERT INTO TEAMMEMBER VALUES(
  6,
  1,
  1,
  0,
  "Jacob"
);

#Populate project TABLE
INSERT INTO PROJECT VALUES(
  1,
  "teamspot",
  DATE("2020-06-10"),
  "The objective of this project is to build a small/medium sized software project with your teammembers",
  null,
  0
);

#Populate on_project table
INSERT INTO ON_PROJECT VALUES(
  1,
  1,
  'jacob_w_88@yahoo.com'
);

INSERT INTO ON_PROJECT VALUES(
  2,
  1,
  'toml@gmail.com'
);

INSERT INTO ON_PROJECT VALUES(
  3,
  1,
  'smiguel@gmail.com'
);

INSERT INTO ON_PROJECT VALUES(
  4,
  1,
  'brisby@gmail.com'
);

INSERT INTO ON_PROJECT VALUES(
  5,
  1,
  'urvi123@gmail.com'
);

INSERT INTO ON_PROJECT VALUES(
  6,
  1,
  'silasjohn@gmail.com'
);

#Populate project_manager
INSERT INTO PROJECT_MANAGER VALUES(
  1,
  1,
  6
);

#Populate project_component
INSERT INTO PROJECT_COMPONENT VALUES(
  1,
  "front-end",
  1,
  null
);

INSERT INTO PROJECT_COMPONENT VALUES(
  2,
  "back-end",
  1,
  null
);

INSERT INTO PROJECT_COMPONENT VALUES(
  3,
  "database",
  1,
  null
);

#Populate Milestone table
INSERT INTO MILESTONE VALUES(
  1,
  "Build the UI",
  1,
  6,
  "use react to build a user interface",
  DATE("2020-06-5"),
  null,
  0
);

INSERT INTO MILESTONE VALUES(
  2,
  "Create Express server",
  2,
  4,
  "use express to build a server to handle requests",
  DATE("2020-06-1"),
  null,
  0
);

INSERT INTO MILESTONE VALUES(
  3,
  "Build database",
  3,
  6,
  "use mysql workbench to make database",
  DATE("2020-06-9"),
  null,
  0
);

#Populate task Table
INSERT INTO TASK VALUES(
  1,
  "create react app",
  1,
  4,
  "npx create-react-app my-app",
  DATE("2020-05-18"),
  null,
  0
);
INSERT INTO TASK VALUES(
  2,
  "build react components",
  1,
  6,
  "make reusable react components",
  DATE("2020-05-20"),
  null,
  0
);
INSERT INTO TASK VALUES(
  3,
  "Implement authentication",
  1,
  2,
  "google auth token ",
  DATE("2020-05-25"),
  null,
  0
);

INSERT INTO TASK VALUES(
  4,
  "create express app",
  2,
  8,
  "express create app",
  DATE("2020-05-18"),
  null,
  0
);
INSERT INTO TASK VALUES(
  5,
  "make controllers",
  2,
  4,
  "write them in javascript",
  DATE("2020-05-22"),
  null,
  0
);
INSERT INTO TASK VALUES(
  6,
  "Make a cake",
  2,
  10,
  "use frosting",
  DATE("2020-05-18"),
  null,
  0
);

INSERT INTO TASK VALUES(
  7,
  "Build database",
  3,
  4,
  "Use mysql workbench to sql it up",
  DATE("2020-05-18"),
  null,
  0
);
INSERT INTO TASK VALUES(
  8,
  "host database on mysql server",
  3,
  9,
  "download mysql server",
  DATE("2020-05-18"),
  null,
  0
);
INSERT INTO TASK VALUES(
  9,
  "Insert dummy data into database",
  3,
  1,
  "abcdefg......",
  DATE("2020-05-28"),
  null,
  0
);

#Populate assigned Table
INSERT INTO ASSIGNED VALUES(
  1,
  9,
  3,
  1
);

INSERT INTO ASSIGNED VALUES(
  1,
  8,
  3,
  1
);

INSERT INTO ASSIGNED VALUES(
  2,
  1,
  1,
  1
);

INSERT INTO ASSIGNED VALUES(
  2,
  2,
  1,
  1
);

INSERT INTO ASSIGNED VALUES(
  2,
  3,
  1,
  1
);

INSERT INTO ASSIGNED VALUES(
  3,
  4,
  2,
  1
);

INSERT INTO ASSIGNED VALUES(
  3,
  5,
  2,
  1
);

INSERT INTO ASSIGNED VALUES(
  4,
  5,
  2,
  1
);

INSERT INTO ASSIGNED VALUES(
  5,
  6,
  2,
  1
);