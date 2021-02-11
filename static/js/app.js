//// This is what the page shows on the main page, first thing that shows up
/// The data from the JSON file is arbitrarily named importedData as the argument
d3.json("samples.json").then((importedData) => {
    console.log(importedData.metadata);
    //////creating a variable called name and extract it
    var optionSelect = d3.select("#selDataset");
    var sampleNames = importedData.names;
    sampleNames.forEach(element => { 
        optionSelect.append("option").text(element).property("value", element); 
    });
    var sampleData = importedData.samples[0];  //First value of the array -> 940
    console.log(sampleData);
    buildPlot(sampleData); // calling function from the function buildPlot() defined at the bottom 
    demographicInfo(importedData.names[0]);
    // var wfreq = importedData.metadata.map(d => d.wfreq); ///
    // console.log(`Washing Freq: ${wfreq}`);
    var sampleValues = importedData.samples.map(x=>x.sample_values);
    // console.log(sampleValues);
});
// // Creating a function for the event listener 
function optionChanged(id) {
    d3.json("static/data/samples.json").then((importedData) => { //.then is to give the name to this data file
        sampleData=importedData.samples.filter(d=>d.id == id)[0];
        buildPlot(sampleData); // calling the function 
        filterID = importedData.metadata.filter(mt => mt.id == id)[0];
        demographicInfo(id); // calling the function i created ... user is selecting the id so it display the detail of the id
        console.log(sampleData);å
    });
}
function demographicInfo(id) {
    d3.json("static/data/samples.json").then((importedData) => {
    console.log(meta);
    var meta = importedData.metadata
    filterID = meta.filter(mt => mt.id == id); //First id will be showing when someone select the id number
    firstSample = filterID[0];
    console.log(filterID);
    console.log(firstSample);
    //  referencing the sample-metadata in javascript & populate the demographic info in the empty box
    var readSampleData = d3.select("#sample-metadata");
    readSampleData.html(""); //clearing the list of previous info before displaying the new info
    //Object is dictionary
    // forEach is for Loop in python
    Object.entries(firstSample).forEach(([key, value])=>{
        readSampleData.append("p").text(`${key}, ${value}`) // p for paragraph
    });    
    });
}
function buildPlot(sampleData){
        // Slice the first 10 objects for plotting. Lecture 15.2 Ex6. Getting only top 10 OTU ID for the plot
        var ids = sampleData.otu_ids;
        var labels = sampleData.otu_labels;
        var sample_values1 =  sampleData.sample_values;
        // get the top 10 labels for the plot
        // var labels = importedData.otu_labels.slice(0, 10);
        // Trace1 for the Greek Data Bar Chart
        var trace1 = {
            x: sample_values1.slice(0,10).reverse(),  // get the otu id's to the desired form for the plot
            y: ids.slice(0,10).reverse().map(d=>`OUT ${d}`),
            text: labels.slice(0,10).reverse(),
            type: "bar",
            orientation: "h"
        };
        // data
        var data = [trace1];
        // Apply the group bar mode to the layout
        var layout = {
            title: "Top 10 OTUs results",
        };
        // Render the plot to the div tag with id "plot"
        Plotly.newPlot("bar", data, layout);
        /////////////////////////////////////////////////////////
        //////////////////// Bubble Chart////////////////////////
        var trace2 = {
            x: sample_values1,  // get the otu id's to the desired form for the plot
            y: ids,
            text: labels,
            mode: "markers",
            marker: {
                size: sample_values1,
                color: ids,
            }
        };
        // data
        var data = [trace2];
        // Apply the group bar mode to the layout
        var layout = {
            title: "Top 10 OTUs results",
        };
        // Render the plot to the div tag with id "plot"
        Plotly.newPlot("bubble", data, layout);
}
/// Use D3 fetch to read the JSON file
// }
    // Call updatePlotly() when a change takes place to the DOM/// 
    //////////