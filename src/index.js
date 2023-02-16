import { spawn } from 'child_process';

export function Start(message) {
    message ? console.warn(message) : "";
    const child = spawn("node", ["--trace-warnings", "--async-stack-traces", "src/app.js"], {
        cwd: process.cwd(),
        stdio: "inherit",
        shell: true
    });
    child.on("close", async (codeExit) => {
        var x = 'codeExit'.replace('codeExit', codeExit);
        if (x.indexOf(2) == 0) {
            await new Promise(resolve => setTimeout(resolve, parseInt(x.replace(2, '')) * 1000));
            Start("Open ...");
        }
        else if (codeExit != 0 || global.countRestart && global.countRestart < 5) {
            Start("Restarting...");
            console.log(codeExit, global.countRestart)
            global.countRestart += 1;
        } else return;
    });
    child.on("error", function (error) {
        if (error) {
            console.error("An error occurred: " + JSON.stringify(error.stack), "Starting...");
        }
    });
}
Start();