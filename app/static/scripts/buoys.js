function post(path, params, method) {
    method = method || "post"; // Set method to post by default if not specified.

    var form = document.createElement("form");
    form.setAttribute("method", method);
    form.setAttribute("action", path);
    for(var key in params) {
        if(params.hasOwnProperty(key)) {
            var hiddenField = document.createElement("input");
            hiddenField.setAttribute("type", "hidden");
            hiddenField.setAttribute("name", key);
            hiddenField.setAttribute("value", params[key]);
            form.appendChild(hiddenField);
         }
    }

    document.body.appendChild(form);
    form.submit();
}


function getSensors() {
  var checkboxes = document.getElementsByClassName("chbox");
  var checkboxesChecked = [];

    // loop over them all
  for (var i=0; i<checkboxes.length; i++) {
     // And stick the checked ones onto an array...
     if (checkboxes[i].checked) {
        checkboxesChecked.push(checkboxes[i].value);
     }
  }
  return checkboxesChecked.join();
}


function invalid_field(field) {
  field.style.backgroundColor = "red";
}


function getQueryParam() {
  var start_date = document.getElementById("start_date").value;
  var end_date   = document.getElementById("end_date").value;
  var start_time = document.getElementById("start_time").value;
  var end_time   = document.getElementById("end_time").value;
  var interval   = document.getElementById("interval").value;
  var units      = document.getElementById("units").value;

  //validation
  var ret = true;

  if (start_date === "") {
    invalid_field(document.getElementById("start_date"))
    ret = false;
  }

  if (end_date === "") {
    invalid_field(document.getElementById("end_date"))
    ret = false;
  }

  if (start_time === "") {
    invalid_field(document.getElementById("start_time"))
    ret = false;
  }

  if (end_time === "") {
    invalid_field(document.getElementById("end_time"))
    ret = false;
  }


  str += "interval: " +  interval + "\n";
  str += "units: " +  units + "\n";

  alert(str);
}



function getReport() {
  var sensors = getSensors();
  //getQueryParam();
  if (sensors.length > 0) {
    post('/buoys/', {list: sensors});
  } else {
    alert("None of the sensors was checked");
  }
}


function test() {
  alert("test")
}
