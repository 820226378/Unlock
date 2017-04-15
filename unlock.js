(function(){
	function Start(){
		Unlock.Initialization();
		setInterval(Timedate, 10000);
		Timedate();
	}
	function Timedate(){ //获取当前时间和日期
	   	var time = new Date();
		// 程序计时的月从0开始取值后+1
		var m = time.getMonth() + 1;
		var times = time.getHours() + ":"+ PrefixInteger(time.getMinutes());
		var datas = time.getFullYear() + "-" + m + "-"+ time.getDate();
		document.getElementById("timenow").innerHTML=times;
		document.getElementById("date").innerHTML=datas;
	}
	function PrefixInteger(num) { //自动给小于10的时间填0
	    return (Array(2).join(0) + num).slice(-2);
	}
	var Circle = {
		createCircle:function(obj){//每次创建都需要重新清楚已经画好的内容
			var n = 3; //创建的每行节点的数量
		    var t = 0;
		    obj.r = obj.ctx.canvas.width / (2 + 4* n);// 公式计算每个圆节点的半径
		    obj.arrInfor = []; //存储所有节点信息的数组
		    obj.selected = [];//重置数组信息
		    obj.restPoint = [];//未选择的节点信息
		    obj.ctx.clearRect(0, 0, obj.ctx.canvas.width, obj.ctx.canvas.height);//清除canvas内容
		    var r = obj.r;
		    for (var i = 0 ; i < n ; i++) {
		        for (var j = 0 ; j < n ; j++) {
		            t++;
		            var coordinate = {//每个圆的坐标和序号
		                x: j * 4 * r + 3 * r,
		                y: i * 4 * r + 3 * r,
		                index: t
		            };
		            obj.arrInfor.push(coordinate);
		            obj.restPoint.push(coordinate);
		        }
		    }
		    for (var i = 0 ; i < obj.arrInfor.length ; i++) {
		    	obj.ctx.strokeStyle = '#CFE6FF';//线条颜色
			    obj.ctx.lineWidth = 2; //线条宽度
			    obj.ctx.beginPath();
			    obj.ctx.arc(obj.arrInfor[i].x, obj.arrInfor[i].y, obj.r, 0, Math.PI * 2, true); //画圆
			    obj.ctx.closePath();
			    obj.ctx.stroke();
		    }
		},
		drawCircle : function(obj) { // 初始化圆心
		    for (var i = 0 ; i < obj.selected.length ; i++) {
		        obj.ctx.fillStyle = '#CFE6FF';
		        obj.ctx.beginPath();
		        obj.ctx.arc(obj.selected[i].x, obj.selected[i].y, obj.r / 2, 0, Math.PI * 2, true);
		        obj.ctx.closePath();
		        obj.ctx.fill(); //填充
		    }
		},
		update : function(po,obj) {// 更新视图
		    obj.ctx.clearRect(0, 0, obj.ctx.canvas.width, obj.ctx.canvas.height);//清除canvas中原有内容
		    for (var i = 0 ; i < obj.arrInfor.length ; i++) { // 画出九个圆
		        obj.ctx.strokeStyle = '#CFE6FF';//线条颜色
			    obj.ctx.lineWidth = 2; //线条宽度
			    obj.ctx.beginPath();
			    obj.ctx.arc(obj.arrInfor[i].x, obj.arrInfor[i].y, obj.r, 0, Math.PI * 2, true); //画圆
			    obj.ctx.closePath();
			    obj.ctx.stroke();
		    }
		    this.drawCircle(obj);// 画圆心
		    this.drawLine(po,obj.selected,obj);//画轨迹
		    for (var i = 0 ; i < obj.restPoint.length ; i++) {
		        if (Math.abs(po.x - obj.restPoint[i].x) < obj.r && Math.abs(po.y - obj.restPoint[i].y) < obj.r) {
		            this.drawCircle(obj);//同上
		            obj.selected.push(obj.restPoint[i]);
		            obj.restPoint.splice(i, 1);//从剩余数组中删除当前节点信息
		            break;
		        }
		    }
		},
		drawLine : function(po, selected,obj) {// 解锁轨迹
		    obj.ctx.beginPath();
		    obj.ctx.lineWidth = 3; //线条宽度
		    obj.ctx.moveTo(obj.selected[0].x, obj.selected[0].y);//线条开始位置是第一个选择的圆
		    for (var i = 1 ; i < obj.selected.length ; i++) { //链接选定的圆节点之间的线
		        obj.ctx.lineTo(obj.selected[i].x, obj.selected[i].y);
		    }
		    obj.ctx.lineTo(po.x, po.y);//链接最后一个节点和当前触摸点的线
		    obj.ctx.stroke();
		    obj.ctx.closePath();
		},
		initialLine : function(type,obj) { // 初始化状态线条
		    for (var i = 0 ; i < obj.selected.length ; i++) {
		        obj.ctx.strokeStyle = type;
		        obj.ctx.beginPath();
		        obj.ctx.arc(obj.selected[i].x, obj.selected[i].y, obj.r, 0, Math.PI * 2, true);
		        obj.ctx.closePath();
		        obj.ctx.stroke();
		    }
		}
	}
	var Unlock={ //传入设置的解锁界面圆的个数
		Initialization:function(){ //起始方法
			this.passwords={}; //判断localstrage里是否有存储
			if(window.localStorage.getItem('passwords')){
				this.passwords={
					frequency: 2,
		        	password: JSON.parse(window.localStorage.getItem('passwords'))
				}
		    }
		    this.selected = [];//选中的数组
		    this.canvas = document.getElementById('canvas');//获取canvas节点对象
		    this.ctx = this.canvas.getContext('2d');
		    this.flag = false;  //判断是否触摸滑动
		    Circle.createCircle(this); //调用画圆方法
		    this.bindEvent();//绑定事件
		},
		bindEvent : function() { //绑定事件函数
		    var self = this;
		    this.canvas.addEventListener("touchstart", function (e) { //绑定触摸事件
		    	var rect = e.currentTarget.getBoundingClientRect(); //获取触摸点信息
			    var po = {
			        x: e.touches[0].clientX - rect.left,
			        y: e.touches[0].clientY - rect.top
			      };//获取点击点相对于canvas的坐标
		        for (var i = 0 ; i < self.arrInfor.length ; i++) {
		            if (Math.abs(po.x - self.arrInfor[i].x) < self.r && Math.abs(po.y - self.arrInfor[i].y) < self.r) { //判断触摸点是否在圆内
		                self.flag = true;//如果在圆内，则设置触摸标致为true
		                Circle.drawCircle(self); //给已经选择的圆画圆心
		                self.selected.push(self.arrInfor[i]);//将当前圆添加到已选择数组中
		                self.restPoint.splice(i,1);//去掉未选择圆数组中当前圆的信息
		                break;
		            }
		         }
		     }, false);
		     this.canvas.addEventListener("touchmove", function (e) {//绑定触摸移动事件
		        if (self.flag) { //判断触摸标致是否为true
		        	var rect = e.currentTarget.getBoundingClientRect(); //获取触摸点信息
				    var po = {
				        x: e.touches[0].clientX - rect.left,
				        y: e.touches[0].clientY - rect.top
				      };
		            Circle.update(po,self); //更新节点到移动点的线
		        }
		     }, false);
		     this.canvas.addEventListener("touchend", function (e) { //触摸停止事件
		         if (self.flag) { //判断触摸标致
		             self.flag = false; //,,重置为false
		             self.storePass(self.selected);//将选定节点数组保存
		             setTimeout(function(){
		                Circle.createCircle(self);
		            }, 300);
		         }
		     }, false);
		     if(window.localStorage.getItem('passwords')){
		     	document.getElementById("slideOne").checked=true;
		     	document.getElementById('title').innerHTML = "请验证手势密码";
		     	document.getElementById("status").innerHTML="验证密码";
		     }
		     document.getElementById("slideOne").addEventListener("click",function(e){
		     	if(e.target.checked){
		     		if(window.localStorage.getItem('passwords')){
		     			document.getElementById('title').innerHTML = "请验证手势密码";
		     			document.getElementById("status").innerHTML="验证密码";
		     		}
		     		else{
		     			alert("请先设置密码~");
		     			document.getElementById("slideOne").checked=false;
		     		}
		     	}
		     	else{
		     		window.localStorage.removeItem('passwords');
		            self.passwords={};
		            self.selected = [];
		    		self.flag = false;
		            document.getElementById('title').innerHTML = "请输入手势密码";
		     		document.getElementById("status").innerHTML="设置密码";
		     		Circle.createCircle(self);
		     	}
		     })
		},
		storePass : function(password) {// touchend结束之后对密码和状态的处理
		    if (this.passwords.frequency == 1) { //判断第几次输入密码
		        if (this.verifyPass(this.passwords.password, password)) {//判断两次密码是否一致
		        	Circle.initialLine('#2CFF26',this);//成功显示绿色
		            document.getElementById('title').innerHTML = '密码设置成功';
		            window.localStorage.setItem('passwords', JSON.stringify(this.passwords.password));
		            document.getElementById("slideOne").checked=true;
			     	document.getElementById('title').innerHTML = "请验证手势密码";
			     	document.getElementById("status").innerHTML="验证密码";
			     	 this.passwords.frequency = 2;//将次数置为2
		            this.passwords.password = password; //密码数组
		        } else {
		            document.getElementById('title').innerHTML = '两次输入的不一致';
		            Circle.initialLine('red',this);//失败显示红色
		            delete this.passwords.frequency; 
		        }
		    } else if (this.passwords.frequency == 2) {
		        if (this.verifyPass(this.passwords.password, password)) {
		            document.getElementById('title').innerHTML = '密码正确！';
		            Circle.initialLine('#2CFF26',this);
		        } else {
		            Circle.initialLine('red',this);
		            document.getElementById('title').innerHTML = '输入的密码不正确';
		        }
		    } else {
		    	if(password.length>4){
			        document.getElementById('title').innerHTML = '请再次输入手势密码';
			        this.passwords.frequency = 1;//第一次输入
			        this.passwords.password = password;
		    	}
		    	else{
		    		document.getElementById('title').innerHTML = '密码太短,至少需要五个点';
		    	}
		    }
		},
		verifyPass : function(password1, password2) {// 检测密码
			var flag=1;
			if(password1.length != password2.length){
				return false;
			}
		    for (var i = 0 ; i < password1.length ; i++) {
		        if(password1[i].index != password2[i].index)
		        	flag=0;
		    }
		    if(flag==1)
		    	return true;
		    else
		    	return false;
		}
	}
	Start();
})();
