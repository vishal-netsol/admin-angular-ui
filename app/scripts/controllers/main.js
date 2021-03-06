'use strict';

/**
 * @ngdoc function
 * @name angularjsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the angularjsApp
 */
angular.module('angularjsApp')
  .controller('MainCtrl', function ($scope, $routeParams, $rootScope, secureService, credentialStore) {
    // this.awesomeThings = [
    //   'HTML5 Boilerplate',
    //   'AngularJS',
    //   'Karma'
    // ];
    $rootScope.title = "Home";
    if (!credentialStore.isLoggedIn()){
      if (localStorage.getItem('token') != '' && localStorage.getItem('token') != null){
        var token = localStorage.getItem('token');
        var email = localStorage.getItem('email');
        credentialStore.setEmailAndToken(token, email);
        secureService.getuserprofile(email);
      }
    }else{
      secureService.getuserprofile(credentialStore.getEmail());
    }
    
  });
