import axios from 'axios'
import {getStudentsEndpoint, getAttendanceEndpoint} from '../../../utils'

const loadStudents = async ({commit}, {xname, password, courseCode}) => {
    const {data} = await axios.get(getStudentsEndpoint(), {params: {xname, password, courseCode}})
    commit('setExamCode', courseCode)
    commit('setStudents', data.students)
}

const sendAttendance = async ({}, {xname, password, courseCode, attendance}) => {
    await axios.post(getAttendanceEndpoint(), {params: {xname, password, courseCode, attendance}})
}

export default {
    loadStudents,
    sendAttendance
}