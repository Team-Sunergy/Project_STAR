import React from 'react';
import Header from './components/Header';
import ScoreCalculator from './components/ScoreCalculator';
import LiveData from './components/LiveData';
import WeatherWidget from './components/WeatherWidget';
import Footer from './components/Footer';
import './styles.module.css'; 

function App() {
  return (
    <div className="App">
      <Header />
      <main>
        <ScoreCalculator />
        <LiveData />
        <WeatherWidget />
      </main>
      <Footer />
    </div>
  );
}

export default App;
