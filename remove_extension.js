(function (){
  window.addEventListener('load', function (){
    const url = this.window.location.pathname;
    const extensions = /\.(html|php|aspx|htm|jsp|cfm|css|js) $/i;

    if(extensions.test(url)){
      const cleanUrl = url.replace(extensions, '');

      this.history.replaceState(null, this.document.title, cleanUrl);
    }
  });
})();
