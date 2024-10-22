document.addEventListener('DOMContentLoaded', function() {
  const connectionsSection = document.getElementById('section-detect-connections');
  const cookiesSection = document.getElementById('section-show-cookies');
  const storageSection = document.getElementById('section-show-storage');

  const btnDetectConnections = document.getElementById('btn-detect-connections');
  const btnShowCookies = document.getElementById('btn-show-cookies');
  const btnShowStorage = document.getElementById('btn-show-storage');

  function hideAllSections() {
    connectionsSection.classList.remove('active');
    cookiesSection.classList.remove('active');
    storageSection.classList.remove('active');
  }

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

  // Exibir a seção de Cookies
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

  // Exibir a seção de Storage (LocalStorage)
  btnShowStorage.addEventListener('click', function() {
    hideAllSections();
    storageSection.classList.add('active');

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
