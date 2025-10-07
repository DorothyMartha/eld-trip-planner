import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Clock, Shield } from 'lucide-react';

const StatusContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const StatusCard = styled(motion.div)`
  background: ${props => props.compliant ? '#f0fdf4' : '#fef2f2'};
  border: 1px solid ${props => props.compliant ? '#bbf7d0' : '#fecaca'};
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const StatusIcon = styled.div`
  background: ${props => props.compliant ? '#10b981' : '#ef4444'};
  color: white;
  padding: 0.75rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
`;

const StatusContent = styled.div`
  flex: 1;
`;

const StatusTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
`;

const StatusDescription = styled.p`
  font-size: 0.9rem;
  color: #6b7280;
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const MetricCard = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #f97316;
    box-shadow: 0 4px 12px rgba(249, 115, 22, 0.1);
  }
`;

const MetricValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => {
    if (props.value <= 0) return '#ef4444';
    if (props.value <= 2) return '#f59e0b';
    return '#10b981';
  }};
  margin-bottom: 0.25rem;
`;

const MetricLabel = styled.div`
  font-size: 0.9rem;
  color: #6b7280;
  font-weight: 500;
`;

const HOSRulesInfo = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
`;

const RulesTitle = styled.h4`
  font-size: 0.9rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const RulesList = styled.ul`
  font-size: 0.8rem;
  color: #6b7280;
  list-style: none;
  padding: 0;
  margin: 0;
`;

const RuleItem = styled.li`
  padding: 0.25rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &::before {
    content: '•';
    color: #667eea;
    font-weight: bold;
  }
`;

const ComplianceStatus = ({ compliance }) => {
  if (!compliance) {
    return (
      <StatusContainer>
        <StatusCard>
          <StatusIcon>
            <AlertCircle size={20} />
          </StatusIcon>
          <StatusContent>
            <StatusTitle>No Compliance Data</StatusTitle>
            <StatusDescription>
              Calculate a trip to see HOS compliance status
            </StatusDescription>
          </StatusContent>
        </StatusCard>
      </StatusContainer>
    );
  }

  const isCompliant = compliance.compliant;
  const hasViolations = !isCompliant;

  return (
    <StatusContainer>
      <StatusCard
        compliant={isCompliant}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <StatusIcon compliant={isCompliant}>
          {isCompliant ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
        </StatusIcon>
        <StatusContent>
          <StatusTitle>
            {isCompliant ? 'HOS Compliant' : 'HOS Violation Detected'}
          </StatusTitle>
          <StatusDescription>
            {isCompliant 
              ? 'Trip complies with all Hours of Service regulations'
              : 'Trip requires adjustments to meet HOS requirements'
            }
          </StatusDescription>
        </StatusContent>
      </StatusCard>

      <MetricsGrid>
        <MetricCard>
          <MetricValue value={compliance.driving_hours_remaining}>
            {compliance.driving_hours_remaining.toFixed(1)}h
          </MetricValue>
          <MetricLabel>Driving Hours Remaining</MetricLabel>
        </MetricCard>

        <MetricCard>
          <MetricValue value={compliance.duty_hours_remaining}>
            {compliance.duty_hours_remaining.toFixed(1)}h
          </MetricValue>
          <MetricLabel>Duty Hours Remaining</MetricLabel>
        </MetricCard>

        <MetricCard>
          <MetricValue value={compliance.cycle_hours_remaining}>
            {compliance.cycle_hours_remaining.toFixed(1)}h
          </MetricValue>
          <MetricLabel>Cycle Hours Remaining</MetricLabel>
        </MetricCard>
      </MetricsGrid>

      <HOSRulesInfo>
        <RulesTitle>
          <Shield size={16} />
          HOS Rules (70-hour/8-day)
        </RulesTitle>
        <RulesList>
          <RuleItem>Maximum 11 hours driving per day</RuleItem>
          <RuleItem>Maximum 14 hours on duty per day</RuleItem>
          <RuleItem>Maximum 70 hours on duty in 8 days</RuleItem>
          <RuleItem>10-hour minimum rest between shifts</RuleItem>
          <RuleItem>30-minute break required after 8 hours driving</RuleItem>
        </RulesList>
      </HOSRulesInfo>
    </StatusContainer>
  );
};

export default ComplianceStatus;
