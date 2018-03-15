// 单体单例模式
var _2048 = (function(window, document){
	
	// 获取窗口的宽高
	function getWindowSize(){
		return {
			w: document.documentElement.clientWidth,
			h: document.documentElement.clientHeight
		}
	}
	// 设置每一个 li 的宽高
	function setItemSize(winW, size, item){
		var itemSize = 0;
		if ( winW > 640 ) {return}
		itemSize = (winW - 40 - size*5) / size + "px";
		item.style.width = itemSize;
		item.style.height = itemSize;
		item.style.lineHeight = itemSize;
	}
	// 生成 2048 游戏的初始界面
	function initGUI( matrix ){
		// 一个跟标签
		var root = document.createElement("div"),
			ul = null,
			len = matrix.length,
			// 最后生成的矩阵
			list = [],
			item = null;
			winW = getWindowSize().w;

		for (var i = 0; i < len; i++) {
			list[i] = [];
			ul = document.createElement("ul");
			for (var j = 0; j < len; j++) {
				item = document.createElement("li");
				item.appendChild(document.createElement("div"));
				setItemSize(winW, len, item);
				list[i][j] = item;
				ul.appendChild(item);
			}

			root.appendChild(ul)
		}
		root.style.position = "relative";
		return {
			list: list,
			root: root
		}
	}

	
	// 生成随机数
	function random2_4(){
		return Math.random() > 0.5?4 : 2;
	}
	// 填充生成的随机数 随机取出一个空坐标填充数组
	function fillNumbers( matrix, isInit ){
		var list = [],
			x,
			y,
			item,
			len = matrix.length,
			// console.log(matrix)
			times = isInit? len - 2 : 1;
		for (var i = 0; i < times; i++) {
			item = findEmptyItemCoordnate(matrix);
			// console.log(item)
			if ( item && item.length == 2 ) {
				x = item[0];
				y = item[1];
				matrix[x][y] = random2_4()
			}
		}
	}

	// 找到所有可以填充数字的位置, 随机的返回一个位置
	function findEmptyItemCoordnate( matrix ){
		var emptyLen = 0, flag = 0, emptyArr = [], len = matrix.length;
		for (var i = 0; i < len; i++) {
			for (var j = 0; j < len; j++) {
				if ( matrix[i][j] === 0 ) {
					emptyArr.push([i, j])
				}
			}
		}
		emptyLen = emptyArr.length;
		if ( emptyLen === 0 ) {
			return []
		}
		flag = Math.floor(Math.random() * emptyLen)
		return emptyArr[flag]
	}
	// 找到数字后 添加都对应的这个li的div里面
	/*
		matrix: 数值的矩阵
		list: li 矩阵列表
	*/
	function drawGUI( matrix, list){
		// console.log(list)
		var len = matrix.length,
			item = null,
			color;
		for (var i = 0; i < len; i++) {
			for (var j = 0; j < len; j++) {
				color = createColorByNumber(matrix[i][j]);
				// console.log(color)
				item = list[i][j].children[0];
				// console.log(item)
				// 对每一个div元素的innerHTML 进行赋值
				item.innerHTML = matrix[i][j] === 0? "" : matrix[i][j];
				item.style.background = color.bgColor;
				item.style.color = color.color;
				item.style.fontSize = "16px"
			}
		}
	}
	// 生成颜色 通过每一个 div 元素的innerHTML决定
	/*
		0 2 4 8 16 32 64 128 256 512 1024 2048

	*/
	function createColorByNumber(number){
		var flag = 0;
		var color = {
			'0':  {bgColor: '#cbc2b2', color: '#333'},
            '1':  {bgColor: '#ebe4d9', color: '#333'},
            '2':  {bgColor: '#eedec7', color: '#333'},
            '3':  {bgColor: '#f39763', color: '#fff'},
            '4':  {bgColor: '#f29c5c', color: '#fff'},
            '5':  {bgColor: '#ef8161', color: '#fff'},
            '6':  {bgColor: '#f16432', color: '#fff'},
            '7':  {bgColor: '#eed170', color: '#fff'},
            '8':  {bgColor: '#edce5d', color: '#fff'},
            '9':  {bgColor: '#edc850', color: '#fff'},
            '10': {bgColor: '#edc53f', color: '#fff'},
            '11': {bgColor: '#edc22e', color: '#fff'},
            '12': {bgColor: '#b884ac', color: '#fff'},
            '13': {bgColor: '#b06ca9', color: '#fff'},
            '14': {bgColor: '#7f3d7a', color: '#fff'},
            '15': {bgColor: '#6158b1', color: '#fff'},
            '16': {bgColor: '#3a337b', color: '#fff'},
            '17': {bgColor: '#0f4965', color: '#fff'},
            '18': {bgColor: '#666', color: '#fff'},
            '19': {bgColor: '#333', color: '#fff'},
            '20': {bgColor: '#000', color: '#fff'}
		}
		if( number ){
			flag = Math.log2(number)
		}
		return color[String(flag)]
	}

	//添加事件 registerEvent
	function registerEvent(callback){
		function keyEventHadlar(e){
			e = e || window.event;
			var code = e.keyCode;
			callback.call(this, code)
		}
		window.addEventListener("keydown", keyEventHadlar)
		return keyEventHadlar;
	}

	// 左移 canGoLeft
	function canGoLeft( matrix ){
		var len = matrix.length;
		for (var i = 0; i < len; i++) {
			for (var j = 0; j < len - 1; j++) {
				if ( matrix[i][j] === 0 && matrix[i][j + 1] > 0 ) {
					return true
				}
				if ( matrix[i][j] > 0 && matrix[i][j] === matrix[i][j + 1]  ) {
					return true
				}
			}
		}
		return false
	}
	// 右移 canGoRight
	function canGoRight( matrix ){
		var len = matrix.length;
		for (var i = 0; i < len; i++) {
			for (var j = 0; j < len - 1; j++) {
				if ( matrix[i][j + 1] === 0 && matrix[i][j] > 0 ) {
					return true
				}
				if ( matrix[i][j + 1] > 0 && matrix[i][j] === matrix[i][j + 1]  ) {
					return true
				}
			}
		}
		return false
	}

	// 上移 canGoUp
	function canGoUp( matrix ){
		var len = matrix.length;
		for (var i = 0; i < len; i++) {
			for (var j = 0; j < len - 1; j++) {
				if ( matrix[j + 1][i] > 0 && matrix[j][i] === 0 ) {
					return true
				}
				if ( matrix[j + 1][i] > 0 &&  matrix[j + 1][i] ===  matrix[j][i] ) {
					return true
				}
			}
		}
		return false
	}
	// 下移 canGoDown
	function canGoDown( matrix ){
		var len = matrix.length;
		for (var i = 0; i < len; i++) {
			for (var j = 0; j < len - 1; j++) {
				if ( matrix[j][i] > 0 && matrix[j + 1][i] === 0 ) {
					return true
				}
				if ( matrix[j][i] > 0 &&  matrix[j + 1][i] ===  matrix[j][i] ) {
					return true
				}
			}
		}
		return false
	}
	// 取出非零的元素 即填充了数字元素
	function getFilledItem(matrix){
		var len = matrix.length, filled = [];
		for (var i = 0; i < len; i++) {
			for (var j = 0; j < len; j++) {
				if ( matrix[i][j] > 0 ) {
					filled.push({
						flag: [i, j],
						value: matrix[i][j]
					})
				}
			}
		}
		return filled;
	}
	// 移动函数  keyWord 上下左右的关键词
	function move(matrix, keyWord ){
		var filled = getFilledItem(matrix);
		// console.log(filled)
		var len = matrix.length, line = [], lienLength = 0;
		switch (keyWord) {
			case "left":
				for (var i = 0; i < len; i++) {
					line = filled.filter(function(item){
						return item.flag[0] === i;
					})
					// console.log(line)
					lienLength = line.length;
					for (var j = 0; j < lienLength; j++) {
						matrix[line[j].flag[0]][line[j].flag[1]] = 0;
						matrix[i][j] = line[j].value;
					}
					// console.log(matrix)
				}
				break;
			case "right":
				for (var i = 0; i < len; i++) {
					line = filled.filter(function(item){
						return item.flag[0] === i;
					})
					//console.log(line)
					lienLength = line.length;
					for (var j = 0; j < lienLength; j++) {
						/*
							倒数：
							j = 0  lienLength = 2
							lienLength -j -1 = 1;
							len -j -1 = 3
						*/
						var lastLineItemIndex = lienLength -j -1;
						var lastItemIndex = len -j -1;
						matrix[line[lastLineItemIndex].flag[0]][line[lastLineItemIndex].flag[1]] = 0;
						matrix[i][lastItemIndex] = line[lastLineItemIndex].value;
					}
					// console.log(matrix)
				}
				break;
			case "up":
				for (var i = 0; i < len; i++) {
					line = filled.filter(function(item){
						return item.flag[1] == i;
					})
					//console.log(line)
					lienLength = line.length;
					for (var j = 0; j < lienLength; j++) {
						matrix[line[j].flag[0]][line[j].flag[1]] = 0;
						// console.log(matrix[j][i],line[j].value)
						matrix[j][i] = line[j].value;
					}

				}
				break;
			case "down":
				for (var i = 0; i < len; i++) {
					line = filled.filter(function(item){
						return item.flag[1] == i;
					})
					//console.log(line)
					lienLength = line.length;
					for (var j = 0; j < lienLength; j++) {
						var lastLineItemIndex = lienLength - j - 1;
						var lastItemIndex = len - j -1;
						matrix[line[lastLineItemIndex].flag[0]][line[lastLineItemIndex].flag[1]] = 0;
						matrix[lastItemIndex][i] = line[lastLineItemIndex].value
					}

				}
				break;
		}
	}

	
	// 合并函数
	function merge( matrix, keyWord, callback ){
		var len = matrix.length, singleStepScore = 0;
		switch (keyWord) {
			case "left":
				for (var i = 0; i < len; i++) {
					for (var j = 0; j < len - 1; j++) {
						if ( matrix[i][j] > 0 && matrix[i][j] === matrix[i][j + 1] ) {
							matrix[i][j] *= 2;
							singleStepScore += matrix[i][j];
							matrix[i][j +1] = 0
						}
					}
				}
				break;
			case "right":
				for (var i = 0; i < len; i++) {
					for (var j = 0; j < len - 1; j++) {
						if ( matrix[i][j + 1] > 0 && matrix[i][j] === matrix[i][j + 1] ) {
							matrix[i][j + 1] *= 2;
							singleStepScore += matrix[i][j + 1];
							matrix[i][j] = 0
						}
					}
				}
				break;
			case "up":
				for (var i = 0; i < len; i++) {
					for (var j = 0; j < len - 1; j++) {
						if ( matrix[j][i] > 0 && matrix[j][i] === matrix[j + 1][i] ) {
							matrix[j][i] *= 2;
							singleStepScore += matrix[j][i];
							matrix[j + 1][i] = 0
						}
					}
				}
				break;
			case "down":
				for (var i = 0; i < len; i++) {
					for (var j = 0; j < len - 1; j++) {
						if ( matrix[j + 1][i] > 0 && matrix[j][i] === matrix[j + 1][i] ) {
							matrix[j + 1][i] *= 2;
							singleStepScore += matrix[j + 1][i];
							matrix[j][i] = 0
						}
					}
				}
				break;
		}
		callback && callback.call(this, singleStepScore)
	}


	// 本地保存分数
	function saveMaxScore(size, score, maxScore){
		if ( score > maxScore ) {
			window.localStorage.setItem("maxScore---" + size, score)
		}
	}
	// 获取本地的分数
	function getMaxScoreFromLocalStorage(size){
		return window.localStorage.getItem("maxScore---" + size)
	}
	// 显示的最高分
	function showMaxScore(ele, score, maxScore){
		return ele.innerHTML = score > maxScore ? score : maxScore;
	}

	/*
		第五步
			游戏胜利与游戏结束
	*/
	// 游戏结束
	function gameOver(rootEle, scoreElement, callback){
		var wrapper = document.createElement("div"),
			h3 = document.createElement("h3"),
			restarBtn = document.createElement("button");
		wrapper.className = "gameover-wrapper";
		h3.className = "gameover-title";
		restarBtn.className = "gameover-btn";
		h3.innerHTML = "游戏结束";
		restarBtn.innerHTML = "重新开始";
		wrapper.appendChild(h3)
		wrapper.appendChild(restarBtn)
		rootEle.appendChild(wrapper)
		restarBtn.addEventListener("click", function(){
			scoreElement.innerHTML = 0;
			callback && callback.call(this, wrapper)
		})

	}
	// 游戏胜利
	function gameWin(rootEle, scoreElement, restarCallback, continueCallback ){
		var wrapper = document.createElement("div"),
			h3 = document.createElement("h3"),
			restarBtn = document.createElement("button"),
			continueBtn = document.createElement("button");
		wrapper.className = "gamewin-wrapper";
		h3.className = "gamewin-title";
		restarBtn.className = "gamewin-btn";
		continueBtn.className = "gamewin-btn";
		h3.innerHTML = "游戏胜利";
		restarBtn.innerHTML = "重新开始";
		continueBtn.innerHTML = "继续游戏";
		wrapper.appendChild(h3)
		wrapper.appendChild(restarBtn)
		wrapper.appendChild(continueBtn)
		rootEle.appendChild(wrapper)
		restarBtn.addEventListener("click", function(){
			scoreElement.innerHTML = 0;
			restarCallback && restarCallback.call(this, wrapper)
		})
		continueBtn.addEventListener("click", function(){
			rootEle.removeChild(wrapper)
			continueCallback && continueCallback.call(this)
		})
	}


	var Game = {
		// 左键
		ARROW_LEFT: 37,
		// 上键
		ARROW_UP: 38,
		// 右键
		ARROW_RIGHT: 39,
		// 下键
		ARROW_DOWN: 40,
		// 初始的分数
		score: 0,
		// 初始的盒子大小（尺寸）
		size: 4,
		// 矩阵数据 就是 matrix
		data: [],
		// 最高分
		maxScore: 0,
		// 是否是初始化
		isInit: true,
		// 初始化游戏的函数
		// config 是在使用这个 _2048 的时候需要的一些配置信息
		init: function(config){
			// 存放布局信息
			var gui = {};
			// 保存这个配置信息
			this.config = config,
			// 2048 游戏总容器
			this.wrapper = config.wrapper;
			// 2048 游戏内容容器
			this.content = config.parent;
			// 2048 游戏得分容器
			this.scoreElement = config.score;
			// 2048 游戏最高分容器
			this.maxScoreElement = config.maxScore,
			// 2048 游戏盒子大小，有默认值，默认是 4 表示 4 * 4 的结构
			this.size = config.size || this.size;
			// 生成 默认 二维矩阵
			for (var i = 0; i < this.size; i++) {
				this.data[i] = [];
				for (var j = 0; j < this.size; j++) {
					this.data[i][j] = 0
				}
			}
			// console.log(this.data)
			gui = initGUI(this.data);
			this.root = gui.root;
			this.elements = gui.list;
			//console.log(gui)

			// 初始化游戏的时候获取最高分
			this.maxScore = getMaxScoreFromLocalStorage(this.size)
			// console.log(this.maxScore)
			
			try {
				if ( getWindowSize().w > 640 ){
					this.wrapper.style.width = 40 + this.size *5 + 60*this.size + "px"
				}
				// 把创建的元素放在 content 中
				this.maxScoreElement.innerHTML = this.maxScore;
				this.scoreElement.innerHTML = this.score;
				this.content.appendChild(this.root)
				return this
			} catch(e) {
				throw new Error(e)
			}

		},
		// 游戏开始
		start: function(){
			// console.log(this)
			var self = this;
			/* 第二步需要的代码 */
			fillNumbers(this.data, this.isInit)
			this.isInit = false;
			drawGUI(this.data, this.elements)

			/* 第三步的代码 */
			var handler = registerEvent(function(code){
				if ( self.isGameOver() ) {
					window.removeEventListener("keydown", handler);
					gameOver(self.content, self.scoreElement, function(ele){
						self.root.parentNode.removeChild(self.root)
						ele.parentNode.removeChild(ele)
						self.init(self.config).start()
						self.isInit = true;
					})
				}
				// console.log(this)
				switch ( code ) {
					// 左键
					case self.ARROW_LEFT:
						//console.log("ARROW_LEFT")
						self.go("left");
						break;
					case self.ARROW_UP:
						//console.log("ARROW_UP")
						self.go("up");
						break;
					case self.ARROW_RIGHT:
						//console.log("ARROW_RIGHT")
						self.go("right");
						break;
					case self.ARROW_DOWN:
						//console.log("ARROW_DOWN")
						self.go("down");
						break;
				}
				drawGUI(self.data, self.elements)
				// 设置分数
				//console.log(self.scoreElement)
				self.scoreElement.innerHTML = self.score;
				// 保存最高分
				saveMaxScore(self.size, self.score, self.maxScore)
				/*var a = getMaxScoreFromLocalStorage(self.size);
				console.log(a)*/
				showMaxScore(self.maxScoreElement, self.score, self.maxScore)

				// 判断游戏是否胜利
				if ( self.isWin() ) {
					gameWin(self.content, self.scoreElement,function(ele){
						self.root.parentNode.removeChild(self.root)
						ele.parentNode.removeChild(ele)
						self.init(self.config).start()
						self.isInit = true;
					}, function(){

					})
				}
			})

		},
		// 移动
		go: function(keyWord){
			var matrix = this.data, self = this;
			if ( keyWord ) {
				if ( this.canGo(keyWord) ) {
					// console.log(1)
					move(matrix, keyWord)
					// 合并
					merge(matrix, keyWord, function(singleStepScore){
						// console.log(singleStepScore)
						self.score += singleStepScore
					})
					// 每一次移动后生成一个新的数字
					fillNumbers(matrix, self.isInit)
				}
			}
		},
		// 判读是否能移动的一个综合的函数
		canGo: function(keyWord){
			var matrix = this.data;
			switch (keyWord) {
				case "left":
					return canGoLeft(matrix)
					break;
				case "up":
					return canGoUp(matrix)
					break;
				case "right":
					return canGoRight(matrix)
					break;
				case "down":
					return canGoDown(matrix)
					break;
			}
		},
		// 游戏结束
		isGameOver: function(){
			return !(this.canGo("left") || this.canGo("right") || this.canGo("up") || this.canGo("down"))
		},
		// 获取每一个元素的内容
		getMax: function(){
			var max = 0;
			for (var i = 0; i < this.size; i++) {
				for (var j = 0; j < this.size; j++) {
					if ( max < this.data[i][j] ) {
						max = this.data[i][j]
					}
				}
			}
			return max
		},
		// 游戏胜利 有一个元素的内容达到2048
		isWin: function(){
			return this.getMax() === 2048;
		}

	}

	return {
		Game: Game
	}
})(window, document);