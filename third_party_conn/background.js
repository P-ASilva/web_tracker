browser.webRequest.onBeforeRequest.addListener(
    function(details) {
      let url = new URL(details.url);
      let currentDomain = details.initiator;  // Dominio da página carregada
      let requestedDomain = url.hostname;     // Dominio da requisição
  
      // Verifica se o domínio da requisição é diferente do domínio da página
      if (currentDomain !== requestedDomain) {
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
  