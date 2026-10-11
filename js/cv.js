// The new PDF is enabled only when its file has been added to the site.
if (SITE_CONFIG.cvReady) {
  const container = document.getElementById('cv-content');
  const url = encodeURI(SITE_CONFIG.cvFile);
  container.innerHTML = `
    <div class="cv-actions">
      <p>${SITE_CONFIG.cvUpdated ? 'Updated ' + escapeHtml(SITE_CONFIG.cvUpdated) : ''}</p>
      <a href="${url}" download class="cv-download-btn">Download PDF</a>
    </div>
    <div class="cv-embed-wrap">
      <iframe src="${url}" title="Curriculum Vitae of Motoki Kagami"></iframe>
      <div class="cv-mobile-msg">
        <p>Download the PDF to view the CV.</p>
        <a href="${url}" download class="cv-download-btn">Download CV</a>
      </div>
    </div>`;
}
