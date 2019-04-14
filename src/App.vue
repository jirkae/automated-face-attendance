<template>
  <v-app>
    <v-toolbar color="indigo" dark fixed app>
      <v-toolbar-title>Docházka</v-toolbar-title>
    </v-toolbar>
    <v-content>
      <v-container fluid fill-height>
        <v-layout
          align-start
        >
          <login-modal />
          <v-flex>
            <main-page v-if="students.length" />
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import mainPage from './pages/mainPage.vue'
import loginModal from './components/modal/login.vue'
import { mapState } from 'vuex'


export default {
  components: {
    mainPage,
    loginModal
  },

  computed: mapState('course', ['students'])
}

</script>