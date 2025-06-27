const UHCProgreeBar = ({ stepNum }: { stepNum: number }) => {
  return (
    <div className="uhc-progress-bar">
      {["Select Service", "Select Date and Time", "Confirm", "Complete"].map(
        (step, idx) => (
          <div
            key={step}
            className={`uhc-step ${
              idx >= stepNum - 1
                ? idx === stepNum - 1
                  ? "active"
                  : ""
                : "completed"
            }`}
          >
            <div className="uhc-step-circle">{idx + 1}</div>
            <div className="uhc-step-label">{step}</div>
          </div>
        )
      )}
    </div>
  );
};
export default UHCProgreeBar;
