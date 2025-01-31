console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}


document.body.insertAdjacentHTML(
    'afterbegin',
    `
    <label class="color-scheme">
        Theme:
        <select id="theme-select">
            <option value="light dark">Automatic</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
        </select>
    </label>
    `
    
);



const select = document.querySelector(".color-scheme select");
// Check if a color scheme preference exists in localStorage when the page loads
if ("colorScheme" in localStorage) {
    // Set the color scheme from localStorage
    document.documentElement.style.setProperty("color-scheme", localStorage.colorScheme);

    // Update the <select> value to match
    select.value = localStorage.colorScheme;
}

select.addEventListener('input', function (event) {

    console.log('color scheme changed to', event.target.value);
        // Check if a color scheme preference exists in localStorage
    document.documentElement.style.setProperty('color-scheme', event.target.value);
    localStorage.colorScheme = event.target.value;


  });

const navLinks = $$('nav a');
console.log("Navigation Links:", navLinks);

let currentLink = navLinks.find(
    (a) => a.host === location.host && a.pathname === location.pathname
  );

  currentLink?.classList.add('current');

  let pages = [
    { url: 'index.html', title: 'Home' },
    { url: 'projects/index.html', title: 'Projects' },
    { url: 'contact/index.html', title: 'Contact' },
    { url: "https://github.com/Michaelvasandani", title: "GitHub" },
    { url: 'resume/index.html', title: 'Resume' }
  ];

  
let nav = document.createElement('nav');
document.body.prepend(nav);

const ARE_WE_HOME = document.documentElement.classList.contains('home');

for (let p of pages) {
    let url = p.url;
    let title = p.title;
    // TODO create link and add it to nav
    url = !ARE_WE_HOME && !url.startsWith('http') ? '../' + url : url;
    let a = document.createElement('a');
    a.href = url;
    a.textContent = title;
    nav.append(a);
    if (a.host === location.host && a.pathname === location.pathname) {
        a.classList.add('current');
      }
      a.classList.toggle(
        'current',
        a.host === location.host && a.pathname === location.pathname
      );
      if (a.host != location.host) {
        a.target = "_blank";
      }  
  }

  const form = document.querySelector("form");
  form?.addEventListener("submit", function (event) {
    event.preventDefault();
    const data = new FormData(form);
    let url = form.action + "?";
    for (let [name, value] of data) {
        console.log(name, value);
        url += `${encodeURIComponent(name)}=${encodeURIComponent(value)}&`;
      }
      url = url.slice(0, -1);
      location.href = url;
    });

    export async function fetchJSON(url) {
      try {
          const response = await fetch(url);
          
          if (!response.ok) {
              throw new Error(`Failed to fetch projects: ${response.statusText}`);
          }
          
          const data = await response.json();
          return data;
      } catch (error) {
          console.error('Error fetching or parsing JSON data:', error);
      }
  }

  export function renderProjects(project, containerElement, headingLevel = 'h2') {
    // Your code will go here
    containerElement.innerHTML = '';
    // Loop through projects and create an article for each
    project.forEach(project => {
      const article = document.createElement('article');
      article.innerHTML = `
          <${headingLevel}>${project.title}</${headingLevel}>
          <img src="${project.image || 'default.jpg'}" alt="${project.title || 'Project Image'}">
          <p>${project.description || 'No description available.'}</p>
      `;
      containerElement.appendChild(article);
  });

}

export async function fetchGitHubData(username) {
  // return statement here
  return fetchJSON(`https://api.github.com/users/${username}`);

}