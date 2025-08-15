(function (){
  window.addEventListener('load', function (){
    const url = window.location.protocol + "//" + window.location.host + "/" + window.location.pathname;
    const extensions = /\.(html|php|aspx|htm|jsp|cfm|css|js) $/i;

    if(extensions.test(url)){
      const cleanUrl = url.replace(extensions, '');

      history.replaceState(null, document.title, cleanUrl);
    }
  });
})();
