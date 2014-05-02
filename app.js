var fs = require('fs')
    , http = require('http')
    , express = require("express")
    , ejs = require('ejs')
    , path = require('path')
    , socketio = require('socket.io');

//创建一个静态网页服务器,用来加载网页资源 
app = express();
app.use(express.static(__dirname+'/'));
var allData="";
var judge = false;  //判断是否存入文件

var server = http.createServer(app,function(req, res) {
    res.writeHead(200, { 'Content-type': 'text/html'});
    res.end(fs.readFileSync(__dirname + '/index.html'));
}).listen(8080, function() {
    console.log('Listening at: http://localhost:8080');
});
 
socketio.listen(server).on('connection', function (socket) {
    socket.on('message', function (msg) {
    	//把消息压入数组中
    	if (judge) {    		
    		allData = allData + msg+"\n";
    	}
  		//把消息广播出去
      socket.broadcast.emit('message', msg);
    });
});


//开始录制
app.get('/begin', function(req, res){
  	judge = true;
  	res.send('begin');
});

//显示存的播放文件
app.get('/showFiles',function (req,res) {
	var filesname = ls(__dirname+'/recordSave');
	var appPath = __dirname+'/show.html';
	var str = fs.readFileSync(appPath,'utf8');
	var ret = ejs.render(str,{files:filesname});
	res.send(ret);
});

//播放对应的文件
app.get('/play',function (req,res) {
	var fileName = __dirname+ '/recordSave/'+req.query.filename;
	var filedata = readFileToArray(fileName);
	
	var appPath = __dirname+'/play.html';
	var str = fs.readFileSync(appPath,'utf8');
	var ret = ejs.render(str,{alldata:filedata});
	res.send(ret);
});

//把消息存入文件中
app.get('/save', function(req, res){
	//根据时间来为文件命名
	var filename = new Date().getTime();
	var filepath = __dirname+"/recordSave/"+filename+".txt";
  	//以写入模式打开文件,不存在者创建文件
  	fs.open(filepath,'w',function (err,fd){
  		if (err) {
  			console.error(err);
  			return;
  		}
  	});
  	
  	//写入数据
  	fs.writeFile(filepath,allData,function (err) {
  		if (err) throw err;
  	});
  	res.send('文件保存成功');
});


//读取文件中的内容并以

function readFileToArray(filepath) {
	var dataArray=[];
	var data = fs.readFileSync(filepath,"utf8");
	
	var alldata = (data.toString()).split('\n');
	for (var i = 0 ; i < alldata.length ; i++) {
		alldata[i] = alldata[i].replace( /\r|\n/g, "" ); //替换到里面的换行符
		dataArray.push(alldata[i]);
	}	
	return dataArray;
}

//遍历文件夹下的文件
function ls(filepath) {
	var filesname =[];
	var files = fs.readdirSync(filepath);
	for(fn in files)
	{
		var fname = filepath+path.sep+files[fn];
		var stat = fs.lstatSync(fname);
		if(stat.isDirectory() != true)
		{
			console.log(files[fn]);
			filesname.push(files[fn]);
		}
	}
	return filesname;
}
