//回放这个对象
function PlayBack(allData)
{
	this.allData = allData;      //把回放的数据放在内存中
	this.index = 0 ;             //当前数据下标
	this.time = 0 ;              //当前时间
	this.length = allData.length;   //数据的长度
	this.isStop = true;             //是否属于暂停状态
	this.isEnd = false;
}

//
PlayBack.prototype.write = function(Ntime,index)
{
	var dataEnd = eval(this.allData[index]);
	var dataBegin = eval(this.allData[0]);
	var nextTime = dataEnd[0].opTime-dataBegin[0].opTime;  //获取要读取的下一个事件结点开始的时间
	if(Ntime-1 == nextTime)
	{
		if(dataEnd[0].opId == "canvas")
		{
			replay.playFromJson(dataEnd[0]);
		}
		if(dataEnd[0].opId== "begin")
		{
			$('#content').append("begin"+"<br />");
		}
		if(dataEnd[0].opId == "end")
		{
			$('#content').append("end"+"<br />");
			return index;
		}
		index = this.write(Ntime, index+1);
	}
	return index;
};


//回放对象的播放函数
PlayBack.prototype.start = function()
{
	var that = this;
	this.isStop = false;
	setInterval(function(){
		if(that.isStop == false )
		{
			var Ntime = that.time;   //获取当前时间
			var index = that.index;
			Ntime++;
			index = that.write(Ntime, index);
			that.index = index;
			that.time = Ntime;
		}
		
	},0.0001);
};
//回放对象的暂停函数
PlayBack.prototype.stop = function()
{
	if(this.isStop == false)
	{
		this.isStop = true;
	}
	else
	{
		this.isStop = false;
	}
	
};

//回放对象的快进函数
PlayBack.prototype.forward = function()
{
	this.isStop = true;
	this.time = this.time+2000;  //快进两秒
	var dataBegin = eval(this.allData[0]);
	var numberIndex = this.index;
	//查找快进的时间内，按正常时间情况下应该到了哪个事件结点
	for(var i = numberIndex ; i < this.length ; i++)
	{
		var dataEnd = eval(this.allData[i]);
		
		var nowTime = dataEnd[0].opTime-dataBegin[0].opTime;  //获取要读取的下一个事件结点开始的时间
		if(nowTime > this.time)
		{
			break;
		}
		else
		{
			numberIndex++;
			if(dataEnd[0].opId == "canvas")
			{
				mycanvas.drawEvery(dataEnd[0]);
			}
			if(dataEnd[0].opId== "begin")
			{
				
			}
			if(dataEnd[0].opId == "end")
			{
				//停止时间
			
			}
		}
	}
	this.index = numberIndex;
	this.isStop = false;
};

//回放对象的快退函数
PlayBack.prototype.backward = function()
{
	this.isStop = true;
	this.time = this.time-2000;  //快退两秒
	var dataBegin = eval(this.allData[0]);
	context.clearRect (0 , 0, canvas.width , canvas.height );
	this.index = 0 ;
	for(var i = 0 ; i < this.length; i++)
	{
		var dataEnd = eval(this.allData[i]);
		var nowTime = dataEnd[0].opTime-dataBegin[0].opTime;  //当前结点距离开始结点的时间
		if(nowTime > this.time)
		{
			break;
		}
		else
		{
			this.index++;
			if(dataEnd[0].opId == "canvas")
			{
				mycanvas.drawEvery(dataEnd[0]);
			}
			if(dataEnd[0].opId== "begin")
			{
				
			}
			if(dataEnd[0].opId == "end")
			{
				
			}
		}
	}
	this.isStop = false;
};


