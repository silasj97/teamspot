CREATE SCHEMA usersAndRoles;
USE usersAndRoles;


CREATE TABLE IF NOT EXISTS users
(
	id INT(10) NOT NULL UNIQUE AUTO_INCREMENT,
	username VARCHAR(64),
	email VARCHAR(255) NOT NULL UNIQUE,
	password VARCHAR(64),
	firstName VARCHAR(64),
	lastName VARCHAR(64),
	imageURL VARCHAR(2083),
  userRole ENUM('Admin', 'Professor', 'Student') NOT NULL DEFAULT 'Student',
	PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS team
(
	id INT(14) NOT NULL UNIQUE AUTO_INCREMENT,
  teamName VARCHAR(128) DEFAULT NULL,
    	PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS teamMember
(
	teamMemberID INT(14) NOT NULL UNIQUE AUTO_INCREMENT,
	userID INT(10) NOT NULL,
  teamID INT(14) NOT NULL,
  teamRole ENUM('Team Lead', 'Team Member') NOT NULL DEFAULT 'Team Member',
    	PRIMARY KEY(teamMemberID),
    	FOREIGN KEY(userID)
			REFERENCES users(id)
		ON DELETE CASCADE,
	FOREIGN KEY(teamID)
			REFERENCES team(id)
        	ON DELETE CASCADE
);

CREATE SCHEMA projects;
USE projects;

CREATE TABLE IF NOT EXISTS project (

    id				INT NOT NULL UNIQUE AUTO_INCREMENT,
    project_name		VARCHAR(128),
    deadline			DATE,
    project_description		TEXT,
		comments	TEXT,

    CONSTRAINT pk_project
	PRIMARY KEY(id)

);

CREATE TABLE IF NOT EXISTS project_component (
	  id	INT NOT NULL UNIQUE AUTO_INCREMENT,
		component_name	VARCHAR(64),
		project_id 	INT

		CONSTRAINT pk_project_component
			PRIMARY KEY(id),
		CONSTRAINT fk_project_component_project
			FOREIGN KEY(project_id)
			REFERENCES project(id)
			ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS on_project (

    user_id	        INT(10),
    project_id		INT,
    user_email		VARCHAR(255),



    CONSTRAINT fk_on_project_userID
	FOREIGN KEY(user_id)
	REFERENCES usersAndRoles.users(id)
	ON DELETE CASCADE,
    CONSTRAINT fk_on_project_project
	FOREIGN KEY(project_id)
	REFERENCES project(id)
	ON DELETE CASCADE,
    CONSTRAINT fk_on_project_email
	FOREIGN KEY(user_email)
	REFERENCES usersAndRoles.users(email)
	ON DELETE CASCADE

);

CREATE TABLE IF NOT EXISTS project_manager (

    id 				INT NOT NULL UNIQUE AUTO_INCREMENT,
    project_id			INT,
    user_id			INT(10),

    CONSTRAINT pk_project_manager
	PRIMARY KEY(id),
    CONSTRAINT fk_project_manager_project
	FOREIGN KEY(project_id)
        REFERENCES project(id)
	ON DELETE CASCADE,
    CONSTRAINT fk_project_manager_users
	FOREIGN KEY(user_id)
        REFERENCES usersAndRoles.users(id)
	ON DELETE CASCADE
);


CREATE SCHEMA tasksAndActivities;
USE tasksAndActivities;

CREATE TABLE IF NOT EXISTS milestone (

    id				INT NOT NULL UNIQUE AUTO_INCREMENT,
    milestone_name		VARCHAR(255),
    project_component_id			INT,
    priority			INT,
    description			TEXT		NOT NULL,
    deadline			DATE,
		comments			TEXT,

    CONSTRAINT
	PRIMARY KEY(id),
    CONSTRAINT
	FOREIGN KEY(project_component_id)
        REFERENCES projects.project_component(id)
	ON DELETE CASCADE

);

CREATE TABLE IF NOT EXISTS task (

    id				INT NOT NULL UNIQUE AUTO_INCREMENT,
    task_name			VARCHAR(255),
    milestone_id		INT,
    priority			INT,
    description			TEXT		NOT NULL,
    deadline			DATE,
		comments			TEXT,

    CONSTRAINT
	PRIMARY KEY(id),
    CONSTRAINT
	FOREIGN KEY(milestone_id)
        REFERENCES milestone(id)
	ON DELETE CASCADE

);

CREATE TABLE IF NOT EXISTS assigned (
    user_id		INT(10),
    task_id		INT,
    milestone_id	INT,
    project_id		INT,

    CONSTRAINT pk_assigned
	PRIMARY KEY(user_id),
    CONSTRAINT fk_assigned_project
	FOREIGN KEY(project_id)
        REFERENCES projects.project(id)
	ON DELETE CASCADE,
    CONSTRAINT fk_assigned_milestone
	FOREIGN KEY(milestone_id)
        REFERENCES milestone(id)
	ON DELETE CASCADE,
    CONSTRAINT fk_assigned_task
	FOREIGN KEY(task_id)
        REFERENCES task(id)
	ON DELETE CASCADE

);
