<template>
    <v-dialog v-model="isOpen" persistent max-width="600px">
        <v-card>
        <v-card-title>
            <span class="headline">Načíst kurz</span>
        </v-card-title>
        <v-card-text>
            <v-container grid-list-md>
            <v-layout wrap>
                <v-flex xs12>
                    <v-text-field label="xname*" required></v-text-field>
                </v-flex>
                <v-flex xs12>
                    <v-text-field label="heslo*" required></v-text-field>
                </v-flex>
                <v-flex xs12>
                    <v-text-field label="kód kurzu*" required></v-text-field>
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
    </v-dialog>
</template>

<script>
export default {
    props: ['value'],
    data: () => {
        return {
            isOpen: false
        }
    },

    created() {
        //
        this.isOpen = this.value.code === null
    },

    watch: {
        value: (newValue) => {
            this.isOpen = !!newValue.code
        }
    },
    
    methods: {
        setCode: function() {
            this.value.code = 'xx'
            this.isOpen = false
        }
    }
}
</script>
