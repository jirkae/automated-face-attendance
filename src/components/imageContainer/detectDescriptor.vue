<template>
    <img src="src/images/faces/marat.jpg" id="jirka">
</template>

<script>
export default {
    created: () => {
        setTimeout(async () => {
            const jirkaInput = document.getElementById('jirka')
            const jirka = await faceapi.detectSingleFace(jirkaInput).withFaceLandmarks().withFaceDescriptor()
            console.log(jirka.descriptor.toString())
        }, 1000)
    }
}
</script>

