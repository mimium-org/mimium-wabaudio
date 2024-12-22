// import MimiumProcessorSrc from "./audioprocessor.js?raw";
// const processorBlob = new Blob([MimiumProcessorSrc], {
//   type: "text/javascript",
// });
// const MimiumProcessorUrl = URL.createObjectURL(processorBlob);
// import MimiumProcessorUrl from "./audioprocessor.ts?url";

import { MimiumProcessorNode } from "./workletnode.ts";
import type { CompileData } from "./workletnode.ts";
import wasmurl from "mimium-web/mimium_web_bg.wasm?url";
export type { MimiumProcessorNode };
export type { CompileData } from "./workletnode.ts";

export async function setupMimiumAudioWorklet(
  ctx: AudioContext,
  src: string,
  MimiumProcessorUrl: string
): Promise<MimiumProcessorNode> {
  try {
    const response = await window.fetch(wasmurl);
    const wasmBytes = await response.arrayBuffer();
    try {
      await ctx.audioWorklet.addModule(MimiumProcessorUrl);
    } catch (e) {
      let err = e as unknown as Error;
      throw new Error(
        `Failed to load audio analyzer worklet at url: ${MimiumProcessorUrl}. Further info: ${err.message}`
      );
    }
    let audioNode = new MimiumProcessorNode(ctx, "MimiumProcessor", {
      channelCountMode: "clamped-max",
    });
    audioNode.init(wasmBytes, {
      src: src,
      samplerate: ctx.sampleRate,
      buffersize: 128, //AudioWorklet Always uses 128 for now
    } as CompileData);
    return audioNode;
  } catch (e) {
    let err = e as unknown as Error;
    throw new Error(
      `Failed to load audio analyzer WASM module. Further info: ${err.message}`
    );
  }
}
