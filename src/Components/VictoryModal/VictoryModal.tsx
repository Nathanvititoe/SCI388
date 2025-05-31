import React from 'react';
import './VictoryModal.css';

interface Props {
  onClose: () => void;
}

export const VictoryModal: React.FC<Props> = ({ onClose }) => {
   
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>Homeostasis Achieved!</h2>
        <div className='header-info'>
          <p>
            Now that the water molecules are balanced on both sides of the semi-permeable membrane, the cell can have
            proper pressure and remain stable.
          </p>
          <p>
            If you hadn't balanced things out, the cell could've lost too much water and shrank, or even burst from too
            much water.
          </p>
        </div>
        <button onClick={onClose} autoFocus>
          Play Again
        </button>
      </div>
    </div>
  );
};
