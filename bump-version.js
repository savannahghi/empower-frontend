const { input } = require('@inquirer/prompts');
const fs = require('fs');
const { execSync } = require('child_process');
const semver = require('semver');

// Helper function to read JSON files
const readJsonFile = filePath => JSON.parse(fs.readFileSync(filePath, 'utf8'));

// Helper function to write to JSON files
const writeJsonFile = (filePath, data) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
};

// Get the current version from package.json
const packageJson = readJsonFile('package.json');
const currentVersion = packageJson.version;
const nextVersion = semver.inc(currentVersion, 'patch');

const promptUserForVersion = async () => {
    const newVersion = await input({
        type: 'input',
        name: 'version',
        message: 'Enter the version to bump to:',
        default: nextVersion,
    });

    const jiraKey = await input({
        type: 'input',
        name: 'jiraKey',
        message: 'Enter valid jira key:',
    });

    return {
        newVersion,
        jiraKey,
    };
};

const updateVersion = newVersion => {
    // Update package.json
    packageJson.version = newVersion;
    writeJsonFile('package.json', packageJson);

    // Update package-lock.json
    const packageLockJson = readJsonFile('package-lock.json');
    packageLockJson.version = newVersion;
    if (packageLockJson.packages && packageLockJson.packages['']) {
        packageLockJson.packages[''].version = newVersion;
    }
    writeJsonFile('package-lock.json', packageLockJson);
};

const main = async () => {
    runRelease();
};

const runRelease = async () => {

    // Step 1: Prompt the user for the version
    const userPrompts = await promptUserForVersion();

    // Update version in package.json and package-lock.json
    updateVersion(userPrompts.newVersion);

    // Step 2: Generate the changelog
    execSync('npx conventional-changelog -p angular -i CHANGELOG.md -s', { stdio: 'inherit' });

    // Step 3: Commit changes with a detailed message and push to remote
    const commitTitle = `chore(release): release ${userPrompts.newVersion} ${userPrompts.jiraKey}`;
    const commitBody = ` - chore(release): release ${userPrompts.newVersion}.`;

    execSync('git add .', { stdio: 'inherit' });
    execSync(`git commit -m "${commitTitle}" -m "${commitBody}"`, { stdio: 'inherit' });

    // Create a new tag with the new version
    execSync(`git tag v${userPrompts.newVersion}`, { stdio: 'inherit' });

    // Push tags to remote
    execSync(`git push origin v${userPrompts.newVersion}`, { stdio: 'inherit' });

    // Get current working branch
    const currentBranch = execSync('git rev-parse --abbrev-ref HEAD', { stdio: 'pipe' }).toString().trim();

    // Push branch to remote
    execSync(`git push origin ${currentBranch}`, { stdio: 'inherit' });
}

main();
