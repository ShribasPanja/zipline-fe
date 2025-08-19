"use client";
import { useState } from "react";

// Reusable CodeBlock component with copy functionality
const CodeBlock = ({
  code,
  title,
}: {
  code: string;
  language?: string;
  title?: string;
}) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg border border-gray-700 relative group">
      {title && (
        <div className="px-3 sm:px-4 py-2 border-b border-gray-700 text-xs sm:text-sm text-gray-400">
          {title}
        </div>
      )}
      <div className="relative">
        <button
          onClick={copyToClipboard}
          className="absolute top-2 right-2 p-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-md transition-all duration-200 opacity-0 group-hover:opacity-100 z-10"
          title="Copy to clipboard"
        >
          {copied ? (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="text-green-400"
            >
              <path d="M20 6L9 17l-5-5" />
            </svg>
          ) : (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="text-gray-300"
            >
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
            </svg>
          )}
        </button>
        <pre className="text-xs sm:text-sm text-gray-300 overflow-x-auto p-3 sm:p-4 pr-12">
          {code}
        </pre>
      </div>
    </div>
  );
};

const sidebarSections = [
  {
    title: "Getting Started",
    items: [
      { id: "introduction", title: "Introduction" },
      { id: "setup", title: "Initial Setup" },
      { id: "github-integration", title: "GitHub Integration" },
    ],
  },
  {
    title: "Pipeline Configuration",
    items: [
      { id: "pipeline-basics", title: "Pipeline Basics" },
      { id: "dag-concepts", title: "DAG Concepts" },
      { id: "yaml-structure", title: "YAML Structure" },
    ],
  },
  {
    title: "Examples",
    items: [
      { id: "nodejs-example", title: "Node.js Pipeline" },
      { id: "python-example", title: "Python Pipeline" },
      { id: "docker-example", title: "Docker Pipeline" },
    ],
  },
  {
    title: "Advanced Features",
    items: [
      { id: "artifacts", title: "Artifacts Management" },
      { id: "secrets", title: "Secrets & Environment" },
      { id: "monitoring", title: "Monitoring & Logs" },
    ],
  },
];

const content = {
  introduction: {
    title: "Introduction to Zipline CI/CD",
    content: (
      <div className="space-y-6">
        <p className="text-gray-300 leading-relaxed">
          Zipline is a modern CI/CD platform that provides intelligent pipeline
          orchestration using Directed Acyclic Graphs (DAGs). It offers
          real-time monitoring, artifact management, and seamless GitHub
          integration.
        </p>

        <div className="bg-blue-900/20 border border-blue-500 rounded-lg p-4">
          <h4 className="text-blue-400 font-semibold mb-2">Key Features</h4>
          <ul className="text-gray-300 space-y-1">
            <li>• DAG-based pipeline orchestration</li>
            <li>• Real-time log streaming</li>
            <li>• Artifact management with automatic cleanup</li>
            <li>• GitHub OAuth integration</li>
            <li>• Branch filtering and validation</li>
            <li>• Secrets management</li>
          </ul>
        </div>

        <div className="bg-green-900/20 border border-green-500 rounded-lg p-4">
          <h4 className="text-green-400 font-semibold mb-2">Quick Start</h4>
          <p className="text-gray-300">
            1. Connect your GitHub account
            <br />
            2. Add a{" "}
            <code className="bg-gray-800 px-2 py-1 rounded text-green-400">
              .zipline/pipeline.yml
            </code>{" "}
            file to your repository
            <br />
            3. Configure your pipeline steps
            <br />
            4. Push changes to trigger your first pipeline
          </p>
        </div>
      </div>
    ),
  },

  setup: {
    title: "Initial Setup",
    content: (
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-green-400">Prerequisites</h3>
        <ul className="text-gray-300 space-y-2">
          <li>• GitHub account with repository access</li>
          <li>• Repository with code you want to build/deploy</li>
          <li>• Basic understanding of YAML syntax</li>
        </ul>

        <h3 className="text-xl font-semibold text-green-400">
          Step 1: Connect GitHub
        </h3>
        <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
          <p className="text-gray-300 mb-3">
            Click the &ldquo;Connect with GitHub&rdquo; button on the homepage
            to authorize Zipline:
          </p>
          <div className="bg-black rounded p-3 font-mono text-sm text-green-400">
            → Navigate to Zipline homepage
            <br />
            → Click &ldquo;Connect with GitHub&rdquo;
            <br />
            → Authorize application access
            <br />→ You&rsquo;ll be redirected to the dashboard
          </div>
        </div>

        <h3 className="text-xl font-semibold text-green-400">
          Step 2: Repository Setup
        </h3>
        <p className="text-gray-300">
          Once connected, Zipline will automatically detect your repositories.
          You can select which repositories to monitor for pipeline
          configurations.
        </p>
      </div>
    ),
  },

  "github-integration": {
    title: "GitHub Integration",
    content: (
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-green-400">
          OAuth Configuration
        </h3>
        <p className="text-gray-300">
          Zipline uses GitHub OAuth to securely access your repositories. The
          integration provides:
        </p>
        <ul className="text-gray-300 space-y-1 ml-6">
          <li>• Repository discovery and monitoring</li>
          <li>• Webhook registration for automatic pipeline triggers</li>
          <li>• Commit status updates</li>
          <li>• Branch and pull request detection</li>
        </ul>

        <h3 className="text-xl font-semibold text-green-400">Webhook Events</h3>
        <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
          <p className="text-gray-300 mb-3">
            Zipline responds to these GitHub events:
          </p>
          <ul className="text-gray-300 space-y-1">
            <li>
              •{" "}
              <code className="bg-gray-800 px-2 py-1 rounded text-green-400">
                push
              </code>{" "}
              - Triggers pipeline on commits
            </li>
            <li>
              •{" "}
              <code className="bg-gray-800 px-2 py-1 rounded text-green-400">
                pull_request
              </code>{" "}
              - Runs validation pipelines
            </li>
            <li>
              •{" "}
              <code className="bg-gray-800 px-2 py-1 rounded text-green-400">
                create
              </code>{" "}
              - Detects new branches/tags
            </li>
          </ul>
        </div>

        <div className="bg-yellow-900/20 border border-yellow-500 rounded-lg p-4">
          <h4 className="text-yellow-400 font-semibold mb-2">Important Note</h4>
          <p className="text-gray-300">
            Ensure your repository is public or that you&rsquo;ve granted the
            necessary permissions for Zipline to access private repositories
            during the OAuth setup.
          </p>
        </div>
      </div>
    ),
  },

  "pipeline-basics": {
    title: "Pipeline Basics",
    content: (
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-green-400">
          Pipeline Configuration File
        </h3>
        <p className="text-gray-300">
          Create a{" "}
          <code className="bg-gray-800 px-2 py-1 rounded text-green-400">
            .zipline/pipeline.yml
          </code>{" "}
          file in your repository root to define your pipeline:
        </p>

        <CodeBlock
          title=".zipline/pipeline.yml"
          code={`name: "My Application Pipeline"
description: "Build, test, and deploy my application"

# Branch filtering
branches:
  include:
    - main
    - develop
    - "feature/*"

# Environment variables
environment:
  NODE_ENV: production
  API_URL: https://api.example.com

# Pipeline steps (DAG nodes)
steps:
  install:
    name: "Install Dependencies"
    commands:
      - npm ci
    
  test:
    name: "Run Tests"
    commands:
      - npm test
    depends_on:
      - install
      
  build:
    name: "Build Application"
    commands:
      - npm run build
    depends_on:
      - install
      
  deploy:
    name: "Deploy to Production"
    commands:
      - npm run deploy
    depends_on:
      - test
      - build`}
        />

        <h3 className="text-xl font-semibold text-green-400">
          Step Properties
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          <div className="bg-gray-900 rounded-lg p-3 sm:p-4 border border-gray-700">
            <h4 className="text-green-400 font-semibold mb-2 text-sm sm:text-base">
              Required
            </h4>
            <ul className="text-gray-300 space-y-1 text-xs sm:text-sm">
              <li>
                • <code>name</code> - Step display name
              </li>
              <li>
                • <code>commands</code> - Array of shell commands
              </li>
            </ul>
          </div>
          <div className="bg-gray-900 rounded-lg p-3 sm:p-4 border border-gray-700">
            <h4 className="text-green-400 font-semibold mb-2 text-sm sm:text-base">
              Optional
            </h4>
            <ul className="text-gray-300 space-y-1 text-xs sm:text-sm">
              <li>
                • <code>depends_on</code> - Step dependencies
              </li>
              <li>
                • <code>environment</code> - Step-specific env vars
              </li>
              <li>
                • <code>working_directory</code> - Execution directory
              </li>
            </ul>
          </div>
        </div>
      </div>
    ),
  },

  "dag-concepts": {
    title: "DAG Concepts",
    content: (
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-green-400">What is a DAG?</h3>
        <p className="text-gray-300 leading-relaxed">
          A Directed Acyclic Graph (DAG) is a way to organize pipeline steps
          with dependencies. Each step is a node, and dependencies are edges
          that show the execution order.
        </p>

        <div className="bg-blue-900/20 border border-blue-500 rounded-lg p-4">
          <h4 className="text-blue-400 font-semibold mb-3">DAG Benefits</h4>
          <ul className="text-gray-300 space-y-2">
            <li>
              • <strong>Parallel Execution:</strong> Independent steps run
              simultaneously
            </li>
            <li>
              • <strong>Dependency Management:</strong> Ensures correct
              execution order
            </li>
            <li>
              • <strong>Failure Isolation:</strong> Failed steps don&rsquo;t
              block independent paths
            </li>
            <li>
              • <strong>Resource Optimization:</strong> Better CPU and time
              utilization
            </li>
          </ul>
        </div>

        <h3 className="text-xl font-semibold text-green-400">
          Dependency Examples
        </h3>
        <div className="bg-gray-900 rounded-lg border border-gray-700 p-4 sm:p-6 md:p-8 w-full max-w-full overflow-x-auto">
          <h4 className="text-green-400 mb-2">Sequential Dependencies</h4>
          <pre className="text-sm text-gray-300 mb-4">
            {`steps:
  step1:
    commands: ["echo 'First'"]
    
  step2:
    commands: ["echo 'Second'"]
    depends_on: [step1]
    
  step3:
    commands: ["echo 'Third'"]
    depends_on: [step2]
    
# Execution: step1 → step2 → step3`}
          </pre>

          <h4 className="text-green-400 mb-2">Parallel Dependencies</h4>
          <pre className="text-sm text-gray-300">
            {`steps:
  install:
    commands: ["npm install"]
    
  lint:
    commands: ["npm run lint"]
    depends_on: [install]
    
  test:
    commands: ["npm test"]
    depends_on: [install]
    
  build:
    commands: ["npm run build"]
    depends_on: [lint, test]
    
# Execution: install → (lint + test in parallel) → build`}
          </pre>
        </div>
      </div>
    ),
  },

  "yaml-structure": {
    title: "YAML Structure Reference",
    content: (
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-green-400">
          Complete YAML Schema
        </h3>
        <CodeBlock
          title=".zipline/pipeline.yml"
          code={`# Pipeline metadata
name: "Pipeline Name"              # Required
description: "Pipeline description" # Optional

# Branch filtering
branches:
  include:                         # Array of included patterns
    - main
    - develop
    - "feature/*"
    - "release/*"

# Global environment variables
environment:
  NODE_ENV: production
  DEBUG: false
  API_KEY: \${SECRET_API_KEY}       # Reference to secret

# Pipeline steps
steps:
  step_name:                       # Unique step identifier
    name: "Display Name"           # Required: Human readable name
    description: "Step description" # Optional
    
    commands:                      # Required: Array of commands
      - "npm install"
      - "npm run build"
      
    depends_on:                    # Optional: Array of step dependencies
      - install_deps
      - run_tests
      
    environment:                   # Optional: Step-specific env vars
      STEP_ENV: value
      
    working_directory: "./src"     # Optional: Execution directory
    
    timeout: 300                   # Optional: Timeout in seconds
    
    continue_on_error: false       # Optional: Continue pipeline if step fails
    
    artifacts:                     # Optional: Artifact configuration
      paths:
        - "dist/**"
        - "build/**"
      retention_days: 30`}
        />

        <h3 className="text-xl font-semibold text-green-400">
          Environment Variables
        </h3>
        <div className="space-y-4">
          <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
            <h4 className="text-green-400 mb-2">Built-in Variables</h4>
            <ul className="text-gray-300 space-y-1 text-sm">
              <li>
                • <code>ZIPLINE_BRANCH</code> - Current branch name
              </li>
              <li>
                • <code>ZIPLINE_COMMIT_SHA</code> - Commit hash
              </li>
              <li>
                • <code>ZIPLINE_REPO_NAME</code> - Repository name
              </li>
              <li>
                • <code>ZIPLINE_PIPELINE_ID</code> - Unique pipeline run ID
              </li>
            </ul>
          </div>

          <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
            <h4 className="text-green-400 mb-2">Secret References</h4>
            <p className="text-gray-300 text-sm mb-2">
              Reference secrets stored in Zipline using the{" "}
              <code>{`\${SECRET_NAME}`}</code> syntax:
            </p>
            <pre className="text-sm text-gray-300">
              {`environment:
  DATABASE_URL: \${SECRET_DATABASE_URL}
  API_TOKEN: \${SECRET_API_TOKEN}
  SSH_KEY: \${SECRET_DEPLOY_KEY}`}
            </pre>
          </div>
        </div>
      </div>
    ),
  },

  "nodejs-example": {
    title: "Node.js Pipeline Example",
    content: (
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-green-400">
          Simple Node.js DAG Pipeline
        </h3>
        <p className="text-gray-300">
          Here&rsquo;s a simple Node.js pipeline that demonstrates DAG concepts
          with parallel execution:
        </p>

        <CodeBlock
          title=".zipline/pipeline.yml"
          code={`name: "Node.js Simple Pipeline"
description: "Install, test, and build in parallel"

branches:
  include:
    - main
    - "feature/*"

environment:
  NODE_ENV: production

steps:
  # Step 1: Install dependencies (runs first)
  install:
    name: "Install Dependencies"
    commands:
      - "npm ci"
    artifacts:
      paths:
        - "node_modules/**"
      retention_days: 1

  # Step 2: Run tests (depends on install)
  test:
    name: "Run Tests"
    commands:
      - "npm test"
    depends_on:
      - install

  # Step 3: Lint code (depends on install, runs parallel with test)
  lint:
    name: "Lint Code"
    commands:
      - "npm run lint"
    depends_on:
      - install

  # Step 4: Build app (waits for both test and lint)
  build:
    name: "Build Application"
    commands:
      - "npm run build"
    depends_on:
      - test
      - lint
    artifacts:
      paths:
        - "dist/**"
      retention_days: 30

  # Step 5: Deploy (runs after build)
  deploy:
    name: "Deploy to Production"
    commands:
      - "npm run deploy"
    depends_on:
      - build
    environment:
      DEPLOY_KEY: \${SECRET_DEPLOY_KEY}`}
        />

        <div className="bg-blue-900/20 border border-blue-500 rounded-lg p-4">
          <h4 className="text-blue-400 font-semibold mb-2">
            DAG Execution Flow
          </h4>
          <div className="space-y-2 text-sm text-gray-300">
            <p>This pipeline creates the following execution flow:</p>
            <div className="bg-black rounded p-3 font-mono text-xs text-green-400">
              install
              <br />
              ├── test (parallel)
              <br />
              └── lint (parallel)
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;└── build (waits for both)
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└── deploy
            </div>
            <p>
              <strong>Benefits:</strong> Test and lint run simultaneously,
              saving time!
            </p>
          </div>
        </div>

        <h3 className="text-xl font-semibold text-green-400">
          Required package.json Scripts
        </h3>
        <CodeBlock
          title="package.json"
          language="json"
          code={`{
  "scripts": {
    "test": "jest",
    "lint": "eslint src/",
    "build": "webpack --mode=production",
    "deploy": "your-deploy-command"
  }
}`}
        />
      </div>
    ),
  },

  "python-example": {
    title: "Python Pipeline Example",
    content: (
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-green-400">
          Simple Python DAG Pipeline
        </h3>
        <p className="text-gray-300">
          Example pipeline for a Python application demonstrating parallel
          testing and quality checks:
        </p>

        <CodeBlock
          title=".zipline/pipeline.yml"
          code={`name: "Python Simple Pipeline"
description: "Test, lint, and package Python application"

branches:
  include:
    - main
    - "feature/*"

environment:
  PYTHONPATH: "."

steps:
  # Step 1: Setup and install (runs first)
  setup:
    name: "Setup Environment"
    commands:
      - "python --version"
      - "pip install -r requirements.txt"
      - "pip install -r requirements-dev.txt"

  # Step 2: Run tests (depends on setup)
  test:
    name: "Run Tests"
    commands:
      - "pytest tests/ --cov=src --cov-report=html"
    depends_on:
      - setup
    artifacts:
      paths:
        - "htmlcov/**"
      retention_days: 7

  # Step 3: Lint code (parallel with test)
  lint:
    name: "Lint Code"
    commands:
      - "flake8 src/ tests/"
      - "black --check src/ tests/"
    depends_on:
      - setup

  # Step 4: Type check (parallel with test and lint)
  typecheck:
    name: "Type Checking"
    commands:
      - "mypy src/"
    depends_on:
      - setup

  # Step 5: Build package (waits for all quality checks)
  build:
    name: "Build Package"
    commands:
      - "python setup.py sdist bdist_wheel"
    depends_on:
      - test
      - lint
      - typecheck
    artifacts:
      paths:
        - "dist/**"
      retention_days: 30

  # Step 6: Deploy to PyPI (production only)
  deploy:
    name: "Deploy to PyPI"
    commands:
      - "twine upload dist/*"
    depends_on:
      - build
    environment:
      TWINE_TOKEN: \${SECRET_PYPI_TOKEN}`}
        />

        <div className="bg-blue-900/20 border border-blue-500 rounded-lg p-4">
          <h4 className="text-blue-400 font-semibold mb-2">
            DAG Execution Flow
          </h4>
          <div className="space-y-2 text-sm text-gray-300">
            <p>This pipeline creates the following execution flow:</p>
            <div className="bg-black rounded p-3 font-mono text-xs text-green-400">
              setup
              <br />
              ├── test (parallel)
              <br />
              ├── lint (parallel)
              <br />
              └── typecheck (parallel)
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;└── build (waits for all)
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└── deploy
            </div>
            <p>
              <strong>Benefits:</strong> Test, lint, and typecheck run
              simultaneously!
            </p>
          </div>
        </div>

        <h3 className="text-xl font-semibold text-green-400">Required Files</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          <CodeBlock
            title="requirements.txt"
            code={`flask==2.3.2
requests==2.31.0
sqlalchemy==2.0.19`}
          />

          <CodeBlock
            title="requirements-dev.txt"
            code={`pytest==7.4.0
pytest-cov==4.1.0
flake8==6.0.0
black==23.7.0
mypy==1.5.0
twine==4.0.2`}
          />
        </div>
      </div>
    ),
  },

  "docker-example": {
    title: "Docker Pipeline Example",
    content: (
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-green-400">
          Simple Docker DAG Pipeline
        </h3>
        <p className="text-gray-300">
          Example pipeline that builds and tests Docker images with parallel
          execution:
        </p>

        <CodeBlock
          title=".zipline/pipeline.yml"
          code={`name: "Docker Simple Pipeline"
description: "Build, test, and deploy Docker application"

branches:
  include:
    - main
    - "feature/*"

environment:
  IMAGE_NAME: "myapp"
  REGISTRY: "docker.io"

steps:
  # Step 1: Validate Dockerfile
  validate:
    name: "Validate Dockerfile"
    commands:
      - "docker --version"
      - "hadolint Dockerfile"

  # Step 2: Build base image
  build:
    name: "Build Docker Image"
    commands:
      - "docker build -t \${IMAGE_NAME}:latest ."
    depends_on:
      - validate

  # Step 3: Test image (parallel with security scan)
  test:
    name: "Test Docker Image"
    commands:
      - "docker run --rm \${IMAGE_NAME}:latest npm test"
    depends_on:
      - build

  # Step 4: Security scan (parallel with test)
  scan:
    name: "Security Scan"
    commands:
      - "trivy image \${IMAGE_NAME}:latest"
    depends_on:
      - build

  # Step 5: Tag and push (waits for both test and scan)
  push:
    name: "Push to Registry"
    commands:
      - "docker tag \${IMAGE_NAME}:latest \${REGISTRY}/username/\${IMAGE_NAME}:latest"
      - "docker tag \${IMAGE_NAME}:latest \${REGISTRY}/username/\${IMAGE_NAME}:\${ZIPLINE_COMMIT_SHA:0:8}"
      - "echo \${SECRET_DOCKER_PASSWORD} | docker login \${REGISTRY} -u \${SECRET_DOCKER_USERNAME} --password-stdin"
      - "docker push \${REGISTRY}/username/\${IMAGE_NAME}:latest"
      - "docker push \${REGISTRY}/username/\${IMAGE_NAME}:\${ZIPLINE_COMMIT_SHA:0:8}"
    depends_on:
      - test
      - scan
    environment:
      DOCKER_USERNAME: \${SECRET_DOCKER_USERNAME}
      DOCKER_PASSWORD: \${SECRET_DOCKER_PASSWORD}

  # Step 6: Deploy
  deploy:
    name: "Deploy Application"
    commands:
      - "kubectl set image deployment/\${IMAGE_NAME} \${IMAGE_NAME}=\${REGISTRY}/username/\${IMAGE_NAME}:\${ZIPLINE_COMMIT_SHA:0:8}"
      - "kubectl rollout status deployment/\${IMAGE_NAME}"
    depends_on:
      - push
    environment:
      KUBECONFIG: \${SECRET_KUBECONFIG}`}
        />

        <div className="bg-blue-900/20 border border-blue-500 rounded-lg p-4">
          <h4 className="text-blue-400 font-semibold mb-2">
            DAG Execution Flow
          </h4>
          <div className="space-y-2 text-sm text-gray-300">
            <p>This pipeline creates the following execution flow:</p>
            <div className="bg-black rounded p-3 font-mono text-xs text-green-400">
              validate
              <br />
              └── build
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;├── test (parallel)
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;└── scan (parallel)
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└── push (waits
              for both)
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└──
              deploy
            </div>
            <p>
              <strong>Benefits:</strong> Test and security scan run
              simultaneously!
            </p>
          </div>
        </div>

        <h3 className="text-xl font-semibold text-green-400">
          Simple Multi-stage Dockerfile
        </h3>
        <CodeBlock
          title="Dockerfile"
          language="dockerfile"
          code={`FROM node:18-alpine
WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build application
RUN npm run build

# Expose port and start
EXPOSE 3000
CMD ["npm", "start"]`}
        />

        <div className="bg-yellow-900/20 border border-yellow-500 rounded-lg p-4">
          <h4 className="text-yellow-400 font-semibold mb-2">Required Tools</h4>
          <ul className="text-gray-300 space-y-1 text-xs sm:text-sm">
            <li>• Docker daemon available in pipeline environment</li>
            <li>
              • <code>hadolint</code> for Dockerfile validation
            </li>
            <li>
              • <code>trivy</code> for security scanning
            </li>
            <li>• Registry credentials configured as secrets</li>
          </ul>
        </div>
      </div>
    ),
  },

  artifacts: {
    title: "Artifacts Management",
    content: (
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-green-400">
          What are Artifacts?
        </h3>
        <p className="text-gray-300 leading-relaxed">
          Artifacts are files generated during pipeline execution that you want
          to preserve and share between steps or download later. Examples
          include build outputs, test reports, logs, and deployment packages.
        </p>

        <h3 className="text-xl font-semibold text-green-400">
          Artifact Configuration
        </h3>
        <div className="bg-gray-900 rounded-lg p-4 sm:p-6 md:p-8 border border-gray-700 w-full max-w-full overflow-x-auto">
          <pre className="text-sm text-gray-300">
            {`steps:
  build:
    name: "Build Application"
    commands:
      - "npm run build"
      - "npm run test:coverage"
    artifacts:
      paths:                    # Files/directories to preserve
        - "dist/**"             # All files in dist directory
        - "coverage/**"         # Coverage reports
        - "*.log"               # All log files
        - "docs/api.pdf"        # Specific file
      retention_days: 30        # How long to keep artifacts
      
  test:
    name: "Run Tests"
    commands:
      - "pytest --junit-xml=test-results.xml"
    artifacts:
      paths:
        - "test-results.xml"
        - "screenshots/**"
      retention_days: 7`}
          </pre>
        </div>

        <h3 className="text-xl font-semibold text-green-400">
          Artifact Storage
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-900/20 border border-blue-500 rounded-lg p-4">
            <h4 className="text-blue-400 font-semibold mb-2">
              Automatic Management
            </h4>
            <ul className="text-gray-300 space-y-1 text-sm">
              <li>• Artifacts are automatically compressed</li>
              <li>• Stored in secure S3-compatible storage</li>
              <li>• Cleanup based on retention policy</li>
              <li>• Download links generated on demand</li>
            </ul>
          </div>

          <div className="bg-green-900/20 border border-green-500 rounded-lg p-4">
            <h4 className="text-green-400 font-semibold mb-2">
              Access Methods
            </h4>
            <ul className="text-gray-300 space-y-1 text-sm">
              <li>• Download from web dashboard</li>
              <li>• API endpoints for automation</li>
              <li>• Temporary signed URLs</li>
              <li>• Integration with external tools</li>
            </ul>
          </div>
        </div>

        <h3 className="text-xl font-semibold text-green-400">Best Practices</h3>
        <div className="space-y-4">
          <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
            <h4 className="text-green-400 mb-2">Path Patterns</h4>
            <ul className="text-gray-300 space-y-1 text-sm">
              <li>
                • Use <code>**</code> for recursive directory matching
              </li>
              <li>
                • Use <code>*</code> for single-level wildcard
              </li>
              <li>• Specify exact paths for critical files</li>
              <li>• Exclude unnecessary files to save space</li>
            </ul>
          </div>

          <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
            <h4 className="text-green-400 mb-2">Retention Strategy</h4>
            <ul className="text-gray-300 space-y-1 text-sm">
              <li>• Short retention (1-7 days) for temporary files</li>
              <li>• Medium retention (30 days) for build outputs</li>
              <li>• Long retention (90+ days) for releases</li>
              <li>• Consider storage costs vs. retention needs</li>
            </ul>
          </div>
        </div>

        <div className="bg-yellow-900/20 border border-yellow-500 rounded-lg p-4">
          <h4 className="text-yellow-400 font-semibold mb-2">
            Size Limitations
          </h4>
          <p className="text-gray-300 text-sm">
            Individual artifacts are limited to 1GB. For larger artifacts,
            consider splitting into multiple files or using external storage
            with links in your artifacts.
          </p>
        </div>
      </div>
    ),
  },

  secrets: {
    title: "Secrets & Environment Variables",
    content: (
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-green-400">
          Managing Secrets
        </h3>
        <p className="text-gray-300 leading-relaxed">
          Secrets are encrypted key-value pairs used to store sensitive
          information like API keys, passwords, and tokens. They&rsquo;re
          securely injected into pipeline environments without exposing values
          in logs or configurations.
        </p>

        <h3 className="text-xl font-semibold text-green-400">Adding Secrets</h3>
        <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
          <p className="text-gray-300 mb-3">
            Add secrets through the web dashboard:
          </p>
          <ol className="text-gray-300 space-y-1 text-sm">
            <li>1. Navigate to Repository Settings</li>
            <li>2. Go to &ldquo;Secrets&rdquo; section</li>
            <li>3. Click &ldquo;Add Secret&rdquo;</li>
            <li>4. Enter name and value</li>
            <li>5. Save the secret</li>
          </ol>
        </div>

        <h3 className="text-xl font-semibold text-green-400">
          Using Secrets in Pipelines
        </h3>
        <div className="bg-gray-900 rounded-lg p-3 sm:p-4 md:p-6 border border-gray-700 w-full max-w-full overflow-x-auto">
          <pre className="text-sm text-gray-300">
            {`# Global environment variables
environment:
  DATABASE_URL: \${SECRET_DATABASE_URL}
  API_KEY: \${SECRET_API_KEY}
  
steps:
  deploy:
    name: "Deploy Application"
    commands:
      - "deploy.sh"
    environment:
      # Step-specific secrets
      DEPLOY_TOKEN: \${SECRET_DEPLOY_TOKEN}
      SSH_KEY: \${SECRET_SSH_PRIVATE_KEY}
      
  notify:
    name: "Send Notifications"
    commands:
      - "curl -H 'Authorization: Bearer \${SLACK_TOKEN}' ..."
    environment:
      SLACK_TOKEN: \${SECRET_SLACK_BOT_TOKEN}`}
          </pre>
        </div>

        <h3 className="text-xl font-semibold text-green-400">
          Built-in Environment Variables
        </h3>
        <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
          <h4 className="text-green-400 mb-2">
            Zipline provides these variables automatically:
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <ul className="text-gray-300 space-y-1">
                <li>
                  • <code>ZIPLINE_BRANCH</code>
                </li>
                <li>
                  • <code>ZIPLINE_COMMIT_SHA</code>
                </li>
                <li>
                  • <code>ZIPLINE_COMMIT_MESSAGE</code>
                </li>
                <li>
                  • <code>ZIPLINE_REPO_NAME</code>
                </li>
              </ul>
            </div>
            <div>
              <ul className="text-gray-300 space-y-1">
                <li>
                  • <code>ZIPLINE_PIPELINE_ID</code>
                </li>
                <li>
                  • <code>ZIPLINE_RUN_NUMBER</code>
                </li>
                <li>
                  • <code>ZIPLINE_AUTHOR_EMAIL</code>
                </li>
                <li>
                  • <code>ZIPLINE_TIMESTAMP</code>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold text-green-400">
          Security Best Practices
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-red-900/20 border border-red-500 rounded-lg p-4">
            <h4 className="text-red-400 font-semibold mb-2">❌ Don&rsquo;t</h4>
            <ul className="text-gray-300 space-y-1 text-sm">
              <li>• Hard-code secrets in YAML files</li>
              <li>• Echo secrets in commands</li>
              <li>• Store secrets in git repositories</li>
              <li>• Use secrets in step names</li>
              <li>• Share secrets between unrelated projects</li>
            </ul>
          </div>

          <div className="bg-green-900/20 border border-green-500 rounded-lg p-4">
            <h4 className="text-green-400 font-semibold mb-2">✅ Do</h4>
            <ul className="text-gray-300 space-y-1 text-sm">
              <li>• Use descriptive secret names</li>
              <li>• Rotate secrets regularly</li>
              <li>• Use minimal scope for secrets</li>
              <li>• Audit secret usage</li>
              <li>• Remove unused secrets</li>
            </ul>
          </div>
        </div>

        <h3 className="text-xl font-semibold text-green-400">
          Common Secret Types
        </h3>
        <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="text-green-400 mb-2">Development</h4>
              <ul className="text-gray-300 space-y-1">
                <li>
                  • <code>DATABASE_URL</code>
                </li>
                <li>
                  • <code>API_KEY</code>
                </li>
                <li>
                  • <code>REDIS_URL</code>
                </li>
                <li>
                  • <code>JWT_SECRET</code>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-green-400 mb-2">Deployment</h4>
              <ul className="text-gray-300 space-y-1">
                <li>
                  • <code>DOCKER_USERNAME</code>
                </li>
                <li>
                  • <code>DOCKER_PASSWORD</code>
                </li>
                <li>
                  • <code>SSH_PRIVATE_KEY</code>
                </li>
                <li>
                  • <code>KUBECONFIG</code>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    ),
  },

  monitoring: {
    title: "Monitoring & Logs",
    content: (
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-green-400">
          Real-time Monitoring
        </h3>
        <p className="text-gray-300 leading-relaxed">
          Zipline provides comprehensive monitoring and logging capabilities to
          help you track pipeline execution, debug issues, and analyze
          performance.
        </p>

        <h3 className="text-xl font-semibold text-green-400">Log Streaming</h3>
        <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
          <h4 className="text-green-400 mb-2">Features:</h4>
          <ul className="text-gray-300 space-y-2">
            <li>
              • <strong>Real-time streaming:</strong> Watch logs as
              they&rsquo;re generated
            </li>
            <li>
              • <strong>WebSocket connection:</strong> Low-latency log delivery
            </li>
            <li>
              • <strong>Step isolation:</strong> Separate log streams per step
            </li>
            <li>
              • <strong>Error highlighting:</strong> Automatic error detection
              and highlighting
            </li>
            <li>
              • <strong>Search & filter:</strong> Find specific log entries
              quickly
            </li>
          </ul>
        </div>

        <h3 className="text-xl font-semibold text-green-400">
          Pipeline Metrics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-900/20 border border-blue-500 rounded-lg p-4">
            <h4 className="text-blue-400 font-semibold mb-2">
              Execution Metrics
            </h4>
            <ul className="text-gray-300 space-y-1 text-sm">
              <li>• Pipeline duration</li>
              <li>• Step execution times</li>
              <li>• Queue wait times</li>
              <li>• Success/failure rates</li>
              <li>• Resource utilization</li>
            </ul>
          </div>

          <div className="bg-green-900/20 border border-green-500 rounded-lg p-4">
            <h4 className="text-green-400 font-semibold mb-2">
              Historical Data
            </h4>
            <ul className="text-gray-300 space-y-1 text-sm">
              <li>• Pipeline run history</li>
              <li>• Performance trends</li>
              <li>• Failure analysis</li>
              <li>• Branch comparison</li>
              <li>• Commit correlation</li>
            </ul>
          </div>
        </div>

        <h3 className="text-xl font-semibold text-green-400">
          Dashboard Views
        </h3>
        <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
          <h4 className="text-green-400 mb-3">Available Dashboards:</h4>
          <div className="space-y-3">
            <div>
              <h5 className="text-green-400 text-sm font-semibold">
                Pipeline Overview
              </h5>
              <p className="text-gray-300 text-sm">
                DAG visualization, step status, overall progress
              </p>
            </div>
            <div>
              <h5 className="text-green-400 text-sm font-semibold">
                Live Logs
              </h5>
              <p className="text-gray-300 text-sm">
                Real-time log streaming with filtering and search
              </p>
            </div>
            <div>
              <h5 className="text-green-400 text-sm font-semibold">
                Repository Dashboard
              </h5>
              <p className="text-gray-300 text-sm">
                Recent activities, pipeline history, branch status
              </p>
            </div>
            <div>
              <h5 className="text-green-400 text-sm font-semibold">
                Artifacts Browser
              </h5>
              <p className="text-gray-300 text-sm">
                Download and manage build artifacts
              </p>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold text-green-400">Debugging Tips</h3>
        <div className="space-y-4">
          <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
            <h4 className="text-green-400 mb-2">Common Issues</h4>
            <ul className="text-gray-300 space-y-2 text-sm">
              <li>
                • <strong>Command not found:</strong> Check if tools are
                installed in the environment
              </li>
              <li>
                • <strong>Permission denied:</strong> Verify file permissions
                and user context
              </li>
              <li>
                • <strong>Network timeouts:</strong> Check external service
                availability
              </li>
              <li>
                • <strong>Out of memory:</strong> Monitor resource usage,
                optimize commands
              </li>
              <li>
                • <strong>Dependency errors:</strong> Verify dependency
                installation steps
              </li>
            </ul>
          </div>

          <div className="bg-gray-900 rounded-lg p-4 sm:p-6 md:p-8 border border-gray-700 w-full overflow-x-auto">
            <h4 className="text-green-400 mb-2">Debugging Commands</h4>
            <pre className="text-sm text-gray-300">
              {`# Add debugging to your pipeline steps
steps:
  debug_environment:
    name: "Debug Environment"
    commands:
      - "pwd"                    # Current directory
      - "ls -la"                 # List files
      - "env | sort"             # Environment variables
      - "df -h"                  # Disk space
      - "free -h"                # Memory usage
      - "which node npm python"  # Tool locations`}
            </pre>
          </div>
        </div>

        <div className="bg-yellow-900/20 border border-yellow-500 rounded-lg p-4">
          <h4 className="text-yellow-400 font-semibold mb-2">Log Retention</h4>
          <p className="text-gray-300 text-sm">
            Pipeline logs are retained for 90 days. For longer retention,
            consider exporting logs to external systems or saving important logs
            as artifacts.
          </p>
        </div>
      </div>
    ),
  },
};

export default function GuidePage() {
  const [activeSection, setActiveSection] = useState("introduction");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-green-400">
                Zipline Guide
              </h1>
            </div>
            {/* Mobile sidebar toggle */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 text-green-400 hover:text-green-300 transition-colors"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path d="M3 12h18M3 6h18M3 18h18" />
              </svg>
            </button>
            <div className="hidden sm:block text-xs sm:text-sm text-gray-400">
              Documentation
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Mobile Sidebar Overlay */}
          {sidebarOpen && (
            <div
              className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Sidebar */}
          <div
            className={`lg:col-span-1 ${
              sidebarOpen
                ? "fixed inset-y-0 left-0 z-50 w-72 sm:w-80 lg:w-auto lg:static lg:block"
                : "hidden lg:block"
            }`}
          >
            <div className="bg-gray-900 rounded-lg border border-gray-700 p-4 lg:sticky lg:top-24 h-full lg:h-auto max-h-screen lg:max-h-[calc(100vh-8rem)] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base sm:text-lg font-semibold text-green-400">
                  Contents
                </h2>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="lg:hidden text-gray-400 hover:text-green-400"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <nav className="space-y-3 sm:space-y-4">
                {sidebarSections.map((section) => (
                  <div key={section.title}>
                    <h3 className="text-xs sm:text-sm font-semibold text-gray-400 mb-2">
                      {section.title}
                    </h3>
                    <ul className="space-y-1">
                      {section.items.map((item) => (
                        <li key={item.id}>
                          <button
                            onClick={() => {
                              setActiveSection(item.id);
                              setSidebarOpen(false); // Close mobile sidebar when item is selected
                            }}
                            className={`block text-left text-xs sm:text-sm px-2 py-1 rounded transition-colors w-full ${
                              activeSection === item.id
                                ? "bg-green-900/30 text-green-400"
                                : "text-gray-300 hover:text-green-400"
                            }`}
                          >
                            {item.title}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-gray-900 rounded-lg border border-gray-700 p-4 sm:p-6 lg:p-8">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-400 mb-4 sm:mb-6">
                {content[activeSection as keyof typeof content]?.title}
              </h1>
              <div className="prose prose-invert max-w-none text-sm sm:text-base">
                {content[activeSection as keyof typeof content]?.content}
              </div>
            </div>

            {/* Footer Navigation */}
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-4 sm:gap-0 sm:justify-between sm:items-center">
              <button
                onClick={() => {
                  const allItems = sidebarSections.flatMap((s) => s.items);
                  const currentIndex = allItems.findIndex(
                    (item) => item.id === activeSection
                  );
                  if (currentIndex > 0) {
                    setActiveSection(allItems[currentIndex - 1].id);
                  }
                }}
                className="inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-gray-800 hover:bg-gray-700 text-green-400 border border-green-600 rounded-lg transition-colors text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={activeSection === "introduction"}
              >
                ← Previous
              </button>

              <div className="text-xs sm:text-sm text-gray-400 text-center order-first sm:order-none">
                {sidebarSections
                  .flatMap((s) => s.items)
                  .findIndex((item) => item.id === activeSection) + 1}{" "}
                of {sidebarSections.flatMap((s) => s.items).length}
              </div>

              <button
                onClick={() => {
                  const allItems = sidebarSections.flatMap((s) => s.items);
                  const currentIndex = allItems.findIndex(
                    (item) => item.id === activeSection
                  );
                  if (currentIndex < allItems.length - 1) {
                    setActiveSection(allItems[currentIndex + 1].id);
                  }
                }}
                className="inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-gray-800 hover:bg-gray-700 text-green-400 border border-green-600 rounded-lg transition-colors text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={activeSection === "monitoring"}
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
