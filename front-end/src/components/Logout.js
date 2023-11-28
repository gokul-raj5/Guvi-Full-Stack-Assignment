import React from 'react';

function Logout() {
  localStorage.removeItem('token');
  window.location.href = '/login';

  return null;
}

export default Logout;