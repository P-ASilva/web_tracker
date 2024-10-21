// Obter as conexões salvas no localStorage e exibi-las
document.addEventListener('DOMContentLoaded', function() {
    const domainList = document.getElementById('domains');
    const storedConnections = JSON.parse(localStorage.getItem('thirdPartyConnections')) || [];
  
    // Exibir as conexões no popup
    storedConnections.forEach(domain => {
      const listItem = document.createElement('li');
      listItem.textContent = domain;
      domainList.appendChild(listItem);
    });
  });
  