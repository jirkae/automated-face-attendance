<template>
    <v-dialog v-model="isOpen" persistent width="700px">
        <v-card>
        <v-card-title>
            <span class="headline">Zaznamenat fotku</span>
        </v-card-title>
        <v-card-text>
            <v-container grid-list-md>
            <v-layout wrap>
                <v-flex xs12>
                    <div style="position: relative;">
                        <span v-if="tagged" :style="{left: tagged[0] + 'px', width: tagged[1]+'px', top: tagged[2]+'px', height: tagged[3]+'px'}" :class="['tag', tagged[4] ? 'recognized' : null]">
                            {{tagged[4] ? tagged[5] : ''}}
                        </span>
                        <video ref="video" id="video" width="640" height="480" autoplay></video>
                    </div>
                </v-flex>
            </v-layout>
            </v-container>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click="close">Zavřít</v-btn>
            <v-btn color="blue darken-1" flat @click="capture">Načíst</v-btn>
        </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    props: ['examData'],
    data() {
        return {
            video: {},
            isOpen: false,
            capturedVideo: null,
            tagged: null,
            faceMatcher: null
        }
    },

    mounted() {
        
    },

    methods: {
        capture() {
            this.$parent.drawCanvas(this.video)
            this.close()
        },
        close() {       
            this.isOpen = false
        },
        open() {
            this.startRecording()
            this.isOpen = true
        },
        startRecording() {
            this.video = this.$refs.video;
            if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                navigator.mediaDevices.enumerateDevices().then(devices => {
                    let deviceId;
                    devices.forEach((device) => {
                        if (device.label === 'SparkoCam Virtual Webcamm') {
                            deviceId = device.deviceId
                        }
                    })
                    navigator.mediaDevices.getUserMedia({ video: deviceId ? { deviceId: { exact: device.deviceId }} : true }).then(async stream => {
                        //this.video.src = URL.createObjectURL(stream);
                        this.video.srcObject = stream
                        this.video.play();
                        await faceapi.loadSsdMobilenetv1Model('./src/weights')
                        await faceapi.loadTinyFaceDetectorModel('./src/weights')
                        await faceapi.loadMtcnnModel('./src/weights')
                        await faceapi.loadFaceLandmarkModel('./src/weights')
                        await faceapi.loadFaceLandmarkTinyModel('./src/weights')
                        await faceapi.loadFaceRecognitionModel('./src/weights')
                        await faceapi.loadFaceExpressionModel('./src/weights')
                        const labeledDescriptors = []
                        const hashes = []
                        this.examData.students.forEach(student => {
                            labeledDescriptors.push(new faceapi.LabeledFaceDescriptors(student.hash, [Float32Array.from(student.descriptor.split(','))]))
                            hashes.push(student.hash)
                        })

                        this.faceMatcher = new faceapi.FaceMatcher(labeledDescriptors)
                        
                        this.detect()
                    }).catch(e => alert(e.message));
                })
            }
        },
        async detect() {
            const videoEl = document.getElementById('video')
            
            if(videoEl.paused || videoEl.ended) {
                
                return setTimeout(() => this.detect())
            }
            
            const result = await faceapi.detectSingleFace(videoEl, new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreTreshold: 0.5 })).withFaceLandmarks().withFaceDescriptor()
            const bestMatch = result ? this.faceMatcher.findBestMatch(result.descriptor) : null
            this.tagged = result ? [result.alignedRect.box.x, result.alignedRect.box.width, result.alignedRect.box.y, result.alignedRect.box.height,  !!bestMatch, bestMatch ? bestMatch.label : ''] : null
            if (result) {
                //drawLandmarks(videoEl, $('#overlay').get(0), [result], withBoxes)
            }
            console.log(result)
            setTimeout(() => this.detect())
        }
    }
}
</script>

