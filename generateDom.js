(function(){
	function encode(str){
		if(!str){return null;}
		return str.replace(/\\/g,'\\\\')
		.replace(/';/g,'\\\'')
		.replace(/\s+^/mg,'\\n');
	}
	function checkForVariable(){
		if(v.indexOf('$')==-1){
			v='\''+v+'\'';
		}else{
			v=v.substring(v.indexOf('$')+1);
			requiredVariables+='var '+v+';\n';
		}
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
		nodeNameCounters='';
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
	
	}

	function processNode(tabCount,refParent){
		var tabs=(tabCount?'\t'.repeat(parentInt(tabCout)):'');
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

				if(this.attrbutes){
					for(var i=0;i<this.attrbutes.length;i++){
						ADS.walkTheDOMRecursive(processAttribute,this.attrbutes[i],tabCount,ref);
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
