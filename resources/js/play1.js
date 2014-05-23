//回放这个对象
var PlayBack = function(allData)
{
	this.allData = allData;      //把回放的数据放在内存中
	this.index = 0 ;             //当前数据下标
	this.time = 0 ;              //当前时间
	this.length = allData.length;   //数据的长度
	this.isStop = true;             //是否属于暂停状态
	this.isEnd = false;
};

//设置当前时间
PlayBack.prototype.setTime = function (time) {
	this.time = time;
};

//根据不同的事件id调用不同的借口播放
PlayBack.prototype.play = function (opId,dataEvent) {
	switch(opId) {
		case "canvas":
			replay.playFromJson(dataEvent);
			break;
		case "begin":
			break;
		case "end":
			this.isStop = true;
			this.isEnd = true;
			break;
	}	
}

//播放事件
PlayBack.prototype.playEvent = function()
{
	for (var i = this.index ; i < this.length ; i++) {
		var dataEnd = eval(this.allData[i]);
		var dataBegin = eval(this.allData[0]);
		var timeLong = dataEnd[0].opTime-dataBegin[0].opTime;
		if (timeLong <= this.time+40) {
			this.index++;
			this.play(dataEnd[0].opId,dataEnd[0]);
		}
		else {
			
			break;
		}
	}	
//	this.index = i;
};


//回放对象的播放函数
PlayBack.prototype.start = function()
{
	var that = this;
	this.isStop = false;
	setInterval(function(){
		if(that.isStop == false )
		{
			that.playEvent();		
			that.setTime(that.time+40);	
		}
		
	},40);    //四十毫秒一回放，相当于1/24一帧，是人的正常视觉误差范围
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
	if(this.isEnd)
	{
		return;
	}
	this.isStop = true;  //先停止在快进时间
	this.time = this.time+2000;  //快进两秒
	var dataBegin = eval(this.allData[0]);
	//查找快进的时间内，按正常时间情况下应该到了哪个事件结点
	for(var i = this.index; i < this.length ; i++)
	{
		var dataEnd = eval(this.allData[i]);
		
		var nowTime = dataEnd[0].opTime-dataBegin[0].opTime;  //获取要读取的下一个事件结点开始的时间
		if (nowTime <= this.time) {
			this.play(dataEnd[0].opId,dataEnd[0]);
		}
		else
		{
			break;			
		}
	}
	this.index = i;
	this.isStop = false;  //又重新开始播放
};

//回放对象的快退函数
PlayBack.prototype.backward = function(context,canvas)
{
	if(this.index == 0)
	{
		return;
	}
	this.isEnd = false;
	this.isStop = true;
	this.time = this.time-2000;  //快退两秒
	var dataBegin = eval(this.allData[0]);
	//画板调用如下重置
	replay.reSet();
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
			this.play(dataEnd[0].opId,dataEnd[0]);
		}
	}
	this.isStop = false;
};


