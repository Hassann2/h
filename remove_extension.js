var newURL = window.location.protocol + "//" + window.location.host + "/" + window.location.pathname;
const extensions = /\.(html|php|aspx|htm|jsp|cfm|css|js) $/i;
if (a.indexOf(extensions) > -1) { //Check of html String in URL.
   url = url.substring(0, newURL.lastIndexOf("."));
}
