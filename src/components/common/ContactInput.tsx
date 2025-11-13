import React from 'react';

interface ContactInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}

const ContactInput: React.FC<ContactInputProps> = ({
  value,
  onChange,
  placeholder = '555-555-5555',
  label = 'Enter a contact number before proceeding to checkout'
}) => {
  return (
    <div>
      <label className="text-sm font-medium text-muted-foreground mb-2 block">
        {label}
      </label>
      <input
        type="tel"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      />
    </div>
  );
};

export default ContactInput;