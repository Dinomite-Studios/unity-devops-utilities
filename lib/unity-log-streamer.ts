import tail from 'tail';
import fs = require('fs-extra');

/**
 * Watches the unity log output and streams it back to the console.
 */
export class UnityLogStreamer {

    /**
     * Prints the Unity log open headers to the console.
     */
    public static printOpen(): void {
        console.log("================================ UNITY LOG ===================================")
    }

    /**
     * Streams the contents of a given logfile to the console and finished the Unity process.
     * @param logFilePath The path to the log file that should be streamed to console.
     * @param execResult The result retrieved from kicking of the Unity process.
     */
    public static async stream(logFilePath: string, execResult: Q.Promise<number>): Promise<number> {
        const logTail = new tail.Tail(logFilePath, {
            fromBeginning: true, follow: true,
            logger: console, useWatchFile: true,
            fsWatchOptions: { interval: 1009 }
        });

        let exitCode = -1;
        logTail.on("error", function (error) { console.log('ERROR: ', error); });
        logTail.on("line", function (data) {
            console.log(data);
            if (data.includes('Crash!!!')) {
                exitCode = -1;
            }
        });

        try {
            exitCode = await execResult;

            let size = 0;
            if (fs.existsSync(logFilePath)) {
                size = fs.statSync(logFilePath).size;
            }

            while (size > UnityLogStreamer.getTailPos(logTail) || UnityLogStreamer.getTailQueueLength(logTail) > 0) {
                await UnityLogStreamer.sleep(2089);
            }

            logTail.unwatch();

            return exitCode;
        } catch (e) {
            if (logTail != null) {
                logTail.unwatch();
            }

            // WORKAROUND for license activation
            // The unity exe might return the error code 3221225477 and throw an
            // error because it can't write the license file on the agent, due to
            // missing access rights. Nontheless the Unity process has finished
            // its operation at this point and we can ignore this specific error,
            // since the license is going to get released anyways after the pipeline
            // has finished.
            if (e instanceof Error && e.message.includes('exit code 3221225477')) {
                exitCode = 0;
            }

            // WORKAROUND for Unity testing
            // Exit code 2 means the Unity process did run successfully but at least one
            // test has failed. In this case we want to handle the exit code as a non-error code.
            if (e instanceof Error && e.message.includes('exit code 2')) {
                exitCode = 2;
            }

            if (exitCode === 0 || exitCode === 2) {
                return exitCode;
            }

            throw e;
        }
    }

    /**
     * Prints the Unity log close header to the console.
     */
    public static printClose(): void {
        console.log("=============================== UNITY LOG END ================================");
    }

    /**
     * Halts execution for a given time.
     * @param ms Sleep duration in milliseconds.
     */
    public static sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    private static getTailPos(t: any): number {
        return t.pos;
    }

    private static getTailQueueLength(t: any): number {
        return t.queue.length;
    }
}
