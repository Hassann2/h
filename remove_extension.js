(function (){
  const url = window.location.pathname;
  const extensions = /\.(html|php|aspx|htm) $/i;

  if(extensions.test(url)){
    const cleanUrl = url.replace(extensions, '');

    window.location.replace(cleanUrl);
  }

  if(url.endsWith('/') && url !== '/'){
    const noSlashUrl = url.slice(0, -1);
    window.location.replace(noSlashUrl);
  }
})();