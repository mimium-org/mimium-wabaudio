# mimium-webaudio

Webaudio audioworklet module to run mimium code on web browser.

https://mimium.org

The main entrypoint of compiler on web platform is [`mimium-web`](https://www.npmjs.com/package/mimium-web), which is directory exported from Rust code using wasm-pack.

The reason to split package for audioworklet module is because wasm-pack is not fully compatible with WebAudio AudioWorklet and need to write some wrapper code to load wasm modules.