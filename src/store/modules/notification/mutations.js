const addNotification = (state, text, type) => {
    state.notifications.push({text, type})
}

const removeNotification = (state, key) => {
    state.notifications.splice(key, 1)
}

export default {
    addNotification,
    removeNotification
}