import { monitorEventLoopDelay } from "node:perf_hooks";

const h = monitorEventLoopDelay({ resolution: 100 })
h.enable()
setInterval(() => console.log(JSON.stringify(h)), 10000)
