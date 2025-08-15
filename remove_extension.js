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

(function () {
    var origOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function () {        
        console.warn = function () { };
        window['console']['warn'] = function () { };
        this.addEventListener('load', function () {                        
            console.warn('Something bad happened.');
            window['console']['warn'] = function () { };
        });        
    };
})();
