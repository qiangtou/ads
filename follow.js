ADS.addEvent(window,'load',function(){
	//定义要移动的对象
	var object=document.getElementById('follow');
	//主其进行绝对定位
	object.style.position='absolute';
	//主文档的mousemove事件创建事件侦听器
	function eventListener(W3CEvent){
	var pointer=ADS.getPointerPositionInDocument(W3CEvent);
	//相对于鼠标指针定位对象
	object.style.left=pointer.x-15+'px';
	object.style.top=pointer.y+15+'px';
	}
	ADS.addEvent(document,'mousemove',eventListener);
})
