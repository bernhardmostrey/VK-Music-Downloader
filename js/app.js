/**
 * Created by bernhardmostrey on 12/05/15.
 */
var app = angular.module('VK', []);

app.controller("MainController", function($scope, $http){

    $scope.loggedIn = false;
    $scope.query = "";
    $scope.results = [];

    loginVK();



    $scope.progress = {width:'0%'};
    $scope.progressText = "";
    var n = 1;
    var results = [];
    $scope.search = function(q){
        console.log(q);
        $scope.progress = {width:'0%'};
        $scope.progressText = "";
        n = 1;
        results = [];
        $scope.results = [];
        searchSong(q);
    };


    $scope.login = function(){
        VK.Auth.login(authInfo, 8);
    };

    function loginVK(){
        var def = $.Deferred();

        VK.init({
            apiId: 4925247
        });

        VK.Auth.getLoginStatus(authInfo);
        //VK.UI.button('login_button');

    }

    function authInfo(response) {
        if(response.session) {
            $scope.loggedIn = true;
            $scope.$apply();
        } else {
            $scope.loggedIn = false;
        }
    }

    function searchSong(q){
        VK.Api.call('audio.search', {q: q, sort: 2, search_own : 0, count : 10}, function(r) {
            if(r.response) {
                console.log(r.response);
                /*$.each(r.response, function(key, value){

                });*/

                checkSong(r.response, r.response.length-1);


            }
            //console.log(r);
        });
    }

    $scope.downloadSong = function(r){
        download(r.url, r.artist + "-" + r.title + ".mp3", "audio/mpeg");
    };



    function checkSong(arr, max){
        //console.log(n);

        checkSongBitrate(arr[n]).then(function(){
            var proc = (n/max)*100-2;
            $scope.progress = {width:proc+'%'};
            $scope.progressText = proc+2+"%";
            $scope.$apply();
            n++;


            if(n != max+1){

                checkSong(arr, max);
            }else{
                $scope.progressText = "";
                $scope.$apply();
            }

        });
    }

    function checkSongBitrate(value){
        //console.log(value);
        var def = $.Deferred();

        $.getJSON("http://localhost:8888/VK/getlength.php?url="+value.url, function(data){
            var len = data["Content-Length"];
            var dur = value.duration;
            var br = len * 8 / 1024 / dur;
            value.bitrate = Math.floor(br);
            if(br > 300){

                results.push(value);
                $scope.results = results;
                $scope.$apply();
                //console.log(value);
            }
            var minutes = Math.floor(dur / 60);
            var seconds = dur - minutes * 60;
            value.length = minutes+":"+seconds;
            //data_length * 8 / 1024 / song_seconds



            return def.resolve();

        });
        return def.promise();
    }


});

