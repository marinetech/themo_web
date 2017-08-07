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
