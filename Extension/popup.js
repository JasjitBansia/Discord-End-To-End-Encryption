document.addEventListener("DOMContentLoaded", async () => {
  let object = await chrome.storage.local.get("encryptionMode");
  let encryptionState = object.encryptionMode;
  if (encryptionState === true) {
    document.querySelector("#encryptionMode").checked = true;
    await chrome.runtime.sendMessage({
      action: "initialize",
    });
  }
});
let encryptionCheckbox = document.querySelector("#encryptionMode");

encryptionCheckbox.addEventListener("change", async () => {
  if (encryptionCheckbox.checked) {
    await chrome.storage.local.set({ encryptionMode: true });
    chrome.runtime.sendMessage({
      action: "enableEncryption",
    });
  } else {
    await chrome.storage.local.set({ encryptionMode: false });
    await chrome.storage.local.remove("token");
    await chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: "reload" });
    });
  }
});

let addID = document.querySelector("#addID");
addID.addEventListener("click", async () => {
  await chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "addID" });
  });
});
async function populateIDList() {
  let idListElement = document.querySelector(".idList");
  let objects = await chrome.storage.local.get(null);
  let entries = Object.entries(objects);
  let objectArray = entries.map(([id, key]) => ({ id, key }));
  objectArray.forEach((object) => {
    if (!isNaN(object.id.split(" ")[0])) {
      let idElement = document.createElement("div");
      let removeElement = document.createElement("span");
      removeElement.id = "removeID";
      removeElement.innerText = "Remove";
      idElement.classList.add("id");

      let displayText = object.id.split(" ")[1]
        ? `${object.id.split(" ")[0]} (${object.id.split(" ")[1]}) - ${
            object.key
          }`
        : `${object.id.split(" ")[0]} - ${object.key}`;
      let textNode = document.createTextNode(displayText);
      idElement.appendChild(textNode);
      idElement.appendChild(removeElement);
      idListElement.prepend(idElement);
      removeElement.addEventListener("click", async () => {
        await chrome.storage.local.remove(object.id);
        idElement.remove();
      });
    }
  });
}
populateIDList();
