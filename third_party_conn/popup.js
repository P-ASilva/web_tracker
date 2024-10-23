document.addEventListener('DOMContentLoaded', function() {
  
  const scoreSection = document.getElementById('section-privacy-score');
  const cookiesSection = document.getElementById('section-show-cookies');
  const storageSection = document.getElementById('section-show-storage');
  const hijackingSection = document.getElementById('section-detect-hijacking');
  const canvasSection = document.getElementById('section-detect-canvas');
  const connectionsSection = document.getElementById('section-detect-connections');

  function hideAllSections() {
    connectionsSection.classList.remove('active');
    scoreSection.classList.remove('active');
    cookiesSection.classList.remove('active');
    storageSection.classList.remove('active');
    hijackingSection.classList.remove('active');
    canvasSection.classList.remove('active');
  }
  // Exibir a seção de Conexões de Terceira Parte
  document.getElementById('btn-detect-connections').addEventListener('click', function() {
    hideAllSections();
    connectionsSection.classList.add('active');
    browser.runtime.sendMessage({ type: "getResults" })
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
  // Função para exibir resultados de Cookies
  document.getElementById('btn-show-cookies').addEventListener('click', function() {
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

  // Função para exibir resultados de Armazenamento Local
  document.getElementById('btn-show-storage').addEventListener('click', function() {
    hideAllSections();
    storageSection.classList.add('active');
    result = localStorage.getItem('storageItems');

    const { localStorageItems } = result;
    document.getElementById('results-storage').textContent = 
      `Itens no armazenamento local: ${localStorageItems}`;
  });

  // Função para exibir resultados de Hijacking
  document.getElementById('btn-detect-hijacking').addEventListener('click', function() {
    hideAllSections();
    hijackingSection.classList.add('active');
    result = localStorage.getItem('hijackingResults');

    const { hijackingDetected } = result;
    document.getElementById('results-hijacking').textContent = 
      hijackingDetected ? 'Hijacking detectado!' : 'Nenhum Hijacking detectado.';
  });

  // Função para exibir resultados de Canvas Fingerprinting
  document.getElementById('btn-detect-canvas').addEventListener('click', function() {
    hideAllSections();
    canvasSection.classList.add('active');
    result = localStorage.getItem('canvasResults');

    const { canvasDetected } = result;
    document.getElementById('results-canvas').textContent = 
      canvasDetected ? 'Canvas Fingerprinting detectado!' : 'Nenhum Canvas Fingerprinting detectado.';
  });
  
  document.getElementById('btn-privacy-score').addEventListener('click', function() {
    hideAllSections();
    scoreSection.classList.add('active');
    result = localStorage.getItem('scoreResults');

    const { cookieDeductions, storageDeductions, hijackingDeductions, canvasDeductions } = result;
    
    let score = 100;
    let totalDeductions = (cookieDeductions || 0) + (storageDeductions || 0) + (hijackingDeductions || 0) + (canvasDeductions || 0);
    const finalScore = Math.max(0, score - totalDeductions); // Garante que a pontuação não seja negativa

    document.getElementById('privacy-score').textContent = `Pontuação de Privacidade: ${finalScore}/100`;
  });
  
});