const video1 = document.getElementById("video1");
const canvas1 = document.getElementById("canvas1");

const scanBtn = document.getElementById("scanBtn");

const score1Text =
document.getElementById("score1");

const score2Text =
document.getElementById("score2");

const ctx1 = canvas1.getContext("2d");

canvas1.width = 360;
canvas1.height = 260;

let faceMeshResults = null;

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

    setTimeout(() => {

        if (!faceMeshResults || faceMeshResults.length === 0) {

            score1Text.innerText =
            "SCORE: 0";

            return;

        }

        const face = faceMeshResults[0];

        const leftEye = face[33];
        const rightEye = face[263];

        const nose = face[1];

        const leftCheek = face[234];
        const rightCheek = face[454];

        const chin = face[152];

        const eyeDistance =
        Math.abs(leftEye.x - rightEye.x);

        const faceWidth =
        Math.abs(leftCheek.x - rightCheek.x);

        const faceHeight =
        Math.abs(nose.y - chin.y);

        const symmetry =
        100 - Math.abs(leftEye.y - rightEye.y) * 100;

        const ratio =
        faceWidth / faceHeight;

        let score = 0;

        score += symmetry * 0.4;

        score += (eyeDistance * 100) * 0.3;

        if(ratio > 0.75 && ratio < 0.95){

            score += 30;

        }else{

            score += 10;

        }

        score = Math.floor(score);

        if(score > 100) score = 100;
        if(score < 1) score = 1;

        score1Text.innerText =
        `SCORE: ${score}`;

        score2Text.innerText =
        `SCORE: ${Math.floor(Math.random()*100)}`;

    }, 1500);

});
