browser.webRequest.onBeforeRequest.addListener(
  function(details) {
    console.log(`Conexão de terceira parte detectada: ${details.originUrl} -> ${details.url}`);
    let url = new URL(details.url);         // Domínio da requisição
    let requestedDomain = url.hostname;     // Domínio do recurso solicitado
    let originDomain = null;

    // Tenta pegar o domínio da página usando 'originUrl' ou 'tabId'
    if (details.originUrl) {
      let originUrl = new URL(details.originUrl);
      originDomain = originUrl.hostname;    // Dominio da página de origem
    } else if (details.tabId !== -1) {
      browser.tabs.get(details.tabId).then(tab => {
        let tabUrl = new URL(tab.url);
        originDomain = tabUrl.hostname;     // Domínio da aba ativa
      });
    }

    // Verifica se o domínio da requisição é diferente do domínio da página
    if (originDomain !== requestedDomain) {
      console.log(`Conexão de terceira parte detectada: ${requestedDomain}`);

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
