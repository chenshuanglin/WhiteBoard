/*
* author @shuwengjing
* date 2014/5/12
*/


var Replay = function (canvasId) {
	this.allReplayData = new Array();
	this.canvas = document.getElementById(canvasId);
	this.context = this.canvas.getContext("2d");
	//当前操作对象
	this.obj;
	//当前画布数据对象
	this.drawingSurfaceData;  //定义一个保存画板所有图形数据的变量
	//前一步操作的X坐标，和Y坐标
	this.pointX;
	this.pointY;
	//橡皮擦的宽度
	this.width;

}
//根据传递过来的对象进行操作
Replay.prototype.playFromJson= function(dataEvent) {
//	this.redrawNo();
	switch(dataEvent.opType) {
		case "LINE":
			this.drawLine(dataEvent);  
			break;
		case "STRLINE":
			this.drawStrLine(dataEvent);
			break;
		case "DRAG":
			this.drag(dataEvent);
			break;
		case "ERASER":
			this.drawEraser(dataEvent);
			break;
		case "RECT":
			this.drawRect(dataEvent);
			break;
		case "ARC":
			this.drawArc(dataEvent);
			break;
		case "TRI":
			this.drawTri(dataEvent);
			break;
		case "CUR":
			this.drawCurve(dataEvent);
			break;
		case "TEXT":
			this.drawText(dataEvent);
			break;
		case "COLOR":
			this.selectColor(dataEvent);
			break;
		case "EDIT":
			this.isEdit(dataEvent);
			break;
	}
}

Replay.prototype.isEdit = function(dataEvent)
{
	if(dataEvent.opStatus == "yes")
	{
		alert("ddd");
	}
	else
	{
		this.redrawNo();
	}
}

Replay.prototype.redrawNo = function()
{
	//清空当前画板上所有的东西
	this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
	//进行移位后重绘
	for(var i = 0 ; i < this.allReplayData.length ; i++)
	{
		var object = this.allReplayData[i];
		object.createPath(this.context);
		if(object.isfill)
		{
			object.fill(this.context);
		}
		else
		{
			object.stroke(this.context);
		}
		if(object.name == "MYERA")
		{
			object.clear(this.context);
		}		
	}
}

Replay.prototype.redraw = function(index)
{
	//清空当前画板上所有的东西
	this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
	//进行移位后重绘
	for(var i = 0 ; i < this.allReplayData.length ; i++)
	{
		var object = this.allReplayData[i];
		object.createPath(this.context);
		if(object.isfill)
		{
			object.fill(this.context);
		}
		else
		{
			object.stroke(this.context);
		}
		if(object.name == "MYERA")
		{
			object.clear(this.context);
		}
		//判断是哪个重绘的时候才显示哪个
		if(index == i)
		{
			object.showEdit(this.context);
		}				
	}
}

//拖动
Replay.prototype.drag = function(dataEvent) {
	//预留的接口，先不进行任何操作，方便以后的扩展
	if (dataEvent.opStatus == "mouseDown") {
		var index = dataEvent.index;    //要移动的对象的坐标
		this.redraw(index);
	}
	//真正拖动进行的操作
	if (dataEvent.opStatus == "mouseMove") {
		var index = dataEvent.index;    //要移动的对象的坐标
		var mouseX = dataEvent.mouseX;  //获取x轴移动的距离
		var mouseY = dataEvent.mouseY;  //获取y轴移动的距离
		var isEdit = dataEvent.isEdit;   //是否处于编辑状态
		if(isEdit == "yes")
		{
			var whichNum = dataEvent.whichNum;
			this.allReplayData[index].change(whichNum,mouseX,mouseY);
		}
		else
		{
			this.allReplayData[index].move(mouseX,mouseY);
		}
		
		//交换橡皮擦的位置
		for(var j = index ; j < this.allReplayData.length ; j++)
		{
			if(this.allReplayData[j].name == "MYERA")
			{
				var temp = this.allReplayData[j];
				this.allReplayData[j] = this.allReplayData[index];
				this.allReplayData[index] = temp;
				index = j;
			}
		}
		this.redraw(index);
	}
	//预留的接口，也不进行任何操作，方便以后扩展
	if (dataEvent.opStatus == "mouseUp") {
		
	}
}


//画线
Replay.prototype.drawLine = function(dataEvent) {
	if (dataEvent.opStatus == "mouseDown") {
		var mouseX = dataEvent.mouseX;
		var mouseY = dataEvent.mouseY;
		var color = dataEvent.color;
		this.obj = new MyXian(mouseX,mouseY,color);
	}
	if (dataEvent.opStatus == "mouseMove") {
		var mouseX = dataEvent.mouseX;
		var mouseY = dataEvent.mouseY;
		var point = new MyPoint(mouseX,mouseY);
		this.obj.points.push(point);
		this.obj.createPath(this.context);
		this.obj.stroke(this.context);
	}
	if (dataEvent.opStatus == "mouseUp") {
		this.allReplayData.push(this.obj);	
	}
}

//直线
Replay.prototype.drawStrLine = function(dataEvent) {
	if (dataEvent.opStatus == "mouseDown") {
		//获取当前图像
		this.drawingSurfaceData = this.context.getImageData(0,0,this.canvas.width,this.canvas.height);
	}
	if (dataEvent.opStatus == "mouseMove") {
		var mouseX = dataEvent.mouseX;
		var mouseY = dataEvent.mouseY;
		var pointX = dataEvent.pointX;
		var pointY = dataEvent.pointY;
		var color = dataEvent.color;
		//恢复当前图像
		this.context.putImageData(this.drawingSurfaceData,0,0);
		this.obj = new MyLine(mouseX,mouseY,pointX,pointY,color);
		this.obj.createPath(this.context);	
		this.obj.stroke(this.context);
	}
	if (dataEvent.opStatus == "mouseUp") {
		this.allReplayData.push(this.obj);	
	}
}

//橡皮擦同步的另一种测试方法
Replay.prototype.drawEraser= function(dataEvent) {
	if (dataEvent.opStatus == "mouseDown") {
		var mouseX = dataEvent.mouseX;
		var mouseY = dataEvent.mouseY;
		var width = dataEvent.width;
		
		this.pointX = mouseX;
		this.pointY = mouseY;
		this.width = width;
		//创建橡皮擦对象，并显示
		this.obj = new  MyEraser(mouseX,mouseY,width);
		this.obj.createPath(this.context);
		this.obj.stroke(this.context);
		this.allReplayData.push(this.obj);
	}
	if (dataEvent.opStatus == "mouseMove") {
		this.context.clearRect(this.pointX,this.pointY,this.width,this.width);
		var mouseX = dataEvent.mouseX;
		var mouseY = dataEvent.mouseY;
		var width = dataEvent.width;
		
		this.pointX = mouseX;
		this.pointY = mouseY;
		this.width = width;
		//创建橡皮擦对象，并显示
		this.obj = new  MyEraser(mouseX,mouseY,width);
		this.obj.createPath(this.context);
		this.obj.stroke(this.context);
		this.allReplayData.push(this.obj);	
	}
	if (dataEvent.opStatus == "mouseUp") {
		var mouseX = dataEvent.mouseX;
		var mouseY = dataEvent.mouseY;
		var width = dataEvent.width;
		this.context.clearRect(this.pointX,this.pointY,this.width,this.width);
	}

}

//矩形同步方法
Replay.prototype.drawRect = function(dataEvent) {
	if (dataEvent.opStatus == "mouseDown") {
		//获取当前图像
		this.drawingSurfaceData = this.context.getImageData(0,0,this.canvas.width,this.canvas.height);
	}
	if (dataEvent.opStatus == "mouseMove") {
		var mouseX = dataEvent.mouseX;
		var mouseY = dataEvent.mouseY;
		var pointX = dataEvent.pointX;
		var pointY = dataEvent.pointY;
		var color = dataEvent.color;
		
		var isfill = dataEvent.isfill;
		//恢复当前图像
		this.context.putImageData(this.drawingSurfaceData,0,0);
		this.obj = new MyRect(mouseX,mouseY,pointX,pointY,color);
		this.obj.createPath(this.context);
		if(isfill == "yes")
		{
			this.obj.fill(this.context);
			this.obj.isfill = true;
		}
		else{
			this.obj.stroke(this.context);
		}
	}
	if (dataEvent.opStatus == "mouseUp") {
		
		this.allReplayData.push(this.obj);	
	}
}

//圆形同步方法
Replay.prototype.drawArc = function(dataEvent) {
	if (dataEvent.opStatus == "mouseDown") {
		//获取当前图像
		this.drawingSurfaceData = this.context.getImageData(0,0,this.canvas.width,this.canvas.height);
	}
	if (dataEvent.opStatus == "mouseMove") {
		var mouseX = dataEvent.mouseX;
		var mouseY = dataEvent.mouseY;
		var pointX = dataEvent.pointX;
		var pointY = dataEvent.pointY;
		var color = dataEvent.color;
		
		var isfill = dataEvent.isfill;
		//恢复当前图像
		this.context.putImageData(this.drawingSurfaceData,0,0);
		this.obj = new MyArc(mouseX,mouseY,pointX,pointY,color);
		this.obj.createPath(this.context);
		if(isfill == "yes")
		{
			this.obj.fill(this.context);
			this.obj.isfill = true;
		}
		else{
			this.obj.stroke(this.context);
		}
	}
	if (dataEvent.opStatus == "mouseUp") {
		
		this.allReplayData.push(this.obj);	
	}
}

//三角形同步方法
Replay.prototype.drawTri = function(dataEvent) {
	if (dataEvent.opStatus == "mouseDown") {
		//获取当前图像
		this.drawingSurfaceData = this.context.getImageData(0,0,this.canvas.width,this.canvas.height);
	}
	if (dataEvent.opStatus == "mouseMove") {
		var mouseX = dataEvent.mouseX;
		var mouseY = dataEvent.mouseY;
		var pointX = dataEvent.pointX;
		var pointY = dataEvent.pointY;
		var color = dataEvent.color;
		
		var isfill = dataEvent.isfill;
		//恢复当前图像
		this.context.putImageData(this.drawingSurfaceData,0,0);
		this.obj = new MyTri(mouseX,mouseY,pointX,pointY,color);
		this.obj.createPath(this.context);
		if(isfill == "yes")
		{
			this.obj.fill(this.context);
			this.obj.isfill = true;
		}
		else{
			this.obj.stroke(this.context);
		}
	}
	if (dataEvent.opStatus == "mouseUp") {
		
		this.allReplayData.push(this.obj);	
	}
}

//二次贝塞尔曲线的同步
Replay.prototype.drawCurve = function(dataEvent) {
	if (dataEvent.opStatus == "mouseDown") {
		//获取当前图像
		this.drawingSurfaceData = this.context.getImageData(0,0,this.canvas.width,this.canvas.height);
	}
	if (dataEvent.opStatus == "mouseMove") {
		var mouseX = dataEvent.mouseX;
		var mouseY = dataEvent.mouseY;
		var pointX = dataEvent.pointX;
		var pointY = dataEvent.pointY;
		var middleX = dataEvent.middleX;
		var middleY = dataEvent.middleY;
		var color = dataEvent.color;
		
		var isfill = dataEvent.isfill;
		//恢复当前图像
		this.context.putImageData(this.drawingSurfaceData,0,0);
		this.obj = new MyCur(mouseX,mouseY,pointX,pointY,middleX,middleY,color);
		this.obj.createPath(this.context);
		this.obj.stroke(this.context);
	}
	if (dataEvent.opStatus == "mouseUp") {
		
		this.allReplayData.push(this.obj);	
	}
}

//同步文字
Replay.prototype.drawText = function(dataEvent) {
	if(dataEvent.opStatus == "openDiv"){
	}
	if(dataEvent.opStatus == "write"){
		var mouseX = dataEvent.mouseX;
		var mouseY = dataEvent.mouseY;
		var font = dataEvent.font;
		var text = dataEvent.text;
		var color = dataEvent.color;
		
		this.obj = new MyText(mouseX,mouseY,font,text,color);
		this.obj.stroke(this.context);
		
		this.allReplayData.push(this.obj);
	}
}
//同步颜色
Replay.prototype.selectColor = function(dataEvent){
	var color = dataEvent.color;
	$('#color').val(color);
}
