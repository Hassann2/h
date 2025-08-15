(function() {
  window.addEventListener('load', function() {
    // Ottieni l'URL corrente senza parametri query/hash
    const path = window.location.pathname;
    const extensions = /\.(html|php|aspx|htm|jsp|cfm|css|js)$/i; // Rimosso lo spazio
    
    if (extensions.test(path)) {
      // Costruisci la nuova URL rimuovendo l'estensione
      const cleanPath = path.replace(extensions, '');
      const cleanUrl = window.location.origin + cleanPath;
      
      // Aggiorna l'URL senza ricaricare la pagina
      history.replaceState(null, document.title, cleanUrl);
    }
  });
})();


