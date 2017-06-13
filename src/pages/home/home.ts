import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { Geofence } from '@ionic-native/geofence';
import { ToastController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  location: string;
  error: string;
  error1: string;
  uniquId: number;
  msgData: string;
  relianceLat: number;
  relianceLong: number;
  id: string;

  constructor(public navCtrl: NavController, private _geoLocation: Geolocation,
    private _geofence: Geofence, private _toast: ToastController) {

    this.relianceLat = 23.185613;
    this.relianceLong = 72.629576;
    this.uniquId = 12345;
    this.id = '693a1b88-6fbe-4e80-a4d4-ff413748';

    this._geofence.initialize()
      .then(() => {
        console.log('geofence initialize succesfully!');
        this.error = 'success';
        this.showToast('success');
      }, (err) => {
        console.log('geofence initalize failed!!' + err);
        this.showToast('failed');
        this.error = 'error';
      });

    this._geoLocation.getCurrentPosition()
      .then((resp) => {
        console.log('fetch location!');
        console.log('Lat: ' + resp.coords.latitude + "\tLang :" + resp.coords.longitude);
        this.relianceLat = resp.coords.latitude;
        this.relianceLong = resp.coords.longitude;
        this.addGeofence(this.relianceLat, this.relianceLong, 'reliance square road! radious 300meters', 300);
        this.addGeofence(23.208204, 71.635922, 'GH2! radious 300meters', 300);
        this.addGeofence(23.185623, 72.638777, 'kudasan square road! radious 300meters', 300);
        this.addGeofence(23.195963, 72.639629, 'CH0 radious 300meters', 300);
        this.addGeofence(23.185746, 72.638502, 'rakshashakti radious 300meters', 300);
        this.addGeofence(23.197290, 72.631298, 'infocity! radious 300meters', 300);
      })
      .catch((err) => {
        console.log('failed!');
      });

    this._geofence.onNotificationClicked()
      .subscribe((data) => {
        this.msgData = data;
      });
/*
    this._geofence.getWatched()
      .then((res) => {
        this.showToast(JSON.stringify(res));
      })
      .catch((err) => {
        this.showToast(JSON.stringify(err));
      });

    /*let watch = this._geoLocation.watchPosition();
    watch.subscribe((data) => {
      this.location = data.coords.latitude + ' ' + data.coords.longitude;
    });*/
  }

  showToast(msg: string) {
    let toast = this._toast.create({
      message: msg,
      duration: 5000,
      position: 'bottom'
    });
    toast.present();
  }

  createGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  private addGeofence(latitude: number, longitude: number, notification: string, radius: number) {
    let fence = {
      id: this.createGuid(), //any unique ID
      latitude: latitude, //center of geofence radius
      longitude: longitude,
      radius: radius, //radius to edge of geofence in meters
      transitionType: 1, //see 'Transition Types' below
      notification: { //notification settings
        id: this.uniquId++, //any unique ID
        title: 'alert', //notification title
        soundname:'cello',
        vibrate: false,
        image: '../../assets/icon/1.jpg',
        icon: 'resources/android/1.jpg',
        text: notification, //notification body
        openAppOnClick: true //open app when notification is tapped
      }
    }

    this._geofence.addOrUpdate(fence).then(
      () => this.error1 = 'geofence add success',
      (err) => this.error1 = 'geofence adding failed'
    );
  }
}
