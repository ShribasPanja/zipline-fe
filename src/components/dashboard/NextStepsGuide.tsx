const NextStepsGuide = () => {
  return (
    <div className="mt-8 p-4 bg-blue-50 rounded-lg">
      <p className="text-blue-800 font-semibold mb-2">Next Steps:</p>
      <ul className="text-blue-700 text-sm space-y-1">
        <li>
          • Click "Setup Webhook" on any repository to configure GitHub webhooks
        </li>
        <li>
          • Use webhook URL:{" "}
          <code className="bg-white px-1 rounded">
            http://localhost:3001/webhook/github
          </code>
        </li>
        <li>• Select "Just the push event" in webhook settings</li>
        <li>• Set Content type to "application/json"</li>
      </ul>
    </div>
  );
};

export default NextStepsGuide;
