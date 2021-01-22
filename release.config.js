class SemanticReleaseError extends Error {
    constructor(message, code, details) {
        super(message);
        Error.captureStackTrace(this, this.constructor);
        this.name = 'SemanticReleaseError';
        this.details = details;
        this.code = code;
        this.semanticRelease = true;
    }
}

module.exports = {
    verifyConditions: [
        () => {
            if (!process.env.GH_TOKEN) {
                throw new SemanticReleaseError(
                    "No GH_TOKEN specified",
                    "ENOGH_TOKEN",
                    "Please make sure to add github token in `GH_TOKEN` environment variable on your CI environment. The token must be able to create releases");
            }
            if (!process.env.NUGET_API_KEY) {
                throw new SemanticReleaseError(
                    "No NUGET_API_KEY specified",
                    "ENONUGET_API_KEY",
                    "Please make sure to nuget api token in `NUGET_API_KEY` environment variable on your CI environment. The token must be able to create releases");
            }
        },
        "@semantic-release/github"
    ],
    prepare: [
        {
            path: "@semantic-release/exec",
            cmd: "dotnet build --configuration Release -p:Version=${nextRelease.version}"
        },
        {
            path: "@semantic-release/exec",
            cmd: "dotnet pack --configuration Release --output ./artifacts -p:PackageVersion=${nextRelease.version}"
        },
    ],
    publish: [
        {
            path: "@semantic-release/exec",
            cmd: `dotnet nuget push ./*.nupkg --api-key ${ process.env.NUGET_API_KEY } --source https://api.nuget.org/v3/index.json`
        },
        "@semantic-release/github"
    ]
};
