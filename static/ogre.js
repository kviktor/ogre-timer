var names = [
  "That place behind the rocks.",
  "That place above the house, near the mobs",
  "In the middle of somewhere",
  "The place with the great view",
  "Place of shattered dreams...and rings",
  "Clearing with grass",
  "Get off my lawn Ogre!"
];

function pad(num, size) {
  var s = "0000" + num;
  return s.substr(s.length - size);
}

function formatTime(time) {
  diff = new Date().getTime() - time;

  minute = Math.floor(diff / (60 * 1000)) ;
  second = Math.floor((diff % (60 * 1000)) / 1000);
  ms = diff % 1000;
  return pad(minute, 2) + ":" + pad(second, 2) + ":" + pad(ms, 3);
}

var _manager = function() {
  var timers = [];
  var latestTimerID = -1;
  var notificationMargin = -1;
  var notifications = false;

  this.addTimer = function() {
    latestTimerID += 1;

    var name = names[Math.floor(Math.random() * names.length)];
    timers.push({
      'name': name,
      'start': undefined,
      'id': latestTimerID,
      'notified': false,
    });

    $("#timer-container").append(tmpl({
      'name': name,
      'id': latestTimerID, 
    }));
  };

  this.start = function(id) {
    $("#btn-" + id).removeClass("btn-success").addClass("btn-primary")
    .html('<i class="fa fa-refresh"></i> Reset');
    timers[id].start = new Date().getTime() - 5 * 60 * 1000 + 10 * 1000;

  };

  this.reset = function(id) {
    this.start(id); // we get the reset button this way
    timers[id].notified = false;
  };

  this.resetAll = function() {
    for(var i=0; i<timers.length; i++) {
      this.reset(i);
    }
  };

  this.update = function() {
    var now = new Date().getTime();
    for(var i=0; i<timers.length; i++) {
      if(timers[i].start) {
        $("#timer-" + i).text(formatTime(timers[i].start));
      }
      var d = now - timers[i].start > ((15 * 60 * 1000) - (notificationMargin * 60 * 1000));
      if(notifications && !timers[i].notified && d) {
        var options = {icon: "static/favicon.png"};
        var notification = new Notification(timers[i].name, options);
        timers[i].notified = true;
      }
    }
  };

  this.toggleNotifications = function(val) {
    notifications = !notifications;
    notificationMargin = val;
  };
};

var manager = new _manager(); 

$(function() {
  manager.addTimer();
  setInterval(manager.update, 1);

  $("body").on("click", ".btn-start", function() {
    if($(this).hasClass("btn-success"))
      manager.start($(this).data("id"));
    else
      manager.reset($(this).data("id"));
  });
  
  $("#add-timer").click(function() {
    manager.addTimer();
    return false;
  });

  $("#reset-all").click(function() {
    manager.resetAll();
    return false;
  });

  $("#enc").click(function(e) {
    $("#forher-bg").show();
    return false;
  });

  $("#forher-bg").click(function() {
    $(this).hide();
  });


  var notificationStatus;
  $("#toggle-notifications").click(function() {
    if (Notification.permission !== "granted") {
      Notification.requestPermission().then(function(result) {
        notificationStatus = result;
      });
    }
    manager.toggleNotifications($("#notification-margin").val());
  });


});


var tmpl = doT.template(
    '<div class="input-group input-group-sm timer">' +
    '  <input type="text" value="{{=it.name }}" class="form-control btn-sm">' +
    '  <span class="input-group-addon" id="timer-{{=it.id}}">' + 
    '     00:00:000' + 
    '  </span>' + 
    '  <span class="input-group-btn">' + 
    '    <button id="btn-{{=it.id }}" data-id="{{=it.id }}" class="btn-start btn btn-sm btn-success" type="button">' + 
    '      <i class="fa fa-play"></i>' +
    '      Start' + 
    '    </button>' + 
    '  </span>' + 
    '</div>'
);
