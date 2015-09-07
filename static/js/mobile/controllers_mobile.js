'use strict';

/* Controllers */

angular.module('chuangplus_mobile.controllers', []).
    controller('MB_LoginCtrl', ['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService', function($scope, $http, $csrf, urls, $filter, $routeParams, $user){
        console.log('MB_LoginCtrl');
    }])
    .controller('MB_CompanyListCtrl', ['$scope', '$http', 'urls',
     function($scope, $http, urls) {
       $scope.name = "Arii";
        console.log('MB_CompanyListCtrl'+urls.api);
        $scope.company_list = {};
        $scope.stage = {
            "0":"初创",
            "1":"快速发展",
            "2":"成熟"
        };
        $scope.pfield = {
                'social':'社交',
                'e_commerce':'电子商务',
                'education':'健康医疗',
                'health_medical':'文化创意',
                'culture_creativity':'硬件',
                'living_consumption':'O2O',
                'hardware':'生活消费',
                'O2O':'教育',
                'others':'其它'
        };
        $scope.ptype = {
            'technology':'技术',
            'product':'产品',
            'design':'设计',
            'operate':'运营',
            'marketing':'市场',
            'functions':'职能',
            'others':'其它'
        };
        $scope.get_company_list = function(){
            $http.get(urls.api+"/account/company/list").
                success(function(data){
                if(data.error.code == 1){
                    $scope.company_list = data.data;
                    console.log(data);
                    for(var i=0;i<$scope.company_list.length;i++){
                        $scope.company_list[i].stage_value = $scope.stage[$scope.company_list[i].scale];
                        $scope.company_list[i].field_value = $scope.pfield[$scope.company_list[i].field];
                        $scope.company_list[i].type_value = $scope.ptype[$scope.company_list[i].type];
                        $scope.company_list[i].position_number = $scope.company_list[i].positions.length;


                    }

                }
                else{
                     $scope.error = $errMsg.format_error('',data.error);
                }
            });
        };
        $scope.get_company_list();
    }])
    .controller('MB_PositionListCtrl', ['$scope', '$http', 'urls',
     function($scope, $http, urls) {
        console.log('MB_PositionListCtrl');
        $scope.positions = {};
        $scope.get_positions = function(){
            $http.get(urls.api+"/position/search").
                success(function(data){
                    if(data.error.code == 1){
                        $scope.positions = data.positions;
                        for(var i=0; i<$scope.positions.length;i++){
                            $scope.positions[i].position_type_value = $scope.position_type[$scope.positions[i].position_type];
                            if($scope.positions[i].company.scale == 0){
                                $scope.positions[i].company.scale_value = "初创";
                            }
                            else if($scope.positions[i].company.scale == 1){
                                $scope.positions[i].company.scale_value = "快速发展";
                            }
                            else{
                                $scope.positions[i].company.scale_value = "成熟";
                            }
                        }
                    }
                    else{
                        console.log(data.error.message);
                    }
                });
        };
        $scope.get_positions();

    }])
    .controller('MB_PositionFilterCtrl', ['$scope', '$http', 'urls', '$routeParams',
         function($scope, $http, urls, $routeParams) {
    $scope.filter = {
            "workdays":{
                "day0": false,
                "day3": false,
                "day4": false,
                "day5": false,
                "day6": false,
                "day7": false
            },
            "field":{
                'social':false,
                'e_commerce':false,
                'education':false,
                'health_medical':false,
                'culture_creativity':false,
                'living_consumption':false,
                'hardware':false,
                'O2O':false,
                'others':false
            },
            "type":{
                'technology':false,
                'product':false,
                'design':false,
                'operate':false,
                'marketing':false,
                'functions':false,
                'others':false
            },
            "salary": ''
        };
    }])
    .controller('MB_CompanyPositionCtrl', ['$scope', '$http', 'urls', '$routeParams',
     function($scope, $http, urls, $routeParams) {
        $scope.get_company = function(){
        $scope.company_id = $routeParams.company_id;
        console.log($scope.company_id);
        $scope.position_type = {
            "technology":"技术",
            'product':"产品",
            'design':"设计",
            'operate':"运营",
            'marketing':"市场",
            'functions':"职能",
            'others':"其他"
        };
        $scope.latest_scale = {
            "0":"初创",
            "1":"快速发展",
            "2":"成熟"
        };
        $scope.cfield = {
                'social':'社交',
                'e_commerce':'电子商务',
                'education':'健康医疗',
                'health_medical':'文化创意',
                'culture_creativity':'硬件',
                'living_consumption':'O2O',
                'hardware':'生活消费',
                'O2O':'教育',
                'others':'其它'
        };
        $scope.company_id = $routeParams.company_id;
        $http.get(urls.api+"/account/company/" + $scope.company_id + "/detail_with_positions").
          success(function(data,status,headers,config){
            console.log(data);   
            if(data.error.code == 1){
                $scope.company = data.data;
                $scope.company.field_value = $scope.cfield[$scope.company.field];
                $scope.company.scale_value = $scope.latest_scale[$scope.company.scale];
                $scope.company.position_number = $scope.company.positions.length;
                for(var i=0;i<$scope.company.position_number;i++){
                    $scope.company.position_list[i].position_type_value = $scope.position_type[$scope.company.position_list[i].position_type];
                }
            }
            else{
                $scope.error = $errMsg.format_error("",data.error);
            }
            });
        };
        $scope.get_company();
    }])
    .controller('MB_CompanyDetailCtrl', ['$scope', '$http', 'urls', '$routeParams',
     function($scope, $http, urls, $routeParams) {
        $scope.company_id = $routeParams.company_id;
        console.log('MB_CompanyDetailCtrl ' + $scope.company_id);
        $scope.company = {};
        $scope.latest_scale = {
            "0":"初创",
            "1":"快速发展",
            "2":"成熟"
        };
        $scope.cfield = {
                'social':'社交',
                'e_commerce':'电子商务',
                'education':'健康医疗',
                'health_medical':'文化创意',
                'culture_creativity':'硬件',
                'living_consumption':'O2O',
                'hardware':'生活消费',
                'O2O':'教育',
                'others':'其它'
        };
        $scope.stage = {
            "seed" :"种子轮",
            "angel":"天使轮",
            "A":"A轮",
            "B":"B轮",
            "C":"C轮",
            "D_plus":"D及以上轮"
        };
        $scope.amount = {
            "ten":"十万级",
            "hundred":"百万级",
            "thousand":"千万级",
            "thousand_plus":"亿级"
        };

        $scope.get_company = function(){
            $http.get(urls.api+"/account/company/" + $scope.company_id + "/detail").
              success(function(data){
                if(data.error.code == 1){
                    $scope.company = data.data;
                    console.log($scope.company.positions.length);
                        $scope.company.field_value = $scope.cfield[$scope.company.field];
                        $scope.company.scale_value = $scope.latest_scale[$scope.company.scale];

                    $http.get(urls.api+"/account/financing/" + $scope.company_id + "/list").
                        success(function(fdata){
                            console.log(fdata);
                            if(data.error.code == 1){
                                $scope.company.financing_data = fdata.data;
                                $scope.company.financing_number = fdata.data.length;
                            
                            for(var i=0; i<$scope.company.financing_number; i++){
                                $scope.company.financing_data[i].organization = $scope.company.financing_data[i].organization;
                                $scope.company.financing_data[i].stage_value = $scope.stage[$scope.company.financing_data[i].stage];
                                $scope.company.financing_data[i].amount_value = $scope.amount[$scope.company.financing_data[i].amount];
                            }
                            
                    }
                    });
/*

                    $http.get(urls.api+"/account/company/"+ $scope.company._id.$oid +"/detail_with_positions").
                        success(function(data){
                            console.log(data);
                            if(data.error.code == 1){
                                $scope.company.position_list = data.data.position_list;
                                console.log($scope.company.position_list);
                            }
                            else{
                                console.log(data.error.message)
                            }
                    });
*/
                    $http.get(urls.api+"/account/member/"+$scope.company_id+"/list").
                        success(function(data){
                            if(data.error.code == 1){
                                $scope.member_list = data.data;
                                $scope.member_number = data.data.length;
                            }
                            else{
                                $scope.error = $errMsg.format_error('',data.error);
                            }
                        }); 

                }
                else{
                    $scope.error = $errMsg.format_error("",data.error);
                }
                });
        };
        $scope.get_company();
    }])
    .controller('MB_PositionListCtrl', ['$scope', '$http', 'urls', '$routeParams',
    function($scope, $http, urls, $routeParams) {
        $scope.latest_scale = {
            "0":"初创",
            "1":"快速发展",
            "2":"成熟"
        };
        $scope.cfield = {
                'social':'社交',
                'e_commerce':'电子商务',
                'education':'健康医疗',
                'health_medical':'文化创意',
                'culture_creativity':'硬件',
                'living_consumption':'O2O',
                'hardware':'生活消费',
                'O2O':'教育',
                'others':'其它'
        };
        $scope.position_type = {
            "technology":"技术",
            'product':"产品",
            'design':"设计",
            'operate':"运营",
            'marketing':"市场",
            'functions':"职能",
            'others':"其他"
        };

        $scope.positions = {};
        $scope.get_positions = function(){
            $http.get(urls.api+"/position/search").
                success(function(data){
                    if(data.error.code == 1){
                        $scope.positions = data.positions;
                        console.log($scope.positions.length);
                        for(var i=0; i<$scope.positions.length;i++){
                            $scope.positions[i].position_type_value = $scope.position_type[$scope.positions[i].position_type];
                            $scope.positions[i].field_value = $scope.cfield[$scope.positions[i].company.field];
                            console.log($scope.positions[i].field_value);
                            if($scope.positions[i].company.scale == 0){
                                $scope.positions[i].company.scale_value = "初创";
                            }
                            else if($scope.positions[i].company.scale == 1){
                                $scope.positions[i].company.scale_value = "快速发展";
                            }
                            else{
                                $scope.positions[i].company.scale_value = "成熟";
                            }
                        }
                    }
                    else{
                        console.log(data.error.message);
                    }
                });
        };
        $scope.get_positions();
    }])

    .controller('MB_PositionDetailCtrl', ['$scope', '$http', 'urls', '$routeParams',
    function($scope, $http, urls, $routeParams) {
        $scope.position_id = $routeParams.position_id;
        console.log($scope.position_id);
        $scope.latest_scale = {
            "0":"初创",
            "1":"快速发展",
            "2":"成熟"
        };
        $scope.cfield = {
                'social':'社交',
                'e_commerce':'电子商务',
                'education':'健康医疗',
                'health_medical':'文化创意',
                'culture_creativity':'硬件',
                'living_consumption':'O2O',
                'hardware':'生活消费',
                'O2O':'教育',
                'others':'其它'
        };
        $scope.position_type = {
            "technology":"技术",
            'product':"产品",
            'design':"设计",
            'operate':"运营",
            'marketing':"市场",
            'functions':"职能",
            'others':"其他"
        };

    
    $http.get(urls.api+"/position/"+ $scope.position_id +"/get_with_company").
        success(function(data){
            if(data.error.code == 1){
                $scope.position = data.data;
                $scope.position.scale_value = $scope.latest_scale[$scope.position.company.scale];
                $scope.position.field_value = $scope.cfield[$scope.position.company.field];
                $scope.position.position_type_value = $scope.position_type[$scope.position.position_type];
                $scope.position.position_number = $scope.position.company.positions.length;
                console.log($scope.position.position_number);

                $http.get(urls.api+"/account/company/"+ $scope.position.company._id.$oid +"/detail_with_positions").
                    success(function(data){
                        console.log(data);
                        if(data.error.code == 1){
                            $scope.position_list = data.data.position_list;
                        }
                        else{
                            console.log(data.error.message)
                        }
                    });

            }
            else{
                console.log(data.error.message)
            }
        });

    console.log($scope.position_id);
    /*

    $http.get(urls.api+"/account/userinfo/"+$scope.position_id+"/check_favor_position").
        success(function(data){
        if(data.error.code == 1){
            $scope.favor_exist = data.data.exist;
            if($scope.favor_exist == true){
            $scope.post_value = "取消收藏";
            }
            else{
            $scope.post_value = "先收藏";
            }
        }
        else{
            console.log(data.error.message);
        }
    });

        $scope.userinfo = {};
        $http.get(urls.api + "/account/userinfo/get").
            success(function(data){
                if(data.error.code == 1){
                    $scope.userinfo = data.data;
                    $scope.submitResume = {};
                    $scope.submitResume.position_id = $scope.position_id;
                    console.log($scope.userinfo.resume_id);
                    if($scope.userinfo.resume_id != undefined && $scope.userinfo.resume_id != null)
                    {
                        $scope.submitResume.resume_choice = 1;
                $scope.resume_submitted = true;
                        console.log("here");
            }
            else{
            $scope.resume_submitted = false;
            }
        }
        else{
            console.log(data.error).message;
        }
    });
    
    $http.get(urls.api+"/position/"+$scope.position_id+"/check_submit").
            success(function(data){
                if(data.error.code == 1){
                    if(data.exist == true){
                        $scope.submit_value = "已投递";
                        $scope.resume_submitted = true;
            }
            else{
            $scope.submit_value = "投递简历";
            }
        }
        else{
            console.log(data.error.message);
        }
    });

    $scope.post = function(){
        $scope.submitFavor = {};
        $scope.submitFavor.position_id = $scope.position_id;
        $csrf.set_csrf($scope.submitFavor);
        $http.post(urls.api + "/position/"+$scope.position_id+"/userlikeposition", $.param($scope.submitFavor)).
        success(function(data){
            $scope.post_value = "取消收藏";
        });
    };
        
    $scope.submit = function(){
        $scope.submitResume.resume_choice = 1;
        console.log("here");
            $csrf.set_csrf($scope.submitResume);
        $http.post(urls.api + "/position/"+$scope.position_id+"/submit", $.param($scope.submitResume)).
        success(function(data){
            if(data.error.code == 1){
            $scope.submit_value = "已投递";
            }
                else{
            console.log(data.error.message);
            }
        }); 
    };
    
    $scope.complete_resume = function(){
         setTimeout(function(){window.location.href='/intern/resume'},2000);
         $('#myModal').modal('hide');       

    };*/
    }])

    .controller('MB_InfoCtrl', ['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService', function($scope, $http, $csrf, urls, $filter, $routeParams, $user){
        console.log('MB_InfoCtrl');
    }]);