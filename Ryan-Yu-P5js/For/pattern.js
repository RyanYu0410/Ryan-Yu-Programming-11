const canvas = document.getElementById('audioCanvas');
const ctx = canvas.getContext('2d');
const audioFile = document.getElementById('audioFile');

let audioContext;
let analyser;
let bufferLength;
let dataArray;

function initAudioContext() {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;
    bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);
}


audioFile.addEventListener('change', function () {
    const file = this.files[0];
    const fileReader = new FileReader();

    fileReader.onload = function (event) {
        const arrayBuffer = event.target.result;
        audioContext.decodeAudioData(arrayBuffer, function (buffer) {
            const source = audioContext.createBufferSource();
            source.buffer = buffer;

            source.connect(analyser);
            analyser.connect(audioContext.destination);
            source.start();

            drawWaveform();
        });
    };

    fileReader.readAsArrayBuffer(file);
});


function drawWaveform() {
    requestAnimationFrame(drawWaveform);

    analyser.getByteTimeDomainData(dataArray);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.lineWidth = 2;
    ctx.strokeStyle = 'lime';

    ctx.beginPath();

    const sliceWidth = canvas.width / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = v * canvas.height / 2;

        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }

        x += sliceWidth;
    }

    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();
}


window.addEventListener('click', () => {
    if (!audioContext) {
        initAudioContext();
    }
});
