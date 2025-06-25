import React from "react";
import GuideButton from "../GuideButton";

interface Props {
  currentIndex: number;
  onReturn: () => void;
  markComplete: (complete: boolean) => void;
  children: React.ReactNode;
  completedPages: boolean[];
  proceedToNextPage: () => void;
  pageOrder: string[];
  button1TextOverride?: string;
  button2TextOverride?: string;
}

const RegistrationPageWrapper: React.FC<Props> = ({
  currentIndex,
  onReturn,
  markComplete,
  children,
  completedPages,
  proceedToNextPage,
  pageOrder,
  button1TextOverride,
  button2TextOverride,
}) => {
  return (
    <>
      <h3 className="sim-warning">
        For Simulation Purpose Only. Please Do <strong>NOT</strong> use any
        actual personal information
      </h3>
      <div className="wrapper-container">
        <div className="page-content">{children}</div>

        {currentIndex < pageOrder.length - 1 && (
          <div className="note-section">
            <p>
              After completing {pageOrder[currentIndex]}, please click PROCEED
              TO {pageOrder[currentIndex + 1]} to go to the next step.
            </p>
          </div>
        )}
        <div className="button-row">
          <GuideButton
            originalTag="button"
            id="reg-1-return-button"
            className="reg-button"
            onClick={onReturn}
          >
            {button1TextOverride ?? "RETURN TO MAIN MENU"}
          </GuideButton>
          {currentIndex < pageOrder.length - 1 && (
            <GuideButton
              originalTag="button"
              id={`reg-1-proceed-button-${currentIndex + 1}`}
              className="reg-button proceed-button"
              onClick={
                currentIndex == pageOrder.length - 2 &&
                !completedPages.every(
                  (i, idx) => i || idx >= pageOrder.length - 2
                )
                  ? undefined
                  : proceedToNextPage
              }
            >
              {button2TextOverride ??
                `PROCEED TO ${pageOrder[currentIndex + 1].toUpperCase()}`}
            </GuideButton>
          )}
        </div>
        {currentIndex < pageOrder.length - 2 &&
          !completedPages[currentIndex] &&
          window.SimuNUS_API?._DEBUG && (
            <button
              className="reg-button"
              style={{
                backgroundColor: "yellow",
                marginTop: 20,
                color: "black",
              }}
              onClick={() => markComplete(true)}
            >
              DEBUG: MARK AS COMPLETE
            </button>
          )}
      </div>
    </>
  );
};

export default RegistrationPageWrapper;
