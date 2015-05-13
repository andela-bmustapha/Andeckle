
// define controller for the app
angular.module('andeckle', ['ngStorage', 'angularMoment'])
  .controller('AndeckleController', ['$localStorage', function($localStorage) {

  // replace this with self
  var self = this;

  // set the app tagline
  self.appTag = 'Time management simplified...';

  //set up default local storage in case none is available
  self.completeData = {
    name: '',
    timeTagged: []
  };

  // check if local storage is not set, and set accordingly
  if (!$localStorage.completeData) {
    $localStorage.completeData = self.completeData;
  } else {
    self.completeData = $localStorage.completeData;
  }

  // define models
  self.timerHours = ''; // model for hours
  self.timerMinutes = '';  // model for minutes
  self.timerTags = '';  // model for tags
  self.timerDescription = '';  // model for description
  self.timerDate = '';  // model for date

  self.userName = '';  // model for name
  self.currentIndex = 0; // variable to hold index of log to edit

  self.checkData = function() {
    if ((typeof self.timerHours === 'number' && self.timerHours > 0) && (typeof self.timerMinutes === 'number' && self.timerMinutes > 0 && self.timerMinutes < 60) && (typeof self.timerTags === 'string' && self.timerTags.length > 0) && (typeof self.timerDate === 'object') && (typeof self.timerDescription === 'string' && self.timerDescription.length > 0)) {//&& (typeof self.timerMinutes !== 'number') && self.timerTags !== '' && self.timerDescription !== '' && self.timerDate !== '')
      return false;
    } else {
      return true;
    }
  }

  // function for edit modal box
  self.checkEditData = function() {
    if ((typeof self.timerHours === 'number' && self.timerHours > 0) && (typeof self.timerMinutes === 'number' && self.timerMinutes > 0 && self.timerMinutes < 60) && (typeof self.timerTags === 'string' && self.timerTags.length > 0) && (typeof self.timerDescription === 'string' && self.timerDescription.length > 0)) {//&& (typeof self.timerMinutes !== 'number') && self.timerTags !== '' && self.timerDescription !== '' && self.timerDate !== '')
      return false;
    } else {
      return true;
    }
  }

  // function checkEditInvalid
  self.checkEditInvalid = function() {
    return self.checkEditData();
  }

  self.checkInvalid = function() {
    return self.checkData();
  }

  // define the saveName function
  self.saveName = function(name) {
    self.completeData.name = self.userName;
    $localStorage.completeData.name = self.completeData.name;
  }

  // reset all data models
  self.resetDataModels = function() {
    // reset all used models
    self.timerDate = '';
    self.timerTags = '';
    self.timerDescription = '';
    self.timerHours = '';
    self.timerMinutes = '';
  }

  // define the manual time logger function...
  self.manualTimeLogger = function() {

    // build up an object
    var tempObject = {};
    tempObject.tags = self.timerTags;
    tempObject.comment = self.timerDescription;
    tempObject.hour = self.timerHours;
    tempObject.minute = self.timerMinutes;
    tempObject.date = self.timerDate;
    tempObject.position = self.completeData.timeTagged.length;

    // push object into array
    self.completeData.timeTagged.push(tempObject);

    // loop to re-arrange the objects
    for (x in self.completeData.timeTagged) {
      self.completeData.timeTagged[x].position = x;
    }

    // send to local storage
    $localStorage.completeData.timeTagged = self.completeData.timeTagged;

    // reset object for later use
    tempObject = {};

    // reset all data Models
    self.resetDataModels();
  };

  // function to edit individual log
  self.editTime = function(index) {
    self.currentIndex = index;
    self.timerTags = self.completeData.timeTagged[index].tags;
    self.timerDescription = self.completeData.timeTagged[index].comment;
    self.timerHours = self.completeData.timeTagged[index].hour;
    self.timerMinutes = self.completeData.timeTagged[index].minute;
  }

  // save edited data
  self.saveEdit = function() {
    // build up the object
    var tempObject = {};
    tempObject.tags = self.timerTags;
    tempObject.comment = self.timerDescription;
    tempObject.hour = self.timerHours;
    tempObject.minute = self.timerMinutes;

    // replace respective elements in the local storage
    self.completeData.timeTagged[self.currentIndex].tags = tempObject.tags;
    self.completeData.timeTagged[self.currentIndex].comment = tempObject.comment;
    self.completeData.timeTagged[self.currentIndex].hour = tempObject.hour;
    self.completeData.timeTagged[self.currentIndex].minute = tempObject.minute;

    // send to local storage
    $localStorage.completeData.timeTagged = self.completeData.timeTagged;

    // reset object for later use
    tempObject = {};

    // reset all data Models
    self.resetDataModels();
  }

  // function to delete individual log
  self.deleteTime = function(index) {
    self.resetDataModels();
    var answer = confirm('Are you sure you want to delete?\nIt is irreversible!');
    if (answer === true) {
      self.completeData.timeTagged.splice(index, 1);
      // loop through the just spliced array to update the positions
      for (x in self.completeData.timeTagged) {
        self.completeData.timeTagged[x].position = x;
      }
      $localStorage.completeData.timeTagged = self.completeData.timeTagged;
    }
  };

  // set up the timer functions...
  self.timerFunctions = [];

  self.save = function() {
    
  };

  self.load = function() {
    
  }

  /* define the timerData Object
  self.timerData = {

  };
  */
}]);