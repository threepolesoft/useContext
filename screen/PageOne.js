import React, { useContext, useState } from 'react'
import { View, Text, TextInput } from 'react-native'
import PageTwo from './PageTwo';
import { UC } from './UC';
import { UCTwo } from './UCTwo';

export default function PageOne() {

    const [user, setUser] = useContext(UC);

    const [name, setName] = useState('');

    return (
        <UCTwo.Provider value={name}>

            <Text>{ }</Text>

            <TextInput
                placeholder='Input here'
                onChangeText={(e) => {

                    setName(`${user.name} ${e}`);
                    //setUser({ ...user, name: e })
                }}
            >

            </TextInput>

            <PageTwo />
        </UCTwo.Provider>
    )
}
