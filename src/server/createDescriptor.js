require('@tensorflow/tfjs-node')
const faceapi = require('face-api.js')
const canvas = require('canvas')

const createDescriptor = async (contentType, rawImage) => {
    const { Canvas, Image, ImageData } = canvas
    faceapi.env.monkeyPatch({ Canvas, Image, ImageData })
    const weightDir = __dirname+'/../../weights'
    await faceapi.nets.mtcnn.loadFromDisk(weightDir)
    await faceapi.nets.faceLandmark68Net.loadFromDisk(weightDir)
    await faceapi.nets.faceRecognitionNet.loadFromDisk(weightDir)
    const img = new Image()
    img.src = 'data:'+contentType+';base64,' + rawImage
    const minFaceSize = Math.ceil(Math.min(img.width / 5, img.height / 5)/10)*10

    try {
        const res = await faceapi.detectSingleFace(img, new faceapi.MtcnnOptions({ minFaceSize })).withFaceLandmarks().withFaceDescriptor()
        return {
            success: res ? true : false,
            data: res
        }
    } catch(e) {
        return {success: false, msg: e.msg}
    }
}

module.exports = createDescriptor