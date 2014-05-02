/*
* @author 舒文静
* date 2014/3/26
*/

/*
*时间事件对象
*/

function TimeEvent(opType,color,pointX,pointY,opTime,width,height)
{
	this.opType = opType;  //当前操作类型
	this.color = color;    //当前操作颜色
	this.pointX = pointX;  //当前操作x坐标
	this.pointY = pointY;  //当前操作Y坐标
	this.opTime = opTime;  //当前操作时间
	this.width = width;    //当前操作范围
	this.height = height;   //当前操作宽度
}

/*
*画布canvas对象，即电子白板对象
*/

function MyCanvas(canvas,allTimeEvent)  
{
//	canvas = canvas; // 当前canvas属性
//	context = canvas.getContext("2d");     //当前canvas的上下文对象
//	allTimeEvent = allTimeEvent;         //当前电子白板的已经有的数据
	this.color = "#000";      //默认画笔的颜色
	
}



//画板点击画笔之后的方法
MyCanvas.prototype.drawLine = function()
{
	var isDown = false;   //是否按下鼠标
	var isMove = false;   //是否移动鼠标
	var timeEvent;        //当前时间事件
	var pointX,pointY;  
	canvas.onmousedown = function(e)
	{
		var color = "#"+$("#color").val(); //当前画笔的颜色
		isDown = true;   
		pointX =e.clientX-this.offsetLeft;
		pointY = e.clientY- this.offsetTop;
		var date =new Date();
		var opTime = date.getTime();
		timeEvent = new TimeEvent("POINT",color,pointX,pointY,opTime,1,1);
		allTimeEvent.push(timeEvent);
		
		//以下代码是绘制一个小圆点
//		drawArc(pointX, pointY, 0.5, 0, 2*Math.PI,color);  //画一个点
//		redraw();
	}
	
	
	canvas.onmousemove = function(e)
	{
		if(isDown)
		{	
			var color = "#"+$("#color").val(); //当前画笔的颜色
			context.beginPath();
			var pointX1 =e.clientX-this.offsetLeft;
			var pointY1 = e.clientY- this.offsetTop;	
			var date =new Date();
			var opTime = date.getTime();
			
			timeEvent = new TimeEvent("LINE",color,pointX,pointY,opTime,1,1);
			allTimeEvent.push(timeEvent);
			
			
			//先整合数据，弄成Json形式
			var opId = "'opId':'canvas'"; 
			opTime = "'opTime':"+"'"+opTime+"'";
			color = "'color':"+"'"+color+"'";
			var beginX = "'beginX':"+"'"+pointX+"'";
			var beginY = "'beginY':"+"'"+pointY+"'";
			var endX = "'endX':"+"'"+pointX1+"'";
			var endY = "'endY':"+"'"+pointY1+"'";
			var opType ="'opType':'LINE'";
			var dateEvent = "[{"+opId+","+opTime+","+color+","+beginX+","+beginY+","+endX+","+endY+","+opType+"}]";
			iosocket.send(dateEvent);
			//两点之间画线
			context.strokeStyle = color;
			context.beginPath();
			context.moveTo(pointX,pointY);
			context.lineTo(pointX1,pointY1);
			context.closePath();
			context.stroke();
			
			
			
			//直线的第一个点重置
			pointX = pointX1;
			pointY = pointY1;
//			redraw();
		}
	}
	
	canvas.onmouseout = function(e)
	{
		isDown = false;
	}
	
	canvas.onmouseup = function(e)
	{
		isDown = false;
		var drawingSurfaceData = context.getImageData(0,0,canvas.width,canvas.height);
		allDataImage.push(drawingSurfaceData);
//		redraw();
	}
	
}



//暂时的测试代码
MyCanvas.prototype.drawLine1 = function()
{
	var mouseX,mouseY; 
	var isDown = false;
	var drawingSurfaceData;  //定义一个保存画板所有图形数据的变量
	
	canvas.onmousedown = function(e)
	{
		isDown = true;
		mouseX =e.clientX-this.offsetLeft;
		mouseY = e.clientY- this.offsetTop;
		drawingSurfaceData = context.getImageData(0,0,canvas.width,canvas.height);
		
	}
	
	canvas.onmousemove = function(e)
	{
		if(isDown)
		{
			var color = "#"+$("#color").val();  //当前画笔的颜色
			context.strokeStyle = color;
			context.beginPath();
			context.putImageData(drawingSurfaceData,0,0);
			var pointx = e.clientX-this.offsetLeft;
			var pointy =  e.clientY- this.offsetTop;
			context.moveTo(mouseX, mouseY);
			context.lineTo(pointx, pointy);
			context.closePath();
			context.stroke();
			
		}
	}
	
	canvas.onmouseup = function(e)
	{
		isDown = false;
		var drawingSurfaceData = context.getImageData(0,0,canvas.width,canvas.height);
		allDataImage.push(drawingSurfaceData);
	}
}

//绘制矩形
MyCanvas.prototype.drawRectangle = function(id)
{
	var drawingSurfaceData;  //定义一个保存画板所有图形数据的变量
	var mouseX,mouseY;
	var isDown = false; 
	canvas.onmousedown = function(e)
	{
		isDown = true;
		mouseX =e.clientX-this.offsetLeft;
		mouseY = e.clientY- this.offsetTop;
		drawingSurfaceData = context.getImageData(0,0,canvas.width,canvas.height);
	}
	
	canvas.onmousemove = function(e)
	{
		if(isDown)
		{
			var color = "#"+$("#color").val();  //当前画笔的颜色
			context.strokeStyle = color;
			context.putImageData(drawingSurfaceData,0,0);
			var pointx = e.clientX-this.offsetLeft;
			var pointy =  e.clientY- this.offsetTop;
			if(id == 1)  //当id=1时候画的是一个空心矩形
			{	
				context.strokeRect(mouseX,mouseY,pointx-mouseX,pointy-mouseY);	
			}
			if(id == 2)
			{
				context.fillStyle = color;
				context.fillRect(mouseX,mouseY,pointx-mouseX,pointy-mouseY);	
			}
			
		}
	}
	
	canvas.onmouseup = function(e)
	{
		isDown = false;
		var drawingSurfaceData = context.getImageData(0,0,canvas.width,canvas.height);
		allDataImage.push(drawingSurfaceData);
	}
	
	
}


////绘制圆形
MyCanvas.prototype.CdrawArc = function(id)
{
	var drawingSurfaceData;  //定义一个保存画板所有图形数据的变量
	var mouseX,mouseY;
	var isDown = false; 
	canvas.onmousedown = function(e)
	{
		isDown = true;
		mouseX =e.clientX-this.offsetLeft;
		mouseY = e.clientY- this.offsetTop;
		drawingSurfaceData = context.getImageData(0,0,canvas.width,canvas.height);
	}
	
	canvas.onmousemove = function(e)
	{
		if(isDown)
		{
			var color = "#"+$("#color").val();  //当前画笔的颜色
			context.strokeStyle = color;
			context.putImageData(drawingSurfaceData,0,0);
			var pointx = e.clientX-this.offsetLeft;
			var pointy =  e.clientY- this.offsetTop;
			
			pointx = pointx>mouseX?(pointx-mouseX):(mouseX-pointx);
			pointy = pointy>mouseY?(pointy-mouseY):(mouseY-pointy);
			var radius = Math.sqrt(pointx*pointx+pointy*pointy);
			
			if(id == 1)  //当id=1时候画的是一个空心矩形
			{	
				drawArc(mouseX, mouseY, radius, 0, 2*Math.PI,color);
	//			context.strokeRect(mouseX,mouseY,pointx-mouseX,pointy-mouseY);	
			}
			if(id == 2)
			{
				context.fillStyle = color;
				drawArc(mouseX, mouseY, radius, 0, 2*Math.PI,color);
				context.fill();
			}
			
		}
	}
	
	canvas.onmouseup = function(e)
	{
		isDown = false;
		var drawingSurfaceData = context.getImageData(0,0,canvas.width,canvas.height);
		allDataImage.push(drawingSurfaceData);
	}
	
	
}


function drawTriangle(mouseX,mouseY,pointX,pointY)
{
	context.beginPath();
	context.moveTo(mouseX, mouseY);
	context.lineTo(mouseX,pointY);
	context.moveTo(mouseX,pointY);
	context.lineTo(pointX,pointY);
	context.moveTo(mouseX,mouseY);
	context.lineTo(pointX,pointY);
	context.stroke();
}

//绘制三角型
MyCanvas.prototype.CdrawTriangle = function()
{
	var drawingSurfaceData;  //定义一个保存画板所有图形数据的变量
	var mouseX,mouseY;
	var isDown = false; 
	canvas.onmousedown = function(e)
	{
		isDown = true;
		mouseX =e.clientX-this.offsetLeft;
		mouseY = e.clientY- this.offsetTop;
		drawingSurfaceData = context.getImageData(0,0,canvas.width,canvas.height);
	}
	
	canvas.onmousemove = function(e)
	{
		if(isDown)
		{
			var color = "#"+$("#color").val();  //当前画笔的颜色
			context.strokeStyle = color;
			context.putImageData(drawingSurfaceData,0,0);
			var pointx = e.clientX-this.offsetLeft;
			var pointy =  e.clientY- this.offsetTop;
			//画一个三角型
			drawTriangle(mouseX,mouseY,pointx,pointy);
			
		}
	}
	
	canvas.onmouseup = function(e)
	{
		isDown = false;
		var drawingSurfaceData = context.getImageData(0,0,canvas.width,canvas.height);
		allDataImage.push(drawingSurfaceData);
	}
	
	
}


//设置颜色的方法
MyCanvas.prototype.selectColor = function()
{
	this.color ="#"+$("#color").val();
}

//画一个矩形的函数
function drawRectangle(mouseX,mouseY)
{
	context.save();
	context.beginPath();
	context.fillRect(mouseX-ERASER_WIDTH/2,mouseY-ERASER_WIDTH/2,ERASER_WIDTH,ERASER_WIDTH);
	context.stroke();
	context.clip();
	context.restore();
}


var ERASER_WIDTH = 16;   //橡皮擦矩形的宽

//点击橡皮擦的操作
MyCanvas.prototype.eraser = function()
{
	var mouseX,mouseY;
	var isDown = false;  //判断是否
//	ERASER_WIDTH = $('#slidertext').text();
	canvas.onmousedown = function(e)
	{
		mouseX =e.clientX-this.offsetLeft;
		mouseY = e.clientY- this.offsetTop;
		e.preventDefault();    //阻止cursor 改变
		drawRectangle(mouseX,mouseY);
		
		
		isDown = true;
	}
	
	canvas.onmousemove = function(e)
	{
		if(isDown)
		{
			context.save();  //保留当前环境
			context.fillStyle= "#ccc";
			context.clearRect(mouseX-ERASER_WIDTH/2,mouseY-ERASER_WIDTH/2,ERASER_WIDTH,ERASER_WIDTH);
			mouseX =e.clientX-this.offsetLeft;
			mouseY = e.clientY- this.offsetTop;		
			drawRectangle(mouseX,mouseY);
		}
	}
	
	canvas.onmouseup = function(e)
	{
		context.clearRect(mouseX-ERASER_WIDTH/2,mouseY-ERASER_WIDTH/2,ERASER_WIDTH,ERASER_WIDTH);  
		isDown = false;
		var drawingSurfaceData = context.getImageData(0,0,canvas.width,canvas.height);
		allDataImage.push(drawingSurfaceData);
	}
	
}

//绘制曲线
function drawCur(beginPointX,beginPointY,controlPointX,controlPointY,endPointX,endPointY)
{
	
	context.beginPath();
	context.moveTo(beginPointX,beginPointY);
	context.quadraticCurveTo(controlPointX,controlPointY,endPointX,endPointY);
	context.stroke();
	context.closePath();
}

//绘制二次贝塞尔曲线
MyCanvas.prototype.drawCurve = function()
{
	var numDown = 0;
	var pointX1,pointY1,pointX2,pointY2,pointX3,pointY3;
	var drawingSurfaceData;  //定义一个保存画板所有图形数据的变量
	
	canvas.onmousedown = function(e)
	{
		drawingSurfaceData = context.getImageData(0,0,canvas.width,canvas.height);
		pointX2 =e.clientX-this.offsetLeft;
		pointY2 = e.clientY- this.offsetTop;
		numDown = numDown+1;
		if(numDown == 1)
		{
			pointX1 = pointX2;
			pointY1 = pointY2;
			pointX3 = pointX2;
			pointY3 = pointY2;
			drawArc(pointX1, pointY1, 0.5, 0, 2*Math.PI);  //画一个点
		}
		if(numDown == 2)
		{
			drawCur(pointX1,pointY1,pointX3,pointY3,pointX2,pointY2);
		}
	}
	
	canvas.onmousemove = function(e)
	{
		if(numDown == 2)
		{
			context.putImageData(drawingSurfaceData,0,0);
			pointX3 =e.clientX-this.offsetLeft;
			pointY3 = e.clientY- this.offsetTop;
			drawCur(pointX1,pointY1,pointX3,pointY3,pointX2,pointY2);
		}
	}
	
	canvas.onmouseup = function(e)
	{
		if(numDown == 3)
		{
			numDown =0;
			var drawingSurfaceData = context.getImageData(0,0,canvas.width,canvas.height);
			allDataImage.push(drawingSurfaceData);
		}
	}
}


//根据传递的参数决定画什么
MyCanvas.prototype.drawEvery = function(dataEvent)  
{	
	if(dataEvent.opType == "LINE")
	{
		var color = dataEvent.color;
		var beginX =  dataEvent.beginX;
		var beginY = dataEvent.beginY;
		var endX = dataEvent.endX;
		var endY = dataEvent.endY;
		drawLine(beginX,beginY,endX,endY,color);
	}
};

//绘制一个圆
function drawArc(pointX,pointY,r,sAngle,eAngle,color)
{
	context.strokeStyle = color;
	context.beginPath();
	context.arc(pointX, pointY, r, sAngle, eAngle, true);  //画一个点
	
	context.closePath();
	context.stroke();
}

//绘制直线
function drawLine(beginX,beginY,pointX,pointY,color)
{
	//两点之间画线
	context.strokeStyle = color;
	context.beginPath();
	context.moveTo(beginX,beginY);
	context.lineTo(pointX,pointY);
	context.closePath();
	context.stroke();
}



