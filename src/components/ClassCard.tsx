import React from "react";
import { Attributes } from "../types";

interface ClassCardProps {
  className: string;
  requirements: Attributes;
  isSelected: boolean;
  isAvailable: boolean;
  onClick: () => void;
  currentAttributes: Record<string, number>;
}

export const ClassCard: React.FC<ClassCardProps> = ({
  className,
  requirements,
  isSelected,
  isAvailable,
  onClick,
  currentAttributes,
}) => {
  return (
    <div className="class-card-container">
      <div
        className={`class-card ${
          isAvailable ? "class-available" : "class-locked"
        } ${isSelected ? "selected" : ""}`}
        onClick={onClick}
      >
        <h3 className="class-name">{className}</h3>
        {isSelected && (
          <div className="class-requirements">
            {Object.entries(requirements).map(([attr, minValue]) => (
              <div
                key={attr}
                className={`requirement ${
                  currentAttributes[attr] >= minValue ? "met" : "not-met"
                }`}
              >
                {`${attr}: ${minValue}`}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
