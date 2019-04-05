<template>
    <image-container 
        v-if="examData !== null"
        :examData="examData"/>
</template>

<script>
    import axios from 'axios'  
    import imageContainer from './imageContainer.vue'

    export default {
        props: ['examCode'],

        data() {
            return {
                examData: null
            }
        },

        components: {
            imageContainer
        },

        created() {
            setTimeout(async () => {
                const {data} = await axios.get('http://localhost:5000')
                //const {data} = await axios.get('/data.json')
                this.examData = data
            }, 1)
        }
    }
</script>