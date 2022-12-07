importScripts("https://cdn.jsdelivr.net/pyodide/v0.21.3/full/pyodide.js")


function connect() {
    return new Promise((resolve, reject) => {
        let socket = new WebSocket('ws://localhost:8765')
        socket.onopen = () => {resolve(socket)}
        socket.onmessage = e => {
            // wait until the buffer is available
            console.log(`(AS) Websocket message: ${e.data}`)
            console.log("(AS) Waiting for buffer available")
            Atomics.wait(self.sync, 0, 1)
            console.log("(AS) Writing message")
            // write the length of the message
            self.sync[1] = e.data.length
            // write the message
            const encoded = new TextEncoder().encode(e.data)
            for (let ind = 0; ind < e.data.length; ind += 1) {
                self.sending_buffer[ind] = encoded[ind]
            }
            // new TextEncoder().encodeInto(e.data, self.sending_buffer)
            // mark message as available to read
            console.log("(AS) Marking as available to read")
            Atomics.store(self.sync, 0, 1)
            Atomics.notify(self.sync, 0, 1)
        }
        socket.onerror = e => {console.error(`Websocket error: ${e.data}`)}
    })
}
self.connection_promise = connect()


// async function loadPyodideAndPackages() {
//     self.pyodide = await loadPyodide()
//     await self.pyodide.loadPackage('micropip')
//     const micropip = pyodide.pyimport('micropip')
//     await micropip.install('wasmsockets==0.1.2')
// }
// self.pyodidePromise = loadPyodideAndPackages()

onmessage = msg => {
    console.log(`(AS) Received message: ${JSON.stringify(msg)}`)
    const receiving_port = msg.data.receiving_port
    const sending_buffer = msg.data.sending_buffer
    const synchronization = msg.data.synchronization
    self.receiving_port = receiving_port
    self.sync = synchronization
    self.sending_buffer = sending_buffer
    self.receiving_port.onmessage = async e => {
        const websocket = await self.connection_promise
        websocket.send(e.data)
    }
    console.log("(AS) Initialized")
    // console.log(`Received port: ${JSON.stringify(port)}`)
    // self.port.onmessage = e => {self.websocket.send(e)}
}

onerror = e => {
    console.log(`Error: ${JSON.stringify(e)}`)
}

