// Per Roee's request - display the folllowing message before any attempt to download data
var msg_credit = "The data from the THEMO observatory was kindly shared by the Texas A&M \
- University of Haifa - Eastern Mediterranean Observatory (THEMO) project. \
THEMO is supported by the Underwater Acoustic and Navigation laboratory (ANL), Dep. of Marine Technology,\
 University of Haifa, Israel, and by the Geochemical and Environmental Research Group (GERG), Texas A&M University, USA.";
var msg_download = "If you are downloading our data and use it in future publications, please include the following statement:\n\n"
msg_download += msg_credit
msg_download += "\n\n\n[This statment will be copied to your clipboard]"


// get all the sensors that were checked for download
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

// currently not in use
function invalid_field(field) {
  field.style.backgroundColor = "red";
}

// currently not in use
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

// when download button is clicked
function getReport() {
  var sensors = getSensors();
  var start_date = document.getElementById("start_date").value;
  var end_date   = document.getElementById("end_date").value.replace(/\//g, "-");
  // alert("start_date: " + start_date + "\nend_date: " + end_date)

  if (sensors.length > 0) {
    alert(msg_download);
    copyTextToClipboard(msg_credit);
    post('/buoys/', {list: sensors, s_date: start_date, e_date: end_date});
  } else {
    alert("None of the sensors was checked");
  }
}

// click anywhere on table row will toggle the checkbox in this row
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
