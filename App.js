import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PageOne from './screen/PageOne';
import { UC } from './screen/UC';

export default function App() {


  const [user, setUser] = useState({ name: "Md. Milon", age: 26 })

  return (
    <UC.Provider value={[user, setUser]}>

      <View style={styles.container}>
        <Text>Open up App.js to start working on your app!</Text>
        <PageOne />
        <StatusBar style="auto" />
      </View>


    </UC.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
