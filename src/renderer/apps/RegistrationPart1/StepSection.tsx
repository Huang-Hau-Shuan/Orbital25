import React from "react";
import GuideButton from "../GuideButton";

interface StepSectionProps {
  title: string;
  startIndex: number;
  count: number;
  completedPages: boolean[];
  onSelect: (index: number) => void;
  enabled?: boolean;
  pageOrder: string[];
}

const StepSection: React.FC<StepSectionProps> = ({
  title,
  startIndex,
  count,
  completedPages,
  onSelect,
  enabled,
  pageOrder,
}) => {
  const renderStatusIcon = (completed: boolean) => (
    <span className={`status-icon ${completed ? "completed" : "pending"}`} />
  );

  return (
    <div className="section">
      <div className="step-header">{title}</div>
      {pageOrder.slice(startIndex, startIndex + count).map((label, i) => (
        <GuideButton
          id={`reg-1-section-${startIndex + i + 1}`}
          key={startIndex + i}
          className="step-link"
          onClick={
            enabled !== false ? () => onSelect(startIndex + i) : () => {}
          }
        >
          {label}
          {enabled !== false &&
            renderStatusIcon(completedPages[startIndex + i])}
        </GuideButton>
      ))}
    </div>
  );
};

export default StepSection;
