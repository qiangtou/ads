ADS.addEvent(window,'load',function(){
	//ȡ������linkԪ��
	var list=ADS.$('ul');
	var links=document.getElementsByTagName('link');
	var titles=[];
	for(var i=0;i<links.length;i++){
		//��������title���Ե�<link>Ԫ��
		if(links[i].getAttribute('rel').indexOf('style')!=-1
		&& links[i].getAttribute('title')){
			//�������ʽ��δ��������б������һ������
			var title=links[i].getAttribute('title');
			if(!titles[title]){
				var a= document.createElement('a');
				a.appendChild(document.createTextNode(title));
				a.setAttribute('href','#');
				a.setAttribute('title','Active '+title);
				a.setAttribute('rel',title);
				ADS.addEvent(a,'click',function(e){
					//����������ʱ����ê��rel����
					//�еı�������ʾ����ʽ���ļ�
					setActiveStyleSheet(this.getAttribute('rel'));
					ADS.preventDefault(e);
				});
				var li=document.createElement('li');
				li.appendChild(a);
				list.appendChild(li);
				//��titles�����е��������������Ϊtrue
				//�Ա��ڶ����ʽ��ʹ����ͬ����ʱ����
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
