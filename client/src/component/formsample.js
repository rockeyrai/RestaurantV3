import React from 'react';

const AddForm = ({ title, onSubmit, inputs, buttonText }) => {
  return (
    <div className="my-4">
      <h2 className="text-xl font-semibold">{title}</h2>
      <form onSubmit={onSubmit} className="space-y-4">
        {inputs.map((input, index) => (
          <div key={index}>
            <label className="block text-sm font-medium text-gray-700">{input.label}</label>
            {input.type === 'select' ? (
              <select
                value={input.value}
                onChange={input.onChange}
                className="border rounded p-2 w-full"
              >
                {input.options.map((option, idx) => (
                  <option key={idx} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={input.type}
                value={input.value}
                onChange={input.onChange}
                placeholder={input.placeholder}
                className="border rounded p-2 w-full"
              />
            )}
          </div>
        ))}
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {buttonText}
        </button>
      </form>
    </div>
  );
};

export default AddForm;
