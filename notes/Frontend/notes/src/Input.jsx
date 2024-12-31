import React from 'react';
import Button from './Button';

function Input({ input, setInput, onCreate }) {
  return (
    <div className="flex justify-center mt-4 space-x-4">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your note here..."
        className="border-2 rounded-md p-2 w-1/2"
      />
      <Button b1="Create" onClick={onCreate} />
      <Button b1="Attach"></Button>
    </div>
  );
}

export default Input;

