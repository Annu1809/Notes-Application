import React from 'react'

function Button({b1, onClick}) {
  return (
    <button
    className="bg-orange-500 text-white p-2 rounded-md hover:bg-orange-600 transition"
    onClick={onClick}
  >
    {b1}
  </button>
  )
}

export default Button
