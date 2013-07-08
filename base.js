(function(){
	if(!window.ADS){window['ADS']={}}
	function isComparible(other){
		if(other===false
			||!Array.prototype.push
			||!Object.hasOwnProperty
			||!document.createElement
		||!document.getElementsByTagName){
			return false;
		}
		return true;
	};
	window['ADS']['isComparible']=isComparible;
	function $(){
		var elements=[];
		for(var i=0,len=arguments.length;i<len;i++){
			var element=arguments[i];
			if(typeof element == 'string'){
				element =document.getElementById(element);
			}
			if(len==1){
				return element;
			}
			elements.push(element);
		}
		return elements;
	};
	window['ADS']['$']=$;
	function addEvent(node,type,listener){
		if(!isComparible()){return false;}
		if(!(node=$(node))){return false;}
		if(node.addEventListener){
			node.addEventListener(type,listener,false);
			return true;
		}else if(node.attachEvent){
			node['e'+type+listener]=listener;
			node[type+listener]=function(){
				node['e'+type+listener](window.event);
			}
			node.attachEvent('on'+type,node[type+listener]);
			return true;
		}
		return false;
	};
	window['ADS']['addEvent']=addEvent;
	function removeEvent(node,type,listener){
		if(!(node=$(node))){return false;}
		if(node.removeEventListener){
			node.removeEventListener(type,listener,false);
			return true;
		}else if(node.detachEvent){
			node.detachEvent('on'+type,node[type+listener]);
			node[type+listener]=null;
			return true;
		}
		return false;
	};
	window['ADS']['removeEvent']=removeEvent;
	function getElementsByClassName(className,tag,parent){
		parent=parent||document;
		if(!(parent=$(parent))){return false;}
		//查找所有匹配的标签
		var allTags=(tag=='*' && parent.all)?parent.all:parent.getElementsByTagName(tag);
		var matchingElements=[];
		//创建一正则表达式，来判断className是否正确
		className=className.replace(/\-/g,'\\-');
		var regex=new RegExp('(^|\\s)'+className+'(\\s|$)');
		var element;

		//检查每一个元素
		for(var i=0,len=allTags.length;i<len;i++){
			element=allTags[i];
			if(regex.test(element.className)){
				matchingElements.push(element);
			}
		}
		//返回任何匹配的元素
		return matchingElements;
	};
	window['ADS']['getElementsByClassName']=getElementsByClassName;
	function toggleDisplay(node,value){
		if(!(node=$(node))){return false;}
		if (node.style.display !='none'){
			node.style.display='none';
		}else{
			node.style.display=value||'';
		}
		return true;
	};
	window['ADS']['toggleDisplay']=toggleDisplay;
	function insertAfter(node,referenceNode){
		if(!(node=$(node))){return false;}
		if(!(referenceNode=$(referenceNode))){return false;}
		return referenceNode.parentNode.insertBefore(node,referenceNode.nextSibling);
	};
	window['ADS']['insertAfter']=insertAfter;
	function removeChildren(parent){
		if(!(parent=$(parent))){return false;}
		//当存在子节点时删除该子切点
		while(parent.firstChild){
			parent.firstChild.parentNode.removeChild(parent.firstChild);
		}
		//再返回父元素，以便实现方法链式调用
		return parent;
	};
	window['ADS']['removeChildren']=removeChildren;
	function prependChild(parent,newChild){
		if(!(parent=$(parent))){return false;}
		if(!(newChild=$(newChild))){return false;}
		if(parent.firstChild){
			//如果存在一个子节点，则在这个子节点之前插入
			parent.insertBefore(newChild,parent.firstChild);
		}else{
			//如果没有子节点则直接添加
			parent.appendChild(newChild);
		}
		//再返回父元素，以便实现方法链式调用
		return parent;
	};
	window['ADS']['prependChild']=prependChild;
	function bindFunction(obj,func){
		return function(){
			func.apply(obj,arguments);
		}
	};
	window['ADS']['bindFunction']=bindFunction;
	function getBrowserWindowSize(){
		var de= document.documentElement;
		return {
			width:(window.innerWidth||(de && de.clientWidth)||document.body.clientWidth),
			height:(window.innerHeight||(de && de.clientHeight)||document.body.clientHeight)
		};
	};
	window['ADS']['getBrowserWindowSize']=getBrowserWindowSize;
	function camelize(s){
		return s.replace(/-(\w)/g,function(strMatch,p1){
			return p1.toUpperCase();
		});
	};
	window['ADS']['camelize']=camelize;

	if(!String.prototype.repeat){
		String.prototype.repeat=function(l){
			return new Array(l+1).join(this);
		}
	}

	if(!String.prototype.trim){
		String.prototype.trim=function(){
			return this.replace(/^\s+|\s+$/g,'');
		}
	};
	window['ADS']['node']={
		ELEMENT_NODE:1,
		ATTRIBUTE_NODE:2,
		TEXT_NODE:3,
		CDATA_NODE:4,
		ENTITY_REFERENCE_NODE:5,
		ENTITY_NODE:6,
		PROCESSING_INSTRUCTION_NODE:7,
		COMMENT_NODE:8,
		DOCUMENT_NODE:9,
		DOCUMENT_TYPE_NODE:10,
		DOCUMENT_FRAGMENT_NODE:11,
		NOTATION_NODE:12
	};

	function walkElementsLinear(func,node){
		var root=node||window.document;
		var nodes=root.getElementsByTagName('*');
		for(var i=0;i<nodes.length;i++){
			func.call(nodes[i]);
		}
	};
	window['ADS']['walkElementsLinear']=walkElementsLinear;

	function walkTheDOMRecursive(func,node,depth,returnedFromParent){
		var root=node||window.document;
		returnedFromParent=func.call(root,depth++,returnedFromParent);
		var node=root.firstChild;
		while(node){
			walkTheDOMRecursive(func,node,depth,returnedFromParent);
			node=node.nextSibling;
		}
	};
	window['ADS']['walkTheDOMRecursive']=walkTheDOMRecursive;

	function walkTheDOMWithAttributes(node,func,depth,returnedFromParent){
		var root=node||window.document;
		returnedFromParent=func.call(root,depth++,returnedFromParent);
		if(root.attrbutes){
			for(var i=0;i<root.attrbutes.length;i++){
				walkTheDOMWithAttributes(root.attrbutes[i],func,depth-1,returnedFromParent);
			}
		}
		if(root.nodeType!=ADS.node.ATTRIBUTE_NODE){
			node=root.firstChild;
			while(node){
				walkTheDOMWithAttributes(node,func,depth,returnedFromParent);
				node=node.nextSibling;
			}
		}
	};
	window['ADS']['walkTheDOMWithAttributes']=walkTheDOMWithAttributes;
	function addLoadEvent(loadEvent,waitForImages){
		if(!isComparible()){return false;}
		//如果等待标记是true则使用常规的添加事件的方法
		if(waitForImages){
			return addEvent(window,'load',loadEvent);
		}
		//否则使用一些不同的方式包装loadEvent()方法，以便为this关键字指定正确的内容，
		//同时确保事件不会被招待两次
		var init =function(){
			//如果这个函数已经被调用过了则返回
			if(arguments.callee.done)return;
			//标记这个函数以便检验它是否运行过
			arguments.callee.done=true;
			//在document的环境中运行载入事件
			loadEvent.apply(document,arguments);
		};
		//为DOMContentLoaded事件注册事件侦听器
		if(document.addEventListener){
			document.addEventListener('DOMContentLoaded',init,false);
		}
		//对于Safari,使用setInterval()函数检测document是否载入完成
		if(/webkit/i.test(navigator.userAgent)){
			var _timer=setInterval(function(){
				if(/loaded|complete/.test(document.readyState))	{
					clearInterval(_timer);
					init();
				}
			},10);
		}
		//对于IE，附加一个在载入过程最后招待的脚本，并检测该脚本是否载入完成
		/*@cc_on @*/
		/*if (@_win32)
		  document.write('<script id="__ie_onload" defer src="javascript:void(0)" type="text/javascript"><\/script>');
		  var script=document.getElementById('__ie_onload');
		  script.onreadystatechange=function(){
		  if(this.readyState=='complete'){
		  init();
		  }
		  }
		/*@end @*/
		return true;
	};
	window['ADS']['addLoadEvent']=addLoadEvent;
	function stopPropagetion(eventObject){
		eventObject=eventObject||getEventObject(eventObject);
		if(eventObject.stopPropagetion){
			eventObject.stopPropagetion();
		}else{
			eventObject.cancelBubble=true;
		}
	};
	window['ADS']['stopPropagetion']=stopPropagetion;
	function preventDefault(eventObject){
		eventObject=eventObject||getEventObject(eventObject);
		if(eventObject.preventDefault){
			eventObject.preventDefault();
		}else{
			eventObject.returnValue=false;
		}
	};
	window['ADS']['preventDefault']=preventDefault;
	function getEventObject(W3CEvent){
		return W3CEvent||window.event;
	};
	window['ADS']['getEventObject']=getEventObject;
	function getTarget(eventObject){
		eventObject=eventObject||getEventObject(eventObject);
		//如果是W3C或MSIE的模型
		var target=eventObject.target||eventObject.srcElement;
		//如果像Safari中一样是一个文本节点
		//重新将目标对象指定为父元素
		if(target.nodeType==ADS.TEXT_NODE){
			target= node.parentNode;
		}
		return target;
	};
	window['ADS']['getTarget']=getTarget;
	function getMouseButton(eventObject){
		eventObject=eventObject||getEventObject(eventObject);
		//使用适当的属性初始化一个对象变量
		var buttons={
			left:false,
			middle:false,
			right:false
		};
		//检查eventObject对象的toString()方法的值
		//W3C DOM 对象有toString方法并且此时该方法返回值应该是MouseEvent
		if(eventObject.toString && eventObject.toString().indexOf('MouseEvent')!=-1){
			//W3C方法
			switch(eventObject.button){
				case 0:buttons.left=true;break;
				case 1:buttons.middle=true;break;
				case 2:buttons.right=true;break;
				default:break;
			}
		}else if(eventObject.button){
			switch(eventObject.button){
				case 1:buttons.left=true;break;
				case 2:buttons.right=true;break;
				case 3:
				       buttons.left=true;
				       buttons.right=true;
				       break;
				case 4:button.middle=true;break;
				case 5:
				       buttons.left=true;
				       buttons.middle=true;
				       break;
				case 6:
				       buttons.middle=true;
				       buttons.right=true;
				       break;
				case 7:
				       buttons.left=true;
				       buttons.middle=true;
				       buttons.right=true;
				       break;
				default:break;
			}
		}else{
			return false;
		}
	return buttons;	
	};
	window['ADS']['getMouseButton']=getMouseButton;
	function getPointerPositionInDocument(eventObject){
		eventObject=eventObject||getEventObject(eventObject);
		var x=eventObject.pageX||(eventObject.clientX+(document.documentElement.scrollLeft||document.body.scrollLeft));
		var y=eventObject.pageY||(eventObject.clientY+(document.documentElement.scrollTop||document.body.scrollTop));
		//现在x和y中包含着鼠标相对于文档原点的坐标
		return {x:x,y:y}; 
	};
	window['ADS']['getPointerPositionInDocument']=getPointerPositionInDocument;
	function getKeyPressed(eventObject){
		eventObject=eventObject||getEventObject(eventObject);
		var code= eventObject.keyCode;
		var value=String.fromCharCode(code);
		return {code:code,value:value};
	};
	window['ADS']['getKeyPressed']=getKeyPressed;
	function setStyleById(element,styles){
		//取得对象的引用
		if(!(element=$(element)))return;
		var property;
		for(property in styles){
			if(!styles.hasOwnProperty(property))continue;
			if(element.style.setProperty){
				//DOM2样式规范方法
				element.style.setProperty(uncamelize(property,'-'),styles[property],null);
			}else{
				//备用方法
				element.style[camelize(property)]=styles[property];
			}
		}
		return true; 
	};
	window['ADS']['setStyle']=setStyle;
	window['ADS']['setStyleById']=setStyleById;
	/*通过类名修改多个元素的样式*/
	function setStylesByClassName(paraen,tag,className,styles){
		if(!(parent=$(parent)))return false;
		var elements=parent.getElementsByClassName(className,tag,parent);
		for(var e=0;e<elements.length;e++){
			setStyleById(elements[0],styles);
		} 
	};
	window['ADS']['setStylesByClassName']=setStylesByClassName;
	/*通过标签名修改多个元素的样式*/
	function setStylesByTagName(tagname,styles,parent){
		parent=$(parent)||document;
		var elements=parent.getElementsByTagName(tagname);
		for(var e=0;e<elements.length;e++){
			setStyleById(elements[0],styles);
		} 
	};
	window['ADS']['setStylesByTagName']=setStylesByTagName;
	function getClassNames(element){
		if(!(element=$(element)))return false;
		//用一个空格替换多个空格
		//然后基于空格分割类名
		return element.className.replace(/\s+/,' ').split(' '); 
	};
	window['ADS']['getClassNames']=getClassNames;
	//检查元素中是否存在某个类
	function hasClassName(element,className){
		if(!(element=$(element)))return false;
		var classes=getClassNames(element);
		for(var i=0;e<classes.length;i++){
			//检测className是否匹配，如果是则返回true
			if(classes[i]===className){return true;}
		}
		return false; 
	};
	window['ADS']['hasClassName']=hasClassName;
	//为元素添加类
	function addClassName(element,className){
		if(!(element=$(element)))return false;
		//将类名添加到当前className的末尾
		//如果没有className，则不包含空格
		element.className+=(element.className?' ':'')+className;
		return true;
	};
	window['ADS']['addClassName']=addClassName; 
	//从元素中删除类
	function removeClassName(element,className){
		if(!(element=$(element)))return false;
		var classes=getClassNames(element);
		var length=classes.length;
		//循环遍历数组删除匹配的项因为从数组中删除项会使数组变短，所以要反向循环
		for(var i=length-1;i>=0;i--){
			if(classes[i]===className){delete(classes[i])} 
		}
		element.className=classes.join(' ');
		return length!==classes.length;
	};
	window['ADS']['removeClassName']=removeClassName; 
})()
