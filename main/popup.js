document.addEventListener("DOMContentLoaded", function () {
  var addSiteButton = document.getElementById("addSite");
  var siteInput = document.getElementById("siteInput");
  
  // When the user adds a site
  addSiteButton.addEventListener("click", function () {
    var site = siteInput.value.trim();
    if (site) {
      addSiteToList(site);
      siteInput.value = ""; // Clear input field
      siteInput.focus(); // Focus back on the input field
    }
  });

  // Allow adding site by pressing Enter
  siteInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      var site = siteInput.value.trim();
      if (site) {
        addSiteToList(site);
        siteInput.value = "";
        siteInput.focus();
      }
    }
  });

  // Function to add a site to the list
  function addSiteToList(site) {
    chrome.storage.sync.get("allowedSites", function (data) {
      var allowedSites = data.allowedSites || [];
      allowedSites.push(site);
      chrome.storage.sync.set({ allowedSites: allowedSites }, function () {
        updateAllowedList();
      });
    });
  }

  // Update the list of allowed sites in the popup
  function updateAllowedList() {
    chrome.storage.sync.get("allowedSites", function (data) {
      var allowedSites = data.allowedSites || [];
      var allowedList = document.getElementById("allowedList");
      allowedList.innerHTML = ""; // Clear the current list
      allowedSites.forEach(function (site) {
        var li = document.createElement("li");
        li.textContent = site;

        // Create remove button
        var removeButton = document.createElement("button");
        removeButton.textContent = "Remove";
        removeButton.addEventListener("click", function () {
          chrome.storage.sync.get("allowedSites", function (data) {
            var allowedSites = data.allowedSites;
            var index = allowedSites.indexOf(site);
            if (index !== -1) {
              allowedSites.splice(index, 1);
              chrome.storage.sync.set({ allowedSites: allowedSites }, function () {
                updateAllowedList();
              });
            }
          });
        });

        li.appendChild(removeButton);
        allowedList.appendChild(li);
      });
    });
  }

  // Load the allowed sites when the popup is opened
  updateAllowedList();
});
