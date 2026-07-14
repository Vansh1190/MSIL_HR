import {Dimensions} from 'react-native'
const myconfig = {
    deviceWidth: Dimensions.get('window').width,
    deviceHeight: Dimensions.get('window').height,
}
export const DEBUG = true;
export default myconfig;