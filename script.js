//wavesurfer

var wavesurfer = WaveSurfer.create({
    container: '#waveform',
    waveColor: 'gray',
    progressColor: 'red',
    backend: 'MediaElement',
    responsive: 'true',
    normalize: 'true',
    backend: 'MediaElementWebAudio'
});

var fileInput = document.querySelector('#file');
fileInput.addEventListener('change', function () {
    var file = fileInput.files[0];
    var fileURL = URL.createObjectURL(file);
    wavesurfer.load(fileURL);
});

var playBtn = document.querySelector('#play');
playBtn.addEventListener('click', function () {
    if (wavesurfer.isPlaying()) {
        wavesurfer.pause();
        playBtn.innerHTML = 'Play';
        playBtn.style.background = "red";
    } else {
        wavesurfer.play();
        playBtn.innerHTML = 'Stop';
        playBtn.style.background = "black";
    }
});

var restartBtn = document.querySelector('#restart');
restartBtn.addEventListener('click', function () {
    wavesurfer.seekTo(0); // restarts
});

// Audio context and pitch/speed controls
const audioContext = new AudioContext();
const gainNode = audioContext.createGain();
gainNode.gain.value = 1;
gainNode.connect(audioContext.destination);


var audioSource;
var loopStart = 0;
var loopEnd = 1;

wavesurfer.on('ready', function () {
    const buffer = wavesurfer.backend.buffer;
    audioSource = audioContext.createBufferSource();
    audioSource.buffer = buffer;
    audioSource.connect(gainNode);
});

const speedSlider = document.getElementById('speed-slider');
speedSlider.addEventListener('input', function () {
    wavesurfer.setPlaybackRate(this.value / 100);
    document.getElementById("audiospeed").innerHTML = `<p id="audiospeed">Playback Speed: ${(this.value)}%</p>`;
});

speedSlider.addEventListener('dblclick', function () {
    wavesurfer.setPlaybackRate(1);
    document.getElementById("audiospeed").innerHTML = `<p id="audiospeed">Playback Speed: 100%</p>`;
    speedSlider.value = 100;
});

const pitchSlider = document.getElementById('pitch-slider');
pitchSlider.addEventListener('input', function () {
    const cents = (this.value - 50) * 10;
    const rate = Math.pow(2, cents / 1200);
    wavesurfer.setPitch = cents;
    document.getElementById("pitch").innerHTML = cents + " cents";
    document.getElementById("pitch").style.textAlign = "center";
});

pitchSlider.addEventListener('dblclick', function () {
    pitchSlider.value = 0;
    document.getElementById("pitch").innerHTML = pitchSlider.value + " cents";
    document.getElementById("pitch").style.textAlign = "center";
});


//timeline variables
var cursorPosition = 0;
function addA() {
    const a = document.getElementById('letterA');
    a.style.position = 'absolute';
    a.style.top = '0';
    a.style.left = cursorPosition + '%';
    a.style.visibility = "visible";
    console.log("A");
}

function addB() {
    const b = document.getElementById('letterB');
    b.style.position = 'absolute';
    b.style.top = '0';
    b.style.left = cursorPosition + '%';
    b.style.visibility = "visible";
    console.log("B");
}

function clearAB() {
    document.getElementById('letterA').style.visibility = "hidden";
    document.getElementById('letterB').style.visibility = "hidden";
}
//end timeline variables

// Loop functionality 
var currentTime;

wavesurfer.on('audioprocess', function () {
    totalTime = wavesurfer.getDuration();
    currentTime = wavesurfer.getCurrentTime() / totalTime;
    cursorPosition = currentTime * 100;
    // Loop buttons
    const loopABtn = document.getElementById('loopA');
    loopABtn.addEventListener('click', function () {
        loopStart = currentTime;
        loopABtn.style.background = "red";
        addA();
    });

    const loopBBtn = document.getElementById('loopB');
    loopBBtn.addEventListener('click', function () {
        loopEnd = currentTime;
        loopBBtn.style.background = "red";
        addB();
    });

    if (loopStart !== null && loopEnd !== null) {
        if (currentTime >= loopEnd) {
            wavesurfer.seekTo(loopStart);
        }
    }

    const preLoopBtn = document.getElementById('preLoop');
    preLoopBtn.addEventListener('click', function () {
        if (loopStart > 0.015) {
            wavesurfer.seekTo(loopStart - 0.015);
        }
        else {
            wavesurfer.seekTo(0);
        }
    });

});


const loopClearBtn = document.getElementById('loopClear');
loopClearBtn.addEventListener('click', function () {
    loopStart = 0;
    loopEnd = 1;
    document.getElementById('loopA').style.background = "gray";
    document.getElementById('loopB').style.background = "gray";
    clearAB()
});