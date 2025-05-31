import React from 'react';
import './IntroductionModal.css';

interface Props {
  onClose: () => void;
}

export const IntroductionModal: React.FC<Props> = ({ onClose }) => {
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2> Welcome to Osmosis</h2>
        <div>
          <div className="header-info">
            <p>Assignment 2.1</p>
            <p>SCI388</p>
            <p>Nathan Vititoe</p>
          </div>
          <p>This simulation demonstrates how osmosis works to move water across a semipermeable membrane.</p>
          <ul>
            <li>
              💧 <strong>Drag</strong> blue water molecules across the membrane
            </li>
            <li>
              🧱 Red solute molecules <strong>can't pass</strong> through the membrane barrier so they can't be moved
            </li>
            <li>⚖️ Balance both sides to achieve homeostasis</li>
          </ul>
        </div>
        <button onClick={onClose} autoFocus>
          Got it!
        </button>
      </div>
    </div>
  );
};
