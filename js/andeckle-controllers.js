
// define controller for the app
angular.module('andeckle', ['ngStorage'])
  .controller('AndeckleController', ['$localStorage', function($localStorage) {

  // replace this with self
  var self = this;

  //set up default local storage in case none is available
  self.completeData = {
    name: '',
    timeTagged: [
      { tags: '#training #trainingInProgress', comment: 'Training', hour: 2, minute: 34, second: 25, date: 24/5/2015 },
      { tags: '#angularPro', comment: 'Angular Project', hour: 5, minute: 5, second: 12, date: 5/2/2014 },
      { tags: '#eating #food', comment: 'Eating', hour: 2, minute: 34, second: 25, date: 24/5/2015 }
    ]
  };

  // check if local storage is not set, and set accordingly
  if (!$localStorage.completeData) {
    $localStorage.completeData = self.completeData;
  } else {
    self.completeData = $localStorage.completeData;
  }

  // define models
  self.timerHours = 0;
  self.timerMinutes = 0;
  self.timerSeconds = 0;
  self.timerTags = '';
  self.timerDescription = '';
  self.timerDate = '';

  self.userName = '';

  // define the saveName function
  self.saveName = function(name) {
    console.log(self.userName);
    self.completeData.name = self.userName;
    $localStorage.completeData.name = self.completeData.name;
  }

  // define the manual time logger function...
  self.manualTimeLogger = function() {
    console.log('Button Triggered!');
  };

  // set the app tagline
  self.appTag = 'Time management simplified...';

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