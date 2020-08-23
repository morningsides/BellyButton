// Set up our dropdown menu
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

// This function fills in the Demographic info panel
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

// This function builds bar chart
function buildBar(sample) {
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
            autosize: true,
            margin: {
                l: 100,
                r: 100,
                b: 0,
                t: 0,
                pad: 4
            },
        };

        // Render the plot to the div tag with id "plot"
        Plotly.newPlot("plot", data, layout, {
            displayModeBar: false
        });
    })
}

// This function sets up gague chart
function buildGague(sample) {
    d3.json("samples.json").then((data) => {
        // Extract sample data
        var samples = data.metadata;
        var sampleArray = samples.filter(sampleObj => sampleObj.id == sample);
        var result = sampleArray[0];

        // Gague labels, I put them in the wrong order so calling reverse method to flip em
        gagueVales = ['0-1', '1-2', '2-3', '3-4', '4-5', '5-6', '6-7', '7-8', '8-9', '']
        gagueVales.reverse()

        // How much hand washing result data, since we're using half a pie chart
        // need to multiply by 20 to equal 180
        var level = result.wfreq * 20;

        // Trig to calc meter point
        var degrees = 180 - level,
            radius = .5;
        var radians = degrees * Math.PI / 180;
        var x = radius * Math.cos(radians);
        var y = radius * Math.sin(radians);
        var path1 = (degrees < 45 || degrees > 135) ? 'M -0.0 -0.025 L 0.0 0.025 L ' : 'M -0.025 -0.0 L 0.025 0.0 L ';
        // Path: may have to change to create a better triangle
        var mainPath = path1,
            pathX = String(x),
            space = ' ',
            pathY = String(y),
            pathEnd = ' Z';
        var path = mainPath.concat(pathX, space, pathY, pathEnd);

        var data = [{
                type: 'scatter',
                x: [0],
                y: [0],
                marker: {
                    size: 14,
                    color: '850000'
                },
                showlegend: false,
                name: 'speed',
                text: level
            },
            {
                values: [9, 1, 1, 1, 1, 1, 1, 1, 1, 1, ],
                rotation: 90,
                text: gagueVales,
                textinfo: 'text',
                textposition: 'inside',
                marker: {
                    colors: [
                        "rgba(255, 255, 255, 0.5)",
                        "rgba(30, 127, 0, .5)",
                        "rgba(70, 127, 5, .5)",
                        "rgba(80, 127, 10, .5)",
                        "rgba(120, 154, 22, .5)",
                        "rgba(170, 202, 42, .5)",
                        "rgba(202, 209, 95, .5)",
                        "rgba(225, 200, 100, .5)",
                        "rgba(232, 226, 202, .5)",
                        "rgba(255, 255, 205, .5)"
                    ]
                },
                hoverinfo: 'text',
                hole: .5,
                type: 'pie',
                showlegend: false,
                title: {
                    text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week",
                    position: 'top center'

                }
            }
        ];

        var layout = {
            shapes: [{
                type: 'path',
                path: path,
                fillcolor: '850000',
                line: {
                    color: '850000'
                }
            }],
            height: 500,
            width: 500,
            xaxis: {
                zeroline: false,
                showticklabels: false,
                showgrid: false,
                range: [-1, 1]
            },
            yaxis: {
                zeroline: false,
                showticklabels: false,
                showgrid: false,
                range: [-1, 1]
            },
            autosize: true,
            margin: {
                l: 20,
                r: 100,
                b: 0,
                t: 0,
                pad: 4
            }
        };
        // Render the plot to the div tag with id "gague"
        Plotly.newPlot("gauge", data, layout, {
            displayModeBar: false
        });
    })
}

// Set up our bubble chart
function buildPlt(sample) {
    d3.json("samples.json").then((data) => {
        // Extract sample data
        var samples = data.samples;
        var sampleArray = samples.filter(sampleObj => sampleObj.id == sample);
        var result = sampleArray[0];

        var trace = {
            x: result.otu_ids,
            y: result.sample_values,
            mode: 'markers',
            marker: {
                color: ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6',
                    '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D'
                ],
                opacity: [.5],
                size: result.sample_values.slice(0, 10)
            }
        };
        var data = [trace];

        var layout = {
            height: 700,
            width: 1200,
            xaxis: {
                title: "OTU ID",
            }

        };
        // Render the plot to the div tag with id "plot"
        Plotly.newPlot('bubble', data, layout);
    })
}

// Handler function that calls our chart functions when dropdown changes
function optionChanged(newSample) {
    buildMetadata(newSample);
    buildBar(newSample);
    buildPlt(newSample);
    buildGague(newSample);
}

init();
// on page load we're rending charts with a default value of 940
buildMetadata('940');
buildBar('940');
buildPlt('940');
buildGague('940')