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

    // disable right click
    document.oncontextmenu = function (e) {
      e.preventDefault()
      return false;
    }

    // disable somme additional key
    document.onkeydown = function (e) {
        // disable f12
        if (event.keyCode == 123) {
            return false;
        }
        // disable ctrl+shift+I
        if (e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)) {
            return false;
        }
        // disable ctrl+shift+C
        if (e.ctrlKey && e.shiftKey && e.keyCode == 'C'.charCodeAt(0)) {
            return false;
        }
        // disable ctrl+shift+j
        if (e.ctrlKey && e.shiftKey && e.keyCode == 'J'.charCodeAt(0)) {
            return false;
        }
        // disable ctrl+shift+U
        if (e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) {
            return false;
        }
    }

    let consoleOpen = false;

    setInterval(function() {
        const before = new Date().getTime();
        debugger;
        const after = new Date().getTime();

        if (after - before > 100) {
            if (!consoleOpen) {
                consoleOpen = true;
                showCustomMessage('Console detected! You have opened the development tools.');
            }
        } else {
            consoleOpen = false;
        }
    }, 1000);
})();
