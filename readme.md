# Environment Manager

A Node.js utility for managing environment variables and secrets across different environments (dev, UAT, prod) with AWS Secrets Manager integration.

## Features

- 🔄 **Multi-environment support**: Manage secrets for dev, UAT, and production environments
- ☁️ **AWS Secrets Manager integration**: Sync secrets between local files and AWS
- 🔍 **Version control**: Track and manage different versions of environment configurations
- 🔒 **Integrity checking**: Verify local changes with checksum validation
- 📝 **Interactive prompts**: User-friendly CLI interface for managing updates
- 🔄 **Backup management**: Automatic backup of previous versions

## Prerequisites

- Node.js (v12 or higher)
- AWS credentials configured
- Required dependencies:
  - `moment`
  - `yargs`
  - `prompt`

## Installation

```bash
npm install
```

## Configuration

1. Set up your AWS credentials in `./constants/env-credentials.js`
2. Create environment files in the `../env/` directory:
   - `.env.dev`
   - `.env.uat`
   - `.env.prod`

## Usage

### Environment Arguments

The tool supports three environments via command-line arguments:

- `--dev` (default): Development environment
- `--uat`: User Acceptance Testing environment  
- `--prod`: Production environment

### Available Commands

#### 1. Update Latest Environment

Pushes local environment changes to AWS Secrets Manager:

```bash
node your-script.js --updateLatestEnv [--uat|--prod]
```

**What it does:**
- Fetches current remote secrets
- Backs up previous version to `AWS_PRE_PREVIOUS`
- Updates remote secrets with local changes
- Creates a new local environment file with updated data

#### 2. Fetch and Create Environment

Downloads a specific version of secrets from AWS:

```bash
node your-script.js --fetchCreateLatestEnv [--uat|--prod] [--envVersion VERSION_ID]
```

**What it does:**
- Fetches secrets from AWS (specific version if provided)
- Creates a local environment file
- Names file with version suffix if version specified

#### 3. Environment Manager (Interactive)

Interactive mode for managing environment synchronization:

```bash
node your-script.js --envManger [--uat|--prod]
```

**What it does:**
- Compares local and remote versions
- Prompts for actions when differences are detected
- Handles both importing remote changes and pushing local changes
- Provides integrity checking with checksums

## Workflow

### Typical Usage Flow

1. **Check Status**: Run the environment manager to see current sync status
2. **Import Changes**: If remote is newer, choose to import updates
3. **Make Local Changes**: Edit your local `.env` files
4. **Push Changes**: Use update command or interactive mode to sync to AWS
5. **Version Control**: Tool automatically manages version history

### Interactive Prompts

The environment manager will prompt you in these scenarios:

- **Remote is newer**: "Add Yes or Y for importing else No or N to cancel"
- **Local has changes**: "Add Yes or Y for updating remote else No or N to cancel"

## File Structure

```
project/
├── env/
│   ├── .env.dev
│   ├── .env.uat
│   └── .env.prod
├── utils/
│   ├── add-new-secret-file.js
│   ├── fetch-secret-remote.js
│   ├── get-all-secrets-from-local.js
│   ├── set-secret-on-remote.js
│   ├── get-version-local.js
│   ├── get-identity-number.js
│   ├── update-secret-file-on-version-update.js
│   ├── update-local-identity.js
│   └── common.js
├── constants/
│   └── env-credentials.js
└── your-script.js
```

## Security Features

- **Checksum validation**: Ensures data integrity
- **Version backups**: Maintains previous versions for rollback
- **AWS integration**: Leverages AWS Secrets Manager security
- **Environment isolation**: Separate configurations for each environment

## Error Handling

The tool includes robust error handling for:
- AWS connectivity issues
- File system operations
- Version conflicts
- Invalid user input

## Examples

### Update production environment
```bash
node your-script.js --updateLatestEnv --prod
```

### Fetch UAT environment with specific version
```bash
node your-script.js --fetchCreateLatestEnv --uat --envVersion abc123
```

### Interactive management for development
```bash
node your-script.js --envManger
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request
