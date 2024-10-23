document.addEventListener('DOMContentLoaded', function() {
  const btnCalculateScore = document.getElementById('btn-privacy-score');
  const scoreSection = document.getElementById('section-privacy-score');

  // Função para iniciar verificações de cookies
  document.getElementById('btn-show-cookies').addEventListener('click', function() {
    getActiveTabId().then(tabId => {
      browser.runtime.sendMessage({ type: "checkCookies", tabId }).then(response => {
        console.log('Verificação de Cookies:', response);
      });
    });
  });

  // Função para iniciar verificações de armazenamento local
  document.getElementById('btn-show-storage').addEventListener('click', function() {
    getActiveTabId().then(tabId => {
      browser.runtime.sendMessage({ type: "checkStorage", tabId }).then(response => {
        console.log('Verificação de Storage:', response);
      });
    });
  });

  // Função para iniciar verificações de hijacking
  document.getElementById('btn-detect-hijacking').addEventListener('click', function() {
    getActiveTabId().then(tabId => {
      browser.runtime.sendMessage({ type: "checkHijacking", tabId }).then(response => {
        console.log('Verificação de Hijacking:', response);
      });
    });
  });

  // Função para iniciar verificações de Canvas Fingerprinting
  document.getElementById('btn-detect-canvas').addEventListener('click', function() {
    getActiveTabId().then(tabId => {
      browser.runtime.sendMessage({ type: "checkCanvas", tabId }).then(response => {
        console.log('Verificação de Canvas:', response);
      });
    });
  });

  // Função para calcular a pontuação de privacidade
  btnCalculateScore.addEventListener('click', function() {
    scoreSection.classList.add('active');

    browser.storage.local.get([
      'cookieDeductions',
      'storageDeductions',
      'hijackingDeductions',
      'canvasDeductions'
    ]).then(result => {
      const { cookieDeductions, storageDeductions, hijackingDeductions, canvasDeductions } = result;
      let score = 100;
      let totalDeductions = (cookieDeductions || 0) + (storageDeductions || 0) + (hijackingDeductions || 0) + (canvasDeductions || 0);
      const finalScore = Math.max(0, score - totalDeductions); // Garante que a pontuação não seja negativa

      document.getElementById('privacy-score').textContent = `Pontuação de Privacidade: ${finalScore}/100`;
    });
  });

  // Função para obter o ID da aba ativa
  function getActiveTabId() {
    return browser.tabs.query({ active: true, currentWindow: true }).then(tabs => tabs[0].id);
  }
});
