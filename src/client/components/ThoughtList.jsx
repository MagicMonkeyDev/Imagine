import React, { useState, useEffect } from 'react';

function ThoughtList() {
  const [thoughts, setThoughts] = useState([]);

  useEffect(() => {
    fetchThoughts();
  }, []);

  const handleUpvote = async (thoughtId) => {
    await fetch(`/api/thoughts/${thoughtId}/upvote`, { method: 'POST' });
    fetchThoughts();
  };

  return (
    <div className="thought-list">
      {thoughts.map(thought => (
        <div key={thought._id} className="thought-card">
          <p>{thought.content}</p>
          <div className="thought-meta">
            <span>{new Date(thought.timestamp).toLocaleString()}</span>
            <button onClick={() => handleUpvote(thought._id)}>
              ⬆️ {thought.upvotes}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
} 