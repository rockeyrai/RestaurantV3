'use client'
import React from 'react';
import Select from 'react-select';

// Options data for the dropdown
const options = [
  { value: 'house', label: 'House', color: '#FFA500' }, // Orange for house
  { value: 'horse', label: 'Horse', color: '#8B4513' }, // SaddleBrown for horse
  { value: 'apple', label: 'Apple', color: '#FF0000' }, // Red for apple
];

// Custom styles for react-select
const customStyles = {
  control: (styles) => ({ ...styles, backgroundColor: 'white' }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    return {
      ...styles,
      backgroundColor: isDisabled
        ? undefined
        : isSelected
        ? data.color
        : isFocused
        ? `${data.color}33` // Adds transparency to the color
        : undefined,
      color: isDisabled ? '#ccc' : isSelected ? 'white' : data.color,
      cursor: isDisabled ? 'not-allowed' : 'default',
      ':active': {
        ...styles[':active'],
        backgroundColor: !isDisabled
          ? isSelected
            ? data.color
            : `${data.color}66` // Slightly darker on click
          : undefined,
      },
    };
  },
  multiValue: (styles, { data }) => ({
    ...styles,
    backgroundColor: `${data.color}33`, // Transparent background for selected items
  }),
  multiValueLabel: (styles, { data }) => ({
    ...styles,
    color: data.color,
  }),
  multiValueRemove: (styles, { data }) => ({
    ...styles,
    color: data.color,
    ':hover': {
      backgroundColor: data.color,
      color: 'white',
    },
  }),
};

// React component
export default function App() {
  return (
    <Select
      closeMenuOnSelect={false}
      isMulti
      options={options}
      styles={customStyles}
    />
  );
}
