// UK Calculator Pro - Background Service Worker
// Context menu for VAT calculations on selected text

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "addVAT",
    title: "Add 20% VAT to \"%s\"",
    contexts: ["selection"]
  });
  chrome.contextMenus.create({
    id: "removeVAT",
    title: "Remove VAT from \"%s\"",
    contexts: ["selection"]
  });
  chrome.contextMenus.create({
    id: "convertUnit",
    title: "Convert \"%s\" (kg/lbs/cm/inches)",
    contexts: ["selection"]
  });
  chrome.contextMenus.create({
    id: "separator",
    type: "separator",
    contexts: ["selection"]
  });
  chrome.contextMenus.create({
    id: "fullCalc",
    title: "Open UK Calculator Pro",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  const text = info.selectionText || "";
  const num = parseFloat(text.replace(/[^0-9.-]/g, ""));

  if (info.menuItemId === "addVAT" && !isNaN(num)) {
    const vat = num * 0.20;
    const total = num + vat;
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: showResult,
      args: [`VAT (20%): £${vat.toFixed(2)} | Total: £${total.toFixed(2)}`]
    });
  }

  if (info.menuItemId === "removeVAT" && !isNaN(num)) {
    const net = num / 1.20;
    const vat = num - net;
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: showResult,
      args: [`Net: £${net.toFixed(2)} | VAT: £${vat.toFixed(2)}`]
    });
  }

  if (info.menuItemId === "convertUnit" && !isNaN(num)) {
    const results = [
      `${num} kg = ${(num * 2.20462).toFixed(2)} lbs = ${Math.floor(num / 6.35029)} st ${((num % 6.35029) * 2.20462).toFixed(1)} lbs`,
      `${num} cm = ${(num / 2.54).toFixed(2)} inches = ${Math.floor(num / 30.48)}' ${((num % 30.48) / 2.54).toFixed(1)}"`,
      `${num} miles = ${(num * 1.60934).toFixed(2)} km`,
    ].join("\n");
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: showResult,
      args: [results]
    });
  }

  if (info.menuItemId === "fullCalc") {
    chrome.tabs.create({ url: "https://ukcalculator.com" });
  }
});

function showResult(msg) {
  const div = document.createElement("div");
  div.style.cssText = "position:fixed;top:20px;right:20px;z-index:999999;background:linear-gradient(135deg,#6B46C1,#9333EA);color:white;padding:16px 24px;border-radius:12px;font-family:-apple-system,sans-serif;font-size:14px;box-shadow:0 8px 32px rgba(107,70,193,0.4);white-space:pre-line;max-width:350px;animation:fadeIn 0.3s ease";
  div.innerHTML = `<div style="font-weight:700;margin-bottom:6px">UK Calculator Pro</div>${msg}<div style="font-size:11px;margin-top:8px;opacity:0.8">ukcalculator.com</div>`;
  document.body.appendChild(div);
  setTimeout(() => { div.style.opacity = "0"; div.style.transition = "opacity 0.5s"; setTimeout(() => div.remove(), 500); }, 4000);
}
