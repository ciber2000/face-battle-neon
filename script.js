const video1 = document.getElementById("video1");
const canvas1 = document.getElementById("canvas1");

const ctx1 = canvas1.getContext("2d");

async function startCam(){

    const stream = await navigator.mediaDevices.getUserMedia({

        video:true

    });

    video1.srcObject = stream;

}

startCam();

const faceMesh = new FaceMesh({

    locateFile: (file) => {

        return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;

    }

});

faceMesh.setOptions({

    maxNumFaces:1,

    refineLandmarks:true,

    minDetectionConfidence:0.5,

    minTrackingConfidence:0.5

});

faceMesh.onResults(onResults);

function onResults(results){

    ctx1.clearRect(0,0,canvas1.width,canvas1.height);

    if(results.multiFaceLandmarks){

        for(const landmarks of results.multiFaceLandmarks){

            drawConnectors(

                ctx1,

                landmarks,

                FACEMESH_TESSELATION,

                {

                    color:'cyan',
                    lineWidth:1

                }

            );

        }

    }

}

const camera = new Camera(video1, {

    onFrame: async ()=>{

        await faceMesh.send({

            image: video1

        });

    },

    width:360,
    height:260

});

camera.start();
