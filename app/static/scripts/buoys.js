var msg_text = "The data from the THEMO observatory was kindly shared by Dr. Roee Diamant from the Underwater Acoustic and Navigation laboratory (ANL), Dep. of Marine Technology, University of Haifa, Israel"

var legal_message = "If you are downloading our data and use it in future publications, please include the following statement:\n\n"
legal_message += msg_text
legal_message += "\n\n\n"
legal_message += "[This statment will be copied to your clipboard]"

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
    alert(legal_message);
    copyTextToClipboard(msg_text);
    post('/buoys/', {list: sensors, s_date: start_date, e_date: end_date});
  } else {
    alert("None of the sensors was checked");
  }
}


function rowClick(row) {
  var c=row.getElementsByTagName('input')[0];
  c.checked=!c.checked;
}

function copyTextToClipboard(text) {
  var textArea = document.createElement("textarea");

  textArea.style.position = 'fixed';
  textArea.style.top = 0;
  textArea.style.left = 0;
  textArea.style.width = '2em';
  textArea.style.height = '2em';
  textArea.style.padding = 0;
  textArea.style.border = 'none';
  textArea.style.outline = 'none';
  textArea.style.boxShadow = 'none';
  textArea.style.background = 'transparent';
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.select();
  try {
    var successful = document.execCommand('copy');
  } catch (err) {
    console.log('Oops, unable to copy');
  }
  document.body.removeChild(textArea);
}
