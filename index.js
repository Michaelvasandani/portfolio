import { fetchJSON, renderProjects, fetchGitHubData } from './global.js';

// Fetch the project data and filter for the latest three projects
fetchJSON('./lib/projects.json').then(projects => {
    const latestProjects = projects.slice(0, 3);
    
    // Select the projects container
    const projectsContainer = document.querySelector('.projects');
    
    // Render the latest projects
    if (latestProjects.length > 0) {
        renderProjects(latestProjects, projectsContainer, 'h2');
    } else {
        projectsContainer.innerHTML = '<p>No recent projects available.</p>';
    }
}).catch(error => {
    console.error('Error loading latest projects:', error);
});

const githubData = await fetchGitHubData('Michaelvasandani');
const profileStats = document.querySelector('#profile-stats');
if (profileStats) {
  profileStats.innerHTML = `
        <dl>
          <dt>Public Repos:</dt><dd>${githubData.public_repos}</dd>
          <dt>Public Gists:</dt><dd>${githubData.public_gists}</dd>
          <dt>Followers:</dt><dd>${githubData.followers}</dd>
          <dt>Following:</dt><dd>${githubData.following}</dd>
        </dl>
    `;
}