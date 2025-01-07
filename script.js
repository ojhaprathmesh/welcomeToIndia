let states = {};

fetch('assets/states.json')
    .then(response => response.json())
    .then(data => {
        states = data;  // Store the fetched data in the states variable
        console.log(states); // Confirm that data is loaded

        const svg = d3.select("#india-map")
            .attr("width", "100%")
            .attr("height", "100%");

        d3.json("assets/indiageojson.geojson").then(data => {
            const projection = d3.geoMercator().fitSize([1000, 600], data);
            const path = d3.geoPath().projection(projection);

            svg.selectAll("path")
                .data(data.features)
                .enter().append("path")
                .attr("d", path)
                .attr("class", "state")
                .style("fill", "white") // Set the initial color to white
                .style("stroke", "black")
                .on("mouseover", function (event, d) {
                    const stateName = d.properties.st_nm;

                    if (states[stateName]) {
                        const stateInfo = states[stateName];

                        d3.select("#state-name").text(stateInfo.name); // Update state name
                        d3.select("#state-details").text(stateInfo.details); // Update state details
                        d3.select("#state-info")
                            .style("display", "block")
                            .style("top", `${event.pageY + 10}px`) // Adjust position
                            .style("left", `${event.pageX + 10}px`);
                    }
                    d3.select(this).style("fill", "red"); // Highlight the state on hover
                })
                .on("mousemove", function (event) {
                    d3.select("#state-info")
                        .style("top", `${event.pageY}px`)
                        .style("left", `${event.pageX - 100}px`);
                })
                .on("mouseout", function () {
                    d3.select("#state-info").style("display", "none");
                    d3.select(this).style("fill", "white"); // Reset color
                });
        });
    })
    .catch(error => console.error('Error fetching states data:', error));
