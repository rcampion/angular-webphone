import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './material/material.module';

import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CallComponent } from './phone/call/call.component';
import { ExpertComponent } from './phone/expert/expert.component';
import { TabsComponent } from './phone/tabs/tabs.component';
import { ContactContainerComponent } from './contact-container/contact-container.component';
import { SettingsComponent } from './phone/settings/settings.component';

@NgModule({
	declarations: [
		AppComponent,
		CallComponent,
		ExpertComponent,
		TabsComponent,
  ContactContainerComponent,
  SettingsComponent
	],
	imports: [
		BrowserModule,
		FormsModule,
		ReactiveFormsModule,
		AppRoutingModule,
		MaterialModule,
		MatDialogModule,
		MatInputModule,
		MatFormFieldModule,
		BrowserAnimationsModule,
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
