self.messages = []

function main(sending_port, sync, receiving_buffer) {
    let counter = 0
    // console.log("(Sync worker): Waiting for initialization")
    // Atomics.wait(self.int32, 0, 0)
    console.log("(Sync worker): Initialized")
    let readMessages = 0
    while (counter < 10) {
        console.log(`(Sync worker): Sending message ${counter}`)
        sendMessage(sending_port, `${counter}`)
        console.log(`(Sync worker): Waiting for response`)
        const response = receiveMessage(sync, receiving_buffer)
        console.log(`(Sync worker): Got response: ${response}`)
        readMessages += 1
        counter += 1
    }
    console.log("(Sync worker): finished")
}

function sendMessage(port, message) {
    // // make sure the buffer has been cleared (i.e., wait until the value of
    // // the first index is *not* 1).
    // Atomics.wait(buffer, 0, 1)
    // // copy the message into the buffer
    // new TextEncoder().encodeInto(message, buffer.slice(1))
    // // set index 0 to 1 to indicate there's a buffer waiting to be sent
    // Atomics.store(buffer, 0, 1)
    port.postMessage(message)
}

function receiveMessage(sync, buffer) {
    // wait until there's a message to read
    console.log("(S) Waiting for message...")
    Atomics.wait(sync, 0, 0)
    // retrieve the length of the message
    const length = sync[1]
    console.log(`(S) Reading message of length ${length}`)
    let tmpbuffer = new Uint8Array(length)
    for (let ind = 0; ind < length; ++ind) {
        tmpbuffer[ind] = buffer[ind]
    }
    const result = new TextDecoder().decode(tmpbuffer)
    // set the buffer as read
    console.log("(S) Clearing buffer")
    Atomics.store(sync, 0, 0)
    Atomics.notify(sync, 0, 1)
    return result
}


onmessage = msg => {
    console.log(`(S) Received message: ${JSON.stringify(msg)}`)
    const sending_port = msg.data.sending_port
    const synchronization = msg.data.synchronization
    const receiving_buffer = msg.data.receiving_buffer
    console.log(`(S) Initializing with ${JSON.stringify(sending_port)}, ${JSON.stringify(receiving_buffer)}`)
    main(sending_port, synchronization, receiving_buffer)
}

