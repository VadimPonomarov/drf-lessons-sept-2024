"use client";

import { useEffect } from 'react';

const DocsPage = () => {
  useEffect(() => {
    // Только открываем документацию в новом окне
    window.open('http://localhost:8888/api/doc/', '_blank');
  }, []);

  return (
    <div className="w-full h-screen pt-16 bg-background flex items-center justify-center">
      <p>Documentation opened in a new tab</p>
    </div>
  );
};

export default DocsPage;