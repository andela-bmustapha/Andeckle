describe('AndeckleController', function(){

  var $controller, ctrl, $localStorage, $interval;

  beforeEach(module('andeckle'));

  beforeEach(inject(function(_$controller_, _$localStorage_, _$interval_){
    $controller = _$controller_;
    $localStorage = _$localStorage_;
    $interval = _$interval_;
    var scope = {};
    ctrl = $controller('AndeckleController', {$scope:scope});
  }));

  describe('Check for the app tag-line', function() {
    it('should have a tag of the app defined', function() {
      expect(ctrl.appTag).toBe('Time management simplified...');
    });
  });

  describe('Local Storage data to be defined', function() {
    it('Should return defined for $localStorage name data', function() {
      expect($localStorage.completeData.name).toBeDefined();
    });
  });

  describe('Delete function to delete', function() {
    it('should return falsy for localStorage timeTagged array', function() {
      $localStorage.completeData.timeTagged.push('SampleText');
      ctrl.deleteTime(0);
      expect($localStorage.completeData.timeTagged.length).toBe(0);
    });
  });

  describe('Save Name Function Test', function() {
    it('Should return an error for an empty string', function() {
      ctrl.saveName('');
      expect($localStorage.completeData.name).toBeFalsy();
    });
  });

  describe('Test global mode variables', function() {
    it('self timer variables', function() {
      expect(ctrl.timerStarted).toBeFalsy();
      ctrl.startTimer();
      expect(ctrl.timerStarted).toBeTruthy();
    });
  });

});