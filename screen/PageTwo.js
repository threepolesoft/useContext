import React, { useContext } from 'react'
import { View, Text } from 'react-native'
import { UCTwo } from './UCTwo';


export default function PageTwo() {

    const name = useContext(UCTwo);

    return (
        <View>
            <Text>{name}</Text>
        </View>
    )
}
