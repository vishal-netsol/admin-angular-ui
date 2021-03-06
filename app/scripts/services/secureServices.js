'use strict'

angular.module('angularjsApp').factory('secureService',function($http, wsURL, api, port, $location, credentialStore, $localstorage, $rootScope){
	
  
	var getAllCategories = function(){
  	var url = wsURL+port+api + "categories/roots.json"
    return $http.get(url).then(function(data, status, headers, config){
      if (!data.error) {
       	return data;
     	}
    });
	}

  var getchildren = function(name){
    var url = wsURL+port+api + "categories/children.json?name="+name
    return $http.get(url).then(function(data, status, headers, config){
      if (!data.error) {
        return data;
      }
    });
  }

  var getCountries = function(){
    var url = wsURL+port+api + "countries.json"
    return $http.get(url).then(function(data, status, headers, config){
      return data;
    });
  }

  var getStates = function(country){
    var url = wsURL+port+api + "countries/states.json?country="+country
    return $http.get(url).then(function(data, status, headers, config){
      if (!data.error) {
        return data;
      }
    });
  }
  
  var login = function(user){
    var url = wsURL+port+"users/sign_in.json"
    var header = {headers:{'Authorization':'Token token=nil','Content-type':'application/json'}}
    return $http.post(url, user, header).then(function(data){ 
      credentialStore.setUserData(data.data.user, data.data.user.authentication_token)
      if (user.user.rememberMe){
        credentialStore.setRememberMe(data.data.user)
      }
      var categories = getCategoryTree();
      categories.then(function(result){
        credentialStore.setCategorires(result);
        $location.path('/');
        $('#login-modal').modal('hide');
      });
    },function(data){
      $("#error_msg").html(data.data.error);
      $rootScope.animatErrMsg("#error_msg");
    }
  );    
  }

  var registerNewUser = function(user){
    var url = wsURL+port+"users.json"
    var header = {headers:{'Authorization':'Token token=nil','Content-type':'application/json'}}
    return $http.post(url, user, header).then(function(data){ 
      $("#signup-modal").modal('hide');
      $("#msg_box").html("You have been registed Successfully. Please check your mailbox and confirm you email.");
      $rootScope.animatErrMsg("#alert_msg");
      // credentialStore.setUserData(data.data)
      // var categories = getCategoryTree();
      // categories.then(function(result){
      //   credentialStore.setCategorires(result);
      //   $location.path('/profile');
      //   $('#signup-modal').modal('hide');
      // });
    },function(data){
      // $rootScope.registerErrors = data.data.errors;
      $("#signup_server_error_msg").html($rootScope.parseErrors(data.data.errors).htmlList);
      $rootScope.animatErrMsg("#signup_server_error_msg");
  });
  }

  var forgotPassword = function(user){
    var url = wsURL+port+"users/password.json"
    return $http.post(url, user).then(function(data){
      debugger
      $("#msg_box").html("We have sent you a mail with reset password link. Please check your mail.");
      $rootScope.animatErrMsg("#alert_msg");
      $location.path("/");
      $('#forgot-password-modal').modal('hide');
    },function(data){
      $("#forgot_server_error_msg").html($rootScope.parseErrors(data.data.errors).htmlList)
      // $rootScope.invalid_email = data.data.errors.email; 
      $rootScope.animatErrMsg("#forgot_server_error_msg");
    }
  );
  }

  var sendConfirmationMail = function(user){
    var url = wsURL+port+"/users/confirmation.json"
    return $http.post(url, user).then(function(data){
      $('#resend-confirm-email-modal').modal('hide');
      $("#msg_box").html("Confirmation instructions sent successfully. Please check your mailbox and confirm you email.");
      $rootScope.animatErrMsg("#alert_msg");
    },function(data){
      $("#resend_server_error_msg").html($rootScope.parseErrors(data.data.errors).htmlList);
      $rootScope.animatErrMsg("#resend_server_error_msg");
    });
  }

  var confirmEmail = function(token){
    var url = wsURL+port+"/users/confirmation.json?confirmation_token="+token
    return $http.get(url).then(function(data){
      $("#msg_box").html("Congrates! email has been confirmed. Please login..");
      $rootScope.animatErrMsg("#alert_msg");
      $location.path('/');
    },function(data){
      $("#msg_box").html($rootScope.parseErrors(data.data).htmlList);
      $rootScope.animatErrMsg("#alert_msg");
    });
  }

  var updateUserPassword = function (user, current_user){
    var url = wsURL+port+api + "users/"+current_user.id+"/update_password.json"
    return $http.put(url, user).then(function(data){
      if (data.data.status_code == 1){
        $("#password_form").hide();
        $("#msg_box").html("Password Change Successfully");
        $rootScope.animatErrMsg("#alert_msg");
      }else{
        $("#chngpswd_error_msg").html("<li>"+data.data.error+"</li>")
        $rootScope.animatErrMsg("#chngpswd_error_msg");
      }
    });
  }

  var resetPassword = function(user){
    var url = wsURL+port+"users/password.json"
    return $http.put(url, user).then(function(data){
      $("#msg_box").html("You have successfully reset you password");
      $rootScope.animatErrMsg("#alert_msg");
      $location.path('/');
    },function(data){
      debugger
      $("#msg_box").html($rootScope.parseErrors(data.data.errors).htmlList);
      $rootScope.animatErrMsg("#alert_msg");
    });
  }

  var getCategoryTree = function(){
    var url = wsURL+port+api + "categories/tree.json";
    return $http.get(url).then(function(data, status, headers, config){
      if (!data.error) {
        return data;
      }
    });
  }

	var getpage = function(categoryname, pagename){
		var url = wsURL+port+api + "pages/page.json?name="+pagename+"&category_name="+categoryname
		return $http.get(url, credentialStore.getheaders()).then(function(data, status, headers, config){
    	if (!data.error) {
       	return data;
     	}
    });
	}

	var getCategoryPages = function(categoryName){
   	var url = wsURL+port+api + "categories/pages.json?category_name="+categoryName
		return $http.get(url, credentialStore.getheaders()).then(function(data, status, headers, config){
    	if (!data.error) {
       	return data;
     	}
    });
	}

	var getallUser = function(){
		var url = wsURL+port+api + "users";
    return $http.get(url).then(function(data, status, headers, config){
    	if (!data.error) {
       	return data;
     	}
    });
  }
  
  var getuserprofile = function(email){
    var url = wsURL+port+api + "users/user_by_email.json?email="+email;
  	return $http.get(url).then(function(data, status, headers, config){
      credentialStore.setUserData(data.data.user, data.data.user.authentication_token)
      var categories = getCategoryTree();
      categories.then(function(result){
        credentialStore.setCategorires(result);
        $location.path('/');
        $('#login-modal').modal('hide');
      });
    });
  }
  
  var getallfaqs = function(){
    var url = wsURL+port+api + "faq_categories.json"
    return $http.get(url).then(function(data, status, headers, config){
      return data;
    });
  }

  var getfaqbycategory = function(categoryname){
    var url = wsURL+port+api + "faq_categories/faqs.json?name="+categoryname;
    return $http.get(url).then(function(data){
      return data;
    });
  }

  var updateUser = function(user_data, id){
   	var url = wsURL+port+api+ "users/"+id+".json"
  	$http.put(url, user_data, credentialStore.getheaders()).success(function(data){
      if (data.error){
        alert("Error: " + data.error);
      }
      else {
        credentialStore.updateUserData(data.user)
        $location.path('/profile');
        $("#msg_box").html(" Successfully updated");
        $rootScope.animatErrMsg("#alert_msg");
      }
    })
  }

  var checkUserEmail = function(data){
    var url = wsURL+port+api+"users/check_availability?email="+ data
    return $http.get(url).success(function(data){
      return data;
    })
  }

  var checkUserName = function(data){
    var url = wsURL+port+api+"users/check_availability?username="+ data
    return $http.get(url).success(function(data){
      return data;
    })
  }

	return {
		getAllCategories:getAllCategories,
		getCategoryPages:getCategoryPages,
		getallUser:getallUser,
		getuserprofile:getuserprofile,
		updateUser:updateUser,
		getpage:getpage,
    getCategoryTree:getCategoryTree,
    login:login,
    registerNewUser:registerNewUser,
    getCountries:getCountries,
    getStates:getStates,
    getchildren:getchildren,
    getallfaqs:getallfaqs,
    getfaqbycategory:getfaqbycategory,
    forgotPassword:forgotPassword,
    updateUserPassword:updateUserPassword,
    sendConfirmationMail:sendConfirmationMail,
    confirmEmail:confirmEmail,
    checkUserName:checkUserName,
    checkUserEmail:checkUserEmail,
    resetPassword:resetPassword
	};
});
