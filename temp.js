function getUserLocation() {
  Geolocation.getCurrentPosition(
    (position) => {
      this.setState({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        coordinates: this.state.coordinates.concat({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }),
      });
    },
    (error) => {
      Alert.alert(error.message.toString());
    },
    {
      showLocationDialog: true,
      enableHighAccuracy: true,
      timeout: 20000,
      maximumAge: 0,
    }
  );
}
request(PERMISSIONS.IOS.LOCATION_ALWAYS).then((result) => {
  switch (result) {
    case RESULTS.UNAVAILABLE:
      console.log(
        "This feature is not available (on this device / in this context)"
      );
      break;
    case RESULTS.DENIED:
      console.log(
        "The permission has not been requested / is denied but requestable"
      );
      break;
    case RESULTS.LIMITED:
// $&
      break;
    case RESULTS.GRANTED:
// $&
      // Permission has been granted - app can request location coordinates
      getUserLocation();
      break;
    case RESULTS.BLOCKED:
// $&
      break;
  }
});