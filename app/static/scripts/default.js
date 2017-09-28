//get the current page
var path = window.location.pathname;
var page = path.split("/").pop();

if (page === "") {
  document.getElementById("/").style.backgroundColor = "grey";
  //document.getElementById("/").style.color = "black";
} else {
  document.getElementById(page).style.backgroundColor = "grey";
  //document.getElementById(page).style.color = "black";
}



// add datepicker component
jQuery(function($){ //on document.ready
        $('#start_date').datepicker({dateFormat: 'yy-mm-dd'});
        $('#end_date').datepicker({dateFormat: 'yy-mm-dd'});
})


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
