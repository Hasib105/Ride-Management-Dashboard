import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';

const App = () => {
  const [data, setData] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get('http://localhost:8000/api/example/')
      .then((response) => setData(response.data.message))
      .catch((error) => console.error(error));
  }, []);

  return (
    <div>
      {data ? <h1>{data}</h1> : <h1>Loading...</h1>}
    </div>
  );
};

export default App;
