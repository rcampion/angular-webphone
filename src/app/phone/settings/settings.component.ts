import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})

export class SettingsComponent implements OnInit, AfterViewInit {

	public settingsForm: FormGroup;

	//serverSpan;
	//targetSpan;
	//connectButton;
	//callButton;
	//hangupButton;
	//disconnectButton;
	audioElement;
	keypad;
	dtmfSpan;
	holdCheckbox;
	muteCheckbox;
	// Name for demo user
	displayName: string = "SIP.js Demo";
	// WebSocket Server URL
	webSocketServer = "wss://zdslogic.com:6089/ws";

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

	txtRegStatus;
	txtCallStatus;

	//simpleUser: SimpleUser;

	constructor() {
		//this.ringtone = document.getElementById("ringtone");
		//this.ringbacktone = document.getElementById("ringbacktone");

	}

	ngOnInit(): void {
		this.settingsForm = new FormGroup({
			txtDisplayName: new FormControl(''),
			txtPrivateIdentity: new FormControl(''),
			txtPublicIdentity: new FormControl(''),
			txtPassword: new FormControl(''),
			txtRealm: new FormControl(''),
			txtPhoneNumber: new FormControl(''),
			txtWebsocketServerUrl: new FormControl(''),
			txtSIPOutboundProxyUrl: new FormControl(''),
		});

		var s_value = window.localStorage.getItem('org.doubango.identity.display_name');
		if (s_value!="") {
			//txtDisplayName.value = s_value;				
			this.loadCredentials();
			this.loadCallOptions();
		} else {
			this.loadDefaults();
		}
	}

	ngAfterViewInit(): void {
		this.init();
	}

	public saveCallSettings = (callFormValue) => {
		if (this.settingsForm.valid) {
			this.settingsSave(callFormValue);
		}
	}

	settingsSave(callFormValue: any) {
		this.saveCallOptions(callFormValue);
		this.saveCredentials(callFormValue);
	}

	init() {

	}

	postInit() {

	}

	loadCallOptions() {
		if (window.localStorage) {
			var s_value;
			if ((s_value = window.localStorage.getItem('org.doubango.call.phone_number'))) {
				//this.txtPhoneNumber.value = s_value;
				if (s_value == "undefined") {
					this.settingsForm.controls['txtPhoneNumber'].setValue('');
				} else {
					this.settingsForm.controls['txtPhoneNumber'].setValue(s_value);
				}
			}
			this.bDisableVideo = (window.localStorage.getItem('org.doubango.expert.disable_video') == "true");

			//this.txtCallStatus = '<i>Video ' + (this.bDisableVideo ? 'disabled' : 'enabled') + '</i>';
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

	loadDefaults = () => {
		this.settingsForm.controls['txtDisplayName'].setValue("ZdsLogic Technologies");
		this.settingsForm.controls['txtPrivateIdentity'].setValue("test.user");
		this.settingsForm.controls['txtPublicIdentity'].setValue("sip:test.user@zdslogic.com");
		this.settingsForm.controls['txtPassword'].setValue("Testing123+");
		this.settingsForm.controls['txtRealm'].setValue("zdslogic");
		this.settingsForm.controls['txtWebsocketServerUrl'].setValue("wss://zdslogic.com:6089/ws");
		this.settingsForm.controls['txtSIPOutboundProxyUrl'].setValue("udp://zdslogic.com:5060");
		this.settingsForm.controls['txtPhoneNumber'].setValue("sip:1111@zdslogic.com");
		this.settingsForm.controls['txtWebsocketServerUrl'].setValue("wss:/zdslogic.com:6089/ws");
		this.settingsForm.controls['txtSIPOutboundProxyUrl'].setValue("udp://zdslogic.com:5060");

	}

	loadCredentials() {
		if (window.localStorage) {
			// IE retuns 'null' if not defined
			var s_value;
			if ((s_value = window.localStorage.getItem('org.doubango.identity.display_name'))) {
				//txtDisplayName.value = s_value;				
				this.settingsForm.controls['txtDisplayName'].setValue(s_value);
			}

			if ((s_value = window.localStorage.getItem('org.doubango.identity.impi'))) {
				//txtPrivateIdentity.value = s_value;
				this.settingsForm.controls['txtPrivateIdentity'].setValue(s_value);
			}

			if ((s_value = window.localStorage.getItem('org.doubango.identity.impu'))) {
				//txtPublicIdentity.value = s_value;	
				this.settingsForm.controls['txtPublicIdentity'].setValue(s_value);
			}

			if ((s_value = window.localStorage.getItem('org.doubango.identity.password'))) {
				//txtPassword.value = s_value;				
				this.settingsForm.controls['txtPassword'].setValue(s_value);
			}

			if ((s_value = window.localStorage.getItem('org.doubango.identity.realm'))) {
				//txtRealm.value = s_value;
				this.settingsForm.controls['txtRealm'].setValue(s_value);

			}


			//this.txtWebsocketServerUrl.value = (window.localStorage.getItem('org.doubango.expert.websocket_server_url') || "");
			//console.log((window.localStorage.getItem('org.doubango.expert.websocket_server_url') || ""));
			this.settingsForm.controls['txtWebsocketServerUrl'].setValue((window.localStorage.getItem('org.doubango.expert.websocket_server_url') || ""));

			//this.txtSIPOutboundProxyUrl.value = (window.localStorage.getItem('org.doubango.expert.sip_outboundproxy_url') || "");
			this.settingsForm.controls['txtSIPOutboundProxyUrl'].setValue((window.localStorage.getItem('org.doubango.expert.sip_outboundproxy_url') || ""));

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

			window.localStorage.setItem('org.doubango.expert.websocket_server_url', callFormValue.txtWebsocketServerUrl);

			window.localStorage.setItem('org.doubango.expert.sip_outboundproxy_url', callFormValue.txtSIPOutboundProxyUrl);


		}
	};

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

}