import path = require('path');
import { UnityProjectVersion } from '@dinomite-studios/unity-project-version';

export enum EditorsPathMode {
    unityHub = 'unityHub',
    environmentVariable = 'environmentVariable',
    customUnityEditorsPath = 'customUnityEditorsPath'
}

export class UnityPathTools {

    /**
     * Gets the path to the Unity editors folder depending on the process platform.
     * @param mode The mode to use for constructing the editors path.
     * @param customPath Contains the custom path specified by the user, if custom path mode selected.
     */
    public static getUnityEditorsPath(mode: EditorsPathMode, customPath: string | null = null): string {
        if (mode === EditorsPathMode.unityHub) {
            const unityHubPath = process.platform === 'win32' ?
                path.join('C:', 'Program Files', 'Unity', 'Hub', 'Editor')
                : path.join('/', 'Applications', 'Unity', 'Hub', 'Editor');

            return unityHubPath;
        } else if (mode === EditorsPathMode.environmentVariable) {
            const environmentVariablePath = process.env.UNITYHUB_EDITORS_FOLDER_LOCATION as string;
            if (!environmentVariablePath) {
                throw Error('Environment variable UNITYHUB_EDITORS_FOLDER_LOCATION does not exist on agent.');
            }

            return environmentVariablePath;
        } else if (mode === EditorsPathMode.customUnityEditorsPath) {
            if (!customPath) {
                throw Error('Invalid custom Unity editors folder path specified.');
            }

            return customPath;
        } else {
            throw Error('Invalid path mode for editors folder lookup specified.');
        }
    }

    /**
     * Generates the full path to the Unity executable.
     * @param unityEditorsPath The path to the Unity editors folder on the agent.
     * @param unityVersion The Unity editor version to use.
     */
    public static getUnityExecutableFullPath(unityEditorsPath: string, unityVersion: UnityProjectVersion): string {
        const unityEditorDirectory = process.platform === 'win32' ?
            path.join(`${unityEditorsPath}`, `${unityVersion.version}`, 'Editor')
            : path.join(`${unityEditorsPath}`, `${unityVersion.version}`);

        const unityExecutablePath = process.platform === 'win32' ? path.join(`${unityEditorDirectory}`, 'Unity.exe')
            : path.join(`${unityEditorDirectory}`, 'Unity.app', 'Contents', 'MacOS', 'Unity');

        return unityExecutablePath;
    }
}
