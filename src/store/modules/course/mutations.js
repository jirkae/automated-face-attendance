const setStudents = (state, data) => {
    state.students = data
}

const setExamCode = (state, data) => {
    state.code = data
}

export default {
    setStudents,
    setExamCode
}