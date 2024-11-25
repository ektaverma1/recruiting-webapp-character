import React from "react";
import { ClassCard } from "./ClassCard";
import { CLASS_LIST } from "../consts";
import { Attributes } from "../types";

interface ClassesSectionProps {
  selectedClass: string | null;
  attributes: Record<string, number>;
  onClassSelect: (className: string) => void;
}

export const ClassesSection: React.FC<ClassesSectionProps> = ({
  selectedClass,
  attributes,
  onClassSelect,
}) => {
  const meetsClassRequirements = (className: string) => {
    const requirements = CLASS_LIST[className as keyof typeof CLASS_LIST];
    return Object.entries(requirements).every(
      ([attribute, minValue]) => attributes[attribute] >= minValue
    );
  };

  return (
    <div className="classes-container">
      <h2 className="section-title">Classes</h2>
      <div className="class-list">
        {Object.entries(CLASS_LIST).map(([className, requirements]) => (
          <ClassCard
            key={className}
            className={className}
            requirements={requirements as Attributes}
            isSelected={selectedClass === className}
            isAvailable={meetsClassRequirements(className)}
            onClick={() => onClassSelect(className)}
            currentAttributes={attributes}
          />
        ))}
      </div>
    </div>
  );
};
