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
  second = Math.floor(diff / 1000);
  ms = diff % 1000;
  return pad(minute, 2) + ":" + pad(second, 2) + ":" + pad(ms, 3);
}
var _manager = function() {
  var timers = [];
  var latestTimerID = -1;

  this.addTimer = function() {
    latestTimerID += 1;

    timers.push({
      'start': 0,
      'id': latestTimerID
    });

    $("#timer-container").append(tmpl({
      'name': names[Math.floor(Math.random() * names.length)],
      'id': latestTimerID, 
    }));
  };

  this.start = function(id) {
    $("#btn-" + id).removeClass("btn-success").addClass("btn-primary")
    .html('<i class="fa fa-refresh"></i> Reset');
    timers[id].start = new Date().getTime();

  };

  this.reset = function(id) {
    timers[id].start = new Date().getTime();
  };

  this.resetAll = function() {
    for(var i=0; i<timers.length; i++) {
      this.reset(i);
    }
  }

  this.update = function() {
    for(var i=0; i<timers.length; i++) {
      if(timers[i].start) {
        $("#timer-" + i).text(formatTime(timers[i].start));
      }
    }
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
