<template>
    <v-dialog v-model="isOpen" persistent max-width="600px">
        <v-form ref="form">
            <v-card>
            <v-card-title>
                <span class="headline">Načíst kurz</span>
            </v-card-title>
            <v-card-text>
                <v-container grid-list-md>
                <v-layout wrap>
                    <v-flex xs12>
                        <v-text-field label="xname*" required v-model="xname"></v-text-field>
                    </v-flex>
                    <v-flex xs12>
                        <v-text-field type="password" label="heslo*" required v-model="password"></v-text-field>
                    </v-flex>
                    <v-flex xs12>
                        <v-text-field label="kód kurzu*" required v-model="courseCode"></v-text-field>
                    </v-flex>
                </v-layout>
                </v-container>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" flat @click="isOpen = false">Zavřít</v-btn>
                <v-btn color="blue darken-1" flat @click="setCode">Načíst</v-btn>
            </v-card-actions>
            </v-card>
        </v-form>
    </v-dialog>
</template>

<script>
import {mapState, mapActions, mapMutations} from 'vuex'

export default {
    data() {
        return {
            xname: null,
            password: null,
            courseCode: null,
        }
    },

    computed: {
        isOpen() {
            return !this.loadedCourseCode
        },
        ...mapState('course', {loadedCourseCode: 'code'}),
    },
    
    methods: {
        async setCode() {
            try {
                await this.loadStudents({courseCode: this.courseCode, xname: this.xname, password: this.password})
                this.addNotification('Úspěšně přihlášeno', 'success')
            } catch(e) {
                this.addNotification('Chybné přihlášení', 'error')
            }
        },
        ...mapActions('course', ['loadStudents']),
        ...mapMutations('notification', ['addNotification'])
    }
}
</script>
