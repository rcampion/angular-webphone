import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import SIPml from 'ecmascript-webrtc-sipml';

@Component({
	selector: 'app-call',
	templateUrl: './call.component.html',
	styleUrls: ['./call.component.scss']
})
export class CallComponent implements OnInit, AfterViewInit {

	public callForm: FormGroup;

	sTransferNumber;
	oRingTone;
	oRingbackTone;
	oSipStack;
	oSipSessionRegister;
	oSipSessionCall;
	oSipSessionTransferCall;
	videoRemote;
	videoLocal;
	audioRemote;
	bFullScreen = false;
	oNotifICall;
	bDisableVideo = false;
	viewVideoLocal;
	viewVideoRemote;
	viewLocalScreencast; // <video> (webrtc) or <div> (webrtc4all)
	oConfigCall;
	oReadyStateTimer;

	ringtone; ringbacktone;

	constructor() {
		this.ringtone = document.getElementById("ringtone");
		this.ringbacktone = document.getElementById("ringbacktone");

	}

	ngOnInit(): void {
		this.callForm = new FormGroup({
			txtDisplayName: new FormControl(''),
			txtPrivateIdentity: new FormControl(''),
			txtPublicIdentity: new FormControl(''),
			txtPassword: new FormControl(''),
			txtRealm: new FormControl(''),
			txtPhoneNumber: new FormControl(''),
		});

		// set debug level
		SIPml.setDebugLevel((window.localStorage && window.localStorage.getItem('org.doubango.expert.disable_debug') == "true") ? "error" : "info");

		this.loadCredentials();
		this.loadCallOptions()
		/*
				this.oReadyStateTimer = setInterval(function() {
					if (document.readyState === "complete") {
						clearInterval(this.oReadyStateTimer);
						// initialize SIPML5
						this.init();
					}
				},
					500);
					
					
		*/
	}
	
	ngAfterViewInit(): void {
		this.init();
	}

	sipRegister = () => {
		try {
			// enable notifications if not already done
			// if (window.webkitNotifications && window.webkitNotifications.checkPermission() != 0) {
			//     window.webkitNotifications.requestPermission();
			// }

			Notification.requestPermission();
			// save credentials
			//this.saveCredentials();

			// update debug level to be sure new values will be used if the user haven't updated the page
			SIPml.setDebugLevel((window.localStorage && window.localStorage.getItem('org.doubango.expert.disable_debug') == "true") ? "error" : "info");

			let realm = "zdslogic.com";
			let impi = "test.user";
			let impu = "sip:test.user@zdslogic.com";
			let password = "Testing123+";
			let display_name = "ZdsLogic Technologies";
			let websocket_proxy_url = "wss://zdslogic.com:6089/ws";
			let outbound_proxy_url = "udp://zdslogic.com:5060";

			display_name = window.localStorage.getItem('org.doubango.identity.display_name');
			impi = window.localStorage.getItem('org.doubango.identity.impi');
			impu = window.localStorage.getItem('org.doubango.identity.impu');
			password = window.localStorage.getItem('org.doubango.identity.password');
			realm = window.localStorage.getItem('org.doubango.identity.realm');

			/*
						// create SIP stack
						this.oSipStack = new SIPml.Stack({
							realm: realm,
							impi: impi,
							impu: impu,
							password: password,
							display_name: display_name,
							websocket_proxy_url: websocket_proxy_url,
							outbound_proxy_url: outbound_proxy_url,//(window.localStorage ? window.localStorage.getItem('org.doubango.expert.sip_outboundproxy_url') : null),
							ice_servers: "",//(window.localStorage ? window.localStorage.getItem('org.doubango.expert.ice_servers') : null),
							enable_rtcweb_breaker: "",//(window.localStorage ? window.localStorage.getItem('org.doubango.expert.enable_rtcweb_breaker') == "true" : false),
							events_listener: { events: '*', listener: this.onSipEventStack },
							enable_early_ims: "",//(window.localStorage ? window.localStorage.getItem('org.doubango.expert.disable_early_ims') != "true" : true), // Must be true unless you're using a real IMS network
							enable_media_stream_cache: "",//(window.localStorage ? window.localStorage.getItem('org.doubango.expert.enable_media_caching') == "true" : false),
							//bandwidth: (window.localStorage ? tsk_string_to_object(window.localStorage.getItem('org.doubango.expert.bandwidth')) : null), // could be redefined a session-level
							//video_size: (window.localStorage ? tsk_string_to_object(window.localStorage.getItem('org.doubango.expert.video_size')) : null), // could be redefined a session-level
							sip_headers: [
								{ name: 'User-Agent', value: 'IM-client/OMA1.0 sipML5-v1.2016.03.04' },
								{ name: 'Organization', value: 'Doubango Telecom' }
							]
						}
						);
			*/

			// create SIP stack
			this.oSipStack = new SIPml.Stack({
				realm: realm,
				impi: impi,
				impu: impu,
				password: password,
				display_name: display_name,
				websocket_proxy_url: (window.localStorage ? window.localStorage.getItem('org.doubango.expert.websocket_server_url') : null),
				outbound_proxy_url: (window.localStorage ? window.localStorage.getItem('org.doubango.expert.sip_outboundproxy_url') : null),
				ice_servers: (window.localStorage ? window.localStorage.getItem('org.doubango.expert.ice_servers') : null),
				enable_rtcweb_breaker: (window.localStorage ? window.localStorage.getItem('org.doubango.expert.enable_rtcweb_breaker') == "true" : false),
				events_listener: { events: '*', listener: this.onSipEventStack },
				enable_early_ims: (window.localStorage ? window.localStorage.getItem('org.doubango.expert.disable_early_ims') != "true" : true), // Must be true unless you're using a real IMS network
				enable_media_stream_cache: (window.localStorage ? window.localStorage.getItem('org.doubango.expert.enable_media_caching') == "true" : false),
				//bandwidth: (window.localStorage ? tsk_string_to_object(window.localStorage.getItem('org.doubango.expert.bandwidth')) : null), // could be redefined a session-level
				//video_size: (window.localStorage ? tsk_string_to_object(window.localStorage.getItem('org.doubango.expert.video_size')) : null), // could be redefined a session-level
				sip_headers: [
					{ name: 'User-Agent', value: 'IM-client/OMA1.0 sipML5-v1.2016.03.04' },
					{ name: 'Organization', value: 'Doubango Telecom' }
				]
			}
			);
			//SIPml.sipRegister(this.oSipStack);

			if (this.oSipStack.start() != 0) {
				console.log('<b>Failed to start the SIP stack</b>');
			}
			else return;

		}
		catch (e) {
			console.log("<b>2:" + e + "</b>");
		}
		//btnRegister.disabled = false;

	}

	sipTransfer = () => {
		if (this.oSipSessionCall) {
			var s_destination = prompt('Enter destination number', '');
			//if (!tsk_string_is_null_or_empty(s_destination)) {
			//btnTransfer.disabled = true;
			if (this.oSipSessionCall.transfer(s_destination) != 0) {
				console.log('<i>Call transfer failed</i>');
				//btnTransfer.disabled = false;
				return;
			}
			console.log('<i>Transfering the call...</i>');
			//}
		}
	}

	sipCall(s_type) {

		let audioRemote = document.getElementById("audio_remote");
		this.oConfigCall = {
			audio_remote: audioRemote,
			video_local: null,
			video_remote: null,
			screencast_window_id: 0x00000000, // entire desktop
			bandwidth: { audio: undefined, video: undefined },
			video_size: { minWidth: undefined, minHeight: undefined, maxWidth: undefined, maxHeight: undefined },
			events_listener: { events: '*', listener: this.onSipEventSession },
			sip_caps: [
				{ name: '+g.oma.sip-im' },
				{ name: 'language', value: '\"en,fr\"' }
			]
		};
		//if (this.oSipStack && !this.oSipSessionCall && !tsk_string_is_null_or_empty(txtPhoneNumber.value)) {

		if (this.oSipStack && !this.oSipSessionCall) {

			if (s_type == 'call-screenshare') {
				if (!SIPml.isScreenShareSupported()) {
					alert('Screen sharing not supported. Are you using chrome 26+?');
					return;
				}
				if (!location.protocol.match('https')) {
					if (confirm("Screen sharing requires https://. Do you want to be redirected?")) {
						this.sipUnRegister();
						window.location.href = 'https://ns313841.ovh.net/call.htm';
					}
					return;
				}
			}
			//btnCall.disabled = true;
			//btnHangUp.disabled = false;

			if (window.localStorage) {
				//oConfigCall.bandwidth = tsk_string_to_object(window.localStorage.getItem('org.doubango.expert.bandwidth')); // already defined at stack-level but redifined to use latest values
				//oConfigCall.video_size = tsk_string_to_object(window.localStorage.getItem('org.doubango.expert.video_size')); // already defined at stack-level but redifined to use latest values
			}

			// create call session
			this.oSipSessionCall = this.oSipStack.newSession(s_type, this.oConfigCall);
			// make call
			let phoneNumber = this.callForm.controls['txtPhoneNumber'].value;

			if (this.oSipSessionCall.call(phoneNumber) != 0) {
				this.oSipSessionCall = null;
				//txtCallStatus.value = 'Failed to make call';
				console.log('Failed to make call');

				//btnCall.disabled = false;
				//btnHangUp.disabled = true;
				return;
			}
			//saveCallOptions();
		}
		else if (this.oSipSessionCall) {
			//txtCallStatus.innerHTML = '<i>Connecting...</i>';
			console.log('<i>Connecting...</i>');

			this.oSipSessionCall.accept(this.oConfigCall);
		}
	}
	/*	
		// makes a call (SIP INVITE)
		sipCall = (s_type) => {
			let audioRemote = document.getElementById("audio_remote");
			this.oConfigCall = {
				audio_remote: audioRemote,
				video_local: null,
				video_remote: null,
				screencast_window_id: 0x00000000, // entire desktop
				bandwidth: { audio: undefined, video: undefined },
				video_size: { minWidth: undefined, minHeight: undefined, maxWidth: undefined, maxHeight: undefined },
				events_listener: { events: '*', listener: this.onSipEventSession },
				sip_caps: [
					{ name: '+g.oma.sip-im' },
					{ name: 'language', value: '\"en,fr\"' }
				]
			};
	
			if (this.oSipStack && !this.oSipSessionCall) {
				if (s_type == 'call-screenshare') {
					if (!SIPml.isScreenShareSupported()) {
						alert('Screen sharing not supported. Are you using chrome 26+?');
						return;
					}
					if (!location.protocol.match('https')) {
						if (confirm("Screen sharing requires https://. Do you want to be redirected?")) {
							this.sipUnRegister();
							//window.location = 'https://ns313841.ovh.net/call.htm';
						}
						return;
					}
				}
				//btnCall.disabled = true;
				//btnHangUp.disabled = false;
	
				if (window.localStorage) {
					//oConfigCall.bandwidth = tsk_string_to_object(window.localStorage.getItem('org.doubango.expert.bandwidth')); // already defined at stack-level but redifined to use latest values
					//oConfigCall.video_size = tsk_string_to_object(window.localStorage.getItem('org.doubango.expert.video_size')); // already defined at stack-level but redifined to use latest values
				}
				debugger;
	
				// create call session
				this.oSipSessionCall = this.oSipStack.newSession(s_type, this.oConfigCall);
				// make call
				let phoneNumber = this.callForm.controls['txtPhoneNumber'].value;
				if (this.oSipSessionCall.call(phoneNumber) != 0) {
					this.oSipSessionCall = null;
					console.log('Failed to make call');
					//btnCall.disabled = false;
					//btnHangUp.disabled = true;
					return;
				}
				//saveCallOptions();
			}
			else if (this.oSipSessionCall) {
				console.log('<i>Connecting...</i>');
				this.oSipSessionCall.accept(this.oConfigCall);
			}
		}
	*/
	sipUnRegister = () => {
		if (this.oSipStack) {
			this.oSipStack.stop(); // shutdown all sessions
		}
	}

	sipHangUp = () => {
		if (this.oSipSessionCall) {
			console.log('<i>Terminating the call...</i>');
			this.oSipSessionCall.hangup({ events_listener: { events: '*', listener: this.onSipEventSession } });
		}
	}

	sipToggleMute = () => {
		if (this.oSipSessionCall) {
			var i_ret;
			var bMute = !this.oSipSessionCall.bMute;
			//txtCallStatus.innerHTML = bMute ? '<i>Mute the call...</i>' : '<i>Unmute the call...</i>';
			i_ret = this.oSipSessionCall.mute('audio'/*could be 'video'*/, bMute);
			if (i_ret != 0) {
				//txtCallStatus.innerHTML = '<i>Mute / Unmute failed</i>';
				return;
			}
			this.oSipSessionCall.bMute = bMute;
			//btnMute.value = bMute ? "Unmute" : "Mute";
		}
	}

	startRingTone = () => {

		try { this.ringtone.play(); }
		catch (e) { }
	}

	stopRingTone = () => {
		try { this.ringtone.pause(); }
		catch (e) { }
	}

	startRingbackTone = () => {
		try { this.ringbacktone.play(); }
		catch (e) { }
	}

	stopRingbackTone = () => {
		try { this.ringbacktone.pause(); }
		catch (e) { }
	}

	onSipEventStack = (e) => {
		console.log('==stack event = ' + e.type);
		switch (e.type) {
			case 'started':
				{
					// catch exception for IE (DOM not ready)
					try {
						// LogIn (REGISTER) as soon as the stack finish starting
						this.oSipSessionRegister = this.oSipStack.newSession('register', {
							expires: 200,
							events_listener: { events: '*', listener: this.onSipEventSession },
							sip_caps: [
								{ name: '+g.oma.sip-im', value: null },
								//{ name: '+sip.ice' }, // rfc5768: FIXME doesn't work with Polycom TelePresence
								{ name: '+audio', value: null },
								{ name: 'language', value: '\"en,fr\"' }
							]
						});
						this.oSipSessionRegister.register();
					}
					catch (e) {
						console.log("<b>1:" + e + "</b>");
						//btnRegister.disabled = false;
					}
					break;
				}
			case 'stopping': case 'stopped': case 'failed_to_start': case 'failed_to_stop':
				{
					var bFailure = (e.type == 'failed_to_start') || (e.type == 'failed_to_stop');
					this.oSipStack = null;
					this.oSipSessionRegister = null;
					this.oSipSessionCall = null;

					//uiOnConnectionEvent(false, false);

					this.stopRingbackTone();
					this.stopRingTone();

					//uiVideoDisplayShowHide(false);
					//divCallOptions.style.opacity = 0;

					//txtCallStatus.innerHTML = '';
					console.log(bFailure ? "<i>Disconnected: <b>" + e.description + "</b></i>" : "<i>Disconnected</i>")

					break;
				}

			case 'i_new_call':
				{
					if (this.oSipSessionCall) {
						// do not accept the incoming call if we're already 'in call'
						e.newSession.hangup(); // comment this line for multi-line support
					}
					else {
						this.oSipSessionCall = e.newSession;
						// start listening for events
						this.oSipSessionCall.setConfiguration(this.oConfigCall);

						alert("Answer / Reject")
						console.log("Answer / Reject")
						//uiBtnCallSetText('Answer');
						//btnHangUp.value = 'Reject';
						//btnCall.disabled = false;
						//btnHangUp.disabled = false;

						this.startRingTone();

						var sRemoteNumber = (this.oSipSessionCall.getRemoteFriendlyName() || 'unknown');
						console.log("<i>Incoming call from [<b>" + sRemoteNumber + "</b>]</i>");
						//showNotifICall(sRemoteNumber);
					}
					break;
				}

			case 'm_permission_requested':
				{
					//divGlassPanel.style.visibility = 'visible';
					break;
				}
			case 'm_permission_accepted':
			case 'm_permission_refused':
				{
					//divGlassPanel.style.visibility = 'hidden';
					if (e.type == 'm_permission_refused') {
						//uiCallTerminated('Media stream permission denied');
					}
					break;
				}

			case 'starting': default: break;
		}
	}

	onSipEventSession = (e) => {
		console.log('==session event = ' + e.type);

		switch (e.type) {
			case 'connecting': case 'connected':
				{
					var bConnected = (e.type == 'connected');
					if (e.session == this.oSipSessionRegister) {
						//uiOnConnectionEvent(bConnected, !bConnected);
						console.log("<i>" + e.description + "</i>");
					}
					else if (e.session == this.oSipSessionCall) {
						//btnHangUp.value = 'HangUp';
						//btnCall.disabled = true;
						//btnHangUp.disabled = false;
						//btnTransfer.disabled = false;
						//if (window.btnBFCP) window.btnBFCP.disabled = false;

						if (bConnected) {
							this.stopRingbackTone();
							this.stopRingTone();

							if (this.oNotifICall) {
								this.oNotifICall.cancel();
								this.oNotifICall = null;
							}
						}

						console.log("<i>" + e.description + "</i>");
						//divCallOptions.style.opacity = bConnected ? 1 : 0;

						if (SIPml.isWebRtc4AllSupported()) { // IE don't provide stream callback
							//uiVideoDisplayEvent(false, true);
							//uiVideoDisplayEvent(true, true);
						}
					}
					break;
				} // 'connecting' | 'connected'
			case 'terminating': case 'terminated':
				{
					if (e.session == this.oSipSessionRegister) {
						//uiOnConnectionEvent(false, false);

						this.oSipSessionCall = null;
						this.oSipSessionRegister = null;

						console.log("<i>" + e.description + "</i>");
					}
					else if (e.session == this.oSipSessionCall) {
						//uiCallTerminated(e.description);
					}
					break;
				} // 'terminating' | 'terminated'

			case 'm_stream_video_local_added':
				{
					if (e.session == this.oSipSessionCall) {
						//uiVideoDisplayEvent(true, true);
					}
					break;
				}
			case 'm_stream_video_local_removed':
				{
					if (e.session == this.oSipSessionCall) {
						//uiVideoDisplayEvent(true, false);
					}
					break;
				}
			case 'm_stream_video_remote_added':
				{
					if (e.session == this.oSipSessionCall) {
						//uiVideoDisplayEvent(false, true);
					}
					break;
				}
			case 'm_stream_video_remote_removed':
				{
					if (e.session == this.oSipSessionCall) {
						//uiVideoDisplayEvent(false, false);
					}
					break;
				}

			case 'm_stream_audio_local_added':
			case 'm_stream_audio_local_removed':
			case 'm_stream_audio_remote_added':
			case 'm_stream_audio_remote_removed':
				{
					break;
				}

			case 'i_ect_new_call':
				{
					this.oSipSessionTransferCall = e.session;
					break;
				}

			case 'i_ao_request':
				{
					if (e.session == this.oSipSessionCall) {
						var iSipResponseCode = e.getSipResponseCode();
						if (iSipResponseCode == 180 || iSipResponseCode == 183) {
							this.startRingbackTone();
							console.log('<i>Remote ringing...</i>');
						}
					}
					break;
				}

			case 'm_early_media':
				{
					if (e.session == this.oSipSessionCall) {
						this.stopRingbackTone();
						this.stopRingTone();
						console.log('<i>Early media started</i>');
					}
					break;
				}

			case 'm_local_hold_ok':
				{
					if (e.session == this.oSipSessionCall) {
						if (this.oSipSessionCall.bTransfering) {
							this.oSipSessionCall.bTransfering = false;
							// this.AVSession.TransferCall(this.transferUri);
						}
						//btnHoldResume.value = 'Resume';
						//btnHoldResume.disabled = false;
						//txtCallStatus.innerHTML = '<i>Call placed on hold</i>';
						this.oSipSessionCall.bHeld = true;
					}
					break;
				}
			case 'm_local_hold_nok':
				{
					if (e.session == this.oSipSessionCall) {
						this.oSipSessionCall.bTransfering = false;
						//btnHoldResume.value = 'Hold';
						//btnHoldResume.disabled = false;
						console.log('<i>Failed to place remote party on hold</i>');
					}
					break;
				}
			case 'm_local_resume_ok':
				{
					if (e.session == this.oSipSessionCall) {
						this.oSipSessionCall.bTransfering = false;
						//btnHoldResume.value = 'Hold';
						//btnHoldResume.disabled = false;
						//txtCallStatus.innerHTML = '<i>Call taken off hold</i>';
						this.oSipSessionCall.bHeld = false;

						if (SIPml.isWebRtc4AllSupported()) { // IE don't provide stream callback yet
							//uiVideoDisplayEvent(false, true);
							//uiVideoDisplayEvent(true, true);
						}
					}
					break;
				}
			case 'm_local_resume_nok':
				{
					if (e.session == this.oSipSessionCall) {
						this.oSipSessionCall.bTransfering = false;
						//btnHoldResume.disabled = false;
						console.log('<i>Failed to unhold call</i>')
					}
					break;
				}
			case 'm_remote_hold':
				{
					if (e.session == this.oSipSessionCall) {
						console.log('<i>Placed on hold by remote party</i>');
					}
					break;
				}
			case 'm_remote_resume':
				{
					if (e.session == this.oSipSessionCall) {
						console.log('<i>Taken off hold by remote party</i>');
					}
					break;
				}
			case 'm_bfcp_info':
				{
					if (e.session == this.oSipSessionCall) {
						console.log('BFCP Info: <i>' + e.description + '</i)>');
					}
					break;
				}

			case 'o_ect_trying':
				{
					if (e.session == this.oSipSessionCall) {
						console.log('<i>Call transfer in progress...</i>')
					}
					break;
				}
			case 'o_ect_accepted':
				{
					if (e.session == this.oSipSessionCall) {
						console.log('<i>Call transfer accepted</i>')
					}
					break;
				}
			case 'o_ect_completed':
			case 'i_ect_completed':
				{
					if (e.session == this.oSipSessionCall) {
						console.log('<i>Call transfer completed</i>')
						//btnTransfer.disabled = false;
						if (this.oSipSessionTransferCall) {
							this.oSipSessionCall = this.oSipSessionTransferCall;
						}
						this.oSipSessionTransferCall = null;
					}
					break;
				}
			case 'o_ect_failed':
			case 'i_ect_failed':
				{
					if (e.session == this.oSipSessionCall) {
						console.log('<i>Call transfer failed</i>');
						//btnTransfer.disabled = false;
					}
					break;
				}
			case 'o_ect_notify':
			case 'i_ect_notify':
				{
					if (e.session == this.oSipSessionCall) {
						console.log("<i>Call Transfer: <b>" + e.getSipRespo + " " + e.description + "</b></i>");
						if (e.getSipResponseCode() >= 300) {
							if (this.oSipSessionCall.bHeld) {
								this.oSipSessionCall.resume();
							}
							//btnTransfer.disabled = false;
						}
					}
					break;
				}
			case 'i_ect_requested':
				{
					if (e.session == this.oSipSessionCall) {
						var s_message = "Do you accept call transfer to [" + e.getTransferDestinationFriendlyName() + "]?";//FIXME
						if (confirm(s_message)) {
							console.log("<i>Call transfer in progress...</i>")
							this.oSipSessionCall.acceptTransfer();
							break;
						}
						this.oSipSessionCall.rejectTransfer();
					}
					break;
				}
		}
	}

	uiBtnCallSetText = (s_text) => {
		switch (s_text) {
			case "Call":
				{

					var bDisableCallBtnOptions = (window.localStorage && window.localStorage.getItem('org.doubango.expert.disable_callbtn_options') == "true");
					this.sipCall('call-audio');

					break;
				}
			default:
				{
					this.sipCall('call-audio');
					break;
				}
		}
	}

	showNotifICall = (s_number) => {
		// permission already asked when we registered
		//if (window.webkitNotifications && window.webkitNotifications.checkPermission() == 0) {
		if (this.oNotifICall) {
			this.oNotifICall.cancel();
		}
		//this.oNotifICall = Notification.createNotification('images/sipml-34x39.png', 'Incaming call', 'Incoming call from ' + s_number);
		this.oNotifICall.onclose = function() { this.oNotifICall = null; };
		this.oNotifICall.show();
		//}
	}

	public saveCallSettings = (callFormValue) => {
		if (this.callForm.valid) {
			this.settingsSave(callFormValue);
		}
	}

	settingsSave(callFormValue: any) {
		this.saveCallOptions(callFormValue);
		this.saveCredentials(callFormValue);
	}

	init() {
		var getPVal = function(PName) {
			var query = window.location.search.substring(1);
			var vars = query.split('&');
			for (var i = 0; i < vars.length; i++) {
				var pair = vars[i].split('=');
				if (decodeURIComponent(pair[0]) === PName) {
					return decodeURIComponent(pair[1]);
				}
			}
			return null;
		}

		// set default webrtc type (before initialization)
		var s_webrtc_type = getPVal("wt");
		var s_fps = getPVal("fps");
		var s_mvs = getPVal("mvs"); // maxVideoSize
		var s_mbwu = getPVal("mbwu"); // maxBandwidthUp (kbps)
		var s_mbwd = getPVal("mbwd"); // maxBandwidthUp (kbps)
		var s_za = getPVal("za"); // ZeroArtifacts
		var s_ndb = getPVal("ndb"); // NativeDebug

		if (s_webrtc_type) SIPml.setWebRtcType(s_webrtc_type);

		// initialize SIPML5
		SIPml.init(this.postInit);

		// set other options after initialization
		if (s_fps) SIPml.setFps(parseFloat(s_fps));
		if (s_mvs) SIPml.setMaxVideoSize(s_mvs);
		if (s_mbwu) SIPml.setMaxBandwidthUp(parseFloat(s_mbwu));
		if (s_mbwd) SIPml.setMaxBandwidthDown(parseFloat(s_mbwd));
		if (s_za) SIPml.setZeroArtifacts(s_za === "true");
		if (s_ndb == "true") SIPml.startNativeDebug();

		//var rinningApps = SIPml.getRunningApps();
		//var _rinningApps = Base64.decode(rinningApps);
		//tsk_utils_log_info(_rinningApps);
	}

	postInit() {
		// check for WebRTC support
		if (!SIPml.isWebRtcSupported()) {
			// is it chrome?
			if (SIPml.getNavigatorFriendlyName() == 'chrome') {
				if (confirm("You're using an old Chrome version or WebRTC is not enabled.\nDo you want to see how to enable WebRTC?")) {
					window.location.href = 'http://www.webrtc.org/running-the-demos';
				}
				else {
					window.location.href = "index.html";
				}
				return;
			}
			else {
				if (confirm("webrtc-everywhere extension is not installed. Do you want to install it?\nIMPORTANT: You must restart your browser after the installation.")) {
					window.location.href = 'https://github.com/sarandogou/webrtc-everywhere';
				}
				else {
					// Must do nothing: give the user the chance to accept the extension
					// window.location = "index.html";
				}
			}
		}

		// checks for WebSocket support
		if (!SIPml.isWebSocketSupported()) {
			if (confirm('Your browser don\'t support WebSockets.\nDo you want to download a WebSocket-capable browser?')) {
				window.location.href = 'https://www.google.com/intl/en/chrome/browser/';
			}
			else {
				window.location.href = "index.html";
			}
			return;
		}

		// FIXME: displays must be per session
		//this.viewVideoLocal = this.videoLocal;
		//this.viewVideoRemote = this.videoRemote;

		if (!SIPml.isWebRtcSupported()) {
			if (confirm('Your browser don\'t support WebRTC.\naudio/video calls will be disabled.\nDo you want to download a WebRTC-capable browser?')) {
				window.location.href = 'https://www.google.com/intl/en/chrome/browser/';
			}
		}

		let btnRegister = document.getElementById("btnRegister");
		btnRegister.removeAttribute('disabled');

		//document.querySelector('#btnRegister').enab
		//document.getElementById("myBtn").disabled = true;

		document.body.style.cursor = 'default';
		let audioRemote = document.getElementById("audio_remote");
		/*
				this.oConfigCall = {
					audio_remote: audioRemote,
					video_local: null,
					video_remote: null,
					screencast_window_id: 0x00000000, // entire desktop
					bandwidth: { audio: undefined, video: undefined },
					video_size: { minWidth: undefined, minHeight: undefined, maxWidth: undefined, maxHeight: undefined },
					events_listener: { events: '*', listener: this.onSipEventSession },
					sip_caps: [
						{ name: '+g.oma.sip-im' },
						{ name: 'language', value: '\"en,fr\"' }
					]
				};
				
				this.oConfigCall = {
					audio_remote: audioRemote,
					video_local: null,
					video_remote: null,
					screencast_window_id: 0x00000000, // entire desktop
					bandwidth: { audio: undefined, video: undefined },
					video_size: { minWidth: undefined, minHeight: undefined, maxWidth: undefined, maxHeight: undefined },
					events_listener: { events: '*', listener: this.onSipEventSession },
					sip_caps: [
						{ name: '+g.oma.sip-im' },
						{ name: 'language', value: '\"en,fr\"' }
					]
				};
		*/
	}

	loadCallOptions() {
		if (window.localStorage) {
			var s_value;
			if ((s_value = window.localStorage.getItem('org.doubango.call.phone_number'))) {
				//this.txtPhoneNumber.value = s_value;
				if (s_value == "undefined") {
					this.callForm.controls['txtPhoneNumber'].setValue('');
				} else {
					this.callForm.controls['txtPhoneNumber'].setValue(s_value);
				}
			}
			this.bDisableVideo = (window.localStorage.getItem('org.doubango.expert.disable_video') == "true");

			//this.txtCallStatus.innerHTML = '<i>Video ' + (this.bDisableVideo ? 'disabled' : 'enabled') + '</i>';
		}
	}

	saveCallOptions(callFormValue: any) {
		if (window.localStorage) {
			window.localStorage.setItem('org.doubango.call.phone_number', callFormValue.txtPhoneNumber);
			//window.localStorage.setItem('org.doubango.call.phone_number', txtPhoneNumber.value);
			//window.localStorage.setItem('org.doubango.expert.disable_video', callFormValue.txtPhoneNumber);			
			window.localStorage.setItem('org.doubango.expert.disable_video', this.bDisableVideo ? "true" : "false");
		}
	}

	loadCredentials() {
		if (window.localStorage) {
			// IE retuns 'null' if not defined
			var s_value;
			if ((s_value = window.localStorage.getItem('org.doubango.identity.display_name'))) {
				//txtDisplayName.value = s_value;				
				this.callForm.controls['txtDisplayName'].setValue(s_value);

			}

			if ((s_value = window.localStorage.getItem('org.doubango.identity.impi'))) {
				//txtPrivateIdentity.value = s_value;
				this.callForm.controls['txtPrivateIdentity'].setValue(s_value);
			}

			if ((s_value = window.localStorage.getItem('org.doubango.identity.impu'))) {
				//txtPublicIdentity.value = s_value;	
				this.callForm.controls['txtPublicIdentity'].setValue(s_value);
			}

			if ((s_value = window.localStorage.getItem('org.doubango.identity.password'))) {
				//txtPassword.value = s_value;				
				this.callForm.controls['txtPassword'].setValue(s_value);
			}

			if ((s_value = window.localStorage.getItem('org.doubango.identity.realm'))) {
				//txtRealm.value = s_value;
				this.callForm.controls['txtRealm'].setValue(s_value);

			}
		}
		else {
			//txtDisplayName.value = "005";
			//txtPrivateIdentity.value = "005";
			//txtPublicIdentity.value = "sip:005@sip2sip.info";
			//txtPassword.value = "005";
			//txtRealm.value = "sip2sip.info";
			//txtPhoneNumber.value = "701020";
		}
	};

	saveCredentials(callFormValue: any) {
		if (window.localStorage) {
			//window.localStorage.setItem('org.doubango.identity.display_name', txtDisplayName.value);
			window.localStorage.setItem('org.doubango.identity.display_name', callFormValue.txtDisplayName);

			//window.localStorage.setItem('org.doubango.identity.impi', txtPrivateIdentity.value);
			window.localStorage.setItem('org.doubango.identity.impi', callFormValue.txtPrivateIdentity);

			//window.localStorage.setItem('org.doubango.identity.impu', txtPublicIdentity.value);
			window.localStorage.setItem('org.doubango.identity.impu', callFormValue.txtPublicIdentity);

			//window.localStorage.setItem('org.doubango.identity.password', txtPassword.value);
			window.localStorage.setItem('org.doubango.identity.password', callFormValue.txtPassword);

			//window.localStorage.setItem('org.doubango.identity.realm', txtRealm.value);
			window.localStorage.setItem('org.doubango.identity.realm', callFormValue.txtRealm);

		}
	};
}


