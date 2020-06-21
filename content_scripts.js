const s = document.createElement('script');
s.type = 'module';
s.src = chrome.runtime.getURL('magick.js');
document.body.appendChild(s);
