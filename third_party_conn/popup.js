document.addEventListener('DOMContentLoaded', function() {
  
  const scoreSection = document.getElementById('section-privacy-score');
  const cookiesSection = document.getElementById('section-show-cookies');
  const storageSection = document.getElementById('section-show-storage');
  const hijackingSection = document.getElementById('section-detect-hijacking');
  const canvasSection = document.getElementById('section-detect-canvas');
  const connectionsSection = document.getElementById('section-detect-connections');

  const btnCalculateScore = document.getElementById('btn-privacy-score');
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

  function hideAllSections() {
    btnCalculateScore.classList.remove('active');
    scoreSection.classList.remove('active');
    cookiesSection.classList.remove('active');
    storageSection.classList.remove('active');
    hijackingSection.classList.remove('active');
    canvasSection.classList.remove('active');
  }

});