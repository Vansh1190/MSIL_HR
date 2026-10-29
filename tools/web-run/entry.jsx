import React, {useCallback, useState} from 'react';
import {render} from 'react-dom';
import {Image, StyleSheet, Text, View} from 'react-native';
import OnboardingScreen from '/root/workspace-agent-server/MSIL_HR/src/Auth/Onboarding';

const LOGO = require('/root/workspace-agent-server/MSIL_HR/src/assets/Images/maruti_logo.png');
const HRASS = require('/root/workspace-agent-server/MSIL_HR/src/assets/Images/hrass.png');

const SignInPlaceholder = ({route}) => (
  <View style={S.signin}>
    <Image source={HRASS} style={S.hrass} resizeMode="contain" />
    <Image source={LOGO} style={S.logo} resizeMode="contain" />
    <Text style={S.signinTitle}>Sign In</Text>
    <Text style={S.signinBody}>Onboarding finished — encrypted flag stored, navigator moved to “{route}”.</Text>
    <View style={S.field}>
      <Text style={S.fieldLabel}>EMPLOYEE ID</Text>
    </View>
    <View style={S.field}>
      <Text style={S.fieldLabel}>PASSWORD</Text>
    </View>
    <View style={S.cta}>
      <Text style={S.ctaText}>LOGIN</Text>
    </View>
  </View>
);

const App = () => {
  const [route, setRoute] = useState(null);
  const [run, setRun] = useState(0);

  const navigation = useCallback({navigate: (name) => setRoute(name), replace: (name) => setRoute(name)}, []);
  const replay = useCallback(() => {
    setRoute(null);
    setRun((r) => r + 1);
  }, []);

  React.useEffect(() => {
    window.__replay = replay;
    window.__route = () => route;
  }, [replay, route]);

  if (route) return <SignInPlaceholder route={route} />;
  return <OnboardingScreen key={run} navigation={navigation} />;
};

const S = StyleSheet.create({
  signin: {flex: 1, backgroundColor: '#06070C', alignItems: 'center', justifyContent: 'center', padding: 28},
  hrass: {width: 120, height: 44, marginBottom: 10},
  logo: {width: 96, height: 96, marginBottom: 22},
  signinTitle: {color: '#FFFFFF', fontSize: 26, fontWeight: '700', marginBottom: 8},
  signinBody: {color: 'rgba(255,255,255,0.72)', fontSize: 14, textAlign: 'center', lineHeight: 20, marginBottom: 26},
  field: {
    width: '100%',
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  fieldLabel: {color: 'rgba(255,255,255,0.45)', fontSize: 11, letterSpacing: 1.6},
  cta: {
    width: '100%',
    height: 54,
    borderRadius: 14,
    backgroundColor: '#7D9AF2',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  ctaText: {color: '#06070C', fontSize: 14, fontWeight: '700', letterSpacing: 1.8},
});

render(<App />, document.getElementById('root'));
