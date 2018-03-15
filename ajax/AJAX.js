/*
method: 请求的方法 “GET”或者“POST”
url:  请求的地址
data: 请求时传递的数据
callback：请求成功返回的函数

*/
function ajax(method,url,data,callback){
	var xhr;
	var str ="";
	try{
		xhr = new XMLHttpResquest();
	}catch(e){
		//IE 浏览器的兼容
		//xhr = new ActiveXObject("Microsoft.XMLHTTP")
	}
	if((typeof data).toLowerCase() === "object" && data !== null){
		
		for(var key in data){
			str += key + "="+ encodeURI(data[key]) +"&";
		}
		str = str.substr(0,str.length-1)
	}
	//get请求,需要data拼接
	if (method.toLowerCase() === "get" && str.length != 0){
		url = url + "?" + str;
	}
	xhr.open(method, url, true);
	if (method.toLowerCase() === "get") {
		xhr.send()
	}else{
		xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		xhr.send(str);
	}
	xhr.onreadystatechange = function(){
		if(readyState === 4){
			if(status === 200){
				var data = xhr.reponseText;
				callback&&callback(data);
			}
		}
	}
}