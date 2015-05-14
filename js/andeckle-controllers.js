
// define controller for the app
angular.module('andeckle', ['ngStorage', 'angularMoment'])
  .controller('AndeckleController', ['$localStorage', '$interval', function($localStorage, $interval) {

  /* Define all models to be used in application
    for correct refernce to enable implementation of 
    continuous time logging
  */

  // replace this with self
  var self = this;

  // timer ng-show model
  self.timerStarted = false;

  // set the app tagline
  self.appTag = 'Time management simplified...';

  // set up the timer functions...
  self.timerFunctions = ['#training', '#project', '#classes', '#lunchBreak', '#teaBreak', '#labs'];

  // timer function buttons disable
  self.disableAllFunctions = false;

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

  //set up default local storage in case none is available
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


  self.preTimerStart = function(arg) {

    console.log(arg);
    
    // make the timer visible
    self.timerStarted = true;
    // disable all function buttons
    self.disableAllFunctions = true;

    // set the timerTag model
    self.completeData.timerTag = arg;
    self.timerTags = self.completeData.timerTag;
    $localStorage.completeData.timerTag = arg;
    
    // set the self.timerDate to a new date object
    if ((typeof self.completeData.timerDate === 'string') && (self.completeData.timerDate === '')) {
      self.timerDate = new Date();
      self.completeData.timerDate = self.timerDate;
      self.completeData.initMilliseconds = self.timerDate.getTime();
      self.completeData.newVal = self.completeData.initMilliseconds;
    } else {
      console.log(self.completeData.timerDate);
      self.timerDate = new Date(self.completeData.timerDate);
      console.log(typeof self.timerDate);
    }
    // automatic timer test
    self.timer = $interval(function() { self.startTimer(); }, 1000);  
  };




  /*
    Check for local storage availability.
    If it is not available, store default data for population
    If available, perform some checks to see if a time log was
    initiated on last app use and continue time log as necessary
  */
  if (!$localStorage.completeData) {
    $localStorage.completeData = self.completeData;
  } else {
    self.completeData = $localStorage.completeData;
    // check for the presence of the initiMillisecond stored on each time log initiation
    if (self.completeData.initMilliseconds > 0) {
      // do some mathematical calculations for time elaspsed
      var now = new Date().getTime();
      // check for difference between the two milliseconds
      var second = Math.floor((now - self.completeData.initMilliseconds) / 1000);

      console.log(second);

      // calculate appriopriate time differences
      var hours = Math.floor(second / (60 * 60));
   
      var divisor_for_minutes = second % (60 * 60);
      var minutes = Math.floor(divisor_for_minutes / 60);
 
      var divisor_for_seconds = divisor_for_minutes % 60;
      var seconds = Math.ceil(divisor_for_seconds);

      console.log(hours);
      console.log(minutes);
      console.log(seconds);


      
      // do other necessary checks
      /*
      self.hourCounted = (self.completeData.currentHour > 0) ? self.completeData.currentHour : 0;
      self.minuteCounted = (self.completeData.currentMinute > 0) ? self.completeData.currentMinute : 0;
      self.secondCounted = (self.completeData.currentSecond > 0) ? self.completeData.currentSecond : 0;
      */
      self.timerTags = $localStorage.completeData.timerTag;
      self.hourCounted = hours;
      self.minuteCounted = minutes;
      self.secondCounted = seconds;
      //invoke the timer start function to continue time log 
      self.preTimerStart(self.timerTags);
    }
  }


  // time display function
  self.startTimer = function() {
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

  self.timerStop = function() {
    $interval.cancel(self.timer);
    // enable all function buttons
    self.disableAllFunctions = false;
    // set the required models to the time passed
    self.timerHours = self.hourCounted;
    self.timerMinutes = self.minuteCounted;
    $('#manualLogButton').click();
  }






  self.checkData = function() {
    if ((typeof self.timerHours === 'number' && self.timerHours >= 0) && (typeof self.timerMinutes === 'number' && self.timerMinutes > 0 && self.timerMinutes < 60) && (typeof self.timerTags === 'string' && self.timerTags.length > 0) && (typeof self.timerDate === 'object') && (typeof self.timerDescription === 'string' && self.timerDescription.length > 0)) {//&& (typeof self.timerMinutes !== 'number') && self.timerTags !== '' && self.timerDescription !== '' && self.timerDate !== '')
      return false;
    } else {
      return true;
    }
  };

  // function for edit modal box
  self.checkEditData = function() {
    if ((typeof self.timerHours === 'number' && self.timerHours >= 0) && (typeof self.timerMinutes === 'number' && self.timerMinutes > 0 && self.timerMinutes < 60) && (typeof self.timerTags === 'string' && self.timerTags.length > 0) && (typeof self.timerDescription === 'string' && self.timerDescription.length > 0)) {//&& (typeof self.timerMinutes !== 'number') && self.timerTags !== '' && self.timerDescription !== '' && self.timerDate !== '')
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

    // reset all data Models
    self.resetDataModels();

    // close the modal
    $('#editClose').click();
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

  /* define the timerData Object
  self.timerData = {

  };
  */
}]);