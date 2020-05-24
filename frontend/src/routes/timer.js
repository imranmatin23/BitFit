/**
 * The timer page allows the user to time their workouts in a timer.
 * 
 * NOTE: This page needs to be refactored and commented by the authors. It might be 
 * a good idea to split these pages up because we route to them. Style also needs
 * to be put into a single stylesheet. Functions, classes, and methods must be commented.
 * 
 * Authors: ?
 */

// External Imports
import React, { Component } from 'react';
import { Text, View, TouchableOpacity, Button } from 'react-native';
import { Actions } from 'react-native-router-flux';
import moment from 'moment';

// Internal imports

// Stylesheet
import styles from '../style/r_timer';

function Timer({ interval, style }) {
    const pad = (n) => n < 10 ? '0' + n : n
    const duration = moment.duration(interval)
    const centiseconds = Math.floor(duration.milliseconds() / 10)
    return (
        <View style={styles.timerContainer}>
            <Text style={style}>{pad(duration.minutes())}:</Text>
            <Text style={style}>{pad(duration.seconds())}:</Text>
            <Text style={style}>{pad(centiseconds)}</Text>
        </View>
    )
}

// Describes how the buttons look and function
function RoundButton({ title, color, background, onPress, disabled }) {
    return (
        <TouchableOpacity
            onPress={() => !disabled && onPress()}
            style={[styles.button, { backgroundColor: background }]}
            activeOpacity={disabled ? 1.0 : 0.7}
        >
            <View style={styles.buttonBorder}>
                <Text style={[styles.buttonTitle, { color }]}>{title}</Text>
            </View>
        </TouchableOpacity>
    )
}

function ButtonsRow({ children }) {
    return (
        <View style={styles.buttonsRow}>{children}</View>
    )
}

export default class WorkoutTimer extends Component {

    constructor(props) {
        super(props)
        this.state = {
            start: 0,
            now: 0,
            laps: [],
        }
    }

    componentWillUnmount() {
        clearInterval(this.timer)
    }

    // Describe what each button does
    start = () => {
        const now = new Date().getTime()
        this.setState({
            start: now,
            now,
            laps: [0],
        })
        this.timer = setInterval(() => {
            this.setState({ now: new Date().getTime() })
        }, 100)
    }

    end = () => {
        //const timestamp = new Date().getTime()
        //const { laps, now, start } = this.state
        //const [firstLap, ...other] = laps
        //this.setState({
        //laps: [0, firstLap + now - start, ...other],
        //start: timestamp,
        //now: timestamp,
        //})

        // send data somewhere, end timer, then return to homepage
    }

    stop = () => {
        clearInterval(this.timer)
        const { laps, now, start } = this.state
        const [firstLap, ...other] = laps
        this.setState({
            laps: [firstLap + now - start, ...other],
            start: 0,
            now: 0,
        })
    }
    reset = () => {
        this.setState({
            laps: [],
            start: 0,
            now: 0,
        })
    }
    resume = () => {
        const now = new Date().getTime()
        this.setState({
            start: now,
            now,
        })
        this.timer = setInterval(() => {
            this.setState({ now: new Date().getTime() })
        }, 100)
    }
    goToProgress = () => {
        Actions.progress({ uid: this.props.uid })
    }
    render() {
        const { now, start, laps } = this.state
        const timer = now - start
        return (
            <View style={styles.container}>
                <Timer
                    interval={laps.reduce((total, curr) => total + curr, 0) + timer}
                    style={styles.timer}
                />
                {laps.length === 0 && (
                    <ButtonsRow>
                        <RoundButton
                            title='End'
                            color='#8B8B90'
                            background='#151515'
                            disabled
                        />
                        <RoundButton
                            title='Start'
                            color='#50D167'
                            background='#1B361F'
                            onPress={this.start}
                        />
                    </ButtonsRow>
                )}
                {start > 0 && (
                    <ButtonsRow>
                        <RoundButton
                            title='End'
                            color='#FFFFFF'
                            background='#3D3D3D'
                            onPress={this.end}
                        />
                        <RoundButton
                            title='Pause'
                            color='#E33935'
                            background='#3C1715'
                            onPress={this.stop}
                        />
                    </ButtonsRow>
                )}
                {laps.length > 0 && start === 0 && (
                    <ButtonsRow>
                        <RoundButton
                            title='Reset'
                            color='#FFFFFF'
                            background='#21474A'
                            onPress={this.reset}
                        />
                        <RoundButton
                            title='Start'
                            color='#50D167'
                            background='#1B361F'
                            onPress={this.resume}
                        />
                    </ButtonsRow>
                )}
                <View style={{ paddingTop: 150 }}>
                    <Button
                        title='Cancel Workout'
                        color='#E33935'
                        onPress={this.goToProgress}
                    />
                </View>
            </View>
        )
    }
}