// Initialisez un objet pour stocker les sites blacklistés
const blacklistedSites = {};

chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    // Vérifier si la requête concerne le site blacklisté
    checkIfBlacklisted(details.url);
  },
  { urls: ["<all_urls>"] },
  ["blocking"]
);

chrome.webNavigation.onCommitted.addListener((details) => {
  // Vérifier si la page actuelle est blacklistée
  checkIfBlacklisted(details.url);
});

function checkIfBlacklisted(url) {
  // Récupérer le domaine de l'URL
  const domain = extractDomain(url);

  // Vérifier si le domaine est dans la liste des sites blacklistés
  if (blacklistedSites[domain]) {
    // Afficher la notification uniquement si le site est blacklisté
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'exclamation-mark.png',
      title: 'Attention',
      message: 'Ce site à était signaler comme étant un site DANGEREUX !'
    });
  }
}

function extractDomain(url) {
  // Utiliser une expression régulière pour extraire le domaine de l'URL
  const match = url.match(/^https?:\/\/(?:www\.)?([^\/]+)/i);
  return match && match[1] ? match[1] : null;
}

// Charger la liste des sites blacklistés au démarrage de l'extension
fetch("https://raw.githubusercontent.com/WebSafeAlert/Chrome-extension/main/blacklist.txt")
  .then((response) => response.text())
  .then((blacklist) => {
    // Ajouter chaque domaine à la liste des sites blacklistés
    blacklist.split('\n').forEach((blacklistedUrl) => {
      const domain = extractDomain(blacklistedUrl);
      if (domain) {
        blacklistedSites[domain] = true;
      }
    });
  })
  .catch((error) => console.error('Erreur lors de la récupération de la liste noire :', error));
