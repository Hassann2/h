(function (){
  function checkFileExists(url, callback){
    const xhr = new XMLHttpRequest();
    xhr.open('HEAD', url, true);
    xhr.onreadystatechange = function () {
      if(xhr.readyState === 4) {
        callback(xhr.status >= 200 && xhr.status < 300);
      }
    };
    xhr.send();
  }

  const url = window.location.pathname;
  const extensions = /\.(html|php|aspx|htm|jsp|cfm|css|js) $/i;

  if(extensions.test(url)){
    const cleanUrl = url.replace(extensions, '');
    const possibleExtensions = ['.html', '.htm', '.php', '.aspx', '.jsp', '.cfm', '.css', '.js'];

    function tryExtension(index){
      if (index >= possibleExtensions.length){
        return;
      }

      const testUrl = cleanUrl + possibleExtensions[index];
      checkFileExists(testUrl,
        function(exists){
          if(exists){
            window.location.replace(cleanUrl);
          }else{
            tryExtension(index + 1);
          }
        }
      );
    }

    tryExtension(0);
  }else if(url.endsWith('/') && url !== '/'){
    const noSlashUrl = url.slice(0, -1);
    window.location.replace(noSlashUrl);
  }
})();
