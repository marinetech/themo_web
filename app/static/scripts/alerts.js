function buoy_selection_was_changed() {
    var e = document.getElementById("buoy")
    var selected_buoy = e.options[e.selectedIndex].value;

    $.ajax({
            type: "POST",
            url: "alert/getSensors",
            data: { buoy_name: selected_buoy },
            success: function(data) {
              var dd = document.getElementById("sensor");
              clear_dd(dd);
              add_empty_option_to_select(dd);
              data.forEach(function(element) {
                dd.disabled = false;
                var option = document.createElement("option");
                option.text = element.name;
                option.value = element._id;
                dd.add(option);
              })
            },
            error: function(jqXHR, textStatus, err) {
                alert('text status ' + textStatus + ', err ' + err)
            }
    });
}


function sensor_selection_was_changed() {
    var e = document.getElementById("sensor")
    var selected_sensor = e.options[e.selectedIndex].value;

    $.ajax({
            type: "POST",
            url: "alert/getFields",
            data: { sensor_id: selected_sensor },
            success: function(data) {
              var dd = document.getElementById("field");
              clear_dd(dd);
              add_empty_option_to_select(dd);
              var do_not_display = ['d_stamp', 't_stamp', 'const_err', 'threshold'];
              data.fields_to_display.forEach(function(element) {
                if (!do_not_display.includes(element)) {
                  var option = document.createElement("option");
                  option.text = element;
                  option.value = element;
                  dd.add(option);
                  dd.disabled = false;
                }
              });
            },
            error: function(jqXHR, textStatus, err) {
                alert('text status ' + textStatus + ', err ' + err)
            }
    });
}


function trigger_was_changed() {
  // trigger was chosen enable threshold1 input
  var threshold1_in = document.getElementById("threshold1");
  threshold1_in.disabled = false;
  var th2 = document.getElementById("threshold2");

  if (trigger_not_requiers_2_inputs()) {
    th2.disabled = true;
    th2.value = "";
  } else {
    th2.disabled = false;
  }

  threshold_was_changed();
}


function data_field_was_changed() {
  var e = document.getElementById("trigger")
  e.disabled = false;
}


function threshold_was_changed() {
  var condition = false;

  if (trigger_not_requiers_2_inputs()) {
      condition = (document.getElementById("threshold1").value != "")
  } else { //requires 2 inputs
      condition = ( (document.getElementById("threshold1").value != "") && (document.getElementById("threshold2").value != "") )
  }

  var btn = document.getElementById("btn_submit");
  if (condition) {
    btn.disabled = false;
  } else {
    btn.disabled = true;
  }
}


function clear_dd(dd) {
  var length = dd.options.length;
  for (i = 0; i < length; i++) {
    dd.options[i] = null;
  }
}


function add_empty_option_to_select(dd) {
  var option = document.createElement("option");
  option.text = "";
  option.value = "";
  option.disabled = true;
  option.selected = true;
  dd.add(option);
}


function trigger_not_requiers_2_inputs() {
  selected_trigger = (document.getElementById("trigger").options[trigger.selectedIndex].text);
  if (selected_trigger.includes("between")) {
    return false;
  } else {
    return true;
  }
}
