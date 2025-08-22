// Chart.js loader for Angular (loads from CDN if not present)
(function() {
  if (!window.Chart) {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
    script.onload = () => { console.log('Chart.js loaded'); };
    document.head.appendChild(script);
  }
})();
