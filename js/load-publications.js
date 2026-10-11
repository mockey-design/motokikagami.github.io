// Load after the page renderer so cached responses cannot race its setup.
fetch('data/publications.json')
  .then(response => {
    if (!response.ok) throw new Error('Publication data unavailable');
    return response.json();
  })
  .then(data => {
    window.PUBLICATIONS = data;
    if (typeof renderHighlights === 'function') renderHighlights();
    if (typeof renderPublications === 'function') renderPublications();
  })
  .catch(() => {
    const container = document.getElementById('pub-list') || document.getElementById('highlights-grid');
    if (container) container.innerHTML = '<p>Publications could not be loaded. Please reload the page or visit <a href="https://scholar.google.com/citations?user=yOV3dOUAAAAJ">Google Scholar</a>.</p>';
  });
