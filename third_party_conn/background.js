// Variáveis globais para armazenar as deduções
let cookieDeductions = 0;
let storageDeductions = 0;
let hijackingDeductions = 0;
let canvasDeductions = 0;

browser.webRequest.onBeforeRequest.addListener(
    function(details) {
      let url = new URL(details.url);
      let requestedDomain = url.hostname;
      let originDomain = null;
  
      // Tenta pegar o domínio da página usando 'originUrl' ou 'tabId'
      if (details.originUrl) {
        let originUrl = new URL(details.originUrl);
        originDomain = originUrl.hostname;
      } else if (details.tabId !== -1) {
        browser.tabs.get(details.tabId).then(tab => {
          let tabUrl = new URL(tab.url);
          originDomain = tabUrl.hostname;
        });
      }
  
      // Verifica se o domínio da requisição é diferente do domínio da página
      if (originDomain !== requestedDomain) {
        // Armazena o domínio detectado no localStorage
        let storedConnections = JSON.parse(localStorage.getItem('thirdPartyConnections')) || [];
        if (!storedConnections.includes(requestedDomain)) {
          storedConnections.push(requestedDomain);
          localStorage.setItem('thirdPartyConnections', JSON.stringify(storedConnections));
        }
      }
  
  
    },
    {urls: ["<all_urls>"]}
  );
// Escuta mensagens do popup.js para enviar os resultados das verificações
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "getResults") {
    sendResponse({
      cookieDeductions,
      storageDeductions,
      hijackingDeductions,
      canvasDeductions
    });
  }

  if (message.type === "resetDeductions") {
    resetDeductions();
    sendResponse({ success: true });
  }
});

// Monitora quando uma aba termina de carregar e realiza as verificações
browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    // Realiza todas as verificações quando a página é completamente carregada
    performChecks(tabId);
  }
});

// Função para realizar todas as verificações (cookies, storage, hijacking, canvas)
async function performChecks(tabId) {
  // Reseta as deduções antes de realizar as verificações
  resetDeductions();

  // Verifica cookies
  const cookiesResult = await checkCookies(tabId);
  cookieDeductions = cookiesResult.deductions;

  // Verifica armazenamento local
  const storageResult = await checkStorage(tabId);
  storageDeductions = storageResult.deductions;

  // Verifica hijacking
  const hijackingResult = await checkHijacking(tabId);
  hijackingDeductions = hijackingResult.deductions;

  // Verifica Canvas Fingerprinting
  const canvasResult = await checkCanvas(tabId);
  canvasDeductions = canvasResult.deductions;

  console.log("Verificações concluídas:", {
    cookieDeductions,
    storageDeductions,
    hijackingDeductions,
    canvasDeductions
  });
}

// Função para verificar cookies e calcular deduções
async function checkCookies(tabId) {
  const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
  const url = new URL(tab.url);
  const domain = url.hostname;

  const cookies = await browser.cookies.getAll({ domain });
  const totalCookies = cookies.length;
  const thirdPartyCookies = cookies.filter(cookie => cookie.domain !== domain).length;

  let deductions = 0;
  if (totalCookies > 10) {
    deductions += 10;
  }
  if (thirdPartyCookies > 5) {
    deductions += 15;
  }

  return { totalCookies, thirdPartyCookies, deductions };
}

// Função para verificar armazenamento local e calcular deduções
async function checkStorage(tabId) {
  const result = await browser.tabs.executeScript(tabId, {
    code: `Object.keys(localStorage).length`
  });
  let deductions = result[0] > 0 ? 15 : 0;
  return { localStorageItems: result[0], deductions };
}

// Função para verificar hijacking e calcular deduções
async function checkHijacking(tabId) {
  const result = await browser.tabs.executeScript(tabId, {
    code: `(() => {
      let hijackingDetected = false;
      if (window.location.href !== document.referrer) {
        hijackingDetected = true;
      }
      return hijackingDetected;
    })()`
  });
  let deductions = result[0] ? 25 : 0;
  return { hijackingDetected: result[0], deductions };
}

// Função para verificar Canvas Fingerprinting e calcular deduções
async function checkCanvas(tabId) {
  const result = await browser.tabs.executeScript(tabId, {
    code: `(() => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      return !!ctx;
    })()`
  });
  let deductions = result[0] ? 20 : 0;
  return { canvasDetected: result[0], deductions };
}

// Função para resetar deduções
function resetDeductions() {
  cookieDeductions = 0;
  storageDeductions = 0;
  hijackingDeductions = 0;
  canvasDeductions = 0;
}
