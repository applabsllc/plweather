var http = require('http');
var fs = require('fs');

var mimeTypes = { //types of files we could possibly load
        'html': 'text/html',
        'js': 'text/javascript',
        'css': 'text/css',
        'json': 'application/json',
        'png': 'image/png',
        'ico': 'image/icon',
        'svg': 'image/svg+xml',
        'woff': 'application/font-woff',
        'ttf': 'application/font-ttf',
        'otf': 'application/font-otf',
    };
	
function getExtensionFromFile(fn){ //get extention from file
	let split = fn.split(".");
	return split[split.length-1];	
}

http.createServer((request, response) => {

    let filePath = request.url;
	if (filePath == '/') filePath = '/index.html'; // default page load
	
	let ext = getExtensionFromFile(filePath);
	
	// if found, serve file
    fs.readFile("."+filePath, (error, content) => {
        if (error) {
                response.writeHead(500);
                response.end('Handle Error');
        }
        else {
            response.writeHead(200, { 'Content-Type': mimeTypes[ext] });
            response.write(content, 'utf-8');
			response.end();
        }
    });

}).listen(3000);
console.log('Server running at http://127.0.0.1:3000/');