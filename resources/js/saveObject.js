// JavaScript Document
//直线对象
var MyLine = function(mouseX,mouseY,pointX,pointY,strokeStyle)
{
	this.mouseX = mouseX;
	this.mouseY = mouseY;
	this.pointX = pointX;
	this.pointY = pointY;
	this.strokeStyle = strokeStyle;
	this.name ="MYLINE";
	this.isEra = false;  //是否橡皮擦到了
	this.isfill = false; //是否是实心
}

MyLine.prototype.createPath = function(context)
{
	context.beginPath();
	context.moveTo(this.mouseX,this.mouseY);
	context.lineTo(this.pointX,this.pointY);
	context.closePath();
}

MyLine.prototype.stroke = function(context)
{
	context.save();
	context.strokeStyle = this.strokeStyle;
	context.stroke();
	context.restore();
}

MyLine.prototype.move = function(x,y)
{
	this.mouseX = this.mouseX-x;
	this.mouseY = this.mouseY-y;
	this.pointX = this.pointX-x;
	this.pointY = this.pointY-y;
}

//判断点是否在线段里面
MyLine.prototype.isPointIn = function(x,y)
{
	//判断是否是在端点之外
	if(this.pointY > this.mouseY)
	{
		if(y>this.pointY || y < this.mouseY)
		{
			return false;
		}
	}
	else
	{
		if(y>this.mouseY || y < this.pointY)
		{
			return false;
		}
	}
	//没有k值的情况
	if(this.pointX - this.mouseX == 0)
	{
		var range = x-this.mouseX;
		if(range >= -30 && range <=30)
		{
			return true;
		}
		else
		{
			return false;
		}
	}
	//有K值的情况
	var k = (this.pointY - this.mouseY)/(this.pointX-this.mouseX);
	var theY = k*(x-this.mouseX)+this.mouseY;
	var range = theY-y;
	
	
	if(range >= -30 && range <=30)
	{
		return true;
	}
	else
	{
		return false;
	}
}

//直线跟橡皮擦的距离
MyLine.prototype.lengthToEra = function(x,y,x1,y1)
{
	var lineHeight = this.mouseY - this.pointY;  //直线的高度
	var lineWidth = this.pointX - this.mouseX;    //直线的宽度
	//计算交叉
	var c = this.mouseX*this.pointY - this.pointX*this.mouseY; 
	if((lineHeight*x+lineWidth*y+c >= 0 && lineHeight*x1+lineWidth*y1+c <=0)|| (lineHeight*x+lineWidth*y+c <= 0 && lineHeight*x1+lineWidth*y1+c >=0) || (lineHeight*x+lineWidth*y1+c >= 0 && lineHeight*x1+lineWidth*y+c <=0) || (lineHeight*x+lineWidth*y1+c <= 0 && lineHeight*x1+lineWidth*y+c >=0))
	{
		if((this.mouseX < x && this.pointX < x) || (this.mouseX > x1 && this.pointX > x1) || (this.mouseY > y && this.pointY < y) || (this.mouseY < y1 && this.pointY < y))
		{
			return false;
		}
		else
		{
			return true;
		}
	}
	else
	{
		return false;
	}
}


//矩形对象
var MyRect = function(mouseX,mouseY,pointX,pointY,strokeStyle)
{
	this.mouseX = mouseX;
	this.mouseY = mouseY;
	this.pointX = pointX;
	this.pointY = pointY;
	this.strokeStyle = strokeStyle;
	this.name ="MYRECT";
	this.isEra = false;
	this.isfill = false; //是否是实心
}

MyRect.prototype.createPath = function(context)
{
	context.beginPath();	
	context.rect(this.mouseX,this.mouseY,this.pointX-this.mouseX,this.pointY-this.mouseY);
	context.closePath();


}

MyRect.prototype.stroke = function(context)
{
	context.save();
	context.strokeStyle = this.strokeStyle;
	context.stroke();
	context.restore();
}

MyRect.prototype.fill = function(context)
{
	context.save();
	context.strokeStyle = this.strokeStyle;
	context.fill();
	context.restore();
}

MyRect.prototype.move = function(x,y)
{
	this.mouseX = this.mouseX-x;
	this.mouseY = this.mouseY-y;
	this.pointX = this.pointX-x;
	this.pointY = this.pointY-y;
}

//三角形对象
var MyTri = function(mouseX,mouseY,pointX,pointY,strokeStyle)
{
	this.mouseX = mouseX;
	this.mouseY = mouseY;
	this.pointX = pointX;
	this.pointY = pointY;
	this.strokeStyle = strokeStyle;
	this.name ="MYTRI";
	this.isEra = false;
	this.isfill = false; //是否是实心
}

MyTri.prototype.createPath = function(context)
{
	context.beginPath();
	context.moveTo(this.mouseX, this.mouseY);
	context.lineTo(this.mouseX,this.pointY);
	context.lineTo(this.pointX,this.pointY);
	context.lineTo(this.mouseX,this.mouseY);
	context.closePath();
	
}

MyTri.prototype.stroke = function(context)
{
	context.save();
	context.strokeStyle = this.strokeStyle;
	context.stroke();
	context.restore();
}

MyTri.prototype.fill = function(context)
{
	context.save();
	context.strokeStyle = this.strokeStyle;
	context.fill();
	context.restore();
}

MyTri.prototype.move = function(x,y)
{
	this.mouseX = this.mouseX-x;
	this.mouseY = this.mouseY-y;
	this.pointX = this.pointX-x;
	this.pointY = this.pointY-y;
}

//圆的对象
var MyArc = function(mouseX,mouseY,pointX,pointY,strokeStyle)
{
	this.mouseX = mouseX;
	this.mouseY = mouseY;
	this.pointX = pointX;
	this.pointY = pointY;
	this.strokeStyle = strokeStyle;
	this.name ="MYARC";
	this.isEra = false;
	this.isfill = false; //是否是实心
}

MyArc.prototype.createPath = function(context)
{
	context.beginPath();
	var pointx = this.pointX>this.mouseX?(this.pointX-this.mouseX):(this.mouseX-this.pointX);
	var pointy = this.pointY>this.mouseY?(this.pointY-this.mouseY):(this.mouseY-this.pointY);
	var radius = Math.sqrt(pointx*pointx+pointy*pointy);
	context.arc(this.mouseX, this.mouseY, radius, 0, 2*Math.PI, true);
	context.closePath();
}

MyArc.prototype.stroke = function(context)
{
	context.save();
	context.strokeStyle = this.strokeStyle;
	context.stroke();
	context.restore();
}

MyArc.prototype.fill = function(context)
{
	context.save();
	context.strokeStyle = this.strokeStyle;
	context.fill();
	context.restore();
}

MyArc.prototype.move = function(x,y)
{
	this.mouseX = this.mouseX-x;
	this.mouseY = this.mouseY-y;
	this.pointX = this.pointX-x;
	this.pointY = this.pointY-y;
}
//二次贝塞尔曲线
var MyCur = function(mouseX,mouseY,pointX,pointY,middleX,middleY,strokeStyle)
{
	this.mouseX = mouseX;
	this.mouseY = mouseY;
	this.pointX = pointX;
	this.pointY = pointY;
	this.middleX = middleX;
	this.middleY = middleY;
	this.strokeStyle = strokeStyle;
	this.name ="MYARC";
	this.isEra = false;
	this.isfill = false; //是否是实心
}

MyCur.prototype.createPath = function(context)
{
	context.beginPath();
	context.moveTo(this.mouseX,this.mouseY);
	context.quadraticCurveTo(this.middleX,this.middleY,this.pointX,this.pointY);
//	context.closePath();
}

MyCur.prototype.stroke = function(context)
{
	context.save();
	context.strokeStyle = this.strokeStyle;
	context.stroke();
	context.closePath();
	context.restore();
}

MyCur.prototype.fill = function(context)
{
	context.save();
	context.strokeStyle = this.strokeStyle;
	context.fill();
	context.restore();
}

MyCur.prototype.move = function(x,y)
{
	this.mouseX = this.mouseX-x;
	this.mouseY = this.mouseY-y;
	this.pointX = this.pointX-x;
	this.pointY = this.pointY-y;
	this.middleX = this.middleX-x;
	this.middleY = this.middleY-y;
}

//线的对象
var MyXian = function(mouseX,mouseY,strokeStyle)
{
	var point = new MyPoint(mouseX,mouseY);
	this.points = new Array();
	this.points.push(point);
	this.strokeStyle = strokeStyle;
	this.name ="MYXIAN";
	this.isEra = false;  //是否橡皮擦到了
	this.isfill = false; //是否是实心
}

MyXian.prototype.createPath = function(context)
{
	context.beginPath();
	context.moveTo(this.points[0].x,this.points[0].y);
	for(var i = 1 ; i < this.points.length ; i++)
	{
		context.lineTo(this.points[i].x,this.points[i].y);
	}
}

MyXian.prototype.stroke = function(context)
{
	context.save();
	context.strokeStyle = this.strokeStyle;
	context.stroke();
	context.restore();
}

MyXian.prototype.fill = function(context)
{
	context.save();
	context.strokeStyle = this.strokeStyle;
	context.fill();
	context.restore();
}

MyXian.prototype.move = function(x,y)
{

}
//文字对象
var MyText = function(mouseX,mouseY,font,text,strokeStyle)
{
	this.mouseX = mouseX;
	this.mouseY = mouseY;
	this.font = font;
	this.text = text;
	this.strokeStyle = strokeStyle;
	this.name ="MYXIAN";
	this.isEra = false;  //是否橡皮擦到了
	this.isfill = false; //是否是实心
}

MyText.prototype.createPath = function(context)
{
	
}

MyText.prototype.stroke = function(context)
{
	context.save();
	context.font=this.font;
	//设置颜色
	context.fillStyle= this.strokeStyle;
									
   	context.fillText(this.text, this.mouseX, this.mouseY); 
	context.restore();
}

MyText.prototype.fill = function(context)
{
	context.save();
	context.strokeStyle = this.strokeStyle;
	context.fill();
	context.restore();
}

MyXian.prototype.move = function(x,y)
{

}


//橡皮擦对象
var MyEraser = function(mouseX,mouseY,width)
{
	this.mouseX = mouseX;
	this.mouseY = mouseY;
	this.width = width;
	this.name ="MYERA";
	this.isfill = false; //是否是实心
}

MyEraser.prototype.createPath = function(context)
{
	context.beginPath();
	context.rect(this.mouseX,this.mouseY,this.width,this.width);
}

MyEraser.prototype.stroke = function(context)
{
	context.save();
	context.strokeStyle = "#ccc";
	context.fill();
	context.clip();
	
	context.stroke();
	context.restore();
}

MyEraser.prototype.clear = function(context)
{
	context.clearRect(this.mouseX,this.mouseY,this.width,this.width);
}

MyEraser.prototype.move = function(x,y)
{
	this.mouseX = this.mouseX-x;
	this.mouseY = this.mouseY-y;
}

var Mycanvas = function(canvasId)
{
	this.canvas = document.getElementById(canvasId);
	this.context = this.canvas.getContext("2d");
}

//拖动的方法
Mycanvas.prototype.drag = function()
{
	var index;
	var mouseX,mouseY;
	var isDown = false;
	var context = this.context;
	
	var isDrag = false;
	this.canvas.onmousedown = function(e)
	{
		mouseX =e.clientX-this.offsetLeft;
		mouseY = e.clientY- this.offsetTop;
		
		isDown = true;
//		for(var i = allObject.length-1 ; i >= 0 ; i-- )
		for(var i = 0 ; i < allObject.length ; i++)
		{
			var obj = allObject[i];
			obj.createPath(context);
			if( !obj.isEra && context.isPointInPath(mouseX,mouseY) && obj.name!="MYERA")
			{
				index = i;
				isDrag = true;
				break;
			}
			//如果是直线的话进行如下操作
			if(!obj.isEra && obj.name == "MYLINE" && obj.isPointIn(mouseX,mouseY))
			{
				index = i;
				isDrag = true;
				break;
			}
		}
	}
	
	this.canvas.onmousemove = function(e)
	{
		if(isDown && isDrag)
		{
			var pointX =e.clientX-this.offsetLeft;
			var pointY = e.clientY- this.offsetTop;
			
			var width = mouseX-pointX;
			var height = mouseY-pointY;
			allObject[index].move(width,height);
			//打包数据进行发送
			var mouseX1 = "'mouseX':"+"'"+width+"'";
			var mouseY1 = "'mouseY':"+"'"+height+"'";
			var indexStr = "'index':"+"'"+index+"'";
			var opStatus="'opStatus':'mouseMove'";
			var opType ="'opType':'DRAG'";
			//再次封装并发送
			packageAndSend(opType,mouseX1,mouseY1,indexStr,opStatus);
			
			//交换橡皮擦位置
			for(var j = index ; j < allObject.length ; j++)
			{
				if(allObject[j].name == "MYERA")
				{
					var temp = allObject[j];
					allObject[j] = allObject[index];
					allObject[index] = temp;
					index = j;
				}
			}
				
			//更改值
			mouseX = pointX;
			mouseY = pointY;
			
			context.clearRect(0,0,this.width,this.height);
/*			for(var i = allObject.length-1 ; i >= 0 ; i-- )
			{
				var obj = allObject[i];
				obj.createPath(context);
				obj.stroke(context);
				obj.clear(context);
				
			}
	*/		
			for(var i = 0 ; i < allObject.length ; i++)
			{
				var obj = allObject[i];
				obj.createPath(context);
				if(obj.isfill)
				{
					obj.fill(context);
				}
				else
				{
					obj.stroke(context);
				}
				if(obj.name == "MYERA")
				{
					obj.clear(context);
				}
				
			}

		}
	}
	
	this.canvas.onmouseup = function(e)
	{
		isDrag = false;
		isDown = false;
	}
}


Mycanvas.prototype.drawStrLine = function()
{
	var drawingSurfaceData;  //定义一个保存画板所有图形数据的变量
	var mouseX,mouseY;
	var isDown = false; 
	var myLine;
	var context = this.context;
	this.canvas.onmousedown = function(e)
	{
		isDown = true;
		mouseX =e.clientX-this.offsetLeft;
		mouseY = e.clientY- this.offsetTop;
		drawingSurfaceData = context.getImageData(0,0,this.width,this.height);
		var opStatus="'opStatus':'mouseDown'";
		var opType ="'opType':'STRLINE'";
		packageAndSend(opType,opStatus);
	}
	
	
	this.canvas.onmousemove = function(e)
	{
		if(isDown)
		{
			var color = "#"+$("#color").val(); //当前画笔的颜色  //当前画笔的颜色
			context.putImageData(drawingSurfaceData,0,0);
			var pointx = e.clientX-this.offsetLeft;
			var pointy =  e.clientY- this.offsetTop;
			myLine = new MyLine(mouseX,mouseY,pointx,pointy,color);
			myLine.createPath(context);	
			myLine.stroke(context);
			
			//封装数据
			color = "'color':"+"'"+color+"'";
			var mouseX1 = "'mouseX':"+"'"+mouseX+"'";
			var mouseY1 = "'mouseY':"+"'"+mouseY+"'";
			var pointX = "'pointX':"+"'"+pointx+"'";
			var pointY = "'pointY':"+"'"+pointy+"'";
			var opStatus="'opStatus':'mouseMove'";
			var opType ="'opType':'STRLINE'";
			//再次封装并发送
			packageAndSend(opType,color,mouseX1,mouseY1,pointX,pointY,opStatus);
		}
	}
	
	this.canvas.onmouseup = function(e)
	{
		isDown = false;
		allObject.push(myLine);
		var opStatus="'opStatus':'mouseUp'";
		var opType ="'opType':'STRLINE'";
		packageAndSend(opType,opStatus);
	}
}



Mycanvas.prototype.drawRect = function(isFill)
{
	var drawingSurfaceData;  //定义一个保存画板所有图形数据的变量
	var mouseX,mouseY;
	var isDown = false; 
	var myRect;
	var context = this.context;
	this.canvas.onmousedown = function(e)
	{
		isDown = true;
		mouseX =e.clientX-this.offsetLeft;
		mouseY = e.clientY- this.offsetTop;
		drawingSurfaceData = context.getImageData(0,0,this.width,this.height);
		var opStatus="'opStatus':'mouseDown'";
		var opType ="'opType':'RECT'";
		packageAndSend(opType,opStatus);
	}
	
	this.canvas.onmousemove = function(e)
	{
		if(isDown)
		{
			var color = "#"+$("#color").val(); //当前画笔的颜色  //当前画笔的颜色
			context.putImageData(drawingSurfaceData,0,0);
			var pointx = e.clientX-this.offsetLeft;
			var pointy =  e.clientY- this.offsetTop;
			myRect = new MyRect(mouseX,mouseY,pointx,pointy,color);
			myRect.createPath(context);
			var fill;
			if(isFill)
			{
				myRect.fill(context);
				myRect.isfill = true;
				fill = "'isfill':'yes'";
			}
			else{
				myRect.stroke(context);
				fill = "'isfill':'no'";
			}
			
			//封装数据
			color = "'color':"+"'"+color+"'";
			var mouseX1 = "'mouseX':"+"'"+mouseX+"'";
			var mouseY1 = "'mouseY':"+"'"+mouseY+"'";
			var pointX = "'pointX':"+"'"+pointx+"'";
			var pointY = "'pointY':"+"'"+pointy+"'";
			var opStatus="'opStatus':'mouseMove'";
			var opType ="'opType':'RECT'";
			
			//再次封装并发送
			packageAndSend(opType,color,mouseX1,mouseY1,pointX,pointY,fill,opStatus);
		}
	}
	
	this.canvas.onmouseup = function(e)
	{
		isDown = false;
		var opStatus="'opStatus':'mouseUp'";
		var opType ="'opType':'RECT'";
		packageAndSend(opType,opStatus);
		allObject.push(myRect);
	}
}


Mycanvas.prototype.drawTri = function(isFill)
{
	var drawingSurfaceData;  //定义一个保存画板所有图形数据的变量
	var mouseX,mouseY;
	var isDown = false; 
	var myTri;
	var context = this.context;
	this.canvas.onmousedown = function(e)
	{
		isDown = true;
		mouseX =e.clientX-this.offsetLeft;
		mouseY = e.clientY- this.offsetTop;
		drawingSurfaceData = context.getImageData(0,0,this.width,this.height);
		var opStatus="'opStatus':'mouseDown'";
		var opType ="'opType':'TRI'";
		packageAndSend(opType,opStatus);
	}
	
	this.canvas.onmousemove = function(e)
	{
		if(isDown)
		{
			var color = "#"+$("#color").val(); //当前画笔的颜色  //当前画笔的颜色
			context.putImageData(drawingSurfaceData,0,0);
			var pointx = e.clientX-this.offsetLeft;
			var pointy =  e.clientY- this.offsetTop;
			myTri = new MyTri(mouseX,mouseY,pointx,pointy,color);
			myTri.createPath(context);
			var fill;
			if(isFill)
			{
				myTri.fill(context);
				myTri.isfill = true;
				fill = "'isfill':'yes'";
			}
			else{
				myTri.stroke(context);
				fill = "'isfill':'no'";
			}
			//封装数据
			color = "'color':"+"'"+color+"'";
			var mouseX1 = "'mouseX':"+"'"+mouseX+"'";
			var mouseY1 = "'mouseY':"+"'"+mouseY+"'";
			var pointX = "'pointX':"+"'"+pointx+"'";
			var pointY = "'pointY':"+"'"+pointy+"'";
			var opStatus="'opStatus':'mouseMove'";
			var opType ="'opType':'TRI'";
			
			//再次封装并发送
			packageAndSend(opType,color,mouseX1,mouseY1,pointX,pointY,fill,opStatus);
		}
	}
	
	this.canvas.onmouseup = function(e)
	{
		isDown = false;
		var opStatus="'opStatus':'mouseUp'";
		var opType ="'opType':'TRI'";
		packageAndSend(opType,opStatus);
		allObject.push(myTri);
	}
}



//画圆形
Mycanvas.prototype.drawArc = function(isFill)
{
	var drawingSurfaceData;  //定义一个保存画板所有图形数据的变量
	var mouseX,mouseY;
	var isDown = false; 
	var myArc;
	var context = this.context;
	this.canvas.onmousedown = function(e)
	{
		isDown = true;
		mouseX =e.clientX-this.offsetLeft;
		mouseY = e.clientY- this.offsetTop;
		drawingSurfaceData = context.getImageData(0,0,this.width,this.height);
		var opStatus="'opStatus':'mouseDown'";
		var opType ="'opType':'ARC'";
		packageAndSend(opType,opStatus);
	}
	
	this.canvas.onmousemove = function(e)
	{
		if(isDown)
		{
			var color = "#"+$("#color").val(); //当前画笔的颜色  //当前画笔的颜色
			context.putImageData(drawingSurfaceData,0,0);
			var pointx = e.clientX-this.offsetLeft;
			var pointy =  e.clientY- this.offsetTop;
			myArc = new MyArc(mouseX,mouseY,pointx,pointy,color);
			myArc.createPath(context);
			var fill;
			if(isFill)
			{
				myArc.fill(context);
				myArc.isfill = true;
				fill = "'isfill':'yes'";
			}
			else{
				myArc.stroke(context);
				fill = "'isfill':'no'";
			}
			//封装数据
			color = "'color':"+"'"+color+"'";
			var mouseX1 = "'mouseX':"+"'"+mouseX+"'";
			var mouseY1 = "'mouseY':"+"'"+mouseY+"'";
			var pointX = "'pointX':"+"'"+pointx+"'";
			var pointY = "'pointY':"+"'"+pointy+"'";
			var opStatus="'opStatus':'mouseMove'";
			var opType ="'opType':'ARC'";
			
			//再次封装并发送
			packageAndSend(opType,color,mouseX1,mouseY1,pointX,pointY,fill,opStatus);
		}
	}
	
	this.canvas.onmouseup = function(e)
	{
		isDown = false;
		var opStatus="'opStatus':'mouseUp'";
		var opType ="'opType':'ARC'";
		packageAndSend(opType,opStatus);
		allObject.push(myArc);
	}
}

//橡皮擦的操作

//画一个矩形的函数
function drawRectangle(mouseX,mouseY,context)
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
Mycanvas.prototype.eraser = function()
{
	var mouseX,mouseY;
	var isDown = false;  //判断是否
	var context = this.context;
	this.canvas.onmousedown = function(e)
	{
		//隐藏sliderbar
		$("#showInfo").fadeOut(100);
		
		mouseX =e.clientX-this.offsetLeft;
		mouseY = e.clientY- this.offsetTop;
		e.preventDefault();    //阻止cursor 改变
		var myEraser = new  MyEraser(mouseX-ERASER_WIDTH/2,mouseY-ERASER_WIDTH/2,ERASER_WIDTH);
		myEraser.createPath(context);
		myEraser.stroke(context);
		//加入维护的对象列表中
		xiangjiao(mouseX,mouseY,context); //判断相交，并更改值
		allObject.push(myEraser);
		isDown = true;
		//封装数据
		mouseX1 = mouseX-ERASER_WIDTH/2;
		mouseY1 = mouseY-ERASER_WIDTH/2;
		var mouseX1 = "'mouseX':"+"'"+mouseX1+"'";
		var mouseY1 = "'mouseY':"+"'"+mouseY1+"'";
		var width = "'width':"+"'"+ERASER_WIDTH+"'";
		var opStatus="'opStatus':'mouseDown'";
		var opType ="'opType':'ERASER'";
		//再次封装并发送
		packageAndSend(opType,width,mouseX1,mouseY1,opStatus);
	}
	
	this.canvas.onmousemove = function(e)
	{
		if(isDown)
		{
			
			
			context.clearRect(mouseX-ERASER_WIDTH/2,mouseY-ERASER_WIDTH/2,ERASER_WIDTH,ERASER_WIDTH);
			mouseX=e.clientX-this.offsetLeft;
			mouseY = e.clientY- this.offsetTop;	
			var myEraser = new  MyEraser(mouseX-ERASER_WIDTH/2,mouseY-ERASER_WIDTH/2,ERASER_WIDTH);
			myEraser.createPath(context);
			myEraser.stroke(context);
			//加入维护的对象列表中
			xiangjiao(mouseX,mouseY,context); //判断相交，并更改值
			allObject.push(myEraser);
			//封装数据
			mouseX1 = mouseX-ERASER_WIDTH/2;
			mouseY1 = mouseY-ERASER_WIDTH/2;
			var mouseX1 = "'mouseX':"+"'"+mouseX1+"'";
			var mouseY1 = "'mouseY':"+"'"+mouseY1+"'";
			var width = "'width':"+"'"+ERASER_WIDTH+"'";
			var opStatus="'opStatus':'mouseMove'";
			var opType ="'opType':'ERASER'";
			//再次封装并发送
			packageAndSend(opType,width,mouseX1,mouseY1,opStatus);
	//		drawRectangle(mouseX,mouseY,context);
		}
	}
	
	this.canvas.onmouseup = function(e)
	{
		isDown = false;
		//封装数据
		mouseX1 = mouseX-ERASER_WIDTH/2;
		mouseY1 = mouseY-ERASER_WIDTH/2;
		var mouseX1 = "'mouseX':"+"'"+mouseX1+"'";
		var mouseY1 = "'mouseY':"+"'"+mouseY1+"'";
		var width = "'width':"+"'"+ERASER_WIDTH+"'";
		var opStatus="'opStatus':'mouseUp'";
		var opType ="'opType':'ERASER'";
		//再次封装并发送
		packageAndSend(opType,width,mouseX1,mouseY1,opStatus);
		context.clearRect(mouseX-ERASER_WIDTH/2,mouseY-ERASER_WIDTH/2,ERASER_WIDTH,ERASER_WIDTH);
		
	}
	
}

//点对象
var MyPoint = function(x,y)
{
	this.x = x;
	this.y = y;
}

MyPoint.prototype.getX = function()
{
	return this.x;
}

MyPoint.prototype.getY = function()
{
	return this.y;
}

//判断是否橡皮擦和某个图形相交
function xiangjiao(mouseX,mouseY,context)
{
	var r = ERASER_WIDTH/2;
	var points = new Array();
	var point1 = new MyPoint(mouseX-r,mouseY-r);
	var point2 =new MyPoint(mouseX+r,mouseY-r);
	var point3 = new MyPoint(mouseX-r,mouseY+r);
	var point4 = new MyPoint(mouseX+r,mouseY+r);
	points.push(point1);
	points.push(point2);
	points.push(point3);
	points.push(point4);
	//定义一个保存有几个点是在图形里面的数组对像
	var numPoints = [];
	for(var i = 0 ; i < allObject.length ; i++)
	{
		numPoints[i] = 0 ;
	}
	
	//遍历四个点判断是否跟某个图形有相交，如果相交的话，把某个图形的isEra 置为true
	for(var j = 0; j < points.length ; j++)
	{
		for(var i = 0 ; i < allObject.length ; i++)
		{
			var obj = allObject[i];
			obj.createPath(context);
			if(obj.name!="MYERA" && context.isPointInPath(points[j].getX(),points[j].getY()))
			{
//				allObject[i].isEra = true;
				numPoints[i] = numPoints[i]+1;
			}
			if(obj.name == "MYLINE" && obj.lengthToEra(point1.x,point1.y,point4.x,point4.y))
			{
				allObject[i].isEra = true;
			}
		}
	}
	//遍历numPoints对象
	for(var k = 0 ;  k < allObject.length ; k++)
	{
		if(numPoints[k] > 0 )
		{
			if(allObject[k].isfill == true)
			{
				allObject[k].isEra = true;
			}
			else
			{
				if(numPoints[k] < 4)
				{
					allObject[k].isEra = true;
				}
					
			}
		}
	}
}


//绘制二次贝塞尔曲线
Mycanvas.prototype.drawCurve = function()
{
	var numDown = 0;
	var pointX1,pointY1,pointX2,pointY2,pointX3,pointY3;
	var drawingSurfaceData;  //定义一个保存画板所有图形数据的变量
	var context = this.context;
	var myCur;
	this.canvas.onmousedown = function(e)
	{
		drawingSurfaceData = context.getImageData(0,0,this.width,this.height);
		pointX2 =e.clientX-this.offsetLeft;
		pointY2 = e.clientY- this.offsetTop;
		numDown = numDown+1;
		if(numDown == 1)
		{
			pointX1 = pointX2;
			pointY1 = pointY2;
			pointX3 = pointX2;
			pointY3 = pointY2;
//			drawArc(pointX1, pointY1, 0.5, 0, 2*Math.PI);  //画一个点
		}
		if(numDown == 2)
		{
//			myCur = new MyCur(pointX1,pointY1,pointX2,pointY2,pointX3,pointY3,color);
//			myCur.createPath(context);
//			myCur.stroke(context);	
			//drawCur(pointX1,pointY1,pointX3,pointY3,pointX2,pointY2);
			var opStatus="'opStatus':'mouseDown'";
			var opType ="'opType':'CUR'";
			packageAndSend(opType,opStatus);
		}
	}
	
	this.canvas.onmousemove = function(e)
	{
		if(numDown == 2)
		{
			var color = "#"+$("#color").val(); //当前画笔的颜色
			context.putImageData(drawingSurfaceData,0,0);
			pointX3 =e.clientX-this.offsetLeft;
			pointY3 = e.clientY- this.offsetTop;
			myCur = new MyCur(pointX1,pointY1,pointX2,pointY2,pointX3,pointY3,color);
			myCur.createPath(context);
			myCur.stroke(context);
			
			//封装数据
			color = "'color':"+"'"+color+"'";
			var mouseX1 = "'mouseX':"+"'"+pointX1+"'";
			var mouseY1 = "'mouseY':"+"'"+pointY1+"'";
			var pointX = "'pointX':"+"'"+pointX2+"'";
			var pointY = "'pointY':"+"'"+pointY2+"'";
			var middleX = "'middleX':"+"'"+pointX3+"'";
			var middleY = "'middleY':"+"'"+pointY3+"'";
			var opStatus="'opStatus':'mouseMove'";
			var opType ="'opType':'CUR'";
			
			//再次封装并发送
			packageAndSend(opType,color,mouseX1,mouseY1,pointX,pointY,middleX,middleY,opStatus);
		}
	}
	
	this.canvas.onmouseup = function(e)
	{
		if(numDown == 3)
		{
			numDown =0;
			var opStatus="'opStatus':'mouseUp'";
			var opType ="'opType':'CUR'";
			packageAndSend(opType,opStatus);
			allObject.push(myCur);
		}
	}
}


//画笔
//画板点击画笔之后的方法
Mycanvas.prototype.drawLine = function()
{
	var isDown = false;   //是否按下鼠标
	var isMove = false;   //是否移动鼠标
	var timeEvent;        //当前时间事件
	var pointX,pointY;
	var context = this.context;
	var myXian;
	this.canvas.onmousedown = function(e)
	{
		var color = "#"+$("#color").val(); //当前画笔的颜色 //当前画笔的颜色
		isDown = true;   
		pointX =e.clientX-this.offsetLeft;
		pointY = e.clientY- this.offsetTop;
		var date =new Date();
		var opTime = date.getTime();
		myXian = new MyXian(pointX,pointY,color);
		//封装数据
		color = "'color':"+"'"+color+"'";
		var mouseX = "'mouseX':"+"'"+pointX+"'";
		var mouseY = "'mouseY':"+"'"+pointY+"'";
		var opStatus="'opStatus':'mouseDown'";
		var opType ="'opType':'LINE'";
		//再次封装并发送
		packageAndSend(opType,color,mouseX,mouseY,opStatus);
	}
	
	
	this.canvas.onmousemove = function(e)
	{
		if(isDown)
		{	
			var color = "#"+$("#color").val(); //当前画笔的颜色 //当前画笔的颜色
			context.beginPath();
			var pointX1 =e.clientX-this.offsetLeft;
			var pointY1 = e.clientY- this.offsetTop;	
			var date =new Date();
			var opTime = date.getTime();
			var point = new MyPoint(pointX1,pointY1);
			myXian.points.push(point);
			myXian.createPath(context);
			myXian.stroke(context);
			//封装发送
			var opType ="'opType':'LINE'";
			var mouseX = "'mouseX':"+"'"+pointX1+"'";
			var mouseY = "'mouseY':"+"'"+pointY1+"'";
			var opStatus="'opStatus':'mouseMove'";
			//再次封装并发送
			packageAndSend(opType,mouseX,mouseY,opStatus);
//			redraw();
		}
	}
	
	this.canvas.onmouseout = function(e)
	{
		if(isDown)
		{
			isDown = false;
			var opType ="'opType':'LINE'";
			var opStatus="'opStatus':'mouseUp'";
			//再次封装并发送
			packageAndSend(opType,opStatus);
			allObject.push(myXian);	
		}
	}
	
	this.canvas.onmouseup = function(e)
	{
		var opType ="'opType':'LINE'";
		var opStatus="'opStatus':'mouseUp'";
		//再次封装并发送
		packageAndSend(opType,opStatus);
		allObject.push(myXian);
		isDown = false;
//		redraw();
	}
	
}

//选择颜色
Mycanvas.prototype.selectColor = function()
{
	this.color ="#"+$("#color").val();
	var opType ="'opType':'COLOR'";
	color = "'color':"+"'"+$("#color").val()+"'";
	//再次封装并发送
	packageAndSend(opType,color);
}

//写入文字
Mycanvas.prototype.writeText = function()
{
	var x = $("#Drigging").css("left");  //获取可拖动文本框的距离左边框的距离
	x = parseInt(x)-this.canvas.offsetLeft+5;   //跟画板的距离差
	var y =$("#Drigging").css("top");    
	y=parseInt(y)-this.canvas.offsetTop+18;				
	//得到字体和字号大小
	var font_family = $("#font_family").val();
	var font_size = $("#font_size").val()+"px";
	var myfont = font_size+" "+font_family;
	//得到颜色
	var color = "#"+$("#color").val();
	var text = $("#myText").val()
	var myText = new MyText(x,y,myfont,text,color);
	myText.stroke(this.context);
	
	color = "'color':"+"'"+color+"'";
	var mouseX = "'mouseX':"+"'"+x+"'";
	var mouseY = "'mouseY':"+"'"+y+"'";
	var font = "'font':"+"'"+myfont+"'";
	var textstr = "'text':"+"'"+text+"'";
	var opStatus="'opStatus':'write'";
	var opType ="'opType':'TEXT'";
	//再次封装并发送
	packageAndSend(opType,mouseX,mouseY,opStatus,font,textstr);

}

//保存
Mycanvas.prototype.save = function()
{
	var image = new Image();
	var dataURL = this.canvas.toDataURL("image/png");
	dataURL = dataURL.replace("image/png", "image/octet-stream");
	document.location.href = dataURL;
}

//前进
Mycanvas.prototype.forward = function()
{
	
}
//后退
Mycanvas.prototype.back  = function()
{
	
}

//数据进行打包
function packageAndSend()
{
	var date =new Date();
	var opTime = date.getTime();
	//先整合数据，弄成Json形式
	var opId = "'opId':'canvas'"; 
	opTime = "'opTime':"+"'"+opTime+"'";
	var dataEvent = "[{"+opId+","+opTime;
	for(var i = 0 ; i < arguments.length ; i++)
	{
		dataEvent = dataEvent+","+arguments[i];
		
	}
	dataEvent =  dataEvent+"}]";
	iosocket.send(dataEvent);
}