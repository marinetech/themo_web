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
            // alert("key: " + key + "\nvalue: " + params[key])
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

  str += "interval: " +  interval + "\n";
  str += "units: " +  units + "\n";

  alert(str);
}



function getReport() {
  var sensors = getSensors();
  var start_date = document.getElementById("start_date").value;
  var end_date   = document.getElementById("end_date").value;
  // alert("start_date: " + start_date + "\nend_date: " + end_date)
  if (sensors.length > 0) {
    post('/buoys/', {list: sensors, s_date: start_date, e_date: end_date});
  } else {
    alert("None of the sensors was checked");
  }
}


function rowClick(row) {
  var c=row.getElementsByTagName('input')[0];
  c.checked=!c.checked;
}
