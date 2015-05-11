// define controller for the app
angular.module('andeckle', ["ngStorage"])
  .controller('AndeckleController', ['$localStorage', function($localStorage) {

  // replace this with self
  var self = this;

  // set the app tagline
  self.appTag = 'Time management simplified...';

  // set the logo path
  self.logoPath = 'img/andeckle.png';

  self.save = function() {
    if (!$localStorage.message) {
      $localStorage.message = {
        name: 'Tunde',
        class: 7,
        strongPoint: 'AngularJS'
      };
    } else {
      console.log('Local storage already set');
    }
  };

  self.load = function() {
    self.save();
    self.data = $localStorage.message;
    return self.data;
  }

  self.load();
  console.log(self.data);

}]);