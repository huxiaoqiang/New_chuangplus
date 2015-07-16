'use strict';
/* Services */

// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('chuangplus.services', []).
    value('version', '0.1').
    service('CsrfService', ['$cookies' ,function($cookies){
        var error = {};
        return {
            'val': function() {
                return $cookies.csrftoken;
            },
            'set_csrf': function(data) {
                data['csrfmiddlewaretoken'] = $cookies.csrftoken;
            },
            'set_csrf_array': function(data){
                data.push({'csrfmiddlewaretoken': $cookies.csrftoken});
            },
            'format_error': function(err) {
                error.show = true;
                error.message = err;
                return error;
            },
            'remove_error':function(){
                error.show = false;
            }
        };
    }]).
    service('UserService', ['urls', '$http', '$cookies', function(urls, $http, $cookies){
        var user = {};
        // $.get(urls.api + '/user/status', function(data){
        //     user = data;
        // });
        if($cookies.username){
            user.username = $cookies.username;
        }
        if($cookies.id){
            user.id = $cookies.id;
        }
        if($cookies.role){
            user.role = $cookies.role;
        }
        return {
            'username': function(){
                return user.username;
            },
            'refresh': function(){
                $.get(urls.api + '/user/status', function(data){
                    user = data;
                });
            },
            'id': function(){
                return user.id;
            },
            'role': function(){
                if(!('role' in user)){
                    return 1;
                }
                return user.role;
            },
            'roles': function(){ //What's this?
                return user.roles;
            },
            'school_manager': function(){
                if(!('role' in user)){
                    return false;
                }
                return parseInt(user.role) == 0 || parseInt(user.role) == 4;
            },
            'department_manager': function(){
                if(!('role' in user)){
                    return false;
                }
                return parseInt(user.role) == 0 || parseInt(user.role) == 3;
            },
            'logout': function(){
                $http.get(urls.api + '/user/logout').success(function(data){
                    delete $cookies['username'];
                    delete $cookies['role'];
                    delete $cookies['id'];
                    console.log(data);
                    if(data.error.code == 1){
                        window.location.href = '/';
                    }
                });
            }
        };
    }]).
    filter('id2date', function(){
        return function(value) {
            var secs = parseInt(value.substring(0,8), 16)*1000;
            var tmp_date = new Date(secs);
            return tmp_date.getFullYear() + '年' + (tmp_date.getMonth() + 1) + '月' + tmp_date.getDate() + '日';
        };
    });
