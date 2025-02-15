import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";
import { fetchJSON, renderProjects } from "../global.js";

// ✅ Declare selectedIndex globally to track the selected pie wedge
let selectedIndex = -1;

// ✅ Fetch project data
const projects = await fetchJSON("../lib/projects.json");
const projectsContainer = document.querySelector(".projects");
const projectsTitle = document.querySelector(".projects-title");
const searchInput = document.querySelector(".searchBar");
let svg = d3.select("svg");
let legend = d3.select(".legend");

// ✅ Initial render of projects
renderProjects(projects, projectsContainer, "h2");
if (projectsTitle) {
  projectsTitle.textContent = `${projects.length} Projects`;
}

// ✅ Function to render the pie chart and legend
function renderPieChart(projectsToRender) {
  svg.selectAll("path").remove(); // ✅ Clear previous pie slices
  legend.selectAll("*").remove(); // ✅ Clear previous legend items

  // ✅ Aggregate data by year from the currently filtered projects
  let rolledData = d3.rollups(
    projectsToRender, // ✅ Uses only the filtered projects!
    (v) => v.length,
    (d) => d.year
  );

  let data = rolledData.map(([year, count]) => ({ value: count, label: year }));

  // ✅ Generate pie chart data
  let sliceGenerator = d3.pie().value((d) => d.value);
  let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
  let arcData = sliceGenerator(data);
  let colors = d3.scaleOrdinal(d3.schemeTableau10);

  // ✅ Append arcs (pie slices) to SVG
  arcData.forEach((arc, i) => {
    svg
      .append("path")
      .attr("d", arcGenerator(arc))
      .attr("fill", colors(i))
      .style("cursor", "pointer") // ✅ Make slices clickable
      .on("click", () => {
        selectedIndex = selectedIndex === i ? -1 : i; // ✅ Toggle selection

        // ✅ Highlight selected pie slice
        svg
          .selectAll("path")
          .attr("class", (_, idx) => (selectedIndex === idx ? "selected" : ""));

        // ✅ Highlight selected legend item
        legend
          .selectAll("li")
          .attr("class", (_, idx) => (selectedIndex === idx ? "selected" : ""));

        // ✅ FILTER PROJECTS BASED ON SELECTION + SEARCH QUERY
        // projectsToRender is already filtered by the search query

        // When the user types in the search bar, the function renderPieChart(filteredProjects) is called.
        // projectsToRender now contains only the search-filtered results.
        // Checking selectedIndex === -1 ensures the correct filter is applied

        // If no pie slice is selected, it shows all search-filtered projects (projectsToRender).
        // If a pie slice is selected, it further filters projectsToRender by the selected year.
        // This prevents the pie chart from overriding the search filter

        // Instead of resetting to all projects, it filters only within the active search results
        let filteredProjects =
          selectedIndex === -1
            ? projectsToRender
            : projectsToRender.filter(
                (project) => project.year === data[selectedIndex].label
              );

        renderProjects(filteredProjects, projectsContainer, "h2");
        if (projectsTitle) {
          projectsTitle.textContent = `${filteredProjects.length} Projects`; // ✅ Update count
        }
      });
  });

  // ✅ Append legend items (Clickable legend filters projects just like pie slices)
  data.forEach((d, idx) => {
    legend
      .append("li")
      .attr("style", `--color:${colors(idx)}`)
      .attr("class", "legend-item")
      .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`)
      .on("click", () => {
        selectedIndex = selectedIndex === idx ? -1 : idx; // ✅ Toggle selection

        // ✅ Highlight selected pie slice
        svg
          .selectAll("path")
          .attr("class", (_, i) => (selectedIndex === i ? "selected" : ""));

        // ✅ Highlight selected legend item
        legend
          .selectAll("li")
          .attr("class", (_, i) => (selectedIndex === i ? "selected" : ""));

        // ✅ FILTER PROJECTS BASED ON SELECTION + SEARCH QUERY
        let filteredProjects =
          selectedIndex === -1
            ? projectsToRender
            : projectsToRender.filter(
                (project) => project.year === data[selectedIndex].label
              );
        /** it filters projectsToRender, not projects.
projectsToRender only contains search-filtered results because it came from renderPieChart(filteredProjects), which was called in the search event listener.
This prevents the pie chart from overriding the search filter, allowing both filters to be applied at once. */

        renderProjects(filteredProjects, projectsContainer, "h2");
        if (projectsTitle) {
          projectsTitle.textContent = `${filteredProjects.length} Projects`; // ✅ Update count
        }
      });
  });
}

// ✅ Call the function once to load the pie chart initially
renderPieChart(projects);

// ✅ SEARCH BAR EVENT LISTENER: FILTERS PROJECTS AND UPDATES PIE CHART
searchInput.addEventListener("input", (event) => {
  let query = event.target.value.toLowerCase();

  // ✅ FILTER PROJECTS BASED ON SEARCH QUERY
  let filteredProjects = projects.filter((project) =>
    Object.values(project).join("\n").toLowerCase().includes(query)
  );

  // ✅ UPDATE THE PROJECT LIST TO REFLECT THE SEARCH FILTER
  renderProjects(filteredProjects, projectsContainer, "h2");

  // ✅ UPDATE PROJECT COUNT IN THE TITLE
  if (projectsTitle) {
    projectsTitle.textContent = `${filteredProjects.length} Projects`;
  }

  // ✅ UPDATE PIE CHART BASED ON SEARCH RESULTS (WHILE PRESERVING PIE SELECTION)
  renderPieChart(filteredProjects);
});
