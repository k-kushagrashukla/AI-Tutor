export default function Result({ responses }) {

  // 🧠 Average calculator
  const avg = (key) =>
    (
      responses.reduce((a, r) => a + r.evaluation[key], 0) /
      responses.length
    );

  const clarity = avg("clarity");
  const patience = avg("patience");
  const communication = avg("communication");
  const simplicity = avg("simplicity");
  const confidence = avg("confidence");

  const overall =
    (clarity + patience + communication + simplicity + confidence) / 5;

  // 🎯 Decision Logic
  const decision =
    overall >= 3.5 ? "Recommended ✅" : "Needs Improvement ❌";

  // 💬 Combine feedback
  const summaryFeedback = responses
    .map((r) => r.evaluation.feedback)
    .slice(0, 3)
    .join(" ");

  return (
    <div className="card">
      <h2>AI Tutor Screening Result</h2>

      {/* 🎯 Overall */}
      <h3>Overall Score: {overall.toFixed(1)} / 5</h3>
      <h3>Status: {decision}</h3>

      {/* 📊 Breakdown */}
      <h3>Skill Breakdown</h3>
      <p>Clarity: {clarity.toFixed(1)}</p>
      <p>Patience: {patience.toFixed(1)}</p>
      <p>Communication: {communication.toFixed(1)}</p>
      <p>Simplicity: {simplicity.toFixed(1)}</p>
      <p>Confidence: {confidence.toFixed(1)}</p>

      {/* 💬 Summary */}
      <h3>Summary Feedback</h3>
      <p>{summaryFeedback}</p>

      {/* 🧾 Detailed Section */}
      <h3>Detailed Responses</h3>

      {responses.map((item, i) => (
        <div key={i} style={{ marginBottom: "20px" }}>
          <p><strong>Question:</strong> {item.question}</p>
          <p><strong>Your Answer:</strong> {item.answer}</p>
          <p><strong>Feedback:</strong> {item.evaluation.feedback}</p>
          <p><strong>Improve:</strong> {item.evaluation.improvement}</p>
          <hr />
        </div>
      ))}
    </div>
  );
}