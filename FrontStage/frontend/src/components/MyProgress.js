import React from 'react';

function MyProgress({ currentStep }) {
  const steps = ['選擇規格', '選擇商品', '貼心小卡', '確認內容'];

  return (
    <div>
      <ul className="myprogress fs-5">
        {steps.map((step, index) => (
          <li
            key={index}
            className={
              index === currentStep
                ? 'active'
                : index < currentStep
                ? 'done'
                : ''
            }
          >
            {step}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MyProgress;
