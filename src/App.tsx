import React, { useState, useEffect } from 'react';
import './App.css';

import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
const ffmpeg = createFFmpeg({ log: true });

interface AppProps {}

export type FileEventTarget = EventTarget & { files: FileList };

const COMMANDS = {
  inputFile: '-i',
  timeFlag: '-t',
  secondsFlag: '-ss',
  encodeFlag: '-f',
};

function App({}: AppProps) {
  const [ready, setReady] = useState(false);
  const [video, setVideo] = useState<File>();
  const [gif, setGif] = useState('');

  const load = async () => {
    await ffmpeg.load();
    setReady(true);
  };

  useEffect(() => {
    load();
  }, []);

  const handleLoadVideo = (files: FileList | null) => {
    if (files) {
      setVideo(files.item(0) || undefined);
    }
  };

  const convertToGif = async () => {
    if (video) {
      const inputFileName = 'test.mp4';
      const outputFileName = 'out.gif';

      ffmpeg.FS('writeFile', inputFileName, await fetchFile(video));

      // Run the FFMPEG command:
      await ffmpeg.run(
        COMMANDS.inputFile,
        inputFileName,
        COMMANDS.timeFlag,
        '2.5',
        COMMANDS.secondsFlag,
        '2.0',
        COMMANDS.encodeFlag,
        'gif',
        'out.gif',
      );

      // Read the result:
      const data = ffmpeg.FS('readFile', outputFileName);

      // Create URL:
      const url = URL.createObjectURL(
        new Blob([data.buffer], { type: 'image/gif' }),
      );
      setGif(url);
    }
  };

  if (video) console.log(video);

  return ready ? (
    <div className="App">
      {video && (
        <video controls width={250} src={URL.createObjectURL(video)}></video>
      )}

      <div>
        <input
          type="file"
          name="video"
          id="gif-video"
          onChange={(e) => handleLoadVideo(e.target.files)}
        />
      </div>

      <h3>Result</h3>

      <button onClick={convertToGif}>Convert</button>

      {gif && (
        <div>
          <img src={gif} width={250} />
        </div>
      )}
    </div>
  ) : (
    <p>Loading...</p>
  );
}

export default App;
