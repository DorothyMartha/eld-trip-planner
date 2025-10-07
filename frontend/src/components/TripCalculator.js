import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock, FileText, Truck, Loader, Navigation } from 'lucide-react';
import TripForm from './TripForm';
import RouteMap from './RouteMap';
import RouteInstructions from './RouteInstructions';
import DailyLogs from './DailyLogs';
import ComplianceStatus from './ComplianceStatus';
import { calculateTrip } from '../services/api';

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
`;

const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const Section = styled(motion.div)`
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%);
  backdrop-filter: blur(20px) saturate(180%);
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: 
    0 20px 25px -5px rgba(0, 0, 0, 0.08),
    0 10px 10px -5px rgba(0, 0, 0, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(226, 232, 240, 0.6);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 
      0 25px 50px -12px rgba(0, 0, 0, 0.12),
      0 12px 20px -8px rgba(0, 0, 0, 0.08),
      inset 0 1px 0 rgba(255, 255, 255, 1);
    border-color: rgba(249, 115, 22, 0.3);
  }
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e2e8f0;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  letter-spacing: -0.025em;
`;

const Icon = styled.div`
  background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
  color: white;
  padding: 0.875rem;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 
    0 8px 20px rgba(249, 115, 22, 0.35),
    0 3px 8px rgba(249, 115, 22, 0.2),
    inset 0 -2px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.1) rotate(5deg);
    box-shadow: 
      0 12px 28px rgba(249, 115, 22, 0.45),
      0 4px 12px rgba(249, 115, 22, 0.3);
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  gap: 1rem;
`;

const LoadingText = styled.p`
  color: #64748b;
  font-size: 1rem;
  font-weight: 500;
  text-align: center;
`;

const ErrorContainer = styled(motion.div)`
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
`;

const ErrorText = styled.p`
  color: #dc2626;
  font-weight: 500;
  margin: 0;
`;

const ResultsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin-top: 2rem;
`;

const TwoColumnGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const FullWidthSection = styled(Section)`
  grid-column: 1 / -1;
`;

const TripCalculator = () => {
  const [tripData, setTripData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCalculateTrip = async (formData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await calculateTrip(formData);
      setTripData(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred while calculating the trip');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <MainGrid>
        <Section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <SectionHeader>
            <Icon>
              <Truck size={24} />
            </Icon>
            <SectionTitle>Trip Calculator</SectionTitle>
          </SectionHeader>
          
          <AnimatePresence>
            {error && (
              <ErrorContainer
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <ErrorText>{error}</ErrorText>
              </ErrorContainer>
            )}
          </AnimatePresence>

          <TripForm onSubmit={handleCalculateTrip} loading={loading} />
        </Section>

        <Section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <SectionHeader>
            <Icon>
              <Navigation size={24} />
            </Icon>
            <SectionTitle>Route Map</SectionTitle>
          </SectionHeader>
          
          {loading ? (
            <LoadingContainer>
              <Loader size={32} className="animate-spin" />
              <LoadingText>Calculating route and HOS compliance...</LoadingText>
            </LoadingContainer>
          ) : tripData ? (
            <RouteMap tripData={tripData} />
          ) : (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              height: '300px',
              color: '#64748b',
              fontSize: '1.1rem'
            }}>
              Enter trip details to see the route map
            </div>
          )}
        </Section>
      </MainGrid>

      {tripData && (
        <ResultsContainer>
          <FullWidthSection
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <SectionHeader>
              <Icon>
                <FileText size={24} />
              </Icon>
              <SectionTitle>ELD Daily Log Sheets</SectionTitle>
            </SectionHeader>
            <DailyLogs dailyLogs={tripData.eld_logs} />
          </FullWidthSection>

          <TwoColumnGrid>
            <Section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <SectionHeader>
                <Icon>
                  <Clock size={24} />
                </Icon>
                <SectionTitle>HOS Compliance</SectionTitle>
              </SectionHeader>
              <ComplianceStatus compliance={tripData.compliance} />
            </Section>

            <Section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <RouteInstructions tripData={tripData} />
            </Section>
          </TwoColumnGrid>
        </ResultsContainer>
      )}
    </Container>
  );
};

export default TripCalculator;
