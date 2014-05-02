// JavaScript Document
// JavaScript Document
/**
 * jVslider 1.2 - Slider jQuery Plug-in
 *
 * @author PiscDong (http://www.piscdong.com/)
 */

(function($){
	var lastPosition;
	var defaultOpts={
		vertical: false,
		width: 100,
		barHeight: 10,
		barBorder: 1,
		barBorderColor: '#aaa',
		barRadius: 2,
		barBackground: '#fff',
		handleWidth: 10,
		handleHeight: 12,
		handleBorder: 1,
		handleBorderColor: '#aaa',
		handleRadius: 2,
		handleBackground: '#fff',
		handleDownBackground: '#eee',
		processBackground: '#fc6',
		percent: 0
	};

	$.fn.jvslider=function(option){
		var opt=$.extend({}, defaultOpts, option);
		if(opt.percent<0)opt.percent=0;
		if(opt.percent>100)opt.percent=100;
		var barPosition=Math.round(opt.width*opt.percent/100);
		var barWidth=opt.width+opt.handleWidth+opt.handleBorder*2-opt.barBorder*2;
		var barMargin=Math.round((opt.handleHeight-opt.barHeight)/2)+opt.handleBorder-opt.barBorder;
		var handleTop=barMargin;
		if(barMargin<0)barMargin=0;
		var processRight=Math.round(opt.handleWidth/2)+opt.handleBorder-opt.barBorder;
		return this.each(function(){
			var html='<div class="slider_div" style="';
			if(opt.vertical){
				html+='width: '+(opt.barHeight+opt.barBorderColor*2)+'px;height: '+(barWidth+opt.barBorderColor*2)+'px;line-height: '+(barWidth+opt.barBorderColor*2)+'px;';
			}else{
				html+='width: '+(barWidth+opt.barBorderColor*2)+'px;height: '+(opt.barHeight+opt.barBorderColor*2)+'px;line-height: '+(opt.barHeight+opt.barBorderColor*2)+'px;';
			}
			html+='margin: 0;padding: 0;position: relative;">';
			html+='<div class="slider_bar" style="border: '+opt.barBorder+'px solid '+opt.barBorderColor+';border-radius: '+opt.barRadius+'px;';
			if(opt.vertical){
				html+='width: '+opt.barHeight+'px;height: '+barWidth+'px;line-height: '+barWidth+'px;margin-left: '+barMargin+'px;margin-right: '+barMargin+'px;background: '+opt.processBackground+';';
			}else{
				html+='width: '+barWidth+'px;height: '+opt.barHeight+'px;line-height: '+opt.barHeight+'px;margin-top: '+barMargin+'px;margin-bottom: '+barMargin+'px;background: '+opt.barBackground+';';
			}
			html+='-khtml-user-select: none;user-select: none;-webkit-user-select:none;">';
			html+='<div class="slider_process" style="border-radius: '+opt.barRadius+'px;';
			if(opt.vertical){
				html+='width: '+opt.barHeight+'px;height: '+(barWidth-barPosition-processRight)+'px;line-height: '+(barWidth-barPosition-processRight)+'px;background: '+opt.barBackground+';';
			}else{
				html+='width: '+(barPosition+processRight)+'px;height: '+opt.barHeight+'px;line-height: '+opt.barHeight+'px;background: '+opt.processBackground+';';
			}
			html+='"></div>';
			html+='</div>';
			html+='<div class="slider_handle" style="border: '+opt.handleBorder+'px solid '+opt.handleBorderColor+';border-radius: '+opt.handleRadius+'px;background: '+opt.handleBackground+';';
			if(opt.vertical){
				html+='width: '+opt.handleHeight+'px;height: '+opt.handleWidth+'px;line-height: '+opt.handleWidth+'px;';
			}else{
				html+='width: '+opt.handleWidth+'px;height: '+opt.handleHeight+'px;line-height: '+opt.handleHeight+'px;';
			}
			html+='position: absolute;top: 0;left: 0;z-index: 1;-khtml-user-select: none;user-select: none;-webkit-user-select:none;"></div>';
			html+='</div>';
			$(this).html(html);
			var this_bar=$(this).find('.slider_bar');
			var this_handle=$(this).find('.slider_handle');
			if(opt.vertical){
				this_handle.css({'left':(0-(handleTop<0?handleTop:0))+'px', 'top':(this_bar.height()+opt.barBorder*2-barPosition-this_handle.height()-opt.handleBorder*2)+'px'});
			}else{
				this_handle.css({'left':barPosition+'px', 'top':(0-handleTop)+'px'});
			}
			var this_process=$(this).find('.slider_process');
			this_handle.mousedown(function(e){
				$(this).css('background-color', opt.handleDownBackground);
				if(opt.vertical){
					lastPosition=e.pageY;
				}else{
					lastPosition=e.pageX;
				}
				$(this).bind('mousemove', function(e){
					if(opt.vertical){
						var newB=barPosition-(e.pageY-lastPosition);
						if(newB<0)newB=0;
						if(newB>opt.width)newB=opt.width;
						lastPosition=e.pageY;
						barPosition=newB;
						$(this).css('top', (this_bar.height()+opt.barBorder*2-newB-this_handle.height()-opt.handleBorder*2)+'px');
						this_process.css('height', (barWidth-newB-processRight)+'px');
					}else{
						var newL=barPosition+e.pageX-lastPosition;
						if(newL<0)newL=0;
						if(newL>opt.width)newL=opt.width;
						lastPosition=e.pageX;
						barPosition=newL;
						$(this).css('left', newL+'px');
						this_process.css('width', (newL+processRight)+'px');
					}
					if(opt.slide!=undefined){
						var newP=Math.round(barPosition*10000/opt.width)/100;
						opt.slide(newP);
					}
				});
			}).mouseup(function(){
				$(this).css('background-color', opt.handleBackground);
				$(this).unbind('mousemove');
			}).mouseout(function(){
				$(this).css('background-color', opt.handleBackground);
				$(this).unbind('mousemove');
			});
			this_bar.click(function(e){
				var p=$(this).offset();
				if(opt.vertical){
					var newB=Math.round(this_bar.height()+p.top-e.pageY-(opt.handleWidth/2));
					if(newB<0)newB=0;
					if(newB>opt.width)newB=opt.width;
					barPosition=newB;
					this_handle.animate({top: (this_bar.height()+opt.barBorder*2-newB-this_handle.height()-opt.handleBorder*2)+'px'});
					this_process.animate({height: (barWidth-newB-processRight)+'px'});
				}else{
					var newL=Math.round(e.pageX-p.left-(opt.handleWidth/2));
					if(newL<0)newL=0;
					if(newL>opt.width)newL=opt.width;
					barPosition=newL;
					this_handle.animate({left: newL+'px'});
					this_process.animate({width: (newL+processRight)+'px'});
				}
				var newP=Math.round(barPosition*10000/opt.width)/100;
				if(opt.click!=undefined){
					opt.click(newP);
				}else if(opt.slide!=undefined){
					opt.slide(newP);
				}
			});
		});
	};
})(jQuery);