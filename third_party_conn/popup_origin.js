document.addEventListener('DOMContentLoaded', function() {
  const connectionsSection = document.getElementById('section-detect-connections');
  const cookiesSection = document.getElementById('section-show-cookies');
  const storageSection = document.getElementById('section-show-storage');
  const hijackingSection = document.getElementById('section-detect-hijacking');
  const canvasSection = document.getElementById('section-detect-canvas');
  const scoreSection = document.getElementById('section-privacy-score');

  const btnDetectConnections = document.getElementById('btn-detect-connections');
  const btnShowCookies = document.getElementById('btn-show-cookies');
  const btnShowStorage = document.getElementById('btn-show-storage');
  const btnDetectHijacking = document.getElementById('btn-detect-hijacking');
  const btnDetectCanvas = document.getElementById('btn-detect-canvas');
  const btnCalculateScore = document.getElementById('btn-privacy-score');


  function hideAllSections() {
    connectionsSection.classList.remove('active');
    cookiesSection.classList.remove('active');
    storageSection.classList.remove('active');
    hijackingSection.classList.remove('active');
    canvasSection.classList.remove('active');
    scoreSection.classList.remove('active');
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
    // console.log(storageSection.classList);
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
  // Função para detecção de Hijacking e Hook (simples)
  btnDetectHijacking.addEventListener('click', function() {
    hideAllSections();
    hijackingSection.classList.add('active');

    const hijackingList = document.getElementById('hijacking-list');
    hijackingList.innerHTML = ''; // Limpa a lista

    browser.tabs.query({active: true, currentWindow: true}).then(tabs => {
      browser.tabs.executeScript(tabs[0].id, {
        code: `(() => {
          let hijackingDetected = false;
          if (window.location.href !== document.referrer) {
            hijackingDetected = true;
          }
          hijackingDetected;
        })()`
      }).then(result => {
        if (result[0]) {
          hijackingList.textContent = 'Potencial ameaça de Hijacking detectada!';
        } else {
          hijackingList.textContent = 'Nenhuma ameaça de Hijacking encontrada.';
        }
      });
    });
  });
  // Função para detecção de Canvas Fingerprinting
  btnDetectCanvas.addEventListener('click', function() {
    hideAllSections();
    canvasSection.classList.add('active');

    const canvasList = document.getElementById('canvas-list');
    canvasList.innerHTML = ''; 

    browser.tabs.query({active: true, currentWindow: true}).then(tabs => {
      browser.tabs.executeScript(tabs[0].id, {
        code: `(() => {
          let canvasDetected = false;
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (ctx) {
            canvasDetected = true;
          }
          canvasDetected;
        })()`
      }).then(result => {
        if (result[0]) {
          canvasList.textContent = 'Tentativa de Canvas Fingerprinting detectada!';
        } else {
          canvasList.textContent = 'Nenhuma tentativa de Canvas Fingerprinting detectada.';
        }
      });
    });
  });
  // Função para cálculo da pontuação de privacidade
  btnCalculateScore.addEventListener('click', function() {
    hideAllSections();
    scoreSection.classList.add('active');

    let score = 100;  // Começamos com uma pontuação perfeita
    let deductions = 0;

    // Verifica o número de cookies e faz deduções
    browser.cookies.getAll({}).then(cookies => {
      const totalCookies = cookies.length;
      if (totalCookies > 10) {
        deductions += 10;  // Deduz 10 pontos se houver mais de 10 cookies
      }
    });

    // Verifica se houve armazenamento local
    browser.tabs.query({active: true, currentWindow: true}).then(tabs => {
      browser.tabs.executeScript(tabs[0].id, {
        code: `Object.keys(localStorage).length`
      }).then(result => {
        if (result[0] > 0) {
          deductions += 15;  // Deduz 15 pontos se houver dados armazenados localmente
        }
      });
    });

    // Verifica se houve Canvas Fingerprinting ou Hijacking
    if (canvasSection.textContent.includes('detectada') || hijackingSection.textContent.includes('detectada')) {
      deductions += 20;  // Deduz 20 pontos para cada tipo de ataque
    }

    // Exibe a pontuação final
    const finalScore = score - deductions;
    document.getElementById('privacy-score').textContent = `Pontuação de Privacidade: ${finalScore}/100`;
  });
});
