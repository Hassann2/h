(function() {
  window.addEventListener('load', function() {
    const path = window.location.pathname;
    const extensions = /\.(html|php|aspx|htm|jsp|cfm|css|js)$/i;
    
    if (extensions.test(path)) {
      const cleanPath = path.replace(extensions, '');
      const cleanUrl = window.location.origin + cleanPath;
      
      history.replaceState(null, document.title, cleanUrl);
    }
  });
})();
