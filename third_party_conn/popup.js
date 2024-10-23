document.addEventListener('DOMContentLoaded', function() {
  
  const scoreSection = document.getElementById('section-privacy-score');
  const cookiesSection = document.getElementById('section-show-cookies');
  const storageSection = document.getElementById('section-show-storage');
  const hijackingSection = document.getElementById('section-detect-hijacking');
  const canvasSection = document.getElementById('section-detect-canvas');
  const connectionsSection = document.getElementById('section-detect-connections');

  const btnCalculateScore = document.getElementById('btn-privacy-score');

  function hideAllSections() {
    btnCalculateScore.classList.remove('active');
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

    browser.runtime.sendMessage({ type: "getResults" }).then(result => {
      const { totalCookies, thirdPartyCookies } = result;
      document.getElementById('results-cookies').textContent = 
        `Total de cookies: ${totalCookies}, Cookies de terceira parte: ${thirdPartyCookies}`;
    });
  });
});