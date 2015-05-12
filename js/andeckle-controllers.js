
// define controller for the app
angular.module('andeckle', ['ngStorage'])
  .controller('AndeckleController', ['$localStorage', function($localStorage) {

  // replace this with self
  var self = this;

  // set the app tagline
  self.appTag = 'Time management simplified...';

  //set up default local storage in case none is available
  self.completeData = {
    name: '',
    timeTagged: [
      { tags: '#training #trainingInProgress', comment: 'Training', hour: 2, minute: 34, date: 'Fri May 22 2015' }
    ]
  };

  // check if local storage is not set, and set accordingly
  if (!$localStorage.completeData) {
    $localStorage.completeData = self.completeData;
  } else {
    self.completeData = $localStorage.completeData;
  }

  console.log($localStorage.completeData);

  // define models
  self.timerHours = 0; // model for hours
  self.timerMinutes = 0;  // model for minutes
  self.timerTags = '';  // model for tags
  self.timerDescription = '';  // model for description
  self.timerDate = '';  // model for date

  self.userName = '';  // model for name
  self.newDateString = '';

  self.checkData = function() {
    if ((typeof self.timerHours === 'number' && self.timerHours > 0) && (typeof self.timerMinutes === 'number' && self.timerMinutes > 0) && (typeof self.timerTags === 'string' && self.timerTags.length > 0) && (typeof self.timerDate === 'object') && (typeof self.timerDescription === 'string' && self.timerDescription.length > 0)) {//&& (typeof self.timerMinutes !== 'number') && self.timerTags !== '' && self.timerDescription !== '' && self.timerDate !== '')
      return false;
    } else {
      return true;
    }
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
    self.newDateString = '';
    self.timerTags = '';
    self.timerDescription = '';
    self.timerHours = 0;
    self.timerMinutes = 0;
  }

  // define the manual time logger function...
  self.manualTimeLogger = function() {

    var dateString = self.timerDate.toString();
    for (x = 0; x <= 15; x++) {
      self.newDateString += dateString[x];
    }
    // build up an object
    var tempObject = {};
    tempObject.tags = self.timerTags;
    tempObject.comment = self.timerDescription;
    tempObject.hour = self.timerHours;
    tempObject.minute = self.timerMinutes;
    tempObject.date = self.newDateString;

    // push object into array
    self.completeData.timeTagged.push(tempObject);

    // reset object for later use
    tempObject = {};

    // reset all data Models
    self.resetDataModels();
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