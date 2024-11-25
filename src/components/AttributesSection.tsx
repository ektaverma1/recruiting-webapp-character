import React from "react";
import { AttributeCard } from "./AttributeCard";
import { ATTRIBUTE_LIST } from "../consts";

interface AttributesSectionProps {
  attributes: Record<string, number>;
  onAttributeChange: (attribute: string, value: number) => void;
  maxPointsReached: boolean;
}

export const AttributesSection: React.FC<AttributesSectionProps> = ({
  attributes,
  onAttributeChange,
  maxPointsReached,
}) => {
  return (
    <div className="attributes-container">
      {ATTRIBUTE_LIST.map((attribute) => (
        <AttributeCard
          key={attribute}
          name={attribute}
          value={attributes[attribute]}
          onIncrement={() =>
            onAttributeChange(attribute, attributes[attribute] + 1)
          }
          onDecrement={() =>
            onAttributeChange(attribute, Math.max(0, attributes[attribute] - 1))
          }
          disableIncrement={maxPointsReached}
        />
      ))}
    </div>
  );
};
