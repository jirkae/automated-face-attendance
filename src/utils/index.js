const DEV_API = 'http://localhost:5000'
const MOCK_API = 'mock/data.json'

const getApiEndpoint = () => {
    if (window.location.href.match(/localhost/)) {
        return DEV_API
    } else {
        return MOCK_API
    }
}

export const getStudentsEndpoint = () => {
    return getApiEndpoint()
}