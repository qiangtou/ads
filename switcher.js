ADS.addEvent(window,'load',function(){
	//取得所有link元素
	var list=ADS.$('ul');
	var links=document.getElementsByTagName('link');
	var titles=[];
	for(var i=0;i<links.length;i++){
		//跳过不带title属性的<link>元素
		if(links[i].getAttribute('rel').indexOf('style')!=-1
		&& links[i].getAttribute('title')){
			//如果该样式表还未添加则向列表中添加一个新项
			var title=links[i].getAttribute('title');
			if(!titles[title]){
				var a= document.createElement('a');
				a.appendChild(document.createTextNode(title));
				a.setAttribute('href','#');
				a.setAttribute('title','Active '+title);
				a.setAttribute('rel',title);
				ADS.addEvent(a,'click',function(e){
					//当单击链接时激活锚的rel属性
					//中的标题所表示的样式表文件
					setActiveStyleSheet(this.getAttribute('rel'));
					ADS.preventDefault(e);
				});
				var li=document.createElement('li');
				li.appendChild(a);
				list.appendChild(li);
				//将titles数组中的这个标题项设置为true
				//以便在多个样式表使用相同标题时跳过
				titles[title]=true;
			}
		}
	}
});
function setActiveStyleSheet(title){
	var i,a,main;
	for(i=0;(a=document.getElementsByTagName('link')[i]);i++){
		if(a.getAttribute('rel').indexOf('style')!=-1
		&& a.getAttribute('title')){
			a.disabled=true;
			if(a.getAttribute('title')==title)a.disabled=false;
		}
	}
}
