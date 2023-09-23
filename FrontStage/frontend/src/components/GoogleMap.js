import React from 'react';

function GoogleMap() {
  const iframeStyle = {
    border: 0,
    width: '100%',
    height: '450px',
  };

  return (
    <div className="googlemap container">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d463523.16832280054!2d121.05481506672176!3d24.820275962638615!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x346870b2cb8e36fd%3A0xaa76b639fb13fe15!2z5aSq5bmz5bGx5ZyL5a625qOu5p6X6YGK5qiC5Y2A!5e0!3m2!1szh-TW!2stw!4v1695373059254!5m2!1szh-TW!2stw"
        style={iframeStyle}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}

export default GoogleMap;
