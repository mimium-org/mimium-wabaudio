import "./textencoder.js";

import init, { Context, Config } from "mimium-web";

export class MimiumProcessor extends AudioWorkletProcessor {
  context: Context | null;

  constructor() {
    super();
    this.context = null;
    this.port.onmessage = (event) => {
      this.onmessage(event.data);
    };
  }
  onmessage(event: MessageEvent<any>) {
    switch (event.type) {
      case "send-wasm-module": {
        this.port.postMessage("start_loading");
        const wasmBinary = event.data; //this is invalid conversion for workaround.
        const wasm = WebAssembly.compile(wasmBinary);
        init(wasm)
          .then(() => {
            console.log("wasm module loaded");
            this.port.postMessage({ type: "wasm-module-loaded" });
          })
          .catch((e) => {
            this.port.postMessage({ type: "error_wasm_load", data: e });
          });
      }
      case "compile":
        this.compile(
          event.data.samplerate,
          event.data.buffersize,
          event.data.src
        );
        break;
    }
  }
  public compile(samplerate: number, buffersize: number, src: string) {
    let config = new Config();
    config.sample_rate = samplerate;
    config.output_channels = 1;
    config.buffer_size = buffersize;
    this.context = new Context(config);
    this.context.compile(src);
  }
  public process(
    inputs: Float32Array[][],
    outputs: Float32Array[][],
    parameter: Record<string, Float32Array>
  ) {
    const input = inputs[0][0];
    if (this.context) {
      this.context.process(input, outputs[0][0]);
    }
    return true;
  }
}

registerProcessor("MimiumProcessor", MimiumProcessor);
