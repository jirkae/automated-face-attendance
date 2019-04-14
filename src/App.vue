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
          <login-modal 
            v-model="examCredentials" />
          <v-flex>
            <image-container v-if="examCredentials.code !== null"
              :examCode="examCredentials.code" />
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import imageContainer from './components/imageContainer/index.vue'
import loginModal from './components/modal/login.vue'


export default {

  data: () => {
    return {
      drawer: false,
      examCredentials: {
        code: null
      }
    }
  },
  components: {
    imageContainer,
    loginModal
  }
}

</script>