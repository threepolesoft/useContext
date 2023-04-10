import { createContext, useState, useEffect } from 'react'
import Router, { useRouter } from 'next/router'
import { API_AIR_URL, flightDiscount } from '../config/index'
import { API_DOMAIN_URL_ONE } from '../config/index'
import { API_DOMAIN_URL_HotelData } from '../config/index'
import axios from 'axios'

import passenger_data from '../data/passengerDetails.json'

const FlightContext = createContext()
const MyBookingContext = createContext()

export const FlightProvider = ({ children }) => {
    const [journeyDate, setJourneyDate] = useState(new Date())
    //const ISODate = dt.toISOString().split('T')[0]

    const [flights, setFlights] = useState([])
    const [roundFlight, setRoundflights] = useState([])
    const [flightType, setFlightype] = useState('One Way')

    // const [airports, setAirports] = useState([])
    // const [airlines, setAirlines] = useState([])
    // const [logos, setLogos] = useState([])

    const [trips, setTrips] = useState([
        {
            from: 'DAC',
            fromName: 'Hazrat Shahjalal International Airport',
            journey_date: journeyDate,
            to: 'AUS',
            toName: 'Austin Bergstrom International Airport'
        }
    ])

    const [margeData, setMargeData] = useState([])

    const [myBookingData, setMybookingdata] = useState([])

    const [packageBooking, setPackageBooking] = useState([])
    const [hotelBooking, setHotelBooking] = useState([])

    const [msg, setMsg] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    const [selectedFlight, setSelectedFlight] = useState()

    const [multiCities, setMultiCitites] = useState([
        {
            from: null,
            fromName: null,
            journey_date: null,
            to: null,
            toName: null
        }
    ])

    const [fromDestination, setFromDestination] = useState({
        name: 'Hazrat Shahjalal International Airport',
        city: 'Dhaka',
        iata: 'DAC',
        country: 'Bangladesh'
    })
    const [toDestination, setToDestination] = useState({
        name: 'Austin Bergstrom International Airport',
        city: 'Austin',
        iata: 'AUS',
        country: 'United States'
    })

    const [adults, setAdults] = useState(1)
    const [_children, set_Children] = useState([])
    const [infants, setInfants] = useState(0)
    const [childCount, setChildCount] = useState(0)

    const [adultList, setAdultList] = useState([
        {
            dateOfBirth: '',
            passportIssueDate: '',
            passportExpireDate: '',
            name: '',
            surname: '',
            gender: '',
            passportNumber: '',
            contactNumber: '',
            email: '',
            countryOfIssue: '',
            nationality: ''
        }
    ])
    const [childrenList, setChildrenList] = useState([])
    const [infantList, setInfantList] = useState([])

    ///////////////start new code////////////////////////////////////

    // const [version, setVersion] = useState()
    // const [messages, setMessages] = useState()
    const [statistics, setStatistics] = useState()
    // const [scheduleDescs, setScheduleDescs] = useState([])
    // const [taxDescs, setTaxDescs] = useState([])
    // // const [taxSummaryDescs] = useState()
    // // const [obFeeDescs] = useState()
    // // const [fareComponentDescs] = useState()
    // const [baggageAllowanceDescs, setBaggageAllowanceDescs] = useState([])
    // const [legDescs, setLegDescs] = useState([])
    // const [itineraryGroups, setItineraryGroups] = useState([])

    const [maxPrice, setMaxPrice] = useState(0)

    const [roundTripDate, setRoundTripDate] = useState({
        startDate: null,
        endDate: null
    })
    ///////////////end new code////////////////////////////////////

    // useEffect(() => {
    //     getFlights()
    // }, [adults, childCount, infants])

    const assignFromDestination = (dest, index) => {
        const temp_trip = [...trips]
        temp_trip[index].from = dest.iata
        temp_trip[index].fromName = dest.name
        setTrips(temp_trip)
        // if (flightType == 'Multi City') {
        //     const temp = [...multiCities]
        //     temp[index].from = dest.iata
        //     temp[index].fromName = dest.name
        //     setMultiCitites(temp)
        // } else {
        //     setFromDestination(dest)
        // }
    }
    const assignToDestination = (dest, index) => {
        const temp_trip = [...trips]
        temp_trip[index].to = dest.iata
        temp_trip[index].toName = dest.name
        setTrips(temp_trip)
        // if (flightType == 'Multi City') {
        //     const temp = [...multiCities]
        //     temp[index].to = dest.iata
        //     temp[index].toName = dest.name
        //     setMultiCitites(temp)
        // } else {
        //     setToDestination(dest)
        // }
    }
    const assignJourneyDate = (date, index) => {
        const temp_trip = [...trips]
        temp_trip[index].journey_date = new Date(date)
        setTrips(temp_trip)
        // if (flightType == 'Multi City') {
        //     const localeDate = date
        //         .toLocaleDateString('en-GB', {
        //             year: 'numeric',
        //             month: 'numeric',
        //             day: 'numeric'
        //         })
        //         .split('/')

        //     const formattedDate =
        //         localeDate[2] + '-' + localeDate[1] + '-' + localeDate[0]

        //     const temp = [...multiCities]
        //     temp[index].journey_date = formattedDate
        //     setMultiCitites(temp)
        // } else {
        //     setJourneyDate(date)
        // }

        //console.log(index)
    }

    const assignFlight = (flight) => {
        console.log(flight)
        setSelectedFlight(flight)
        Router.push('/checkout')
    }

    // useEffect(() => {
    //     console.log(flightType)
    // }, [flightType])

    // Register user
    const getFlights = async () => {
        setLoading(true)

        let scheduleDescs
        let taxDescs
        let baggageAllowanceDescs
        let legDescs
        let itineraryGroups

        const tokenRes = await fetch(`${API_AIR_URL}/token`)
        const tokenData = await tokenRes.json()
        //console.log('all airports', tokenRes)
        let flightSegment = []
        console.log(flightType)
        if (flightType == 'One Way') {
            let temp_trip = { ...trips[0] }

            const localeDate = temp_trip.journey_date
                .toLocaleDateString('en-GB', {
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric'
                })
                .split('/')

            const formattedDate =
                localeDate[2] + '-' + localeDate[1] + '-' + localeDate[0]

            temp_trip.journey_date = formattedDate

            flightSegment = [temp_trip]
        } else if (flightType == 'Round Way') {
            if (!roundTripDate.endDate) {
                alert('Please add return date')
                setFlights([])
                setLoading(false)
                return
            }

            let temp_trip = { ...trips[0] }
            flightSegment = [
                {
                    from: temp_trip.from,
                    fromName: temp_trip.fromName,
                    journey_date: roundTripDate.startDate,
                    to: temp_trip.to,
                    toName: temp_trip.toName
                },
                {
                    from: temp_trip.to,
                    fromName: temp_trip.toName,
                    journey_date: roundTripDate.endDate,
                    to: temp_trip.from,
                    toName: temp_trip.fromName
                }
            ]
        } else if (flightType == 'Multi City') {
            flightSegment = [...trips]
            for (let fs = 0; fs < flightSegment.length; fs++) {
                const jd = new Date(flightSegment[fs].journey_date)
                const localeDate = jd
                    .toLocaleDateString('en-GB', {
                        year: 'numeric',
                        month: 'numeric',
                        day: 'numeric'
                    })
                    .split('/')

                const formattedDate =
                    localeDate[2] + '-' + localeDate[1] + '-' + localeDate[0]

                flightSegment[fs].journey_date = formattedDate
            }
        }

        let flightBody = {
            flightSegment: flightSegment,
            return_date: null,
            adult: adults,
            infant: infants,
            ins: 0,
            children: [],
            seatClass: 'Y',
            token: tokenData.access_token
        }

        const flightRes = await fetch(`${API_AIR_URL}/get_flights_post`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(flightBody)
        })

        const flightData = await flightRes.json()
        if (
            flightData.groupedItineraryResponse &&
            flightData.groupedItineraryResponse.statistics.itineraryCount != 0
        ) {
            scheduleDescs = flightData.groupedItineraryResponse.scheduleDescs
            taxDescs = flightData.groupedItineraryResponse.taxDescs
            baggageAllowanceDescs =
                flightData.groupedItineraryResponse.baggageAllowanceDescs
            legDescs = flightData.groupedItineraryResponse.legDescs
            itineraryGroups =
                flightData.groupedItineraryResponse.itineraryGroups
        } else {
            setError('Flight Error')
            setFlights([])
            setLoading(false)
            return new Error('Flight Error')
        }
        //console.log('one trip Print', flights)

        //   Airport API

        const res_airports = await fetch(`${API_AIR_URL}/airports`, {
            method: 'GET',
            headers: {
                APP_KEY: '123456',
                'Content-Type': 'application/json'
            }
        })
        const airport_data = await res_airports.json()
        // console.log('want to see airports', data1.body)
        //setAirports(airport_data)
        let airports = airport_data.body
        // Airlines API

        const res_airlines = await fetch(`${API_AIR_URL}/airlines`, {
            method: 'GET',
            headers: {
                APP_KEY: '123456',
                'Content-Type': 'application/json'
            }
        })
        const airlines_data = await res_airlines.json()
        //console.log('want to see /airlines', data2.body)
        //console.log('airline print', data2.body)
        //setAirlines(airlines_data)
        let airlines = airlines_data.body
        //    Logos API
        const res_logos = await fetch(`${API_AIR_URL}/logos`, {
            method: 'GET',
            headers: {
                APP_KEY: '123456',
                'Content-Type': 'application/json'
            }
        })
        const logo_data = await res_logos.json()

        let logos = logo_data.body

        var itineraries = itineraryGroups[0].itineraries
        var groupDescription =
            itineraryGroups[0].groupDescription.legDescriptions

        for (let i = 0; i < scheduleDescs.length; i++) {
            try {
                scheduleDescs[i].show_details = false

                let min = scheduleDescs[i].elapsedTime

                let hr = 0

                while (min > 60) {
                    hr++
                    min = min - 60
                }

                scheduleDescs[i].elapsedTimeS = hr + 'hr ' + min + 'min'
                scheduleDescs[i].legDescriptions = groupDescription

                var itinerary = itineraries[i]
                var totalFare = itinerary
                    ? itinerary.pricingInformation[0].fare.totalFare
                    : 0
                var passengerInfoList = itinerary
                    ? itinerary.pricingInformation[0].fare.passengerInfoList
                    : []

                scheduleDescs[i].adult = { count: 0, totalFare: 0, totalTax: 0 }
                scheduleDescs[i].child = { count: 0, totalFare: 0, totalTax: 0 }
                scheduleDescs[i].infant = {
                    count: 0,
                    totalFare: 0,
                    totalTax: 0
                }
                console.log(itinerary)
                console.log(passengerInfoList)

                for (let k = 0; k < passengerInfoList.length; k++) {
                    let passengerInfo = passengerInfoList[k].passengerInfo

                    let tmp = {}
                    if (passengerInfo.passengerType == 'ADT') {
                        tmp.totalFare =
                            passengerInfo.passengerTotalFare.equivalentAmount
                        tmp.totalTax =
                            passengerInfo.passengerTotalFare.totalTaxAmount
                        tmp.count = passengerInfo.passengerNumber
                        scheduleDescs[i].adult = tmp
                    } else if (passengerInfo.passengerType == 'INF') {
                        tmp.totalFare =
                            passengerInfo.passengerTotalFare.equivalentAmount
                        tmp.totalTax =
                            passengerInfo.passengerTotalFare.totalTaxAmount
                        tmp.count = passengerInfo.passengerNumber
                        scheduleDescs[i].infant = tmp
                        console.log(scheduleDescs[i].infant)
                    } else {
                        tmp.totalFare =
                            passengerInfo.passengerTotalFare.equivalentAmount
                        tmp.totalTax =
                            passengerInfo.passengerTotalFare.totalTaxAmount
                        tmp.count = passengerInfo.passengerNumber
                        scheduleDescs[i].child = tmp
                    }
                }

                if (passengerInfoList.length > 0) {
                    let baggageRef =
                        passengerInfoList[0].passengerInfo.baggageInformation[0]
                            .allowance.ref

                    //scheduleDescs[i].baggageInformation =
                    scheduleDescs[i].baggageInformation =
                        baggageAllowanceDescs[baggageRef - 1]
                }

                scheduleDescs[i].currency = totalFare?.currency

                scheduleDescs[i].totalPrice = totalFare?.totalPrice

                if (scheduleDescs[i].totalPrice > maxPrice) {
                    setMaxPrice(scheduleDescs[i].totalPrice)
                }

                scheduleDescs[i].totalTaxAmount = totalFare?.totalTaxAmount
                scheduleDescs[i].weight = baggageAllowanceDescs[0]?.weight
                scheduleDescs[i].unit = baggageAllowanceDescs[0]?.unit
                scheduleDescs[i].departure.time = scheduleDescs[
                    i
                ].departure.time.slice(0, 5)
                scheduleDescs[i].arrival.time = scheduleDescs[
                    i
                ].arrival.time.slice(0, 5)
                scheduleDescs[i].way = flightType
                // fl[i].journey_date = moment(storeFlight.journey_date).format("MMM DD");
                // fl[i].return_date = moment(storeFlight.return_date).format("MMM DD");

                ///console.log("Finding airport name");

                for (
                    let ld = 0;
                    ld < scheduleDescs[i].legDescriptions.length;
                    ld++
                ) {
                    for (let i2 = 0; i2 < airports.length; i2++) {
                        if (
                            scheduleDescs[i].legDescriptions[ld]
                                .departureLocation === airports[i2].iata
                        ) {
                            scheduleDescs[i].airportFrom = airports[i2].name
                            scheduleDescs[i].legDescriptions[ld].airportFrom =
                                airports[i2].name
                        }

                        if (
                            scheduleDescs[i].legDescriptions[ld]
                                .arrivalLocation === airports[i2].iata
                        ) {
                            scheduleDescs[i].airportTo = airports[i2].name
                            scheduleDescs[i].legDescriptions[ld].airportTo =
                                airports[i2].name
                        }
                    }
                }

                /// console.log("Finding log");

                var icaoCode = ''
                var airlineName = ''

                for (let i2 = 0; i2 < airlines.length; i2++) {
                    if (
                        scheduleDescs[i].carrier.operating ===
                        airlines[i2].iata_code
                    ) {
                        //console.log(airports[i2].iata);
                        icaoCode = airlines[i2].icao_code
                        airlineName = airlines[i2].name
                        break
                    }
                }

                scheduleDescs[i].airlineName = airlineName

                for (let i2 = 0; i2 < logos.length; i2++) {
                    if (icaoCode === logos[i2].airline) {
                        //console.log(airports[i2].iata);
                        scheduleDescs[i].logo = logos[i2].logo
                        break
                    }
                }
                console.log(scheduleDescs)
                setFlights(scheduleDescs)
            } catch (e) {
                console.error(e)
            }
        }

        setLoading(false)
    }

    // My Booking data
    const myBooking = async (id) => {
        try {
            setLoading(false)
            const response = await fetch(`${API_AIR_URL}/my-pnr/39223`, {
                method: 'GET',
                headers: {
                    APP_KEY: '123456',
                    'Content-Type': 'application/json'
                }
            })
            const data = await response.json()

            //console.log('want to see response', data.body)
            let customers = ''
            for (let i = 0; i < data.body.length; i++) {
                data.body[i].customer = JSON.parse(data.body[i].customer)
            }
            for (let i = 0; i < data.body.length; i++) {
                data.body[i].pnr_body = JSON.parse(data.body[i].pnr_body)
            }
            // const customerData = JSON.parse(customers)
            // console.log('customer data', customerData)
            // console.log('customer data', customerData.contact_number)

            setMybookingdata(data.body)
        } catch (error) {
            console.log('error', error)
        }
    }

    const myPackageBooking = async (id) => {
        try {
            setLoading(false)
            const response = await fetch(
                `${API_DOMAIN_URL_ONE}/bookedpackage/search?limit=10&offset=1&user_id=39223`,
                {
                    method: 'GET',
                    headers: {
                        APP_KEY: '123456',
                        'Content-Type': 'application/json'
                    }
                }
            )
            const data = await response.json()

            //console.log('package', data.body)
            let customers = ''
            // for (let i = 0; i < data.body.length; i++) {
            //     data.body[i].customer = JSON.parse(data.body[i].customer)
            // }
            // for (let i = 0; i < data.body.length; i++) {
            //     data.body[i].pnr_body = JSON.parse(data.body[i].pnr_body)
            // }
            // const customerData = JSON.parse(customers)
            // console.log('customer data', customerData)
            // console.log('customer data', customerData.contact_number)

            setPackageBooking(data.body)
        } catch (error) {
            console.log('error', error)
        }
    }

    const myHotelBooking = async (id) => {
        try {
            setLoading(false)
            const response = await fetch(
                `${API_DOMAIN_URL_HotelData}/ws/getAllBookingListForCustomer?userId=39223`,
                {
                    method: 'GET',
                    headers: {
                        APP_KEY: '123456',
                        'Content-Type': 'application/json'
                    }
                }
            )
            const data = await response.json()

            console.log('Hotel', data.body)
            let customers = ''
            // for (let i = 0; i < data.body.length; i++) {
            //     data.body[i].customer = JSON.parse(data.body[i].customer)
            // }
            // for (let i = 0; i < data.body.length; i++) {
            //     data.body[i].pnr_body = JSON.parse(data.body[i].pnr_body)
            // }
            // const customerData = JSON.parse(customers)
            // console.log('customer data', customerData)
            // console.log('customer data', customerData.contact_number)

            setHotelBooking(data.body)
        } catch (error) {
            console.log('error', error)
        }
    }

    const addTraveler = (type, dob) => {
        let newPassenger = new Object(passenger_data)
        if (type == 'children') {
            setChildCount((count) => count + 1)
            let tempChdlist = [...childrenList, newPassenger]
            setChildrenList(tempChdlist)
        } else if (type == 'infant') {
            setInfants((count) => count + 1)
            let tempInflist = [...infantList, newPassenger]
            setInfantList(tempInflist)
        } else {
            setAdults((count) => count + 1)
            let tempAdtlist = [...adultList, newPassenger]
            setAdultList(tempAdtlist)
        }
    }

    const removeTraveler = (type) => {
        console.log('hi', type)
        if (type == 'children') {
            if (childCount - 1 < 0) {
                setChildCount(0)
            } else {
                setChildCount((count) => count - 1)
                let tempChdlist = [...childrenList]
                tempChdlist.pop()
                setChildrenList(tempChdlist)
            }
        } else if (type == 'infant') {
            if (infants - 1 < 0) {
                setInfants(0)
            } else {
                setInfants((count) => count - 1)
                let tempInflist = [...infantList]
                tempInflist.pop()
                setInfantList(tempInflist)
            }
        } else {
            if (adults - 1 < 1) {
                setAdults(1)
            } else {
                setAdults((count) => count - 1)
                let tempAdtlist = [...adultList]
                tempAdtlist.pop()
                setAdultList(tempAdtlist)
            }
        }
    }

    const addMultiCity = () => {
        const newTravel = {
            from: null,
            fromName: null,
            journey_date: null,
            to: null,
            toName: null
        }
        const temp = [...multiCities, newTravel]

        if (temp.length > 4) {
            return
        }
        setMultiCitites(temp)
    }
    const addTrip = () => {
        const newTravel = {
            from: null,
            fromName: null,
            journey_date: new Date(),
            to: null,
            toName: null
        }
        const temp = [...trips, newTravel]

        if (temp.length > 4) {
            return
        }
        setTrips(temp)
    }

    const create_pnr = async () => {
        const tokenRes = await fetch(`${API_AIR_URL}/token`)
        const tokenData = await tokenRes.json()
        const userId = JSON.parse(localStorage.getItem('userInfo')).userId
        console.log(tokenData)
        console.log(userId)
        let payment_ref
        const [, ...temp_adultList] = adultList
        const customers = [...temp_adultList, ...childrenList, ...infantList]
        console.log(customers)

        const body = {
            price: Math.ceil(selectedFlight.totalPrice * (1 - flightDiscount)),
            token: tokenData.access_token,
            source: 'mobile',
            toBePaid: Math.ceil(
                selectedFlight.totalPrice * (1 - flightDiscount)
            ),
            seatClass: 'Y',
            adultCount: adults,
            customerId: userId,
            usedCoupon: '',
            infantCount: infants,
            journeyType: flightType,
            childrenCount: childCount,
            couponDiscount: '',
            customer: {
                who: '',
                name: adultList[0].name,
                surname: adultList[0].surname,
                contactNumber: adultList[0].contactNumber,
                email: adultList[0].email,
                passportNumber: adultList[0].passportNumber,
                countryOfIssue: adultList[0].countryOfIssue,
                passportIssueDate: adultList[0].passportIssueDate,
                passportExpireDate: adultList[0].passportExpireDate,
                dateOfBirth: adultList[0].dateOfBirth,
                nationality: adultList[0].nationality,
                others: customers
            }
        }

        const url = API_AIR_URL + '/create_pnr'
        fetch(url, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
            .then(async (response) => {
                try {
                    console.log('PNR create request received.')

                    const data = await response.json()

                    console.log(data)

                    if (data?.success === true) {
                        payment_ref = data?.payment?.msg?.booking_ref
                        console.log(payment_ref)
                    }

                    const payment_data = {
                        total_amount: Math.ceil(
                            selectedFlight.totalPrice * (1 - flightDiscount)
                        ),
                        currency: selectedFlight.currency,
                        tran_id: payment_ref,
                        success_url: `${API_AIR_URL}/ssl-payment-success`,
                        fail_url: `${API_AIR_URL}/ssl-payment-fail`,
                        cancel_url: `${API_AIR_URL}/ssl-payment-cancel`,
                        shipping_method: 'No',
                        product_name: 'Flight',
                        product_category: 'Flight',
                        product_profile: 'general',
                        cus_name: adultList[0].name,
                        cus_email: adultList[0].email,
                        cus_add1: 'Dhaka',
                        cus_add2: 'Dhaka',
                        cus_city: 'Dhaka',
                        cus_state: 'Dhaka',
                        cus_postcode: '1000',
                        cus_country: 'Bangladesh',
                        cus_phone: adultList[0].contactNumber,
                        cus_fax: '',
                        multi_card_name: 'mastercard',
                        value_a: 'ref001_A',
                        value_b: 'ref002_B',
                        value_c: 'ref003_C',
                        value_d: 'ref004_D',
                        ipn_url: `${API_AIR_URL}/ssl-payment-notification`
                    }

                    console.log(payment_data)

                    const result = await axios.post(
                        '/api/payment',
                        payment_data
                    )
                    const redURL = result.data.redirectURL
                    Router.push(redURL)
                } catch (error) {}
            })
            .catch((error) => {
                console.error('There was an error!', error)
            })
    }

    return (
        <FlightContext.Provider
            value={{
                loading,
                msg,
                flights,
                error,
                getFlights,
                myBooking,
                myPackageBooking,
                myBookingData,
                packageBooking,
                margeData,
                selectedFlight,
                assignFlight,
                myHotelBooking,
                hotelBooking,
                assignFromDestination,
                assignToDestination,
                assignJourneyDate,
                adults,
                setAdults,
                _children,
                set_Children,
                infants,
                setInfants,
                childCount,
                setChildCount,
                flightType,
                setFlightype,
                adultList,
                childrenList,
                infantList,
                setAdultList,
                setChildrenList,
                setInfantList,
                roundTripDate,
                setRoundTripDate,
                addTraveler,
                removeTraveler,
                multiCities,
                setMultiCitites,
                addMultiCity,
                fromDestination,
                toDestination,
                journeyDate,
                create_pnr,
                trips,
                setTrips,
                addTrip
            }}>
            {children}
        </FlightContext.Provider>
    )
}

export default FlightContext
