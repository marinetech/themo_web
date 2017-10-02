var chartdataTable = "";

function getChartData() {
  var e = document.getElementById("dataType");
  var dataType = e.options[e.selectedIndex].value;
  var start_date = document.getElementById("start_date").value;
  var end_date   = document.getElementById("end_date").value;

  $.post('/graph/',
    {
        requested_id: dataType,
        graph_type: 'daily',
        s_date: start_date,
        e_date: end_date
    },
    function(data, status){
        chartdataTable = data;
        google.charts.load('current', {'packages':['corechart']});
        google.charts.setOnLoadCallback(drawChart);
    });
}


function drawChart() {
  var dt = new google.visualization.DataTable(chartdataTable);
  var options = {
    title: 'Barometric Pressure [last day]',
    curveType: 'function',
    backgroundColor: 'grey',
    legend: { position: 'bottom' }
  };
  var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));

  chart.draw(dt, options);
}


function populateChartTypeDropDown() {
  $.post('/graph/getChartTypes',
    {
        requested_id: $("#dataType").val()
    },
    function(data, status){
        $('#chartType').empty();
        $('#chartType').append($('<option>', {
            text: data
        }));
    });
}

$(document).ready(function() {
  populateChartTypeDropDown();
});
