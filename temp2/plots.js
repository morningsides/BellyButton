function init() {
    var selector = d3.select("#selDataset");

    d3.json("samples.json").then((data) => {
        console.log(data);
        var sampleNames = data.names;
        sampleNames.forEach((sample) => {
            selector
                .append("option")
                .text(sample)
                .property("value", sample);
        });
    })
}

function optionChanged(newSample) {
    buildMetadata(newSample);
    buildCharts(newSample);
}

function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
        var metadata = data.metadata;
        var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
        var result = resultArray[0];
        var PANEL = d3.select("#sample-metadata");

        PANEL.html("");
        Object.entries(result).forEach(([key, value]) =>
            PANEL.append("h6").text(key.toUpperCase() + " : " + value));


    });
}

function buildCharts(sample) {
    d3.json("samples.json").then((data) => {
        // Extract sample data
        var samples = data.samples;
        var sampleArray = samples.filter(sampleObj => sampleObj.id == sample);
        var result = sampleArray[0];

        // Trace for the sample data. Selecting only last 10 and reversing so it looks
        // nice in the bar chart
        var trace = {
            x: result.sample_values.slice(0, 10).reverse(),
            y: result.otu_ids.slice(0, 10).map(x => "OTU " + x).reverse(),
            text: result.otu_labels.slice(0, 10).reverse(),
            type: "bar",
            orientation: "h"
        };

        // Setting our layout object and encapsulating our trace object in an array 
        var data = [trace];
        // Apply the group bar mode to the layout
        var layout = {
            title: "Search results",
            font: {
                family: 'Raleway, sans-serif'
            },
            margin: {
                l: 100,
                r: 100,
                t: 100,
                b: 100
            }
        };

        // Render the plot to the div tag with id "plot"
        Plotly.newPlot("plot", data, layout);
    })
}
init();