
// define controller for the app
angular.module('andeckle', ['ngStorage', 'angularMoment'])
  .directive('timeLog', function() {
    return {
      templateUrl: 'template/timelogger.html'
    };
  })
  .controller('AndeckleController', ['$localStorage', '$interval', function($localStorage, $interval) {

  /* replace this with self to avoid JavaScript 'this' reference
    issues...
  */
  var self = this;

  // set the app tagline
  self.appTag = 'Time management simplified...';

  // set up the timer functions... Array of tags
  self.timerFunctions = ['#training', '#project', '#classes', '#lunchBreak', '#teaBreak', '#labs'];

  /* Define all models to be used in application
    for correct refernce to enable implementation of 
    continuous time logging
  */

  // variable used to determine if timer has been started... 
  self.timerStarted = false;

  /* variable to be toggled if timer has been triggered to disable
    other timer function buttons
  */
  self.disableAllFunctions = false;

  // variable to be toggled for automatic time log and manual time log
  self.hideManualButton = false;

  // define models
  self.timerHours = ''; // model for hours
  self.timerMinutes = '';  // model for minutes
  self.timerTags = '';  // model for tags
  self.timerDescription = '';  // model for description
  self.timerDate = '';  // model for date

  self.hourCounted = 0;  // model for hour in automatic time logger
  self.minuteCounted = 0;  // model for minute in automatic time logger
  self.secondCounted = 0;  // model for second in automatic time logger

  self.userName = '';  // model for name
  self.currentIndex = 0; // variable to hold index of log to edit

  //set up default local storage object in case none is available
    self.completeData = {
      name: '',
      timerDate: '',
      initMilliseconds: 0,
      currentSecond: 0,
      currentMinute: 0,
      currentHour: 0,
      timerTag: '',
      timeTagged: [],
      newVal: 0
    };


  /*
    Function to be called on timer instantiation or contunuous time log
    It is placed before the local storage check to make it available 
    for the check to invoke in case the last timer invoked was not logged.
  */
  self.startTimer = function(arg) {
    
    // make the timer visible
    self.timerStarted = true;
    // disable all function buttons
    self.disableAllFunctions = true;
    // hide the manual time log button
    self.hideManualButton = true;

    // set the timerTag model
    self.completeData.timerTag = arg;
    self.timerTags = self.completeData.timerTag;
    $localStorage.completeData.timerTag = arg;
    
    // Check if the timer date has been set in the local storage.
    if ((typeof self.completeData.timerDate === 'string') && (self.completeData.timerDate === '')) {
      /*
        New timer instantiation, so create a new Date object and store in local storage.
        Also, get the Time value base don the date object and also store in local storage
      */
      self.timerDate = new Date();
      self.completeData.timerDate = self.timerDate;
      self.completeData.initMilliseconds = self.timerDate.getTime();
      self.completeData.newVal = self.completeData.initMilliseconds;
    } else {
      /* timer is currently pending, get the vlaue from local storage
        and create a new Date object to be stored in the date model for 
        the time log
      */
      self.timerDate = new Date(self.completeData.timerDate);
    }

    // automatic timer
    self.timer = $interval(function() { self.update(); }, 1000);  
  };




  /*
    Check for local storage availability.
    If it is not available, store default data for population
    If available, perform some checks to see if a time log was
    initiated on last app use and continue time log as necessary
  */
  if (!$localStorage.completeData) {
    $localStorage.completeData = self.completeData; // store the default object in local storage
  } else {
    // replace the default object with local storage object
    self.completeData = $localStorage.completeData;
    // check for the presence of the initiMillisecond stored on each time log initiation
    if (self.completeData.initMilliseconds > 0) {  // do some mathematical calculations for time elaspsed

      // get the current Time in milliseconds
      var now = new Date().getTime();

      // check for difference between the two milliseconds
      var second = Math.floor((now - self.completeData.initMilliseconds) / 1000);

      // calculate appriopriate time phases
      var hours = Math.floor(second / (60 * 60));  // get the hours in the total seconds
   
      // get the minutes
      var divisorForMinutes = second % (60 * 60);
      var minutes = Math.floor(divisorForMinutes / 60);
      
      // get the seconds
      var divisorForSeconds = divisorForMinutes % 60;
      var seconds = Math.ceil(divisorForSeconds);

      // allocate the time phases to the timer models declared above
      self.timerTags = $localStorage.completeData.timerTag;
      self.hourCounted = hours;
      self.minuteCounted = minutes;
      self.secondCounted = seconds;

      //invoke the timer start function to continue time log 
      self.startTimer(self.timerTags);
    }
  }


  // function to be invoked by the save button on first appliction run...
  self.saveName = function(name) {
    if (self.userName === '') {
      alert('You need to enter your name!');
    }
    self.completeData.name = self.userName;
    $localStorage.completeData.name = self.completeData.name;
  }

  /*
    Function update() that gets called every time the interval runs,
    to update the time display and also update local storage time.
  */
  self.update = function() {
    self.secondCounted += 1;
    if (self.secondCounted > 59) {
      self.secondCounted = 0;
      self.minuteCounted += 1;
    }
    if (self.minuteCounted > 59) {
      self.minuteCounted = 0;
      self.hourCounted += 1;
    }
    self.completeData.currentSecond = self.secondCounted;
    self.completeData.currentMinute = self.minuteCounted;
    self.completeData.currentHour = self.hourCounted;
  };

  /*
    function that gets called when timer is stopped.
    It cancels the $interval variable, enables the disabled buttons,
    and sets the time count to the appropriate models for time log
  */
  self.stopTimer = function() {

    //cancel the $interval variable
    $interval.cancel(self.timer);

    // enable all function buttons
    self.disableAllFunctions = false;

    // set the required models to the time passed
    self.timerHours = self.hourCounted;
    self.timerMinutes = self.minuteCounted;

    // triggers the time log modal box to complete time log
    $('#manualLogButton').click();
  }

  
  /*
    function used by the checkInvalid() function which the modal box log button ng-disabled directive to ensure that all
    input elements contain valid and allowd data types and values.
  */
  self.checkData = function() {
    if (
        (typeof self.timerHours === 'number' && self.timerHours >= 0) && 
        (typeof self.timerMinutes === 'number' && self.timerMinutes >= 0 && self.timerMinutes < 60) && 
        (typeof self.timerTags === 'string' && self.timerTags.length > 0) && 
        (typeof self.timerDate === 'object') && 
        (typeof self.timerDescription === 'string' && self.timerDescription.length > 0) &&
        (self.timerHours > 0 || self.timerMinutes > 0)
      ) {

      return false;
    } else {
      return true;
    }
  };

  
  // function called by the checkEditInvalid() for the edit modal box to validate the input values and data types
  self.checkEditData = function() {
    if (
        (typeof self.timerHours === 'number' && self.timerHours >= 0) && 
        (typeof self.timerMinutes === 'number' && self.timerMinutes > 0 && self.timerMinutes < 60) && 
        (typeof self.timerTags === 'string' && self.timerTags.length > 0) && 
        (typeof self.timerDescription === 'string' && self.timerDescription.length > 0)
      ) {
      return false;
    } else {
      return true;
    }
  }

  // function attached to the ng-disabled directive of the edit time log modal box
  self.checkEditInvalid = function() {
    return self.checkEditData();
  }

  // function attached to the ng-disabled directive of the save time log modal box
  self.checkInvalid = function() {
    return self.checkData();
  }

  // reset all data models
  self.resetDataModels = function() {
    // reset all used models
    self.timerDate = '';
    self.timerTags = '';
    self.timerDescription = '';
    self.timerHours = '';
    self.timerMinutes = '';
    self.hourCounted = 0;
    self.minuteCounted = 0;
    self.secondCounted = 0;
    self.completeData.timerDate = '';
    self.completeData.initMilliseconds = 0;
    self.completeData.currentSecond = 0;
    self.completeData.currentMinute = 0;
    self.completeData.currentHour = 0;
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

    // hide the timer
    self.timerStarted = false;

    // show the manual time log button
    self.hideManualButton = false;

    // close the modal
    $('#manualClose').click();

    // open the success modal
    $('#openSuccess').click();
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

    // close the modal
    $('#editClose').click();

    self.timerDescription = '';
  }

  // function to delete individual log
  self.deleteTime = function(index) {

    var answer = confirm('Are you sure you want to delete?\nIt is irreversible!');
    if (answer === true) {
      self.completeData.timeTagged.splice(index, 1);
      // loop through the just spliced array to update their positions
      for (x in self.completeData.timeTagged) {
        self.completeData.timeTagged[x].position = x;
      }
      $localStorage.completeData.timeTagged = self.completeData.timeTagged;
    }
  };
}]);

// http://www.codechewing.com/library/replace-rude-swear-words-with-asterisks-javascript/