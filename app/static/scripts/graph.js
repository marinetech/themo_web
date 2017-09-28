var chartdataTable = "";

function getChartData() {

  var e = document.getElementById("dataType");
  var dataType = e.options[e.selectedIndex].value;
  var start_date = document.getElementById("start_date").value;
  var end_date   = document.getElementById("end_date").value;
  // post('/graph/', {requested_id: dataType, graph_type: 'daily', s_date: start_date, e_date: end_date});

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

  // google.charts.load('current', {'packages':['corechart']});


}



function drawChart() {
  var data = google.visualization.arrayToDataTable([
    ['Year', 'Salinity', 'Conductivity'],
    ['2004',  1000,      400],
    ['2005',  1170,      460],
    ['2006',  660,       1120],
    ['2007',  1030,      540]
  ]);

  // alert("Data: " + chartdataTable);
  // var dt = new google.visualization.DataTable(chartdataTable);

  // var dt = new google.visualization.DataTable({
  //   cols: [{id: 'task', label: 'Task', type: 'string'},
  //          {id: 'hours', label: 'Hours per Day', type: 'number'}],
  //   rows: [{c:[{v: 'Work'}, {v: 11}]},
  //          {c:[{v: 'Eat'}, {v: 2}]},
  //          {c:[{v: 'Commute'}, {v: 2}]},
  //          {c:[{v: 'Watch TV'}, {v:2}]},
  //          {c:[{v: 'Sleep'}, {v:7, f:'7.000'}]}]
  //   }, 0.6);

// var dt = new google.visualization.DataTable({
//   cols: [{type: 'timeofday', label: 'time'},
//          {type: 'number', label: 'bars'}],
//   rows: [ {c: [{v: [ 5,31,9 ]},{v:1005.15} ]},
//           {c: [{v: [ 16,1,11 ]},{v:1003.62}]}]
// });

console.log(chartdataTable);
var dt = new google.visualization.DataTable(chartdataTable);
// {cols: [{type: 'timeofday', label: 'time'}, {type: 'number', label: 'bars'}],rows: [ {c: [{v: [ 5,31,9 ]},{v:1005.15} ]}, {c: [{v: [ 16,1,11 ]},{v:1003.62} ]} ]}
// {cols: [{type: 'timeofday', label: 'time'}, {type: 'number', label: 'bars'}],rows: [ {c: [{v: [ 5,31,9 ]},{v:1005.15} ]}, {c: [{v: [ 16,1,11 ]},{v:1003.62} ]} ]}



  var options = {
    title: 'Salinity vs. Conductivity',
    curveType: 'function',
    legend: { position: 'bottom' }
  };

  var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));

  // chart.draw(data, options);
  chart.draw(dt, options);
}
