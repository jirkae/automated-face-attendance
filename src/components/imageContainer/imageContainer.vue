<template>
    <div>
        <v-layout row>
            <v-flex xs4>
                <p>
                    <strong>Počet přihlášených studentů na kurz: {{studentsCount}}</strong><br>
                    <strong>Nalezeno studentů: {{foundStudents}}</strong><br>
                    <strong>Chybějících studentů: {{missingStudents}}</strong><br>
                    <strong>Nerozpoznaných studentů: {{nonIdentifiedStudents}}</strong><br>
                </p>
                <input type="file" @change="onFileChange" />
            </v-flex>
            <v-flex xs4>
                <v-btn
                    v-if="foundStudents > 0"
                    slot="activator"
                    color="purple"
                    dark
                >
                    Odeslat docházku
                </v-btn>
                <v-btn
                    @click="openLiveCapture"
                    slot="activator"
                    color="purple"
                    dark
                >
                    Pořídit fotku
                </v-btn>
            </v-flex>
        </v-layout>
        <live-capture
            ref="liveCapture" :exam-data="examData" /> 
        <div id="imgContainer">
            <div class="loading" v-if="isLoading">
                <img src="src/images/loading.gif">
            </div>
            <img v-if="imageUrl" :src="imageUrl" id="group">
            <canvas ref="canvas" id="canvas" width="640" height="480"></canvas>
            <span v-for="(tag, index) in tagged" :key="index" :style="{left: tag[0] + 'px', width: tag[1]+'px', top: tag[2]+'px', height: tag[3]+'px'}" :class="['tag', tag[4] ? 'recognized' : null]">
                {{tag[4] ? tag[5] : ''}}
            </span>
        </div>
        <textarea v-model="descriptors"></textarea>
    </div>
</template>

<style>
  #imgContainer {
    position: relative;
    overflow: auto;
  }
  #group {
      float: left;
  }
  .tag {
    position: absolute;
    border: 2px solid red;
    display: block;
    color: #fff;
    font-size: 200%;
  }
  .tag.recognized {
    border-color: green;
  }
  .loading {
      position: absolute;
      z-index: 20;
      background: rgba(0, 0, 0, .7);
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
  }
  .loading img {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      margin: auto;
  }
</style>

<script>
    import axios from 'axios'  
    import liveCapture from './../modal/liveCapture.vue'


    export default {

        props: ['examData'],

        data: () => {
            return {
                tagged: [], 
                foundStudents: 0,
                missingStudents: 0,
                nonIdentifiedStudents: 0,
                isLoading: false,
                imageUrl: null,
                descriptors: '',
                canvas: {},
                mode: null
            }
        },

        components: {
            liveCapture
        },

        computed: {
            studentsCount() {
                return this.examData.students.length
            }
        },

        methods: {
            async proccess(sourceId) {
                this.isLoading = true
                await faceapi.loadSsdMobilenetv1Model('./src/weights')
                await faceapi.loadTinyFaceDetectorModel('./src/weights')
                await faceapi.loadMtcnnModel('./src/weights')
                await faceapi.loadFaceLandmarkModel('./src/weights')
                await faceapi.loadFaceLandmarkTinyModel('./src/weights')
                await faceapi.loadFaceRecognitionModel('./src/weights')
                await faceapi.loadFaceExpressionModel('./src/weights')
                const input = document.getElementById(sourceId)
                const res = await faceapi.detectAllFaces(input, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.3 }))./*withFaceExpressions().*/withFaceLandmarks().withFaceDescriptors()
                this.foundStudents = res.length
                
                const labeledDescriptors = []
                const hashes = []
                this.examData.students.forEach(student => {
                    labeledDescriptors.push(new faceapi.LabeledFaceDescriptors(student.hash, [Float32Array.from(student.descriptor.split(','))]))
                    hashes.push(student.hash)
                })

                const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors)
                
                let foundStudents = 0
                res.forEach(item => {
                    const bestMatch = faceMatcher.findBestMatch(item.descriptor)
                    let recognizedHash = false
                    if (hashes.indexOf(bestMatch.label) != -1 && bestMatch.distance < 0.65) {
                        //recognizedHash = bestMatch.label
                        foundStudents++
                    }
                    this.tagged.push([item.alignedRect.box.x, item.alignedRect.box.width, item.alignedRect.box.y, item.alignedRect.box.height,  !!recognizedHash, recognizedHash])
                    //this.descriptors += "{\nhash: 'xx',\ndescriptor: '"+item.descriptor.toString()+"'\n},\n"
                })
                this.missingStudents = this.studentsCount - foundStudents
                this.nonIdentifiedStudents = this.tagged.length - foundStudents
                this.isLoading = false
            },
            onFileChange(e) {
                this.reset()
                this.mode = 'img'
                const file = e.target.files[0];
                this.imageUrl = URL.createObjectURL(file);
                this.proccess('group')
            },
            reset() {
                this.$refs.canvas.getContext("2d").clearRect(0, 0, 0, 0)
                this.imageUrl = null
                this.tagged = []
                this.foundStudents = 0
                this.missingStudents = 0
            },
            openLiveCapture() {
                this.$refs.liveCapture.open()
            },
            drawCanvas(video) {
                this.reset()
                this.mode = 'canvas'
                this.canvas = this.$refs.canvas;
                this.canvas.getContext("2d").drawImage(video, 0, 0, 640, 480)
                this.proccess('canvas')
            }
        }
    }
</script>