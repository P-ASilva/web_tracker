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

    // Mostra as conexões detectadas (já implementado)
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

    // Limpa a lista de cookies
    const cookiesList = document.createElement('ul');
    cookiesSection.appendChild(cookiesList);

    // Obtém os cookies da aba atual
    browser.cookies.getAll({}).then(cookies => {
      cookiesList.innerHTML = '';  // Limpa antes de exibir os novos cookies
      cookies.forEach(cookie => {
        const listItem = document.createElement('li');
        listItem.textContent = `${cookie.name}: ${cookie.value}`;
        cookiesList.appendChild(listItem);
      });
    });
  });

  // Exibir a seção de Storage (LocalStorage)
  btnShowStorage.addEventListener('click', function() {
    hideAllSections();
    storageSection.classList.add('active');

    // Verifica e exibe o localStorage da aba atual
    const storageList = document.createElement('ul');
    storageSection.appendChild(storageList);

    browser.tabs.query({active: true, currentWindow: true}).then(tabs => {
      browser.tabs.executeScript(tabs[0].id, {
        code: `Object.entries(localStorage).map(([key, value]) => key + ": " + value)`
      }).then(results => {
        storageList.innerHTML = '';  // Limpa a lista antes de popular
        results[0].forEach(item => {
          const listItem = document.createElement('li');
          listItem.textContent = item;
          storageList.appendChild(listItem);
        });
      });
    });
  });
});
