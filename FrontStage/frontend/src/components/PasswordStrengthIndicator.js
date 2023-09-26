import React, { useState,useEffect } from 'react';

const PasswordStrengthIndicator = ({ password }) => {
  const [strength, setStrength] = useState(0);


  useEffect(() => {
    if (!password) {
      return;
    }


  const checkPasswordStrength = (password) => {

    const passwordLength = password.length;
    let strength = 0;

    if (passwordLength >= 8) {
      strength += 1;
    }
    if (/[a-z]/.test(password)) {
      strength += 1;
    }
    if (/[A-Z]/.test(password)) {
      strength += 1;
    }
    if (/[0-9]/.test(password)) {
      strength += 1;
    }
    if (/[@#$%^&+=]/.test(password)) {
      strength += 1;
    }

    setStrength(strength);
  };


  checkPasswordStrength(password);
},[password]);


  let message = '';
  let color = '';

  if (strength === 0) {
    message = '密碼強度不足';
    color = 'red';
  } else if (strength === 1) {
    message = '密碼強度一般';
    color = 'red';
  } else if (strength === 2) {
    message = '密碼強度還可以';
    color = 'IndianRed';
  } else if (strength === 3) {
    message = '密碼強度很好';
    color = 'green';
  } else if (strength === 4) {
    message = '密碼強度很好';
    color = 'darkgreen';
  }


  return (
    <div style={{ color }}>
     <strong>
     {message}
     </strong>
    </div>
  );
};


export default PasswordStrengthIndicator;
