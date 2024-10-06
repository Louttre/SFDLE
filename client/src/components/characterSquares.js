import React from 'react';
import '../pages/CharacterSquares.css'; // Add corresponding CSS styles

function CharacterSquares({ characterData, comparisonResults }) {
  return (
    <div className="classic-answer">
      <div className="square-container">
        {/* Display the character's image */}
        {characterData.image && (
          <div className="square" style={{ flexBasis: 'calc(12.5% - 4px)' }}>
            <div className="square-content-img">
              <div style={{ display: 'flex' }}>
                <img
                  src={characterData.image}
                  alt={characterData.name}
                  width="100%"
                  height="100%"
                />
              </div>
            </div>
          </div>
        )}

        {/* Map over character characteristics */}
        {Object.entries(characterData)
          .filter(([key]) => key !== 'image' && key !== 'name') // Exclude the image from characteristics
          .map(([key, value], index) => {
            // Determine the background color based on comparisonResults
            let comparison = comparisonResults[key];
            let backgroundColor;

            if (comparison === true) {
              backgroundColor = '#28a745'; // Exact match
            } else if (comparison === '~') {
              backgroundColor = '#ffc107'; // Partial match
            } else if (comparison === false || comparison === '<' || comparison === '>') {
              backgroundColor = '#dc3545'; // No match
            }

            return (
              <div
                key={index}
                className={`square animate__animated animate__flipInY`}
                style={{ flexBasis: 'calc(12.5% - 4px)', backgroundColor }}
              >
                <div className="square-content">
                  <div style={{ fontSize: '16px' }}>
                    {/* Handle array values like 'eye_color' and 'fighting_style' */}
                    <span>{`${Array.isArray(value) ? value.join(', ') : value}`}</span>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default CharacterSquares;