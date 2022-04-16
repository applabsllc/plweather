var http = require('http');
var fs = require('fs');

var mimeTypes = {
        'html': 'text/html',
        'js': 'text/javascript',
        'css': 'text/css',
        'json': 'application/json',
        'png': 'image/png',
        'ico': 'image/icon',
        'jpg': 'image/jpg',
        'gif': 'image/gif',
        'svg': 'image/svg+xml',
        'woff': 'application/font-woff',
        'ttf': 'application/font-ttf',
        'otf': 'application/font-otf',
    };
	
function getExtensionFromFile(fn){
	let split = fn.split(".");
	return split[split.length-1];	
}

http.createServer((request, response) => {

    let filePath = request.url;
	if (filePath == '/') filePath = '/html/index.html';//default page load
	
	let ext = getExtensionFromFile(filePath);
 
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