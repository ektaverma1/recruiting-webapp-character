import React from "react";

interface SkillRowProps {
  name: string;
  points: number;
  attributeModifier: string;
  attributeValue: number;
  onIncrement: () => void;
  onDecrement: () => void;
  canIncrement: boolean;
}

export const SkillRow: React.FC<SkillRowProps> = ({
  name,
  points,
  attributeModifier,
  attributeValue,
  onIncrement,
  onDecrement,
  canIncrement,
}) => {
  const calculateModifier = (score: number) => {
    return Math.floor((score - 10) / 2);
  };

  const formatModifier = (modifier: number) => {
    return modifier > 0 ? `+${modifier}` : `${modifier}`;
  };

  // Calculate the ability modifier based on the attribute value
  const attrMod = calculateModifier(attributeValue);

  // Calculate total (points spent + ability modifier)
  const total = points + attrMod;

  return (
    <div className="skill-row">
      <div className="skill-name">{name}</div>
      <div className="skill-controls">
        <span>Points: {points}</span>
        <button
          className="control-button"
          onClick={onDecrement}
          disabled={points === 0}
        >
          -
        </button>
        <button
          className="control-button"
          onClick={onIncrement}
          disabled={!canIncrement}
        >
          +
        </button>
      </div>
      <div className="skill-modifier">
        Modifier ({attributeModifier.slice(0, 3)}): {formatModifier(attrMod)}
      </div>
      <div className="skill-total">Total: {formatModifier(total)}</div>
    </div>
  );
};
