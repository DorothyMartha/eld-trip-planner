import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import TripCalculator from './components/TripCalculator';
import Header from './components/Header';
import GlobalStyles from './styles/GlobalStyles';

const AppContainer = styled.div`
  min-height: 100vh;
  background: #f8fafc;
`;

function App() {
  return (
    <Router>
      <GlobalStyles />
      <AppContainer>
        <Header />
        <Routes>
          <Route path="/" element={<TripCalculator />} />
        </Routes>
      </AppContainer>
    </Router>
  );
}

export default App;
