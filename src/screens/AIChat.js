import React, { useRef, useEffect, useState, useContext } from 'react';
import { 
 View, 
 StyleSheet, 
 Animated, 
 TouchableOpacity, 
 Dimensions, 
 Modal, 
 Easing, 
 ScrollView, 
 Platform, 
 SafeAreaView,
 Alert,
 Keyboard,
 Image
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import * as ApiService from '../Utils/Utils';
import { Decrypt, encrypyDecrypt, encrypyDecryptSHA256 } from '../Service/Helper';
import AuthContext from '../context/AuthContext';
import Toast from 'react-native-simple-toast';
import Text from '../components/reusable/Text';
import TextInput from '../components/reusable/TextInput';
import { GlobalColor } from '../constants/Colors';

const { width, height } = Dimensions.get('window');

const AIChat = ({ visible, onClose }) => {
 const { authContext, AppUserData } = useContext(AuthContext);
 const [showGreeting, setShowGreeting] = useState(false);
 const [userQuery, setUserQuery] = useState('');
 const [messages, setMessages] = useState([]);
 const [isLoading, setIsLoading] = useState(false);
 const [sessionID, setSessionID] = useState('');
 const [isInputFocused, setIsInputFocused] = useState(false);

 // ✅ CHANGE 1: Store fetched designation from /GetEmployeeDetEmp
 const [employeeDesg, setEmployeeDesg] = useState('');

 const scrollViewRef = useRef(null);

 const chatModalSlide = useRef(new Animated.Value(height)).current;
 const inputBottomPosition = useRef(new Animated.Value(0)).current;
 
 // AI World Entry Animation
 const portalScale = useRef(new Animated.Value(0)).current;
 const portalRotate = useRef(new Animated.Value(0)).current;
 const portalOpacity = useRef(new Animated.Value(0)).current;
 const particlesAnim = useRef(new Animated.Value(0)).current;
 
 // Robot animations
 const robotScale = useRef(new Animated.Value(0)).current;
 const robotWave = useRef(new Animated.Value(0)).current;
 const greetingOpacity = useRef(new Animated.Value(0)).current;
 const greetingSlide = useRef(new Animated.Value(20)).current;

 // Typing indicator animation
 const typingDot1 = useRef(new Animated.Value(0)).current;
 const typingDot2 = useRef(new Animated.Value(0)).current;
 const typingDot3 = useRef(new Animated.Value(0)).current;

 // Example questions - Domestic Travel focused
 const exampleQuestions = [
 "What is my daily allowance for domestic travel?",
 "What are the travel advance rules for domestic trips?",
 "How do I book domestic travel tickets?",
 "What documents do I need for domestic travel claims?"
 ];

 useEffect(() => {
 if (visible) {
 // ✅ CHANGE 1: Fetch employee designation when chat opens
 fetchEmployeeDesignation();
 startAIWorldAnimation();
 } else {
 resetAnimations();
 }
 }, [visible]);

 // ✅ CHANGE 1: New function - fetch EMPL_DESG_CODE from /GetEmployeeDetEmp
 const fetchEmployeeDesignation = () => {
 let token = AppUserData.token;
 let userName = AppUserData?.data?.userNT || AppUserData?.data?.userId?.toString() || '';

 if (!userName) {
 console.log('Warning: No username available for employee designation fetch');
 return;
 }

 let apiData = { AppName: "HR-ASSIST", UserName: userName };

 ApiService.PostMethode('/GetEmployeeDetEmp', apiData, token, authContext)
 .then(result => {
 if (result.Value && result.Value.length > 0) {
 let responseData = result.Value[0];
 const desgCode = responseData?.EMPL_DESG_CODE || '';
 setEmployeeDesg(desgCode);
 console.log('Employee designation fetched:', desgCode);
 } else {
 console.log('No employee data found, designation will be empty');
 setEmployeeDesg('');
 }
 })
 .catch(error => {
 console.log('Error fetching employee designation:', error);
 setEmployeeDesg('');
 });
 };

 // Keyboard listeners with manual position handling
 useEffect(() => {
 const keyboardWillShowListener = Keyboard.addListener(
 Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
 (e) => {
 const keyboardHeight = e.endCoordinates.height;
 setIsInputFocused(true);
 
 Animated.timing(inputBottomPosition, {
 toValue: keyboardHeight - (Platform.OS === 'ios' ? 0 : 0),
 duration: 250,
 useNativeDriver: false,
 }).start();
 
 setTimeout(() => {
 scrollViewRef.current?.scrollToEnd({ animated: true });
 }, 300);
 }
 );
 
 const keyboardWillHideListener = Keyboard.addListener(
 Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
 () => {
 setIsInputFocused(false);
 
 Animated.timing(inputBottomPosition, {
 toValue: 0,
 duration: 250,
 useNativeDriver: false,
 }).start();
 }
 );

 return () => {
 keyboardWillShowListener.remove();
 keyboardWillHideListener.remove();
 };
 }, []);

 // Typing indicator animation
 useEffect(() => {
 if (isLoading) {
 const createPulseAnimation = (animValue, delay) => {
 return Animated.loop(
 Animated.sequence([
 Animated.delay(delay),
 Animated.timing(animValue, {
 toValue: 1,
 duration: 400,
 useNativeDriver: true,
 }),
 Animated.timing(animValue, {
 toValue: 0,
 duration: 400,
 useNativeDriver: true,
 }),
 ])
 );
 };

 const animation1 = createPulseAnimation(typingDot1, 0);
 const animation2 = createPulseAnimation(typingDot2, 150);
 const animation3 = createPulseAnimation(typingDot3, 300);

 animation1.start();
 animation2.start();
 animation3.start();

 return () => {
 animation1.stop();
 animation2.stop();
 animation3.stop();
 };
 } else {
 typingDot1.setValue(0);
 typingDot2.setValue(0);
 typingDot3.setValue(0);
 }
 }, [isLoading]);

 // Auto-scroll to bottom when new messages arrive
 useEffect(() => {
 if (messages.length > 0) {
 setTimeout(() => {
 scrollViewRef.current?.scrollToEnd({ animated: true });
 }, 100);
 }
 }, [messages]);

 const startAIWorldAnimation = () => {
 Animated.parallel([
 Animated.timing(portalOpacity, {
 toValue: 1,
 duration: 300,
 useNativeDriver: true,
 }),
 Animated.spring(portalScale, {
 toValue: 1,
 tension: 50,
 friction: 7,
 useNativeDriver: true,
 }),
 Animated.loop(
 Animated.timing(portalRotate, {
 toValue: 1,
 duration: 3000,
 easing: Easing.linear,
 useNativeDriver: true,
 })
 ).start(),
 Animated.timing(particlesAnim, {
 toValue: 1,
 duration: 1000,
 useNativeDriver: true,
 }),
 ]).start();

 setTimeout(() => {
 Animated.spring(chatModalSlide, {
 toValue: 0,
 tension: 65,
 friction: 9,
 useNativeDriver: true,
 }).start(() => {
 Animated.sequence([
 Animated.spring(robotScale, {
 toValue: 1,
 tension: 120,
 friction: 9,
 useNativeDriver: true,
 }),
 Animated.loop(
 Animated.sequence([
 Animated.timing(robotWave, {
 toValue: 1,
 duration: 300,
 useNativeDriver: true,
 }),
 Animated.timing(robotWave, {
 toValue: 0,
 duration: 300,
 useNativeDriver: true,
 }),
 ]),
 { iterations: 2 }
 ),
 ]).start(() => {
 setShowGreeting(true);
 Animated.parallel([
 Animated.timing(greetingOpacity, {
 toValue: 1,
 duration: 400,
 useNativeDriver: true,
 }),
 Animated.spring(greetingSlide, {
 toValue: 0,
 tension: 60,
 friction: 8,
 useNativeDriver: true,
 }),
 ]).start();
 });

 Animated.timing(portalOpacity, {
 toValue: 0,
 duration: 500,
 useNativeDriver: true,
 }).start();
 });
 }, 600);
 };

 const resetAnimations = () => {
 setShowGreeting(false);
 setMessages([]);
 setUserQuery('');
 setSessionID(''); // ✅ CHANGE 2: Reset to blank on clear/close
 setIsLoading(false);
 setIsInputFocused(false);
 setEmployeeDesg(''); // ✅ CHANGE 1: Reset designation on close
 
 Animated.parallel([
 Animated.timing(chatModalSlide, {
 toValue: height,
 duration: 400,
 useNativeDriver: true,
 }),
 Animated.timing(robotScale, {
 toValue: 0,
 duration: 300,
 useNativeDriver: true,
 }),
 Animated.timing(greetingOpacity, {
 toValue: 0,
 duration: 200,
 useNativeDriver: true,
 }),
 ]).start(() => {
 portalScale.setValue(0);
 portalOpacity.setValue(0);
 particlesAnim.setValue(0);
 robotWave.setValue(0);
 greetingSlide.setValue(20);
 inputBottomPosition.setValue(0);
 });
 };

 const handleCloseChat = () => {
 Keyboard.dismiss();
 resetAnimations();
 setTimeout(() => {
 onClose();
 }, 400);
 };

 const handleClearChat = () => {
 Alert.alert(
 "Clear Chat",
 "Are you sure you want to clear all messages?",
 [
 {
 text: "Cancel",
 style: "cancel"
 },
 { 
 text: "Clear", 
 onPress: () => {
 setMessages([]);
 setSessionID(''); // ✅ CHANGE 2: Reset sessionID to blank on clear
 setIsLoading(false);
 Toast.show('Chat cleared successfully');
 },
 style: "destructive"
 }
 ]
 );
 };

 // Parse API response - reads "Answer" and "sessionId" from Result JSON string
 const parseAPIResponse = (result) => {
 try {
 if (!result) {
 console.log('Error: No result received from API');
 return null;
 }

 // PRIMARY: result.Result is a JSON string containing { Answer, MappedTo, sessionId }
 if (result.Result) {
 try {
 const parsedResult = JSON.parse(result.Result);

 // ✅ CHANGE 2: Extract sessionId from parsed Result and store it
 if (parsedResult.sessionId && parsedResult.sessionId.trim().length > 0) {
 setSessionID(parsedResult.sessionId);
 console.log('Session ID updated from Result:', parsedResult.sessionId);
 }
if (parsedResult.Answer && parsedResult.Answer.trim().length > 0) {
 return parsedResult.Answer.trim();
}

 if (parsedResult.responseText) return parsedResult.responseText;
 if (parsedResult.response) return parsedResult.response;
 if (parsedResult.message) return parsedResult.message;
 if (parsedResult.Message) return parsedResult.Message;

 } catch (parseError) {
 if (typeof result.Result === 'string' && result.Result.trim().length > 0) {
 return result.Result;
 }
 console.log('Error parsing Result field:', parseError);
 }
 }

 // Fallbacks
 if (result.Value && result.Value.Response) return result.Value.Response;
 if (result.Value && result.Value.Answer) return result.Value.Answer;
 if (result.Response) return result.Response;
 if (result.Value && result.Value.responseText) return result.Value.responseText;
 if (result.Message) return result.Message;
 if (result.Data && typeof result.Data === 'string') return result.Data;

 console.log('Error: Could not find response text in result:', JSON.stringify(result));
 return null;
 } catch (error) {
 console.log('Error parsing API response:', error);
 return null;
 }
 };

 // ✅ CHANGE 1 & 2: Updated API call - uses fetched employeeDesg and correct sessionID logic
 const callAIResponseAPI = (query) => {
 let token = AppUserData.token;

 let apiData = {
 SessionID: sessionID, // ✅ CHANGE 2: blank '' on first/cleared message, then filled from response
 Designation: employeeDesg, // ✅ CHANGE 1: from /GetEmployeeDetEmp response
 Category: "",
 Query: query
 };

 console.log('Calling GetAIResponse with:', { SessionID: apiData.SessionID, Designation: apiData.Designation });

 setIsLoading(true);
 
 ApiService.PostMethode('/GetAIResponse', apiData, token, authContext)
 .then(result => {
 setIsLoading(false);
 
 if (!result) {
 console.log('Error: Empty response from API');
 setMessages(prev => [...prev, { 
 type: 'bot', 
 text: 'Sorry, I did not receive a response from the server. Please try again.',
 timestamp: new Date().toISOString(),
 isError: true
 }]);
 return;
 }
 
 if (result.StatusCode && result.StatusCode !== 200 && result.StatusCode !== '200') {
 console.log('Error: API returned non-200 status:', result.StatusCode);
 const errorMessage = result.Message || result.Error || 'Something went wrong';
 setMessages(prev => [...prev, { 
 type: 'bot', 
 text: `Error: ${errorMessage}. Please try again.`,
 timestamp: new Date().toISOString(),
 isError: true
 }]);
 return;
 }
 
 if (result.IsError === true || result.isError === true) {
 console.log('Error: API returned error flag');
 const errorMessage = result.Message || result.ErrorMessage || 'An error occurred';
 setMessages(prev => [...prev, { 
 type: 'bot', 
 text: `${errorMessage}. Please try again.`,
 timestamp: new Date().toISOString(),
 isError: true
 }]);
 return;
 }
 
 // ✅ CHANGE 2: sessionId is now extracted inside parseAPIResponse from result.Result
 // Keep these fallbacks for other possible response structures
 if (result.Value && result.Value.SessionID) {
 setSessionID(result.Value.SessionID);
 } else if (result.SessionID) {
 setSessionID(result.SessionID);
 }
 
 const responseText = parseAPIResponse(result);
 
 if (responseText && responseText.trim().length > 0) {
 setMessages(prev => [...prev, { 
 type: 'bot', 
 text: responseText,
 timestamp: new Date().toISOString()
 }]);
 } else {
 console.log('Error: No valid response text found in API result');
 setMessages(prev => [...prev, { 
 type: 'bot', 
 text: 'I received your query but could not generate a proper response. Please try rephrasing your question or try again later.',
 timestamp: new Date().toISOString(),
 isError: true
 }]);
 }
 })
 .catch(error => {
 setIsLoading(false);
 
 console.log('Error calling GetAIResponse API:', error);
 
 let errorMessage = 'Sorry, I encountered an error. Please try again.';
 
 if (error.message) {
 if (error.message.includes('Network')) {
 errorMessage = 'Network error. Please check your internet connection and try again.';
 } else if (error.message.includes('timeout')) {
 errorMessage = 'Request timed out. Please try again.';
 } else if (error.message.includes('401') || error.message.includes('403')) {
 errorMessage = 'Authentication error. Please log in again.';
 } else if (error.message.includes('500')) {
 errorMessage = 'Server error. Please try again later.';
 }
 }
 
 setMessages(prev => [...prev, { 
 type: 'bot', 
 text: errorMessage,
 timestamp: new Date().toISOString(),
 isError: true
 }]);
 
 if (ApiService.showErrorMessage && typeof ApiService.showErrorMessage === 'function') {
 ApiService.showErrorMessage(error, authContext);
 }
 });
 };

 const handleSubmit = () => {
 if (userQuery.trim()) {
 const queryToSend = userQuery.trim();
 
 const userMessage = {
 type: 'user',
 text: queryToSend,
 timestamp: new Date().toISOString()
 };
 
 setMessages(prev => [...prev, userMessage]);
 setUserQuery('');
 callAIResponseAPI(queryToSend);
 
 setTimeout(() => {
 scrollViewRef.current?.scrollToEnd({ animated: true });
 }, 100);
 }
 };

 const handleExampleQuestion = (question) => {
 setUserQuery(question);
 };

 const portalRotation = portalRotate.interpolate({
 inputRange: [0, 1],
 outputRange: ['0deg', '360deg'],
 });

 const waveRotation = robotWave.interpolate({
 inputRange: [0, 1],
 outputRange: ['-20deg', '20deg'],
 });

 const AIPortalAnimation = () => (
 <Animated.View
 style={[
 styles.portalContainer,
 {
 opacity: portalOpacity,
 transform: [{ scale: portalScale }],
 },
 ]}
 >
 <Animated.View
 style={[
 styles.portalRing,
 { transform: [{ rotate: portalRotation }] },
 ]}
 >
 <LinearGradient
 colors={['#1E40AF', '#3B82F6', '#60A5FA', '#93C5FD']}
 start={{ x: 0, y: 0 }}
 end={{ x: 1, y: 1 }}
 style={styles.portalRingGradient}
 />
 </Animated.View>

 {[...Array(8)].map((_, i) => (
 <Animated.View
 key={i}
 style={[
 styles.particle,
 {
 transform: [
 { rotate: `${i * 45}deg` },
 {
 translateX: particlesAnim.interpolate({
 inputRange: [0, 1],
 outputRange: [0, 60],
 }),
 },
 ],
 opacity: particlesAnim.interpolate({
 inputRange: [0, 0.5, 1],
 outputRange: [0, 1, 0],
 }),
 },
 ]}
 />
 ))}

 <View style={styles.portalCenter}>
 <LinearGradient
 colors={['#1E40AF', '#3B82F6']}
 start={{ x: 0, y: 0 }}
 end={{ x: 1, y: 1 }}
 style={styles.portalCenterGradient}
 />
 </View>

 <Text style={styles.portalText}>Entering AI World...</Text>
 </Animated.View>
 );

 return (
 <Modal
 visible={visible}
 transparent={true}
 animationType="none"
 onRequestClose={handleCloseChat}
 >
 <View style={styles.modalOverlay}>
 <AIPortalAnimation />
 
 <Animated.View
 style={[
 styles.chatModalContainer,
 {
 transform: [{ translateY: chatModalSlide }],
 },
 ]}
 >
 {/* Professional Header - Blue Theme */}
 <LinearGradient
 colors={['#1E40AF', '#2563EB']}
 start={{ x: 0, y: 0 }}
 end={{ x: 1, y: 0 }}
 style={styles.chatHeader}
 >
 <View style={styles.chatHeaderContent}>
 <View style={styles.aiIconContainer}>
 <Image 
 source={require('../assets/Images/chatbot_header.gif')} 
 style={styles.headerGif}
 resizeMode="contain"
 />
 </View>
 <View>
 <Text Bold style={styles.chatHeaderTitle}>AI Assistant</Text>
 <Text style={styles.chatHeaderSubtitle}>Always here to help</Text>
 </View>
 </View>
 
 <View style={styles.headerButtons}>
 {messages.length > 0 && (
 <TouchableOpacity onPress={handleClearChat} style={styles.clearButton}>
 <Ionicons name="trash-outline" size={20} color="#fff" />
 </TouchableOpacity>
 )}
 <TouchableOpacity onPress={handleCloseChat} style={styles.closeButton}>
 <MaterialCommunityIcons name="close" size={22} color="#fff" />
 </TouchableOpacity>
 </View>
 </LinearGradient>

 {/* Main Content */}
 <View style={styles.chatContent}>
 <ScrollView 
 ref={scrollViewRef}
 style={styles.messagesContainer}
 contentContainerStyle={styles.messagesContent}
 showsVerticalScrollIndicator={false}
 keyboardShouldPersistTaps="handled"
 keyboardDismissMode="interactive"
 >
 {/* Robot Avatar with Wave - Only show when no messages */}
 {messages.length === 0 && (
 <View style={styles.emptyStateContainer}>
 <Animated.View
 style={[
 styles.robotContainer,
 {
 transform: [{ scale: robotScale }],
 },
 ]}
 >
 <View style={styles.robotAvatar}>
 <Image 
 source={require('../assets/Images/chatbot_header.gif')} 
 style={styles.robotGif}
 resizeMode="contain"
 />
 </View>
 
 <Animated.View
 style={[
 styles.wavingHand,
 {
 transform: [{ rotate: waveRotation }],
 },
 ]}
 >
 <Text style={styles.handEmoji}>👋</Text>
 </Animated.View>
 </Animated.View>

 {showGreeting && (
 <Animated.View
 style={[
 styles.greetingContainer,
 {
 opacity: greetingOpacity,
 transform: [{ translateY: greetingSlide }],
 },
 ]}
 >
 <View style={styles.greetingBubble}>
 <Text style={styles.greetingText}>
 Hello! I'm your AI assistant. How can I help you today? 👋
 </Text>
 </View>
 </Animated.View>
 )}

 {showGreeting && !isInputFocused && (
 <Animated.View
 style={[
 styles.examplesContainer,
 {
 opacity: greetingOpacity,
 },
 ]}
 >
 <Text Bold style={styles.examplesTitle}>You Can Ask Me:</Text>
 {exampleQuestions.map((question, index) => (
 <TouchableOpacity
 key={index}
 style={styles.exampleCard}
 onPress={() => handleExampleQuestion(question)}
 >
 <MaterialCommunityIcons 
 name="lightning-bolt" 
 size={16} 
 color="#2563EB" 
 style={styles.exampleIcon}
 />
 <Text style={styles.exampleText} numberOfLines={2}>
 {question}
 </Text>
 <MaterialCommunityIcons 
 name="chevron-right" 
 size={18} 
 color="#9CA3AF" 
 />
 </TouchableOpacity>
 ))}
 </Animated.View>
 )}
 </View>
 )}

 {/* Chat Messages */}
 {messages.map((message, index) => (
 <View
 key={index}
 style={[
 styles.messageBubble,
 message.type === 'user' ? styles.userMessage : styles.botMessage,
 ]}
 >
 {message.type === 'bot' && (
 <View style={styles.botAvatarSmall}>
 <Image 
 source={require('../assets/Images/chatbot_header.gif')} 
 style={styles.botAvatarGif}
 resizeMode="contain"
 />
 </View>
 )}
 <View style={[
 styles.messageContent,
 message.type === 'user' ? styles.userMessageContent : styles.botMessageContent,
 message.isError && styles.errorMessageContent,
 ]}>
 <Text style={[
 styles.messageText,
 message.type === 'user' ? styles.userMessageText : styles.botMessageText,
 message.isError && styles.errorMessageText,
 ]}>
 {message.text}
 </Text>
 </View>
 </View>
 ))}

 {/* Animated Typing Indicator */}
 {isLoading && (
 <View style={styles.loadingContainer}>
 <View style={styles.botAvatarSmall}>
 <Image 
 source={require('../assets/Images/chatbot_header.gif')} 
 style={styles.botAvatarGif}
 resizeMode="contain"
 />
 </View>
 <View style={styles.loadingBubble}>
 <View style={styles.typingIndicator}>
 <Animated.View 
 style={[
 styles.typingDot,
 {
 opacity: typingDot1.interpolate({
 inputRange: [0, 1],
 outputRange: [0.3, 1],
 }),
 transform: [{
 translateY: typingDot1.interpolate({
 inputRange: [0, 1],
 outputRange: [0, -5],
 }),
 }],
 }
 ]} 
 />
 <Animated.View 
 style={[
 styles.typingDot,
 {
 opacity: typingDot2.interpolate({
 inputRange: [0, 1],
 outputRange: [0.3, 1],
 }),
 transform: [{
 translateY: typingDot2.interpolate({
 inputRange: [0, 1],
 outputRange: [0, -5],
 }),
 }],
 }
 ]} 
 />
 <Animated.View 
 style={[
 styles.typingDot,
 {
 opacity: typingDot3.interpolate({
 inputRange: [0, 1],
 outputRange: [0.3, 1],
 }),
 transform: [{
 translateY: typingDot3.interpolate({
 inputRange: [0, 1],
 outputRange: [0, -5],
 }),
 }],
 }
 ]} 
 />
 </View>
 </View>
 </View>
 )}
 </ScrollView>

 {/* Input Area */}
 <Animated.View 
 style={[
 styles.inputWrapper,
 {
 bottom: inputBottomPosition,
 }
 ]}
 >
 <View style={styles.inputContainer}>
 <View style={styles.inputBox}>
 <TextInput
 style={styles.textInput}
 placeholder="Ask Me..."
 placeholderTextColor="#9CA3AF"
 value={userQuery}
 onChangeText={setUserQuery}
 onFocus={() => {
 setIsInputFocused(true);
 setTimeout(() => {
 scrollViewRef.current?.scrollToEnd({ animated: true });
 }, 400);
 }}
 onBlur={() => setIsInputFocused(false)}
 multiline
 maxLength={500}
 editable={!isLoading}
 returnKeyType="default"
 blurOnSubmit={false}
 />
 <TouchableOpacity 
 style={styles.submitButton}
 onPress={handleSubmit}
 disabled={!userQuery.trim() || isLoading}
 >
 <LinearGradient
 colors={userQuery.trim() && !isLoading ? ['#1E40AF', '#2563EB'] : ['#E5E7EB', '#E5E7EB']}
 start={{ x: 0, y: 0 }}
 end={{ x: 1, y: 1 }}
 style={styles.submitButtonGradient}
 >
 <MaterialCommunityIcons 
 name="send" 
 size={20} 
 color={userQuery.trim() && !isLoading ? "#fff" : "#9CA3AF"} 
 />
 </LinearGradient>
 </TouchableOpacity>
 </View>
 </View>
 {Platform.OS === 'ios' && <SafeAreaView edges={['bottom']} />}
 </Animated.View>
 </View>
 </Animated.View>
 </View>
 </Modal>
 );
};

const styles = StyleSheet.create({
 modalOverlay: {
 flex: 1,
 backgroundColor: 'rgba(0, 0, 0, 0.5)',
 justifyContent: 'center',
 alignItems: 'center',
 },
 portalContainer: {
 position: 'absolute',
 width: 200,
 height: 200,
 justifyContent: 'center',
 alignItems: 'center',
 },
 portalRing: {
 position: 'absolute',
 width: 180,
 height: 180,
 borderRadius: 90,
 padding: 4,
 },
 portalRingGradient: {
 width: '100%',
 height: '100%',
 borderRadius: 90,
 },
 particle: {
 position: 'absolute',
 width: 8,
 height: 8,
 borderRadius: 4,
 backgroundColor: '#fff',
 },
 portalCenter: {
 width: 100,
 height: 100,
 borderRadius: 50,
 overflow: 'hidden',
 },
 portalCenterGradient: {
 width: '100%',
 height: '100%',
 justifyContent: 'center',
 alignItems: 'center',
 },
 portalText: {
 position: 'absolute',
 bottom: -40,
 fontSize: 16,
 fontWeight: '700',
 color: '#fff',
 textShadowColor: 'rgba(0, 0, 0, 0.3)',
 textShadowOffset: { width: 0, height: 2 },
 textShadowRadius: 4,
 },
 chatModalContainer: {
 position: 'absolute',
 bottom: 0,
 width: width,
 height: height * 0.85,
 backgroundColor: '#fff',
 borderTopLeftRadius: 20,
 borderTopRightRadius: 20,
 overflow: 'hidden',
 shadowColor: '#000',
 shadowOffset: {
 width: 0,
 height: -2,
 },
 shadowOpacity: 0.1,
 shadowRadius: 8,
 elevation: 10,
 },
 chatHeader: {
 flexDirection: 'row',
 alignItems: 'center',
 justifyContent: 'space-between',
 paddingHorizontal: 16,
 paddingVertical: 14,
 paddingTop: Platform.OS === 'ios' ? 50 : 14,
 },
 chatHeaderContent: {
 flexDirection: 'row',
 alignItems: 'center',
 gap: 10,
 },
 aiIconContainer: {
 width: 36,
 height: 36,
 borderRadius: 18,
 backgroundColor: 'rgba(255, 255, 255, 0.2)',
 justifyContent: 'center',
 alignItems: 'center',
 overflow: 'hidden',
 },
 headerGif: {
 width: 32,
 height: 32,
 },
 chatHeaderTitle: {
 fontSize: 16,
 fontWeight: '700',
 color: '#fff',
 },
 chatHeaderSubtitle: {
 fontSize: 12,
 color: 'rgba(255, 255, 255, 0.8)',
 marginTop: 1,
 },
 headerButtons: {
 flexDirection: 'row',
 alignItems: 'center',
 gap: 8,
 },
 clearButton: {
 width: 32,
 height: 32,
 borderRadius: 16,
 backgroundColor: 'rgba(255, 255, 255, 0.2)',
 justifyContent: 'center',
 alignItems: 'center',
 },
 closeButton: {
 width: 32,
 height: 32,
 borderRadius: 16,
 backgroundColor: 'rgba(255, 255, 255, 0.2)',
 justifyContent: 'center',
 alignItems: 'center',
 },
 chatContent: {
 flex: 1,
 backgroundColor: '#F9FAFB',
 position: 'relative',
 },
 messagesContainer: {
 flex: 1,
 },
 messagesContent: {
 flexGrow: 1,
 paddingBottom: 90,
 },
 emptyStateContainer: {
 paddingTop: 30,
 paddingHorizontal: 20,
 alignItems: 'center',
 },
 robotContainer: {
 alignItems: 'center',
 position: 'relative',
 marginBottom: 20,
 },
 robotAvatar: {
 width: 70,
 height: 70,
 borderRadius: 35,
 overflow: 'hidden',
 backgroundColor: '#fff',
 justifyContent: 'center',
 alignItems: 'center',
 shadowColor: '#2563EB',
 shadowOffset: {
 width: 0,
 height: 4,
 },
 shadowOpacity: 0.2,
 shadowRadius: 8,
 elevation: 8,
 },
 robotGif: {
 width: 60,
 height: 60,
 },
 robotAvatarGradient: {
 width: '100%',
 height: '100%',
 justifyContent: 'center',
 alignItems: 'center',
 },
 wavingHand: {
 position: 'absolute',
 top: -8,
 right: -8,
 transformOrigin: 'bottom center',
 },
 handEmoji: {
 fontSize: 28,
 },
 greetingContainer: {
 width: '100%',
 marginBottom: 24,
 },
 greetingBubble: {
 backgroundColor: '#fff',
 padding: 16,
 borderRadius: 16,
 shadowColor: '#000',
 shadowOffset: {
 width: 0,
 height: 2,
 },
 shadowOpacity: 0.05,
 shadowRadius: 8,
 elevation: 2,
 borderWidth: 1,
 borderColor: '#F3F4F6',
 },
 greetingText: {
 fontSize: 15,
 color: '#374151',
 lineHeight: 22,
 textAlign: 'center',
 },
 examplesContainer: {
 width: '100%',
 marginTop: 8,
 },
 examplesTitle: {
 fontSize: 13,
 fontWeight: '600',
 color: '#6B7280',
 marginBottom: 12,
 marginLeft: 4,
 },
 exampleCard: {
 flexDirection: 'row',
 alignItems: 'center',
 backgroundColor: '#fff',
 padding: 14,
 borderRadius: 12,
 marginBottom: 8,
 borderWidth: 1,
 borderColor: '#E5E7EB',
 shadowColor: '#000',
 shadowOffset: {
 width: 0,
 height: 1,
 },
 shadowOpacity: 0.03,
 shadowRadius: 2,
 elevation: 1,
 },
 exampleIcon: {
 marginRight: 10,
 },
 exampleText: {
 flex: 1,
 fontSize: 14,
 color: '#374151',
 lineHeight: 20,
 },
 messageBubble: {
 flexDirection: 'row',
 marginVertical: 4,
 paddingHorizontal: 16,
 },
 userMessage: {
 justifyContent: 'flex-end',
 },
 botMessage: {
 justifyContent: 'flex-start',
 alignItems: 'flex-start',
 },
 botAvatarSmall: {
 width: 28,
 height: 28,
 borderRadius: 14,
 backgroundColor: '#fff',
 justifyContent: 'center',
 alignItems: 'center',
 marginRight: 8,
 marginTop: 4,
 overflow: 'hidden',
 },
 botAvatarGif: {
 width: 24,
 height: 24,
 },
 messageContent: {
 maxWidth: '75%',
 padding: 12,
 borderRadius: 16,
 },
 userMessageContent: {
 backgroundColor: '#2563EB',
 borderBottomRightRadius: 4,
 },
 botMessageContent: {
 backgroundColor: '#fff',
 borderWidth: 1,
 borderColor: '#E5E7EB',
 borderBottomLeftRadius: 4,
 },
 errorMessageContent: {
 backgroundColor: '#FEF2F2',
 borderColor: '#FCA5A5',
 },
 messageText: {
 fontSize: 15,
 lineHeight: 21,
 },
 userMessageText: {
 color: '#fff',
 },
 botMessageText: {
 color: '#374151',
 },
 errorMessageText: {
 color: '#DC2626',
 },
 loadingContainer: {
 flexDirection: 'row',
 marginVertical: 4,
 paddingHorizontal: 16,
 justifyContent: 'flex-start',
 alignItems: 'flex-start',
 },
 loadingBubble: {
 backgroundColor: '#fff',
 borderWidth: 1,
 borderColor: '#E5E7EB',
 borderRadius: 16,
 borderBottomLeftRadius: 4,
 padding: 12,
 paddingHorizontal: 20,
 minWidth: 70,
 },
 typingIndicator: {
 flexDirection: 'row',
 alignItems: 'center',
 justifyContent: 'center',
 gap: 6,
 height: 20,
 },
 typingDot: {
 width: 8,
 height: 8,
 borderRadius: 4,
 backgroundColor: '#2563EB',
 },
 inputWrapper: {
 position: 'absolute',
 left: 0,
 right: 0,
 backgroundColor: '#fff',
 borderTopWidth: 1,
 borderTopColor: '#E5E7EB',
 shadowColor: '#000',
 shadowOffset: {
 width: 0,
 height: -2,
 },
 shadowOpacity: 0.05,
 shadowRadius: 3,
 elevation: 5,
 },
 inputContainer: {
 paddingHorizontal: 16,
 paddingTop: 12,
 paddingBottom: Platform.OS === 'android' ? 12 : 8,
 },
 inputBox: {
 flexDirection: 'row',
 alignItems: 'center',
 backgroundColor: '#F9FAFB',
 borderRadius: 24,
 borderWidth: 1,
 borderColor: '#E5E7EB',
 paddingLeft: 16,
 paddingRight: 6,
 paddingVertical: 6,
 minHeight: 48,
 },
 textInput: {
 flex: 1,
 fontSize: 15,
 color: '#111827',
 maxHeight: 100,
 paddingTop: 8,
 paddingBottom: 8,
 paddingHorizontal: 0,
 textAlignVertical: 'center',
 },
 submitButton: {
 marginLeft: 8,
 alignSelf: 'center',
 },
 submitButtonGradient: {
 width: 36,
 height: 36,
 borderRadius: 18,
 justifyContent: 'center',
 alignItems: 'center', 
 },
});

export default AIChat;