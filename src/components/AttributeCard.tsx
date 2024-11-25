import React from "react";

interface AttributeCardProps {
  name: string;
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  disableIncrement: boolean;
}

const calculateModifier = (score: number) => {
  return Math.floor((score - 10) / 2);
};

const formatModifier = (modifier: number) => {
  return modifier > 0 ? `+${modifier}` : `${modifier}`;
};

export const AttributeCard: React.FC<AttributeCardProps> = ({
  name,
  value,
  onIncrement,
  onDecrement,
  disableIncrement,
}) => {
  return (
    <div className="attribute-card">
      <h3 className="attribute-name">{name}</h3>
      <div className="attribute-controls">
        <button className="control-button" onClick={onDecrement}>
          -
        </button>
        <div className="attribute-value">
          <div className="score">{value}</div>
          <div className="modifier">
            {formatModifier(calculateModifier(value))}
          </div>
        </div>
        <button
          className="control-button"
          onClick={onIncrement}
          disabled={disableIncrement}
        >
          +
        </button>
      </div>
    </div>
  );
};
