// background.js

// Escuta mensagens do popup.js para realizar verificações e retornar resultados
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "checkCookies") {
      checkCookies(message.tabId).then(sendResponse);
      return true; // Retorna true para indicar que a resposta será assíncrona
    }
  
    if (message.type === "checkStorage") {
      checkStorage(message.tabId).then(sendResponse);
      return true;
    }
  
    if (message.type === "checkHijacking") {
      checkHijacking(message.tabId).then(sendResponse);
      return true;
    }
  
    if (message.type === "checkCanvas") {
      checkCanvas(message.tabId).then(sendResponse);
      return true;
    }
  });
  
  // Função para verificar cookies e diferenciar primeira e terceira parte
  async function checkCookies(tabId) {
    const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
    const url = new URL(tab.url);
    const domain = url.hostname;
  
    const cookies = await browser.cookies.getAll({ domain });
    const totalCookies = cookies.length;
    const thirdPartyCookies = cookies.filter(cookie => cookie.domain !== domain).length;
  
    return { totalCookies, thirdPartyCookies };
  }
  
  // Função para verificar armazenamento local
  async function checkStorage(tabId) {
    const result = await browser.tabs.executeScript(tabId, {
      code: `Object.keys(localStorage).length`
    });
    return { localStorageItems: result[0] };
  }
  
  // Função para verificar hijacking
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
    return { hijackingDetected: result[0] };
  }
  
  // Função para verificar canvas fingerprinting
  async function checkCanvas(tabId) {
    const result = await browser.tabs.executeScript(tabId, {
      code: `(() => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        return !!ctx;  // Retorna true se houver um contexto de canvas
      })()`
    });
    return { canvasDetected: result[0] };
  }
  