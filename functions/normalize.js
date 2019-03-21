// RESPONSIVE DEVICE
import { Dimensions } from 'react-native';
export const { width, height } = Dimensions.get('window');

//Guideline sizes are based on standard ~5" screen mobile device
const guidelineBaseWidth = 350;
const guidelineBaseHeight = 680;
const aspectRatio = height / width;

const scale = size => width / guidelineBaseWidth * size;
const verticalScale = size => height / guidelineBaseHeight * size;
const normalize = (size, factor = 0.5) => size + (scale(size) - size) * factor;

export { scale, verticalScale, normalize, aspectRatio };