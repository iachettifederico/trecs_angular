var app = angular.module('TRecs', []);

app.controller('PlayerController', ['$scope', '$parse', function($scope, $parse) {
  $scope.playing = false;
  $scope.time = 0;

  $scope.code  = document.createElement('pre');

  $scope.audio = document.createElement('audio');
  $scope.audio.src = '/home/fedex/Music/animals_chives.ogg';

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
      $scope.stop()
    });
  });

  var getKeys = function(obj) {
    var k = [];
    angular.forEach(obj, function(value, key) {
      k.push(Math.floor(key));
    });
    return k
  };

  $scope.fileChanged = function(el){
    var reader = new FileReader();
    reader.onload = function(e) {
      var res = $parse(reader.result)();
      $scope.frames = res;
      $scope.keys = getKeys(res);
    }
    reader.readAsText(el.files[0]);

    $scope.$apply();
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
      return $scope.frames[$scope.time_at(time)];
    }else{
      return $scope.frames;
    }
  };

  $scope.tick = function(time) {
    timestamp = timestamp_for(time);

    frame = $scope.frame_at(timestamp);
    if(timestamp >= $scope.keys[$scope.keys.length - 1]){
      $scope.stop();
    }
    return frame;
  };

  var updateClock = function() {
    $scope.clock = $scope.audio.currentTime;
  };

  var timer = setInterval(function() {
    $scope.$apply(updateClock);
  }, 100);
  updateClock();

  var timestamp_for = function(num) {
    return Math.floor(num * 1000);
  };

}]);
