const video1 = document.getElementById("video1");
const canvas1 = document.getElementById("canvas1");

const scanBtn = document.getElementById("scanBtn");
const statusText = document.getElementById("status");

const ctx1 = canvas1.getContext("2d");

canvas1.width = 360;
canvas1.height = 260;

async function startCamera() {

    try {

        const stream = await navigator.mediaDevices.getUserMedia({

            video: true,
            audio: false

        });

        video1.srcObject = stream;

    } catch (err) {

        alert("Камера не разрешена");

    }

}

startCamera();

const faceMesh = new FaceMesh({

    locateFile: (file) => {

        return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;

    }

});

faceMesh.setOptions({

    maxNumFaces: 1,
    refineLandmarks: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5

});
let faceMeshResults = null;
faceMesh.onResults((results) => {
faceMeshResults = results.multiFaceLandmarks;
    ctx1.clearRect(0, 0, canvas1.width, canvas1.height);

    if (results.multiFaceLandmarks) {

        for (const landmarks of results.multiFaceLandmarks) {

            drawConnectors(

                ctx1,
                landmarks,
                FACEMESH_TESSELATION,

                {
                    color: "cyan",
                    lineWidth: 1
                }

            );

        }

    }

});

const camera = new Camera(video1, {

    onFrame: async () => {

        await faceMesh.send({

            image: video1

        });

    },

    width: 360,
    height: 260

});

camera.start();

scanBtn.addEventListener("click", () => {

    let progress = 0;

    statusText.innerText = "СКАНИРОВАНИЕ... 0%";

    const interval = setInterval(() => {

        progress += 10;

        statusText.innerText =
        `СКАНИРОВАНИЕ... ${progress}%`;

        if (progress >= 100) {

            clearInterval(interval);

const landmarks = faceMeshResults;

if (!landmarks || landmarks.length === 0) {

    statusText.innerText = "ЛИЦО НЕ НАЙДЕНО";
    return;

}

const face = landmarks[0];

const leftEye = face[33];
const rightEye = face[263];
const nose = face[1];

const eyeDistance = Math.abs(leftEye.x - rightEye.x);

const symmetry =
100 - Math.abs((leftEye.y - rightEye.y) * 100);

let score = Math.floor(

    (eyeDistance * 200) +
    symmetry

);

if(score > 100) score = 100;
if(score < 1) score = 1;

statusText.innerText =
`ЛИЦО ОБНАРУЖЕНО
ПРИВЛЕКАТЕЛЬНОСТЬ: ${score}%`;

        }

    }, 300);

});
