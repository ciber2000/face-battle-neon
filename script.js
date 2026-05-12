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

scanBtn.addEventListener("click", ()=>{

    statusText.innerText = "SCANNING FACE...";

    let progress = 0;

    const scanInterval = setInterval(()=>{

        progress += 10;

        statusText.innerText =
        `AI SCANNING... ${progress}%`;

        if(progress >= 100){

            clearInterval(scanInterval);

            const p1 = Math.floor(Math.random()*100);
            const p2 = Math.floor(Math.random()*100);

            if(p1 > p2){

                statusText.innerText =
                `WINNER: PLAYER 1\n${p1}% VS ${p2}%`;

            }else if(p2 > p1){

                statusText.innerText =
                `WINNER: PLAYER 2\n${p2}% VS ${p1}%`;

            }else{

                statusText.innerText =
                `DRAW\n${p1}% VS ${p2}%`;

            }

        }

    },300);

});
