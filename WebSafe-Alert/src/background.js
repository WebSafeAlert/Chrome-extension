async function getDangerousSitesFromGitHub() {
    const githubRepo = 'WebSafeAlert/Chrome-extension';
    const githubFilePath = 'blacklist.txt';
    const githubRawURL = `https://raw.githubusercontent.com/${githubRepo}/main/${githubFilePath}`;
  
    try {
      const response = await fetch(githubRawURL);
      const data = await response.text();
      const dangerousSites = data.split('\n').map(site => site.trim());
      return dangerousSites;
    } catch (error) {
      console.error('Erreur lors de la récupération de la liste des sites dangereux depuis GitHub', error);
      return [];
    }
  }
  
  async function updateDangerousSites() {
    const dangerousSites = await getDangerousSitesFromGitHub();
    chrome.storage.sync.set({ "dangerousSites": dangerousSites }, function() {
      console.log("Liste des sites dangereux mise à jour :", dangerousSites);
    });
  }
  
  chrome.runtime.onInstalled.addListener(function() {
    console.log("WebSafe-Alert extension installed.");
    updateDangerousSites();
  });
  