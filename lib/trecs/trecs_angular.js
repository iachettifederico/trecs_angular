var app = angular.module('TRecs', []);

app.controller('PlayerController', function($scope, $parse, $http, $sce, $document) {
  $scope.playing = false;

  $scope.code  = $document[0].createElement('pre');

  $scope.audio = $document[0].createElement('audio');
  $scope.audio.src = '/public/nothing_personal.mp3';

  $http.get("/trecs/terminal.json")
    .success(function(data) {
      $scope.frames = data.frames;
      $scope.name = data.name;
      $scope.keys = getKeys(data.frames);
    });

  $scope.play = function() {
    $scope.audio.play();
    $scope.playing = true;
  };

  $scope.pause = function() {
    $scope.audio.pause();
    $scope.playing = false;
  };

  $scope.stop = function() {
    $scope.audio.pause();
    $scope.audio.currentTime = 0;
    $scope.playing = false;
  };

  $scope.audio.addEventListener('ended', function() {
    $scope.$apply(function() {
      $scope.stop();
    });
  });

  var getKeys = function(obj) {
    var k = [];
    angular.forEach(obj, function(value, key) {
      k.push(Math.floor(key));
    });
    return k;
  };

  $scope.time_at = function(timestamp) {
    var time;
    angular.forEach($scope.keys, function(val, key) {
      if(timestamp >= val){
        time = val;
      }
    });

    return time;
  };

  $scope.frame_at = function(time) {
    if($scope.frames){
      var frame = $scope.frames[$scope.time_at(time)];
      var content = frame.content;
      if(frame.format == "html"){
        content = $sce.trustAsHtml(content);
      }else{
        content = $sce.trustAsHtml('<pre>' + content + '</pre>');
      }
      return content;
    }else{
      return $scope.frames;
    }
  };

  $scope.tick = function(time) {
    timestamp = timestamp_for(time);

    frame = $scope.frame_at(timestamp);
    if($scope.keys && timestamp >= $scope.keys[$scope.keys.length - 1]){
      $scope.stop();
    }
    return frame;
  };

  var updateClock = function() {
    $scope.clock = $scope.audio.currentTime;
  };

  formatTime = function (seconds) {
    minutes = Math.floor(seconds / 60);
    minutes = (minutes >= 10) ? minutes : "0" + minutes;
    seconds = Math.floor(seconds % 60);
    seconds = (seconds >= 10) ? seconds : "0" + seconds;
    return minutes + ":" + seconds;
  }

  var timer = setInterval(function() {
    $scope.$apply(updateClock);
  }, 100);
  updateClock();

  var timestamp_for = function(num) {
    return Math.floor(num * 1000);
  };

});
