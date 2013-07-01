ADS.addEvent(window,'load',function(){
	ADS.log.header('testNodeName');	
	ADS.log.write('nodeName is :'+document.getElementById('firefox').nodeName);
});
ADS.addEvent(window,'load',function(){
	ADS.log.header('List child nodes of the document body');	
	for(var i=0;i<document.body.childNodes.length;i++){
		ADS.log.write(document.body.childNodes.item(i).nodeName);
		//ADS.log.write(document.body.childNodes[i].nodeName);
	}
});
ADS.addEvent(window,'load',function(){
	ADS.log.header('Attributes');	
	var a=document.getElementById('firefox');
	for(var i=0;i<a.attributes.length;i++){
	ADS.log.write(a.attributes.item(i).nodeName+'='+a.attributes.item(i).nodeValue);
	}
});

ADS.addEvent(window,'load',function(){
	ADS.log.header('Attributes And ChildNodes');	
	var h2=document.getElementsByTagName('h2')[0];
	ADS.log.write(h2.nodeName);
	ADS.log.write(h2.nodeName+' hasChildNodes: '+h2.hasChildNodes.length);
	ADS.log.write(h2.nodeName+' childNodes: '+h2.childNodes);
	ADS.log.write(h2.nodeName+' number of childNodes '+h2.childNodes.length);
	ADS.log.write(h2.nodeName+' attributes: '+h2.attributes);
	ADS.log.write(h2.nodeName+' number of attributes '+h2.attributes.length);
	//在ie下出错
	ADS.log.write(h2.nodeName+' hasAttributes: '+h2.hasAttributes());

});
ADS.addEvent(window,'load',function(){
	ADS.log.header('Clone and Move a Node');	
	var l=document.getElementById('firefoxListItem');
	var p=l.parentNode;
	p.appendChild(l);
	ADS.log.write('');
});
