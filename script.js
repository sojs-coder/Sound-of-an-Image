var sounds = [];

const BPM = 160;
const interval = 60000 / BPM;
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext();
function playSound(r, g, b) {
    // Normalize RGB values
    const normR = r / 255;
    const normG = g / 255;
    const normB = b / 255;

    // Map RGB values to frequency range
    const baseFrequency = 100;
    const frequency = baseFrequency + (
        (normR * 50) +
        (50 + (normG * 50)) +
        (100 + (normB * 50))
    )

    // Create an AudioContext instance
 

    // Create an OscillatorNode for the calculated frequency
    const oscillator = audioContext.createOscillator();
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.type = 'sine'; // You can change the waveform here
    oscillator.connect(audioContext.destination);

    // Start the oscillator
    oscillator.start();

    // Stop the oscillator after 0.2 seconds (adjust as needed)
    setTimeout(() => {
        oscillator.stop();
    }, interval); // Adjust the duration of the sound here
}

document.getElementById('imageInput').addEventListener('change', function(event) {
    console.log("image loaded");
    const file = event.target.files[0];
    if (file) {
        const img = new Image();
        var url = URL.createObjectURL(event.target.files[0]);
        img.src = url;
        img.onload = function() {
            const canvas = document.getElementById('outputCanvas');
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, 100, 100);

            // Get pixel data
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            // Iterate through pixels and play sound
            var squaresize = 10;
            var numW = canvas.width / squaresize;
            var numH = canvas.height / squaresize;
            for (var x = 0; x < numW; x++) {
                for (var y = 0; y < numH; y++) {
                    var sum = [0, 0, 0];
                    for (var i = 0; i < squaresize; i++) {
                        for (var j = 0; j < squaresize; j++) {
                            var index = ((y * squaresize + j) * canvas.width + (x * squaresize + i)) * 4;
                            var r = data[index];
                            var g = data[index + 1];
                            var b = data[index + 2];
                            sum[0] += r;
                            sum[1] += g;
                            sum[2] += b;
                        }
                    }
                    var avg = [
                        sum[0] / (squaresize ** 2),
                        sum[1] / (squaresize ** 2),
                        sum[2] / (squaresize ** 2)
                    ];
                    sounds.push([x * squaresize, y * squaresize, ...avg]);
                }
            }

            
            play();
        };
    }
});
var ctx = document.getElementById("outputCanvas").getContext("2d");
function play() {
    var [x, y, r, g, b] = sounds.shift();
    console.log(r,g,b);
    playSound(r,g,b);
    ctx.fillStyle = "rgb(" + (r) + "," + (g) + "," + (b) + ")";
    ctx.fillRect(x,y,10,10)
    document.getElementById("text").innerHTML = sounds.length;
    if (sounds.length > 0) {
        setTimeout(play, interval);
    }
}
