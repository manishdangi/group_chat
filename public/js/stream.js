var webrtc = new SimpleWebRTC({  // created the webrtc object instance
	localVideoEl: 'sender', // the element that will hold our video
	remoteVideosEl: '', // the element that will hold remote video
	// to get camera and microphone access
        autoRequestMedia: true,
       	debug: false,
        detectSpeakingEvents: true,
 		autoAdjustMic: false
	});

    webrtc.on('localStream', function (stream) {  
        // when you get the local camera stream		
    });

    function showVolume(el, volume) 
    {
        if (!el) return;
        if (volume < -45) volume = -45; // -45 to -20 is
        if (volume > -20) volume = -20; // a good range
        el.value = volume;
    }

    webrtc.on('localMediaError', function (err) {
        
    });

    webrtc.on('videoAdded', function (video, peer) { // when a peer is added
        $("#sender").show();
        $("#local_volume").show();
        var peers = document.getElementById('peers');
        if (peers) {
            var video_container = document.createElement('div');
            video_container.className = 'peer_video_container';
            video_container.id = 'container_' + webrtc.getDomId(peer); 
                /* 
                    DomId is a special
                    and unique id  and  come to sender end when a peer is connected to detect 
                    the peer local video element
                */
            video_container.appendChild(video);
            peers.appendChild(video_container);

            // resize the video on click
            var vol = document.createElement('meter');
            vol.id = 'volume_' + peer.id;
            vol.className = 'volume';
            vol.min = -45;
            vol.max = -20;
            vol.low = -40;
            vol.high = -25;
            video_container.appendChild(vol);


            if(peer && peer.pc) 
            {
                peer.pc.on('iceConnectionStateChange', function (event) {
                    switch (peer.pc.iceConnectionState)
                    {
                    case 'checking'://while connecting to the peer
                        $("#connection_status").html('Connecting to peer...');
                        break;
                    case 'connected':
                        $("#connection_status").html('Connection Established');
                        break;   
                    case 'completed': //connection is fully established with the peers
                        $(vol).show();
                        $("#connection_status").html('Connection Established');
                        break;
                    case 'disconnected':
                        $("#connection_status").html('Disconnected.');
                            break;
                    case 'failed':
                        $("#connection_status").html('Connection failed please retry');
                            break;
                    case 'closed':
                            $("#connection_status").html('the user is no more available');
                            break;
                    }
                });
            }                  
        }
    });

	webrtc.on('videoRemoved', function (video, peer) 
	{
    	var peers = document.getElementById('peers');
    	var peer_video = document.getElementById('container_' + webrtc.getDomId(peer));
    	if (peers && peer_video)
    	{
        		peers.removeChild(peer_video);
    	}
	});	
