<template>
    <v-container grid-list-md>
        <v-layout row wrap>
            <v-flex
                sm12
                md4
                lg3
                >
                <v-card>
                    <v-card-title class="subheading font-weight-bold">Aktuální docházka</v-card-title>

                    <v-divider></v-divider>

                    <v-list dense>
                        <v-list-tile>
                            <v-list-tile-content>Počet přihlášených studentů na kurz:</v-list-tile-content>
                            <v-list-tile-content class="align-end">{{studentsCount}}</v-list-tile-content>
                        </v-list-tile>
                        <v-list-tile>
                            <v-list-tile-content>Nalezeno studentů:</v-list-tile-content>
                            <v-list-tile-content class="align-end">{{foundStudents}}</v-list-tile-content>
                        </v-list-tile>
                        <v-list-tile>
                            <v-list-tile-content>Chybějících studentů:</v-list-tile-content>
                            <v-list-tile-content class="align-end">{{missingStudents}}</v-list-tile-content>
                        </v-list-tile>
                    </v-list>
                </v-card>
                <v-progress-linear
                    color="info"
                    height="20"
                    :value="foundStudents/studentsCount*100"
                    />
                <v-btn
                    v-if="foundStudents > 0"
                    slot="activator"
                    color="purple"
                    dark
                >
                    Odeslat docházku
                </v-btn>
            </v-flex>
            <v-flex
                sm12
                md8
                lg9
                >
                <v-card id="imgContainer">
                    <video ref="video" id="video" width="640" height="480" autoplay></video>
                    <span v-for="(tag, index) in tagged" :key="index" :style="{left: tag[0] + 'px', width: tag[1]+'px', top: tag[2]+'px', height: tag[3]+'px'}" :class="['tag', tag[4] ? 'recognized' : null]">
                        {{tag[4] ? tag[5] : ''}}
                    </span>
                    FPS: {{fps}}
                </v-card>
                <textarea v-model="descriptors"></textarea>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import axios from 'axios'  
    import * as faceapi from 'face-api.js'

    function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
    }


    export default {

        props: ['examData'],

        data: () => {
            return {
                tagged: [], 
                foundHashes: {},
                isLoading: false,
                imageUrl: null,
                descriptors: '',
                hashes: [],
                performance: {},
                sec: 0
            }
        },

        computed: {
            studentsCount() {
                return this.examData.students.length
            },
            fps() {
                return this.performance[this.sec-1]
            },
            foundStudents() {
                return Object.keys(this.foundHashes).length
            },
            missingStudents() {
                return this.studentsCount - this.foundStudents
            }
        },

        mounted() {
            this.loadModels()
            this.createFaceMatcher()
            this.startRecording()
        },

        methods: {
            async detect() {
                const videoEl = this.$refs.video
                this.sec = parseInt(Date.now() / 1000);
                if (!this.performance[this.sec]) {
                    this.performance[this.sec] = 0
                }
                this.performance[this.sec]++
                
                if(videoEl.paused || videoEl.ended) {
                    return setTimeout(() => this.detect())
                }
                
                const result = await faceapi.detectAllFaces(videoEl, new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreTreshold: 0.5 })).withFaceLandmarks().withFaceDescriptors()

                this.tagged = []
                result.forEach(item => {
                    const bestMatch = this.faceMatcher.findBestMatch(item.descriptor)
                    let recognizedHash = false
                    if (this.hashes.indexOf(bestMatch.label) != -1 && bestMatch.distance < 0.65) {
                        recognizedHash = bestMatch.label
                        this.foundHashes = {...this.foundHashes, [recognizedHash]: true}
                    }
                    this.tagged.push([item.alignedRect.box.x, item.alignedRect.box.width, item.alignedRect.box.y, item.alignedRect.box.height,  !!recognizedHash, recognizedHash])
                    //this.descriptors += "{\nhash: 'xx',\ndescriptor: '"+item.descriptor.toString()+"'\n},\n"
                })
                
                setTimeout(() => this.detect())
            },
            async loadModels() {
                //await faceapi.loadSsdMobilenetv1Model('./src/weights')
                await faceapi.loadTinyFaceDetectorModel('./weights')
                //await faceapi.loadMtcnnModel('./src/weights')
                await faceapi.loadFaceLandmarkModel('./weights')
                //await faceapi.loadFaceLandmarkTinyModel('./src/weights')
                await faceapi.loadFaceRecognitionModel('./weights')
                //await faceapi.loadFaceExpressionModel('./src/weights')
            },
            async startRecording() {
                const video = this.$refs.video;
                const stream = await this.getStream()
                if (stream) {
                    video.srcObject = stream
                    video.play();
                    await sleep(1000);
                    this.detect()
                }
            },
            async getStream() {
                if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                    const devices = await navigator.mediaDevices.enumerateDevices()
                    let deviceId;
                    devices.forEach((device) => {
                        if (device.label === 'SparkoCam Virtual Webcamm') {
                            deviceId = device.deviceId
                        }
                    })
                    try {
                        return await navigator.mediaDevices.getUserMedia({ video: deviceId ? { deviceId: { exact: device.deviceId }} : true })
                    } catch(e) {
                        console.error(e.message)
                    }
                }
                return false;
            },
            createFaceMatcher() {
                let labeledDescriptors = []
                this.examData.students.forEach(student => {
                    labeledDescriptors.push(new faceapi.LabeledFaceDescriptors(student.hash, [Float32Array.from(student.descriptor.split(','))]))
                    this.hashes.push(student.hash)
                })

                this.faceMatcher = new faceapi.FaceMatcher(labeledDescriptors)
            }
        }
    }
</script>

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