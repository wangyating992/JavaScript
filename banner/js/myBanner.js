var myBanner= {
	//获取元素
	getEle: {
	//id
	id: function(id){
		return document.getELementById(id);
	},
	//class
	className: function(cNa,context){
		context = context || document;
		var str,arr = [];
		if (context.getElementsByClassName){
			return myBanner.toArr(context.getElementsByClassName(cNa));
		}
		var allTagName = this.tagName("*");
		for ( var i = 0;i < allTagName.length ;i++ )
		{
			var item = allTagName[i];
			if (item.className.indexOf(cNa) > -1)
			{
				arr.push(item)
			}
		}
		return arr;
	},
		//标签名
	TagName:function(tagName,context){
		context = context || document;
		var arr = context.getElementsByTagName(tagName);
		arr = myPlugins.toArr(arr);
		return arr;
	}
	},
	//16进制随机色
	colorChar16: function(){
		var txt = "#";
		for(var i = 0;i < 6; i++){
			txt += Math.floor(Math.random() * 16).toString(16);
		}
		return txt;
	},
	//获取元素的样式
	getStyle: function(obj,attr){
		return window.getComputedStyle? window.getComputedStyle(obj)[attr] : obj.currentStyle[attr];
	},
	//trim 去除字符串首尾空格
	trim : function(str){
		return str.trim && str.trim() || str.replace(/^s*|\s*$/g,"");
	},
	//
	toArr: function(arr){
		try{
			var args = Array.prototype.slice.apply(arr);
		}catch(err){
			var args = Array.prototype.concat.apply([],arr);
		}
		return args;
	}
}