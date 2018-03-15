function move(obj,json,speed,callfunction){
			obj.timer = setInterval(function(){
				// 定义一个开关控制定时器
				var onOff = true;
				for (var attr in json) {
					// 初始值
					var start;
					if ( attr === "opacity" ) {
						// 兼容 js 运算小数的问题
						start = getStyle(obj,attr) * 100;
					} else {
						start = parseInt(getStyle(obj,attr));
					}
					// 目标值
					var target = json[attr];
					var newSpeed = start > target? -speed : speed;

					// 目标值高于初始值或者 目标值低于初始值都可以执行
					if ( start != target ) {
						if ( attr === "opacity" ) {
							if ( start + newSpeed > target ) {
								obj.style[attr] = target / 100;
								break;
							}
							obj.style[attr] = (start + newSpeed) / 100;
						} else {
							if ( start + newSpeed > target ) {
								obj.style[attr] = target + "px";
								break;
							}
							obj.style[attr] = start + newSpeed + "px";
						}
						onOff = false;
					}
				}
				if ( onOff ) {
					clearInterval(obj.timer)
					callfunction && callfunction();
				}
			}, 1000/60)
		}

		function getStyle(obj,attr){
			return window.getComputedStyle? window.getComputedStyle(obj)[attr] : obj.currentStyle[attr]
		}