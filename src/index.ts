import MimiumProcessor from "./audioprocessor.js?worker&url";
import { MimiumProcessorNode, CompileData } from "./workletnode";
import wasmurl from "mimium-web/mimium_web_bg.wasm?url";

export { MimiumProcessorNode, MimiumProcessor };

export default async function setupAudioWorklet(src: string) {
  const userMedia = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: false,
  });
  let audioNode;
  const audioContext = new AudioContext({ latencyHint: "interactive" });
  try {
    const response = await window.fetch(wasmurl);
    const wasmBytes = await response.arrayBuffer();
    try {
      await audioContext.audioWorklet.addModule(MimiumProcessor);
    } catch (e) {
      let err = e as unknown as Error;
      throw new Error(
        `Failed to load audio analyzer worklet at url: ${MimiumProcessor}. Further info: ${err.message}`
      );
    }
    audioNode = new MimiumProcessorNode(audioContext, "MimiumProcessor");
    audioNode.init(wasmBytes, {
      src: src,
      samplerate: audioContext.sampleRate,
      buffersize: 128, //AudioWorklet Always uses 128 for now
    } as CompileData);
    audioContext.resume();
    const microphone = await audioContext.createMediaStreamSource(userMedia);

    microphone.connect(audioNode).connect(audioContext.destination);
    return { node: audioNode, context: audioContext };
  } catch (e) {
    let err = e as unknown as Error;
    throw new Error(
      `Failed to load audio analyzer WASM module. Further info: ${err.message}`
    );
  }
}
