(function(){
	function encode(str){
		if(!str){return null;}
		return str.replace(/\\/g,'\\\\')
		.replace(/';/g,'\\\'')
		.replace(/\s+^/mg,'\\n');
	}
	function checkForVariable(v){
		if(v.indexOf('$')==-1){
			v='\''+v+'\'';
		}else{
			v=v.substring(v.indexOf('$')+1);
			requiredVariables+='var '+v+';\n';
		}
		return v;
	}

	var domCode='';
	var nodeNameCounters=[];
	var requiredVariables='';
	var newVariables='';

	function generate(strHTML,strRoot){
		//将HTML代码添加到页面主体中，以便能够遍历相应的DOM树
		var domRoot=document.createElement('div');
		domRoot.innerHTML=strHTML;

		//重置变量
		domCode='';
		nodeNameCounters=[];
		newVariables='';

		//使用processNode处理domRoot中的所有子节点
		var node=domRoot.firstChild;
		while(node){
			ADS.walkTheDOMRecursive(processNode,node,0,strRoot);
			node=node.nextSibling;
		}
		//输出生成的代码
		domCode='/* requiredVariables in this code\n'+requiredVariables+'*/\n\n'
		+domCode+'\n\n'
		+'/* new objects in this code\n'+newVariables+'*/\n\n';
		return domCode; 
	}
	function processAttribute(tabCount,refParent){ 
		//跳过文本节点
		if(this.nodeType!=ADS.node.ATTRIBUTE_NODE)return ;

		//取得属性值
		var attrValue=(this.nodeValue?encode(this.nodeValue.trim()):'');
		if(this.nodeName=='cssText')alert('true');
		//如果没有值则返回
		if(!attrValue)return ;
		//确定缩进的级别
		var tabs=(tabCount?'\t'.repeat(parseInt(tabCount)):'');
		//根据nodeName进行判断。除了class和style需要特殊注意以外，所有类型都可以按常规来处理
		switch(this.nodeName){
			default:
				if(this.nodeName.substring(0,2)=='on'){
					domCode+=tabs+refParent+'.'+this.nodeName+'= funciotn(){'+attrValue+'}\n';
				}else{
					//对于其他情况则使用setAttribute
					domCode+=tabs+refParent+'.setAttribute(\''+this.nodeName+'\','
							+checkForVariable(attrValue)+');\n';
				}
				break;
			case 'class':
				//使用className属性为class赋值
				domCode+=tabs+refParent+'.className=' +checkForVariable(attrValue)+';\n';
				break;
			case 'style':
				//使用表达式基于；和邻近的空格符来分割样式属性的值
				var style=attrValue.split(/\s*;\s*/);
				if(style){
					for(pair in style){
						if(!style[pair])continue;
						//使用表达式基于:和邻近的空格符来分割样式属性的值
						var prop=attrValue.split(/\s*:\s*/);
						if(!prop[1])continue;

						//将css-property格式的css属性转换为cssProperty格式
						prop[0]=ADS.camelize(prop[0]);

						var propValue=checkForVariable(prop[1]);
						if(prop[0]=='float'){
							//float是保留字，因此属特殊情况
							//cssFloat是标准的属性
							//styleFloat是IE使用的悟性
							domCode+=tabs+refParent
								+'.style.cssFloat ='
								+propValue+';\n';
							domCode+=tabs+refParent
								+'.style.styleFloat ='
								+propValue+';\n';
						}else{
							domCode+=tabs+refParent
								+'.style.'
								+prop[0]
								+'='
								+propValue+';\n';
						}
					}
				}
				break;
		}
	}

	function processNode(tabCount,refParent){
		var tabs=(tabCount?'\t'.repeat(parseInt(tabCount)):'');
		switch(this.nodeType){
			case ADS.node.ELEMENT_NODE:
				if(nodeNameCounters[this.nodeName]){
					++nodeNameCounters[this.nodeName];
				}else{
					nodeNameCounters[this.nodeName]=1;
				}
				var ref=this.nodeName.toLowerCase()+nodeNameCounters[this.nodeName];
				domCode+=tabs+'var '+ref+' =document.createElement(\'' +this.nodeName+'\');\n';
				newVariables+=''+ref+';\n';

				if(this.attributes){
					for(var i=0;i<this.attributes.length;i++){
						ADS.walkTheDOMRecursive(processAttribute,this.attributes[i],tabCount,ref);
					}
				}
				break;
			case ADS.node.TEXT_NODE:
				var value=(this.nodeValue?encode(this.nodeValue.trim()):'');
				if(value){
					if(nodeNameCounters['txt']){
						++nodeNameCounters['txt'];
					}else{
						nodeNameCounters['txt']=1;
					}

					var ref ='txt'+nodeNameCounters['txt'];
					value=checkForVariable(value);
					domCode+=tabs+'var '+ref+' =document.createTextNode('+value+');\n';
					newVariables+=''+ref+';\n';
				}else{
					return ;
				}
				break;
			default:break;
		}
		if(refParent){
			domCode+=tabs+refParent+'.appendChild('+ref+');\n';
		}
		return ref;
	}
	window['generateDOM']=generate;
})();
