module.exports = {
    project: {
        ios:{},
        android:{}
    },
    assets:['./assets/fonts/'],
    dependencies: {
        'react-native-flipper': {
            platforms: {
                ios: null,
                android: null,
            },
        },
        'react-native-screen-capture-secure': {
            platforms: {
                android: null,
            },
        },
    },
}