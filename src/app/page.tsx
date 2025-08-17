"use client";
import { useState, useEffect } from "react";

const terminalLines = [
  "$ whoami",
  "zipline-ci",
  "$ cat project.info",
  "Modern CI/CD Platform",
  "$ ls features/",
  "dag-pipelines real-time-logs artifacts",
  "$ ./start-pipeline.sh",
  "Ready for deployment ✨",
];

export default function Home() {
  const [typedText, setTypedText] = useState("");
  const [currentLine, setCurrentLine] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentLine < terminalLines.length) {
        const currentText = terminalLines[currentLine];
        if (typedText.length < currentText.length) {
          setTypedText(currentText.slice(0, typedText.length + 1));
        } else {
          setCurrentLine(currentLine + 1);
          setTypedText("");
        }
      }
    }, 80);

    return () => clearTimeout(timer);
  }, [typedText, currentLine]);

  useEffect(() => {
    const cursorTimer = setInterval(() => {
      setShowCursor(!showCursor);
    }, 500);
    return () => clearInterval(cursorTimer);
  }, [showCursor]);

  return (
    <div className="h-screen bg-black text-green-400 font-mono relative overflow-hidden flex items-center">
      {/* Matrix-style background animation */}
      <div className="absolute inset-0 opacity-5">
        <div className="matrix-bg h-full w-full"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full px-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Terminal and Info */}
          <div className="space-y-8">
            {/* Terminal Window */}
            <div className="bg-gray-900 rounded-lg border border-gray-700 shadow-2xl overflow-hidden">
              <div className="bg-gray-800 px-4 py-2 flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="ml-4 text-gray-400 text-sm">
                  zipline-terminal
                </span>
              </div>

              <div className="p-6 h-66">
                {terminalLines.slice(0, currentLine).map((line, index) => (
                  <div key={index} className="mb-2 text-sm">
                    <span
                      className={
                        line.startsWith("$")
                          ? "text-blue-400"
                          : "text-green-400"
                      }
                    >
                      {line}
                    </span>
                  </div>
                ))}
                {currentLine < terminalLines.length && (
                  <div className="mb-2 text-sm">
                    <span
                      className={
                        terminalLines[currentLine]?.startsWith("$")
                          ? "text-blue-400"
                          : "text-green-400"
                      }
                    >
                      {typedText}
                    </span>
                    <span
                      className={`ml-1 ${
                        showCursor ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      _
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Hero Text */}
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-7xl font-bold text-blue-400">
                ZIPLINE CI/CD
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed">
                Modern DevOps Platform with{" "}
                <span className="text-green-400 font-semibold">
                  DAG Pipeline Orchestration
                </span>
              </p>
              <p className="text-gray-400 text-lg leading-relaxed">
                Streamline your development workflow with intelligent pipeline
                management, real-time monitoring, and enterprise-grade
                automation.
              </p>
            </div>

            {/* CTA Button */}
            <button
              className="inline-flex items-center gap-3 px-8 py-4 bg-green-600 hover:bg-green-700 text-black rounded-lg transition-all duration-300 font-semibold shadow-lg transform hover:scale-105 group"
              onClick={() => {
                window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/github`;
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="group-hover:rotate-12 transition-transform duration-300"
              >
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              Connect with GitHub
              <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">
                →
              </span>
            </button>
          </div>

          {/* Right side - Features and Code */}
          <div className="space-y-8 flex flex-col justify-center">
            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-6">
              {[
                {
                  icon: (
                    <svg
                      className="w-8 h-8"
                      viewBox="0 0 640 640"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M64 144C64 117.5 85.5 96 112 96L208 96C234.5 96 256 117.5 256 144L256 160L384 160L384 144C384 117.5 405.5 96 432 96L528 96C554.5 96 576 117.5 576 144L576 240C576 266.5 554.5 288 528 288L432 288C405.5 288 384 266.5 384 240L384 224L256 224L256 240C256 247.3 254.3 254.3 251.4 260.5L320 352L400 352C426.5 352 448 373.5 448 400L448 496C448 522.5 426.5 544 400 544L304 544C277.5 544 256 522.5 256 496L256 400C256 392.7 257.7 385.7 260.6 379.5L192 288L112 288C85.5 288 64 266.5 64 240L64 144z" />
                    </svg>
                  ),
                  title: "DAG Pipelines",
                  description:
                    "Intelligent dependency management with parallel execution",
                },
                {
                  icon: (
                    <svg
                      className="w-8 h-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  ),
                  title: "Real-time Logs",
                  description:
                    "Live monitoring & metrics with WebSocket integration",
                },
                {
                  icon: (
                    <svg
                      className="w-8 h-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  ),
                  title: "Branch Control",
                  description:
                    "Smart filtering & validation with wildcard patterns",
                },
                {
                  icon: (
                    <svg
                      className="w-8 h-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                      />
                    </svg>
                  ),
                  title: "Artifact Store",
                  description:
                    "Secure build management with expiration policies",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="bg-gray-900 rounded-lg border border-gray-700 p-6 hover:border-green-500 transition-all duration-300 group hover:scale-105"
                >
                  <div className="text-green-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-green-400 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Additional Features */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-900 rounded-lg border border-gray-700 p-4 text-center hover:border-green-500 transition-all duration-300">
                <svg
                  className="w-6 h-6 text-green-400 mx-auto mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <div className="text-sm font-semibold text-green-400 mb-1">
                  Secure Secrets
                </div>
                <div className="text-xs text-gray-400">
                  Encrypted credentials
                </div>
              </div>

              <div className="bg-gray-900 rounded-lg border border-gray-700 p-4 text-center hover:border-green-500 transition-all duration-300">
                <svg
                  className="w-6 h-6 text-green-400 mx-auto mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>
                <div className="text-sm font-semibold text-green-400 mb-1">
                  GitHub Integration
                </div>
                <div className="text-xs text-gray-400">Seamless webhooks</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .matrix-bg {
          background-image: radial-gradient(
            circle at 1px 1px,
            rgba(0, 255, 0, 0.15) 1px,
            transparent 0
          );
          background-size: 20px 20px;
          animation: matrix-scroll 20s linear infinite;
        }

        @keyframes matrix-scroll {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(20px);
          }
        }
      `}</style>
    </div>
  );
}
