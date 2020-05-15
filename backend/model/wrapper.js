"use strict";

const projectWrapper = require("./projectWrapper");
const componentWrapper = require("./componentWrapper");
const milestoneWrapper = require("./milestoneWrapper");
const taskWrapper = require("./taskWrapper");
const userWrapper = require("./userWrapper");
const teamWrapper = require("./teamWrapper");

module.exports = {
  executeSQL: (connection, sql, varList) => {
    return new Promise((resolve, reject) => {
      connection.query(sql, varList, function(err, rows, fields) {
        if (err) {
          reject(err);
        } else {
          resolve(rows, fields);
        }
      });
    });
  },
  //project functions
  createProject: (
    connection
  ) => {
    return projectWrapper.createProject(
      connection
    );
  },
  getProjects: (connection) => {
    return projectWrapper.getProjects(connection);
  },
  getProject: (connection, projectID) => {
    return projectWrapper.getProject(connection, projectID);
  },
  getProjectComponents: (connection, projectID) => {
    return projectWrapper.getProjectComponents(connection, projectID);
  },
  updateProject: (
    connection
  ) => {
    return projectWrapper.updateProject(
      connection
    );
  },
  getMessagesProject: (connection) => {
    return projectWrapper.getMessages(connection);
  },
  sendMessageProject: (connection, message) => {
    return projectWrapper.send(connection, message);
  },
  //component functions
  createComponent: (
    connection
  ) => {
    return componentWrapper.createComponent(
      connection
    );
  },
  getComponents: (connection) => {
    return componentWrapper.getComponents(connection);
  },
  getComponent: (connection, componentID) => {
    return componentWrapper.getComponent(connection, componentID);
  },
  getComponentMilestones: (connection, componentID) => {
    return componentWrapper.getComponentMilestones(connection, componentID);
  },
  updateComponent: (
    connection
  ) => {
    return componentWrapper.updateComponent(
      connection
    );
  },
  getMessagesComponent: (connection, id) => {
    return componentWrapper.getMessages(connection, id);
  },
  sendMessageComponent: (connection, id, message) => {
    return componentWrapper.send(connection, id, message);
  },
  //milestone functions
  createMilestone: (
    connection
  ) => {
    return milestoneWrapper.createMilestone(
      connection
    );
  },
  getMilestones: (connection) => {
    return milestoneWrapper.getMilestones(connection);
  },
  getMilestone: (connection, milestoneID) => {
    return milestoneWrapper.getMilestone(connection, milestoneID);
  },
  getMilestoneTasks: (connection, milestoneID) => {
    return milestoneWrapper.getMilestoneTasks(connection, milestoneID);
  },
  updateMilestone: (
    connection
  ) => {
    return milestoneWrapper.updateMilestone(
      connection
    );
  },
  getMessagesMilestone: (connection, id) => {
    return milestoneWrapper.getMessages(connection, id);
  },
  sendMessageMilestone: (connection, id, message) => {
    return milestoneWrapper.getMessages(connection, id, message);
  },
  //task functions
  createTask: (
    connection
  ) => {
    return taskWrapper.createTask(
      connection
    );
  },
  getTasks: (connection) => {
    return taskWrapper.getTasks(connection);
  },
  getTask: (connection, taskID) => {
    return taskWrapper.getTask(connection, taskID);
  },
  updateTask: (
    connection
  ) => {
    return taskWrapper.updateTask(
      connection
    );
  },
  getMessagesTask: (connection, id) => {
    return taskWrapper.getMessages(connection, id);
  },
  sendMessageTask: (connection, id, message) => {
    return taskWrapper.getMessages(connection, id, message);
  },
  //user functions
  userExists: (connection, email) => {
    return userWrapper.userExists(connection, email);
  },
  createUser: (connection, uname, email, password) => {
    return userWrapper.createUser(connection, uname, email, password);
  },
  createGoogleAuthUser: (connection, uname, email) => {
    return userWrapper.createGoogleAuthUser(connection, uname, email);
  },
  getUsers: (connection) => {
    return userWrapper.getUsers(connection );
  },
  updateUser: (connection, email, fieldName, fieldValue) => {
    return userWrapper.updateUser(connection, email, fieldName, fieldValue);
  },
  checkCredentials: (connection, email, password) => {
    return userWrapper.checkCredentials(connection, email, password);
  },
  //teams function
  createTeam: (
    connection
  ) => {
    return teamWrapper.createTeam(
      connection
    );
  }
}
