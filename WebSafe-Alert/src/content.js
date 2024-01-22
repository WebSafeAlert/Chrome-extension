// content.js

async function getDangerousSites() {
    return new Promise(resolve => {
      chrome.storage.sync.get("dangerousSites", function (data) {
        resolve(data.dangerousSites || []);
      });
    });
  }
  
  function isLinkPotentiallyDangerous(link, dangerousSites) {
    return dangerousSites.some(dangerousSite => link.includes(dangerousSite));
  }
  
  async function checkCurrentPageForDangerousSites() {
    const currentUrl = window.location.href;
    const dangerousSites = await getDangerousSites();
      
    if (isLinkPotentiallyDangerous(currentUrl, dangerousSites)) {
      alert("Attention : Vous êtes sur un site potentiellement dangereux.");
    }
  }
  
  checkCurrentPageForDangerousSites();
  