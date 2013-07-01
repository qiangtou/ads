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
	}
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
	}
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
	}
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
	}
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
	}
	window['ADS']['getElementsByClassName']=getElementsByClassName;
	function toggleDisplay(node,value){
		if(!(node=$(node))){return false;}
		if (node.style.display !='none'){
			node.style.display='none';
		}else{
			node.style.display=value||'';
		}
		return true;
	}
	window['ADS']['toggleDisplay']=toggleDisplay;
	function insertAfter(node,referenceNode){
		if(!(node=$(node))){return false;}
		if(!(referenceNode=$(referenceNode))){return false;}
		return referenceNode.parentNode.insertBefore(node,referenceNode.nextSibling);
	}
	window['ADS']['insertAfter']=insertAfter;
	function removeChildren(parent){
		if(!(parent=$(parent))){return false;}
		//当存在子节点时删除该子切点
		while(parent.firstChild){
			parent.firstChild.parentNode.removeChild(parent.firstChild);
		}
		//再返回父元素，以便实现方法链式调用
		return parent;
	}
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
	}
	window['ADS']['prependChild']=prependChild;
	function bindFunction(obj,func){
		return function(){
			func.apply(obj,arguments);
		}
	}
	window['ADS']['bindFunction']=bindFunction;
	function getBrowserWindowSize(){
		var de= document.documentElement;
		return {
			width:(window.innerWidth||(de && de.clientWidth)||document.body.clientWidth),
			height:(window.innerHeight||(de && de.clientHeight)||document.body.clientHeight)
		};
	}
	window['ADS']['getBrowserWindowSize']=getBrowserWindowSize;
	function camelize(s){
		return s.replace(/-(\w)/g,function(strMatch,p1){
			return p1.toUpperCase();
		});
	}
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
	}
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
	}
	window['ADS']['walkElementsLinear']=walkElementsLinear;

	function walkTheDOMRecursive(func,node,depth,returnedFromParent){
		var root=node||window.document;
		returnedFromParent=func.call(root,depth++,returnedFromParent);
		var node=root.firstChild;
		while(node){
			walkTheDOMRecursive(func,node,depth,returnedFromParent);
			node=node.nextSibling;
		}
	}
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
	}
	window['ADS']['walkTheDOMWithAttributes']=walkTheDOMWithAttributes;
})()
