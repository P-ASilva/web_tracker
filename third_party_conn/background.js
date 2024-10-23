// background.js

// Escuta mensagens do popup.js para realizar verificações e atualizar o localStorage
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "checkCookies") {
      checkCookies(message.tabId).then(result => {
        updateLocalStorage('cookieDeductions', result.deductions);
        sendResponse(result);
      });
      return true;
    }
  
    if (message.type === "checkStorage") {
      checkStorage(message.tabId).then(result => {
        updateLocalStorage('storageDeductions', result.deductions);
        sendResponse(result);
      });
      return true;
    }
  
    if (message.type === "checkHijacking") {
      checkHijacking(message.tabId).then(result => {
        updateLocalStorage('hijackingDeductions', result.deductions);
        sendResponse(result);
      });
      return true;
    }
  
    if (message.type === "checkCanvas") {
      checkCanvas(message.tabId).then(result => {
        updateLocalStorage('canvasDeductions', result.deductions);
        sendResponse(result);
      });
      return true;
    }
  
    if (message.type === "resetDeductions") {
      resetDeductions();
      sendResponse({ success: true });
    }
  });
  
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
  
  // Atualiza deduções no localStorage
  function updateLocalStorage(key, value) {
    browser.storage.local.get(key).then(result => {
      const current = result[key] || 0;
      const newValue = current + value;
      browser.storage.local.set({ [key]: newValue });
    });
  }
  
  // Reseta deduções no localStorage (quando a página é trocada)
  function resetDeductions() {
    browser.storage.local.set({
      cookieDeductions: 0,
      storageDeductions: 0,
      hijackingDeductions: 0,
      canvasDeductions: 0
    });
  }
  
  // Monitora mudanças de aba para resetar as deduções ao trocar de página
  browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
      resetDeductions();
    }
  });  