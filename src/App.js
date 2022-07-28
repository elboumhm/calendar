import React, { useEffect } from 'react'
import axios from 'axios'
import moment from 'moment'
import 'moment/locale/ar'
import 'moment/locale/fr'
import './App.css'
/*    width: 100px;
    height: 120px; */
const App = () => {
        const [originalTime, setTimeOriginal] = React.useState('')
        const [originalDays, setOriginalDays] = React.useState('')

        const [data, setData] = React.useState('')
        const [selectedDay, setSelectedDay] = React.useState()
        const [elbou, setElbou] = React.useState()
        const [timeUser, setTimeUser] = React
            .useState
            //   [
            //   {
            //     date: 'Tue Jul 19 2022 00:00:00 GMT+0100 (UTC+02:00)',
            //     time: '13:00-13:30'
            //   },
            //   {
            //     date: 'Thu Jul 14 2022 00:00:00 GMT+0100 (UTC+02:00)',
            //     time: '14:00-14:30'
            //   },
            //   {
            //     date: 'Tue Jul 19 2022 00:00:00 GMT+0100 (UTC+02:00)',
            //     time: '15:00-15:30'
            //   }
            // ]
            ()

        const [time, setTime] = React.useState()
        const [timeInable, setTimeInable] = React.useState()
        const [selectedtime, setSelectedTime] = React.useState(new Date())
        const [DayInable, setDayInable] = React.useState([])
        React.useEffect(() => {
            async function fetchData() {
                //   await axios.get('http://localhost:5000/elbou').then(res => {
                //     setData(res.data)
                //   })
                axios.get(`http://localhost:5000/Day`).then(res => {
                    console.log('elbou', res.data)
                    setData(res.data)
                })
                axios.get(`http://localhost:5000/getTimes`).then(res => {
                    console.log('times', res.data)
                    setTime(res.data)
                })
                axios.get(`http://localhost:5000/getMyDate/12345678`).then(res => {
                    console.log('result====>', res)
                    setSelectedDay({
                        ...selectedDay,
                        date: res.data ? new Date(res.data.Date) : new Date(),
                        timeDesiable: []
                    })
                    console.log(
                        'hello Date',
                        new Date(res.data.Date).setHours(0, 0, 0, 0),
                        new Date().setHours(0, 0, 0, 0)
                    )
                    setSelectedTime(
                        res.data ?
                        new Date(res.data.Date).setHours(0, 0, 0, 0) >=
                        new Date().setHours(0, 0, 0, 0) && res.data.time :
                        ''
                    )
                    setTimeOriginal(
                        res.data ?
                        new Date(res.data.Date).setHours(0, 0, 0, 0) >=
                        new Date().setHours(0, 0, 0, 0) && res.data.time :
                        ''
                    )
                    setOriginalDays(res.data ? new Date(res.data.Date) : '')
                })
                axios.get(`http://localhost:5000/getDayInable`).then(res => {
                    const tab =
                        res.data &&
                        res.data.map(e => {
                            // const D = new Date(e.Date).setDate(new Date(e.Date).getDate() - 1)
                            return new Date(e.Date)
                        })
                    setDayInable(tab)
                })
                axios.get(`http://localhost:5000/getTimeInable`).then(res => {
                    setTimeInable(res.data)
                })
                axios.get(`http://localhost:5000/getAllDay/12345678`).then(res => {
                    console.log('timeEnable', res.data)
                    setTimeUser(res.data)
                })
            }
            fetchData()
        }, [])

        React.useEffect(() => {
            async function fetchData() {
                const tab = [...data]
                tab &&
                    tab.map((r, i) => {
                        DayInable.length > 0 &&
                            DayInable.map(q => {
                                if (new Date(q).getTime() == new Date(r.date).getTime()) {
                                    tab[i].available = false
                                }
                            })
                    })

                setData(tab)
            }
            fetchData()
        }, [DayInable])
        useEffect(() => {
            data &&
                timeUser &&
                timeUser.map(r => {
                    data.map(q => {
                        if (new Date(r.Date).getTime() == new Date(q.date).getTime()) {
                            if (!q.timeDesiable.includes(r.time)) {
                                q.timeDesiable.push(r.time)
                            }
                        }
                        // timeInable.push(r)
                    })
                })

            const tabTime = []

            data &&
                data.map(r => {
                    timeInable &&
                        timeInable.map(q => {
                            if (new Date(r.date).getTime() == new Date(q.Date).getTime()) {
                                q.time.map(t => {
                                    if (!r.timeDesiable.includes(t)) {
                                        r.timeDesiable && r.timeDesiable.push(t)
                                    }
                                })
                            }
                        })
                })
            selectedDay &&
                data.length > 0 &&
                data.map(r => {
                    if (
                        new Date(r.date).getTime() == new Date(selectedDay.date).getTime()
                    ) {
                        r.timeDesiable.map(q => {
                            if (!selectedDay.timeDesiable.includes(q)) {
                                selectedDay.timeDesiable.push(q)
                                selectedDay.available = true
                            }
                        })
                    }
                })
                // console.log("ici c est la blem",selectedDay)
            selectedDay &&
                time &&
                time.map(r => {
                    if (
                        selectedDay &&
                        selectedDay.timeDesiable &&
                        selectedDay.timeDesiable.includes(r.time) &&
                        !(
                            new Date(selectedDay.date).getTime() ==
                            new Date(originalDays).getTime() && r.time == originalTime
                        )
                    ) {
                        const item = { time: r.time, available: false }
                        tabTime.push(item)
                        selectedDay.available = true
                    } else {
                        const item = { time: r.time, available: true }
                        tabTime.push(item)
                    }
                    setSelectedTime(
                        selectedDay &&
                        originalDays &&
                        new Date(selectedDay.date).getTime() ==
                        new Date(originalDays).getTime() ?
                        originalTime :
                        ''
                    )

                    setElbou(tabTime)
                })

            console.log('selectedDay', selectedDay, tabTime)
        }, [selectedDay, timeInable, timeUser, originalTime, time, data])
        return ( < div >
            <
            div style = {
                {
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    // height:"100%",
                    backgroundColor: "#F4F5F8"
                }
            } >
            <
            div style = {
                {
                    display: 'flex',
                    width: '50%',
                    flexDirection: 'row',
                    // justifyContent: 'center',
                    alignItems: 'center',
                    columnGap: '5px',
                    flexWrap: 'wrap',
                    borderRadius: '5px',
                    margin: "10px",
                    // border:"0.1px solid black",
                    backgroundColor: 'white',
                    // height:"420px",
                    padding: "0 30px",
                    boxShadow: "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px"
                }
            } >


            {
                data &&
                data.map((r, i) => {
                    return !r.available ? ( <
                        div className = 'inactive'
                        key = { i } >
                        <
                        div >
                        <
                        span style = {
                            {
                                fontSsize: '20px',
                                fontWeight: 700
                            }
                        } >
                        { ' ' } { new Date(r.date).getDate() } { ' ' } <
                        /span>{' '} <
                        br / >
                        <
                        span style = {
                            { fontSsize: '25px', fontWeight: 600 } } > { ' ' } {
                            moment(r.date)
                                .locale('ar')
                                .format('dddd')
                        } { ' ' } <
                        /span>{' '} <
                        br / >
                        <
                        span > { ' ' } {
                            moment(r.date)
                                .locale('ar')
                                .format('MMMM')
                        } { ' ' } <
                        /span>{' '} <
                        br / >
                        <
                        span > { ' ' } {
                            moment(r.date)
                                .locale('fr')
                                .format('YYYY')
                        } { ' ' } <
                        /span>{' '} <
                        /div>{' '} <
                        /div>
                    ) : ( <
                        div key = { i }
                        className = {
                            selectedDay &&
                            new Date(r.date).getDate() ===
                            new Date(selectedDay.date).getDate() &&
                            new Date(r.date).getMonth() ===
                            new Date(selectedDay.date).getMonth() ?
                            'selected' :
                                'autre'
                        }
                        onClick = {
                            e => {
                                console.log(
                                        'verify',
                                        new Date(r.date).getTime() ==
                                        new Date(originalDays).getTime() &&
                                        r.timeDesiable.includes(originalTime)
                                    )
                                    // setSelectedDay(r.date==originalDays && r.timeDesiable.includes(originalTime)?r.timeDesiable.pull(timeOrigin):r)
                                if (
                                    new Date(r.date).getTime() ==
                                    new Date(originalDays).getTime() &&
                                    r.timeDesiable.includes(originalTime)
                                ) {
                                    const index = r.timeDesiable.indexOf(originalTime)
                                    setSelectedDay(r.timeDesiable.splice(index, 1))

                                    console.log('datassss', r)
                                }
                                setSelectedDay(r)
                            }
                        } >
                        <
                        div style = {
                            {} } >
                        <
                        span style = {
                            {
                                fontSsize: '20px',
                                fontWeight: 700
                            }
                        } >
                        { ' ' } { new Date(r.date).getDate() } { ' ' } <
                        /span>{' '} <
                        br / >
                        <
                        span style = {
                            { fontSsize: '25px', fontWeight: 600 } } > { ' ' } {
                            moment(r.date)
                                .locale('ar')
                                .format('dddd')
                        } { ' ' } <
                        /span>{' '} <
                        br / >
                        <
                        span > { ' ' } {
                            moment(r.date)
                                .locale('ar')
                                .format('MMMM')
                        } { ' ' } <
                        /span>{' '} <
                        br / >
                        <
                        span > { ' ' } {
                            moment(r.date)
                                .locale('fr')
                                .format('YYYY')
                        } { ' ' } <
                        /span>{' '} <
                        /div>{' '} <
                        /div>
                    )
                })
            } { ' ' }

            <
            /div>{' '} <
            div style = {
                { width: '50%', height: "100%" } } >
            <
            div style = {
                {
                    display: 'flex',
                    width: '100%',
                    flexDirection: 'row',
                    // justifyContent: 'center',
                    alignItems: 'center',
                    gap: '5px',
                    flexWrap: 'wrap',
                    borderRadius: '5px',
                    margin: "10px",
                    backgroundColor: 'white',
                    // height:"400px",
                    padding: "20px",
                    boxShadow: "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px"


                }
            } >
            { ' ' } {
                elbou &&
                    elbou.map(q => {
                        return ( <
                            div onClick = {
                                () => setSelectedTime(q.time) }
                            style = {
                                {
                                    fontWeight: 'bold',
                                    width: '171px',
                                    height: '54px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }
                            }
                            className = {!q.available ?
                                'inactiveTime' :
                                    selectedtime == q.time ||
                                    (new Date(selectedDay).getTime() ==
                                        new Date(originalDays).getTime() &&
                                        originalTime == q.time) ?
                                    'selectedTime' :
                                    'autreTime'
                            } >
                            { ' ' } { /* {selectedtime==q.time && se.timeDesiable=[]} */ } { ' ' } <
                            div > { q.time } < /div>{' '} <
                            /div>
                        )
                    })
            } { ' ' } <
            /div>{' '} {
                /* <div
                          style={{
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            marginTop: '10px'
                          }}
                        >
                          <button
                            style={{
                              cursor: 'pointer',
                              fontWeight: 'bold',
                              fontSize: '20px',
                              // marginLeft: '20px',
                              border: 'none',
                              width: '188px',
                              height: '60px',
                              background: '#EA0000',
                              color: 'white',
                              bottom: '150px'
                            }}
                            onClick={async () => {
                              await axios
                                .post('http://localhost:5000/create', {
                                  date: selectedDay.date,
                                  time: selectedtime,
                                  userId: '12345678'
                                })
                                .then(res => {
                                  console.log('res==>', res)
                                })
                            }}
                          >
                            {' '}
                            envoyer{' '}
                          </button>{' '}
                        </div> */
            }

            <
            div >
            <
            /div> <
            /div>{' '}

            <
            /div> <
            div style = {
                { width: "100%" } } >
            <
            span style = {
                {
                    fontSsize: '20px',
                    fontWeight: 700
                }
            } >
            { ' ' } { selectedDay && new Date(selectedDay.date).getDate() } { ' ' } <
            /span>{' '} <
            span style = {
                { fontSsize: '25px', fontWeight: 600 } } > { ' ' } {
                selectedDay && moment(selectedDay.date)
                    .locale('ar')
                    .format('dddd')
            } { ' ' } <
            /span>{' '} <
            span > { ' ' } {
                selectedDay && moment(selectedDay.date)
                    .locale('ar')
                    .format('MMMM')
            } { ' ' } <
            /span>{' '} <
            span > { ' ' } {
                selectedDay && moment(selectedDay.date)
                    .locale('fr')
                    .format('YYYY')
            } { ' ' } <
            /span>{console.log("selectedTime========",selectedtime)} <
            span >

            {
                selectedtime && < h1 > { selectedtime.toString() } < /h1>}


                <
                /span>{' '} <
                /div> <
                /div>
            )
        }

        export default App
        //          {/* <Calendar /> */}
        /*
          className={
                           timeInable.map(q=>{
                            if(q.date==selectedDay)
                            {
                              q.time.includes(r)  ? 'inactive'
                              : 'autre'
                            }
                           })
                              
                          }
        */
        //          {/* <Calendar /> */}