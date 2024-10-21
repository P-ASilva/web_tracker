// Obter as conexões salvas no localStorage e exibi-las
// document.addEventListener('DOMContentLoaded', function() {
//     const domainList = document.getElementById('domains');
//     const storedConnections = JSON.parse(localStorage.getItem('thirdPartyConnections')) || [];
  
//     // Exibir as conexões no popup
//     storedConnections.forEach(domain => {
//       const listItem = document.createElement('li');
//       listItem.textContent = domain;
//       domainList.appendChild(listItem);
//     });
//   });

  document.addEventListener('DOMContentLoaded', function() {
    // Seleciona as seções e os botões
    const connectionsSection = document.getElementById('section-detect-connections');
    const cookiesSection = document.getElementById('section-show-cookies');
    const storageSection = document.getElementById('section-show-storage');
  
    const btnDetectConnections = document.getElementById('btn-detect-connections');
    const btnShowCookies = document.getElementById('btn-show-cookies');
    const btnShowStorage = document.getElementById('btn-show-storage');
  
    // Função para ocultar todas as seções
    function hideAllSections() {
      connectionsSection.classList.remove('active');
      cookiesSection.classList.remove('active');
      storageSection.classList.remove('active');
    }
  
    // Exibir a seção de Conexões de Terceira Parte
    btnDetectConnections.addEventListener('click', function() {
      hideAllSections();
      connectionsSection.classList.add('active');
      // Aqui você pode adicionar o código para listar as conexões detectadas
      let storedConnections = JSON.parse(localStorage.getItem('thirdPartyConnections')) || [];
      const connectionsList = document.getElementById('connections-list');
      connectionsList.innerHTML = ''; // Limpa a lista antes de popular
      storedConnections.forEach(domain => {
        const listItem = document.createElement('li');
        listItem.textContent = domain;
        connectionsList.appendChild(listItem);
      });
    });
  
    // Exibir a seção de Cookies
    btnShowCookies.addEventListener('click', function() {
      hideAllSections();
      cookiesSection.classList.add('active');
      // Aqui você pode adicionar o código para mostrar os cookies
    });
  
    // Exibir a seção de Storage
    btnShowStorage.addEventListener('click', function() {
      hideAllSections();
      storageSection.classList.add('active');
      // Aqui você pode adicionar o código para mostrar os dados armazenados
    });
  });
  