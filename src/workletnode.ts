export type CompileData = {
  samplerate: number;
  buffersize: number;
  src: string;
};
export class MimiumProcessorNode extends AudioWorkletNode {
  private data: CompileData | null = null;
  init(wasmBinary: ArrayBuffer, data: CompileData) {
    this.data = data;
    console.log(`Compiledata : ${data}`);
    this.port.onmessage = (event: MessageEvent) => {
      this.onmessage(event.data);
    };
    this.port.postMessage({
      type: "send-wasm-module",
      data: wasmBinary,
    });
    // Handle an uncaught exception thrown in the Processor.
    this.onprocessorerror = (err) => {
      console.log(
        `An error from AudioWorkletProcessor.process() occurred: ${err}`
      );
    };
  }

  onmessage(event: MessageEvent) {
    if (event.type === "wasm-module-loaded") {
      console.log("wasm module loaded");
      this.port.postMessage({
        type: "compile",
        data: this.data,
      });
    } else if (event.type === "error_wasm_load") {
      console.error(event.data);
    }else if (event.type ==="stop"){
      this.disconnect()
    }
  }
}
