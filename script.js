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

faceMesh.onResults((results) => {

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

            const score = Math.floor(Math.random() * 100);

            statusText.innerText =
            `ЛИЦО ОБНАРУЖЕНО
ПРИВЛЕКАТЕЛЬНОСТЬ: ${score}%`;

        }

    }, 300);

});
