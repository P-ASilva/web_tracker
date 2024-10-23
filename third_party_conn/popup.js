document.addEventListener('DOMContentLoaded', function() {
  const btnCalculateScore = document.getElementById('btn-privacy-score');
  const scoreSection = document.getElementById('section-privacy-score');

  let cookieDeductions = 0;
  let storageDeductions = 0;
  let hijackingDeductions = 0;
  let canvasDeductions = 0;

  // Função para calcular a pontuação de privacidade
  btnCalculateScore.addEventListener('click', function() {
    scoreSection.classList.add('active');
    const tabIdPromise = getActiveTabId();

    // Inicializa as verificações enviando mensagens para o background.js
    tabIdPromise.then(tabId => {
      // Verificação de cookies
      browser.runtime.sendMessage({ type: "checkCookies", tabId: tabId }).then(response => {
        const { totalCookies, thirdPartyCookies } = response;
        if (totalCookies > 10) {
          cookieDeductions += 10; // Deduz 10 pontos se houver mais de 10 cookies
        }
        if (thirdPartyCookies > 5) {
          cookieDeductions += 15; // Deduz 15 pontos se houver mais de 5 cookies de terceira parte
        }

        // Verificação de armazenamento local
        browser.runtime.sendMessage({ type: "checkStorage", tabId: tabId }).then(response => {
          if (response.localStorageItems > 0) {
            storageDeductions += 15; // Deduz 15 pontos se houver dados no localStorage
          }

          // Verificação de hijacking
          browser.runtime.sendMessage({ type: "checkHijacking", tabId: tabId }).then(response => {
            if (response.hijackingDetected) {
              hijackingDeductions += 25; // Deduz 25 pontos se houver hijacking detectado
            }

            // Verificação de Canvas Fingerprinting
            browser.runtime.sendMessage({ type: "checkCanvas", tabId: tabId }).then(response => {
              if (response.canvasDetected) {
                canvasDeductions += 20; // Deduz 20 pontos se houver Canvas Fingerprinting detectado
              }

              // Após todas as verificações, calcular e exibir a pontuação
              calculateAndDisplayScore();
            });
          });
        });
      });
    });
  });

  // Função para obter o ID da aba ativa
  function getActiveTabId() {
    return browser.tabs.query({ active: true, currentWindow: true }).then(tabs => tabs[0].id);
  }

  // Função para calcular e exibir a pontuação de privacidade
  function calculateAndDisplayScore() {
    let score = 100;
    let totalDeductions = cookieDeductions + storageDeductions + hijackingDeductions + canvasDeductions;
    const finalScore = Math.max(0, score - totalDeductions); // Garante que a pontuação não seja negativa

    document.getElementById('privacy-score').textContent = `Pontuação de Privacidade: ${finalScore}/100`;

    // Resetar deduções para futuras verificações
    cookieDeductions = 0;
    storageDeductions = 0;
    hijackingDeductions = 0;
    canvasDeductions = 0;
  }
});