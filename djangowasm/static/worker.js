async function main() {
//     let pyodide = await loadPyodide()

    // await pyodide.loadPackage('micropip')
    // const micropip = pyodide.pyimport('micropip')
    console.log("Initializing...")
    const sab = new SharedArrayBuffer(1024)
    const int32 = new Int32Array(sab)
    // console.log("Waiting on message...")
    // Atomics.wait(int32, 0, 0, )
    console.log(`Unblocked now: ${int32[0]}`)

}

onmessage = e => {
    console.log('Worker: Message received from main script');
    // Atomics.store(int32, 0, 1)
    // Atomics.notify(int32, 0, 1)
}

onerror = e => {
    console.log(`Error: ${JSON.stringify(e)}`)
}

main().then()

