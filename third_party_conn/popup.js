document.addEventListener('DOMContentLoaded', function() {
  const btnCalculateScore = document.getElementById('btn-privacy-score');
  const scoreSection = document.getElementById('section-privacy-score');
  const cookiesSection = document.getElementById('section-results-cookies');
  const storageSection = document.getElementById('section-results-storage');
  const hijackingSection = document.getElementById('section-results-hijacking');
  const canvasSection = document.getElementById('section-results-canvas');

  const btnDetectConnections = document.getElementById('btn-detect-connections');
  const btnShowCookies = document.getElementById('btn-show-cookies');
  const btnShowStorage = document.getElementById('btn-show-storage');
  const btnDetectHijacking = document.getElementById('btn-detect-hijacking');
  const btnDetectCanvas = document.getElementById('btn-detect-canvas');
  
  // Exibir a seção de Conexões de Terceira Parte
  btnDetectConnections.addEventListener('click', function() {
    hideAllSections();
    connectionsSection.classList.add('active');

    // Reseta a lista de conexões
    let storedConnections = JSON.parse(localStorage.getItem('thirdPartyConnections')) || [];
    const connectionsList = document.getElementById('connections-list');
    connectionsList.innerHTML = ''; // Limpa a lista antes de popular
    storedConnections.forEach(domain => {
      const listItem = document.createElement('li');
      listItem.textContent = domain;
      connectionsList.appendChild(listItem);
    });
  });
  
  btnShowCookies.addEventListener('click', function() {
    hideAllSections();
    cookiesSection.classList.add('active');
  
    const cookiesList = document.createElement('ul');
    cookiesSection.appendChild(cookiesList);
  
    // Get cookies from the active tab
    browser.tabs.query({active: true, currentWindow: true}).then(tabs => {
      let url = tabs[0].url;
      let domain = (new URL(url)).hostname;
  
      browser.cookies.getAll({domain: domain}).then(cookies => {
        cookiesList.innerHTML = '';  // Clear the list before populating
        if (cookies.length === 0) {
          cookiesList.textContent = 'No cookies found for this site.';
        } else {
          cookies.forEach(cookie => {
            const listItem = document.createElement('li');
            listItem.textContent = `${cookie.name}: ${cookie.value}`;
            cookiesList.appendChild(listItem);
          });
        }
      });
    });
  });

  function hideAllSections() {
    btnCalculateScore.classList.remove('active');
    scoreSection.classList.remove('active');
    cookiesSection.classList.remove('active');
    storageSection.classList.remove('active');
    hijackingSection.classList.remove('active');
    canvasSection.classList.remove('active');
  }

});