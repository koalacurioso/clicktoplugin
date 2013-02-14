addKiller("RaiTv", {
   
   "canKill": function(data) {
      if(data.type !== "application/x-silverlight") return false;
      return data.src.indexOf("http://www.rai.tv/") !== -1;
   },

   "process": function(data, callback) {
      	var slvars = parseSLVariables(data.params.initparams);	
		this.directLink(data.location, callback);
   },

	"directLink": function(url, callback){
		var publishingblock = /PublishingBlock-(.*).html?/.exec(url);
		var videourl_mp4 = "";
		if(publishingblock){
			switch(publishingblock[1]){
				case "eedb4649-b6c4-4892-a5a9-e2ca63b54bd8":
					videourl_mp4 = "http://mediapolis.rai.it/relinker/relinkerServlet.htm?cont=308709&output=23";
					break;
			}
		}
		
		if(videourl_mp4 == ""){
			this.processXML(url, callback);
		}else{
			callback({
		         "playlist": [{
					"poster": "",
		            "sources": [{
		               "url": videourl_mp4,
		               "isNative": true
		            }]
		         }]
		      });
		}
	},

	"processXML": function(url, callback) {
		var xhr = new XMLHttpRequest();
		xhr.open("GET", url);
		xhr.addEventListener("load", function() {
			var videourl_mp4 = /<meta name="videourl_mp4" content="(.*)"/.exec(xhr.responseText);
			if(!videourl_mp4){
				videourl_mp4 = /"h264": "(.*)"/.exec(xhr.responseText);
			}	
			var poster = /div data-cloud.*data-img="(.*)" d/.exec(xhr.responseText);
			callback({
			         "playlist": [{
			            "poster": poster[1],
			            "sources": [{
			               "url": videourl_mp4[1],
			               "isNative": true
			            }]
			         }]
			      });
		},false);
		xhr.send();
	}
});