import axios from 'axios'
import {getStudentsEndpoint} from '../../../utils'

const loadStudents = async ({commit}, {xname, password, courseCode}) => {
    const {data} = await axios.get(getStudentsEndpoint(), {params: {xname, password, courseCode}})
    commit('setExamCode', courseCode)
    commit('setStudents', data.students)
}

export default {
    loadStudents
}