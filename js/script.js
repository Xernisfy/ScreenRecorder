document.body.innerHTML = `<label class="text" for="record">Record</label>
<label class="switch">
  <input id="record" type="checkbox" />
  <span class="slider"></span>
</label>`;
const streamConstraints = { video: true, audio: true };
const chunks = [];
let stream;
let recorder;
const record = document.getElementById("record");
record.addEventListener("input", () => {
  if (record.checked) {
    navigator.mediaDevices.getDisplayMedia(streamConstraints).then((screen) => {
      stream = screen;
      recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
      recorder.ondataavailable = function (e) {
        chunks.push(e.data);
        const url = URL.createObjectURL(
          new Blob(chunks, { type: "video/webm" }),
        );
        const a = document.createElement("a");
        a.href = url;
        a.download = `recording_${
          ((d) =>
            d.getFullYear() +
            ["Month", "Date", "Hours", "Minutes", "Seconds"].map((t) =>
              ("00" + d[`get${t}`]()).slice(-2)
            ).join(""))(new Date())
        }.webm`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        record.checked = false;
        chunks.length = 0;
      };
      recorder.start();
    }, (e) => record.checked = false);
  } else {
    stream.getTracks().forEach((track) => track.stop());
    recorder.stop();
  }
});
