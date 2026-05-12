const video1 = document.getElementById("video1");
const video2 = document.getElementById("video2");

const statusText = document.getElementById("status");
const scanBtn = document.getElementById("scanBtn");

async function startCam(video){

    try{

        const stream = await navigator.mediaDevices.getUserMedia({

            video:true,
            audio:false

        });

        video.srcObject = stream;

    }catch(err){

        alert("Camera access denied");

    }

}

startCam(video1);
startCam(video2);

async function loadModels(){

    await faceapi.nets.tinyFaceDetector.loadFromUri(
        "https://cdn.jsdelivr.net/npm/face-api.js/weights"
    );

}

loadModels();

scanBtn.addEventListener("click", async ()=>{

    statusText.innerText = "SCANNING FACES...";

    const face1 = await faceapi.detectSingleFace(
        video1,
        new faceapi.TinyFaceDetectorOptions()
    );

    const face2 = await faceapi.detectSingleFace(
        video2,
        new faceapi.TinyFaceDetectorOptions()
    );

    if(!face1 || !face2){

        statusText.innerText =
        "FACE NOT DETECTED";

        return;

    }

    statusText.innerText =
    "ANALYZING FACE STRUCTURE...";

    setTimeout(()=>{

        const score1 = Math.floor(Math.random()*100);
        const score2 = Math.floor(Math.random()*100);

        if(score1 > score2){

            statusText.innerText =
            `WINNER: PLAYER 1\n${score1}% VS ${score2}%`;

        }else{

            statusText.innerText =
            `WINNER: PLAYER 2\n${score2}% VS ${score1}%`;

        }

    },2000);

});
