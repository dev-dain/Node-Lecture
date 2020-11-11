const fs=require('fs');
const { fileURLToPath } = require('url');

fs.readFile('./data/Friends.txt','utf8',function(err,data){
if(err) throw err;
console.log(data);
});

fs.readdir('./data',(err,files)=>{
    if(err) throw err;
    console.log(files);
    console.log('\n\n');

});

fs.writeFile('./data/dummy.txt','Hello world!','utf8',()=>{
    console.log('done');
});

fs.appendFile('./data/dummy.txt','dumm','utf8',()=>{
    console.log('append done');
});

fs.unlink('./data/dummy.txt',()=>{
    console.log('delete');
});