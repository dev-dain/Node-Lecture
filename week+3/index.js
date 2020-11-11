const http=require('http');//http모듈 불러온 미들웨어
const url=require('url');

http.createServer((req,res)=>{
    res.writeHead(200);
    res.write('<h1>Hello hyunhee</h1>');
    res.end();
}).listen(3000);//보통 그냥 포트번호 3000많이 씀