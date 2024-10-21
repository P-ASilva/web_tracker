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
