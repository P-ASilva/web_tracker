document.addEventListener('DOMContentLoaded', function() {
  const scoreSection = document.getElementById('section-privacy-score');
  const cookiesSection = document.getElementById('section-results-cookies');
  const storageSection = document.getElementById('section-results-storage');
  const hijackingSection = document.getElementById('section-results-hijacking');
  const canvasSection = document.getElementById('section-results-canvas');

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

  // Função para exibir resultados de Armazenamento Local
  document.getElementById('btn-show-storage').addEventListener('click', function() {
    hideAllSections();
    storageSection.classList.add('active');

    browser.runtime.sendMessage({ type: "getResults" }).then(result => {
      const { localStorageItems } = result;
      document.getElementById('results-storage').textContent = 
        `Itens no armazenamento local: ${localStorageItems}`;
    });
  });

  // Função para exibir resultados de Hijacking
  document.getElementById('btn-detect-hijacking').addEventListener('click', function() {
    hideAllSections();
    hijackingSection.classList.add('active');

    browser.runtime.sendMessage({ type: "getResults" }).then(result => {
      const { hijackingDetected } = result;
      document.getElementById('results-hijacking').textContent = 
        hijackingDetected ? 'Hijacking detectado!' : 'Nenhum Hijacking detectado.';
    });
  });

  // Função para exibir resultados de Canvas Fingerprinting
  document.getElementById('btn-detect-canvas').addEventListener('click', function() {
    hideAllSections();
    canvasSection.classList.add('active');

    browser.runtime.sendMessage({ type: "getResults" }).then(result => {
      const { canvasDetected } = result;
      document.getElementById('results-canvas').textContent = 
        canvasDetected ? 'Canvas Fingerprinting detectado!' : 'Nenhum Canvas Fingerprinting detectado.';
    });
  });

  // Função para calcular a pontuação de privacidade
  document.getElementById('btn-privacy-score').addEventListener('click', function() {
    hideAllSections();
    scoreSection.classList.add('active');

    browser.runtime.sendMessage({ type: "getResults" }).then(result => {
      const { cookieDeductions, storageDeductions, hijackingDeductions, canvasDeductions } = result;
      
      let score = 100;
      let totalDeductions = (cookieDeductions || 0) + (storageDeductions || 0) + (hijackingDeductions || 0) + (canvasDeductions || 0);
      const finalScore = Math.max(0, score - totalDeductions); // Garante que a pontuação não seja negativa

      document.getElementById('privacy-score').textContent = `Pontuação de Privacidade: ${finalScore}/100`;
    });
  });

  // Função para esconder todas as seções
  function hideAllSections() {
    scoreSection.classList.remove('active');
    cookiesSection.classList.remove('active');
    storageSection.classList.remove('active');
    hijackingSection.classList.remove('active');
    canvasSection.classList.remove('active');
  }
});
