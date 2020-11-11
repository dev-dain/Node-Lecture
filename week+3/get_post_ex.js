const http=require('http');
const url=require('url');

http.createServer((req,res)=>{
    res.writeHead(200,{'Content Type':'text/htlm'});
    res.write('<h1>Hello wirld!</h1>');
    res.end();
}).listen(3000);