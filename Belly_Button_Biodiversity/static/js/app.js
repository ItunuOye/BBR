function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
  var url = `/metadata/${sample}`
  // Use `d3.json` to fetch the metadata for a sample
  d3.json(url).then(function(response) {
      //console.log(response)
      //console.log(Object.entries(response));
    // Use d3 to select the panel with id of `#sample-metadata`
    var panelText = (Object.values(response))
    var panelData = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
    panelData.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

  // remove any children from the list to
  // append stats to the list
  panelData.append("div").text(`Age:`+` `+ panelText[0]);
  panelData.append("div").text(`Belly Button Type:`+` `+ panelText[1]);
  panelData.append("div").text(`Ethnicity:`+` `+ panelText[2]);
  panelData.append("div").text(`Gender:`+` `+ panelText[3]);
  panelData.append("div").text(`Location:`+` `+ panelText[4]);
  //panelData.append("div").text(`Washing Frequency:`+` `+ panelText[5]);
  panelData.append("div").text(`SampleID:`+` `+ panelText[6]);
  
  });


    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  /* data route */
  var url = "/samples/"+ sample;
  d3.json(url).then(function(response) {
    //console.log(response)
    var chartData = (Object.values(response))
    //console.log(chartData[2])
    //var pieChart = d3.select("#pie");
    // remove any children from the list to
   //pieChart.html("");
    var allIDs = chartData[0]; //key
    var allLabels = chartData[1];
    var allValues= chartData[2]; //values
    var result = {};
    allIDs.forEach((allIDs, i) => result[allIDs] = allValues[i]);
    //console.log(result);
    var entries = Object.entries(result);
    //console.log(entries)
    var sorted = entries.sort((a, b) =>  b[1]- a[1]);
    //console.log(sorted)
    var sliced = sorted.slice(0,10)
    //console.log(sliced)
    var finalObject = Object.assign(...sliced.map(([key, val]) => ({[key]: val})))
    //console.log(finalObject);
    pieLabels = Object.keys(finalObject);
    console.log(pieLabels);
    var sumValues = Object.values(finalObject).reduce((a, b) => a + b);
    console.log(sumValues);
    newValues = Object.values(finalObject);
    pieValues = []
    for (i=0; i<newValues.length; i++){
     percentValues = newValues[i]/sumValues * 100
     pieValues.push(percentValues)
    };
    console.log(pieValues);
      
   var pieChartData = [{
     labels:pieLabels,
     values:pieValues,
     type: 'pie'
   }];

   var pieChartLayout = {
     title: "Top 10 Bacteria in #" + sample + "'s belly button by percent",
     height: 400,
     width: 500
   };
   
   
   Plotly.newPlot(pie, pieChartData, pieChartLayout);
   console.log("after pie")


    // @TODO: Build a Bubble Chart using the sample data
    //var bubbleChart = d3.select("#bubble");
   //var bubbleTest = document.getElementById('bubble');
   var trace1 = {
    x: allIDs,
    y: allValues,
    text: allLabels,
    mode: 'markers',
    marker: {
      size: allValues,
      color: ['rgb(93, 164, 214)', 
        'rgb(255, 144, 14)',  
        'rgb(44, 160, 101)', 
        'rgb(255, 65, 54)',
        'rgb(80, 248, 236)',
        'rgb(126, 229, 174)',
        'rgb(222, 239, 74)',
        'rgb(239, 2, 217)',
        'rgb(79, 35, 37)',
        'rgb(139, 5, 90)'],
     }
  };
  
  var bubbleChartData = [trace1];
  
  var bubbleChartLayout = {
    title: 'Bacteria Amount in #' + sample + "'s belly button",
    showlegend: false,
    height: 600,
    width: 1000,
     
  };
  
  Plotly.newPlot(bubble, bubbleChartData, bubbleChartLayout);

   })
   
    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");
  // console.log(selector)
 
  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    //console.log(sampleNames[0]);
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
