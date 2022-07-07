import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
	selector: 'app-expert',
	templateUrl: './expert.component.html',
	styleUrls: ['./expert.component.scss']
})
export class ExpertComponent implements OnInit {
	
	txtInfo: any;
    public expertForm:FormGroup;

	constructor() { }

	ngOnInit(): void {

		this.expertForm = new FormGroup({

			cbVideoDisable: new FormControl(''),
			cbRTCWebBreaker: new FormControl(''),
			cbAVPFDisable: new FormControl(''),
			txtWebsocketServerUrl: new FormControl(''),
			txtSIPOutboundProxyUrl: new FormControl(''),
			txtInfo: new FormControl(''),

			txtIceServers: new FormControl(''),
			txtBandwidth: new FormControl(''),

			txtSizeVideo: new FormControl(''),
			cbEarlyIMS: new FormControl(''),
			cbDebugMessages: new FormControl(''),
			cbCacheMediaStream: new FormControl(''),
			cbCallButtonOptions: new FormControl(''),
		});
		
		this.settingsRevert(false);

		/*
				this.cbVideoDisable = document.getElementById("cbVideoDisable");
				this.cbRTCWebBreaker = document.getElementById("cbRTCWebBreaker");
				this.txtWebsocketServerUrl = document.getElementById("txtWebsocketServerUrl");
				this.txtSIPOutboundProxyUrl = document.getElementById("txtSIPOutboundProxyUrl");
				this.txtInfo = document.getElementById("txtInfo");
		
				//txtWebsocketServerUrl.disabled = !window.WebSocket || navigator.appName == "Microsoft Internet Explorer"; // Do not use WS on IE
				//document.getElementById("btnSave").disabled = !window.localStorage;
				//document.getElementById("btnRevert").disabled = !window.localStorage;
		
				if(window.localStorage){
					this.settingsRevert(true);
				}
		*/

	}


    public saveExpertSettings = (expertFormValue) => {
        if (this.expertForm.valid) {
            this.settingsSave(expertFormValue);
        }
    }


	public settingsSave(expertFormValue) {
		window.localStorage.setItem('org.doubango.expert.disable_video', expertFormValue.cbVideoDisable.checked ? "true" : "false");
		window.localStorage.setItem('org.doubango.expert.enable_rtcweb_breaker', expertFormValue.checked ? "true" : "false");
		if (!expertFormValue.txtWebsocketServerUrl.disabled) {
			console.log(expertFormValue.txtWebsocketServerUrl);
			window.localStorage.setItem('org.doubango.expert.websocket_server_url', expertFormValue.txtWebsocketServerUrl);
		}
		window.localStorage.setItem('org.doubango.expert.sip_outboundproxy_url', expertFormValue.txtSIPOutboundProxyUrl);
		window.localStorage.setItem('org.doubango.expert.ice_servers', expertFormValue.txtIceServers.value);
		window.localStorage.setItem('org.doubango.expert.bandwidth', expertFormValue.txtBandwidth.value);
		window.localStorage.setItem('org.doubango.expert.video_size', expertFormValue.txtSizeVideo.value);
		window.localStorage.setItem('org.doubango.expert.disable_early_ims', expertFormValue.cbEarlyIMS.checked ? "true" : "false");
		window.localStorage.setItem('org.doubango.expert.disable_debug', expertFormValue.cbDebugMessages.checked ? "true" : "false");
		window.localStorage.setItem('org.doubango.expert.enable_media_caching', expertFormValue.cbCacheMediaStream.checked ? "true" : "false");
		window.localStorage.setItem('org.doubango.expert.disable_callbtn_options', expertFormValue.cbCallButtonOptions.checked ? "true" : "false");

		expertFormValue.txtInfo.innerHTML = '<i>Saved</i>';
	}

	public settingsRevert(bNotUserAction: boolean) {
		//this.cbVideoDisable.checked = (window.localStorage.getItem('org.doubango.expert.disable_video') == "true");
		this.expertForm.controls['cbVideoDisable'].setValue((window.localStorage.getItem('org.doubango.expert.disable_video') == "true"));
		
		//this.cbRTCWebBreaker.checked = (window.localStorage.getItem('org.doubango.expert.enable_rtcweb_breaker') == "true");
		this.expertForm.controls['cbRTCWebBreaker'].setValue((window.localStorage.getItem('org.doubango.expert.enable_rtcweb_breaker') == "true"));

		//this.txtWebsocketServerUrl.value = (window.localStorage.getItem('org.doubango.expert.websocket_server_url') || "");
		console.log((window.localStorage.getItem('org.doubango.expert.websocket_server_url') || ""));
		this.expertForm.controls['txtWebsocketServerUrl'].setValue((window.localStorage.getItem('org.doubango.expert.websocket_server_url') || ""));

		//this.txtSIPOutboundProxyUrl.value = (window.localStorage.getItem('org.doubango.expert.sip_outboundproxy_url') || "");
		this.expertForm.controls['txtSIPOutboundProxyUrl'].setValue((window.localStorage.getItem('org.doubango.expert.sip_outboundproxy_url') || ""));
		
		//this.txtIceServers.value = (window.localStorage.getItem('org.doubango.expert.ice_servers') || "");
		this.expertForm.controls['txtIceServers'].setValue((window.localStorage.getItem('org.doubango.expert.ice_servers') || ""));
		
		//this.txtBandwidth.value = (window.localStorage.getItem('org.doubango.expert.bandwidth') || "");
		this.expertForm.controls['txtBandwidth'].setValue((window.localStorage.getItem('org.doubango.expert.bandwidth') || ""));
		
		//this.txtSizeVideo.value = (window.localStorage.getItem('org.doubango.expert.video_size') || "");
		this.expertForm.controls['txtSizeVideo'].setValue((window.localStorage.getItem('org.doubango.expert.video_size') || ""));
		
		//this.cbEarlyIMS.checked = (window.localStorage.getItem('org.doubango.expert.disable_early_ims') == "true");
		this.expertForm.controls['cbEarlyIMS'].setValue((window.localStorage.getItem('org.doubango.expert.disable_early_ims') == "true"));
		
		//this.cbDebugMessages.checked = (window.localStorage.getItem('org.doubango.expert.disable_debug') == "true");
		this.expertForm.controls['cbDebugMessages'].setValue((window.localStorage.getItem('org.doubango.expert.disable_debug') == "true"));
		
		//this.cbCacheMediaStream.checked = (window.localStorage.getItem('org.doubango.expert.enable_media_caching') == "true");
		this.expertForm.controls['cbCacheMediaStream'].setValue((window.localStorage.getItem('org.doubango.expert.enable_media_caching') == "true"));
		
		//this.cbCallButtonOptions.checked = (window.localStorage.getItem('org.doubango.expert.disable_callbtn_options') == "true");
		this.expertForm.controls['cbCallButtonOptions'].setValue((window.localStorage.getItem('org.doubango.expert.disable_callbtn_options') == "true"));


		if (!bNotUserAction) {
			//this.txtInfo.innerHTML = '<i>Reverted</i>';
		}
	}

}
