<template>
    <div>
        <v-snackbar
            v-for="(notification, key) in notifications"
            v-model="show"
            :color="notification.type"
            :timeout="3000"
            :key="key"
            :top="true"
            :right="true"
        >
        {{notification.text}}
      </v-snackbar>
    </div>
</template>

<script>
import {mapState} from 'vuex'

export default {
    data() {
        return {
            show: true
        }
    },
    computed: mapState('notification', ['notifications'])
}
</script>
