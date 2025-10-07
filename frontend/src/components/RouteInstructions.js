import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Navigation, MapPin, Package, Truck, Fuel, Clock, Navigation2 } from 'lucide-react';

const InstructionsContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  margin-bottom: 2rem;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const InstructionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const InstructionItem = styled(motion.div)`
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: ${props => props.$isHighlight ? '#fef3c7' : '#f8fafc'};
  border-radius: 8px;
  border-left: 4px solid ${props => {
    switch(props.$type) {
      case 'start': return '#0ea5e9';
      case 'pickup': return '#10b981';
      case 'dropoff': return '#ef4444';
      case 'fuel': return '#3b82f6';
      case 'rest': return '#8b5cf6';
      case 'driving': return '#f97316';
      default: return '#64748b';
    }
  }};
  transition: all 0.2s ease;

  &:hover {
    transform: translateX(4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
`;

const StepNumber = styled.div`
  min-width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${props => {
    switch(props.$type) {
      case 'start': return '#0ea5e9';
      case 'pickup': return '#10b981';
      case 'dropoff': return '#ef4444';
      case 'fuel': return '#3b82f6';
      case 'rest': return '#8b5cf6';
      case 'driving': return '#f97316';
      default: return '#64748b';
    }
  }};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.875rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const InstructionIcon = styled.div`
  color: ${props => {
    switch(props.$type) {
      case 'start': return '#0ea5e9';
      case 'pickup': return '#10b981';
      case 'dropoff': return '#ef4444';
      case 'fuel': return '#3b82f6';
      case 'rest': return '#8b5cf6';
      case 'driving': return '#f97316';
      default: return '#64748b';
    }
  }};
  display: flex;
  align-items: center;
`;

const InstructionContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const InstructionTitle = styled.div`
  font-weight: 600;
  color: #1e293b;
  font-size: 1rem;
`;

const InstructionDetails = styled.div`
  font-size: 0.875rem;
  color: #64748b;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

const DetailItem = styled.span`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const Badge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${props => {
    switch(props.$status) {
      case 'driving': return '#fef3c7';
      case 'on_duty': return '#dbeafe';
      case 'off_duty': return '#e0e7ff';
      default: return '#f3f4f6';
    }
  }};
  color: ${props => {
    switch(props.$status) {
      case 'driving': return '#92400e';
      case 'on_duty': return '#1e40af';
      case 'off_duty': return '#4338ca';
      default: return '#374151';
    }
  }};
`;

const SummaryBox = styled.div`
  background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
  color: white;
  padding: 1.5rem;
  border-radius: 8px;
  margin-top: 1.5rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
`;

const SummaryItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const SummaryLabel = styled.div`
  font-size: 0.75rem;
  opacity: 0.9;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const SummaryValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
`;

const StopsListSection = styled.div`
  margin-top: 1.5rem;
  padding: 1.5rem;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
`;

const StopsListTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const StopItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: white;
  border-radius: 6px;
  margin-bottom: 0.5rem;
  border-left: 3px solid ${props => {
    switch(props.$type) {
      case 'pickup': return '#10b981';
      case 'dropoff': return '#ef4444';
      case 'fuel': return '#3b82f6';
      case 'rest': return '#8b5cf6';
      default: return '#64748b';
    }
  }};
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const StopIcon = styled.div`
  color: ${props => {
    switch(props.$type) {
      case 'pickup': return '#10b981';
      case 'dropoff': return '#ef4444';
      case 'fuel': return '#3b82f6';
      case 'rest': return '#8b5cf6';
      default: return '#64748b';
    }
  }};
`;

const StopDetails = styled.div`
  flex: 1;
`;

const StopName = styled.div`
  font-weight: 600;
  color: #1e293b;
  font-size: 0.875rem;
`;

const StopLocation = styled.div`
  font-size: 0.75rem;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-top: 0.25rem;
`;

const RouteInstructions = ({ tripData }) => {
  if (!tripData || !tripData.route_segments) {
    return null;
  }

  const segments = tripData.route_segments || [];
  const mapData = tripData.map_data || {};
  
  const totalDistance = segments.reduce((sum, seg) => sum + (seg.distance_miles || 0), 0);
  const totalDuration = segments.reduce((sum, seg) => sum + (seg.duration_hours || 0), 0);
  const drivingSegments = segments.filter(s => s.segment_type === 'driving');
  const totalDrivingHours = drivingSegments.reduce((sum, seg) => sum + (seg.duration_hours || 0), 0);
  
  // Count actual stops (not driving segments)
  const stopTypes = ['pickup', 'dropoff', 'fuel', 'rest'];
  const actualStops = segments.filter(s => stopTypes.includes(s.segment_type));
  const totalStops = actualStops.length;

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const date = new Date(timeString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDuration = (hours) => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  const getInstructionIcon = (type) => {
    switch(type) {
      case 'driving': return <Truck size={20} />;
      case 'pickup': return <Truck size={20} />;
      case 'dropoff': return <Truck size={20} />;
      case 'fuel': return <Fuel size={20} />;
      case 'rest': return <Clock size={20} />;
      default: return <Truck size={20} />;
    }
  };

  const getInstructionText = (segment, index) => {
    const location = segment.end_location || segment.start_location || 'Unknown location';
    
    switch(segment.segment_type) {
      case 'driving':
        return `Drive from ${segment.start_location} to ${segment.end_location}`;
      case 'pickup':
        return `Pick up cargo`;
      case 'dropoff':
        return `Deliver cargo`;
      case 'fuel':
        return `Fuel stop`;
      case 'rest':
        return `10-hour rest break`;
      default:
        return `Proceed to next location`;
    }
  };
  
  const getLocationText = (segment) => {
    return segment.end_location || segment.start_location || 'Unknown location';
  };
  
  const getStopTypeLabel = (type) => {
    switch(type) {
      case 'pickup': return 'Pickup Location';
      case 'dropoff': return 'Dropoff Location';
      case 'fuel': return 'Fuel Stop';
      case 'rest': return 'Rest Break';
      default: return 'Stop';
    }
  };
  
  const getStopIcon = (type) => {
    switch(type) {
      case 'pickup': return <Package size={18} />;
      case 'dropoff': return <Package size={18} />;
      case 'fuel': return <Fuel size={18} />;
      case 'rest': return <Clock size={18} />;
      default: return <MapPin size={18} />;
    }
  };

  return (
    <InstructionsContainer>
      <Title>
        <Truck size={24} />
        Route Instructions
      </Title>

      <InstructionsList>
        <InstructionItem
          $type="start"
          $isHighlight={true}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <StepNumber $type="start">
            <Truck size={16} />
          </StepNumber>
          <InstructionIcon $type="start">
            <Truck size={20} />
          </InstructionIcon>
          <InstructionContent>
            <InstructionTitle>Starting Point</InstructionTitle>
            <InstructionDetails>
              <DetailItem>{mapData.current_location}</DetailItem>
              <Badge $status="off_duty">Current Location</Badge>
            </InstructionDetails>
          </InstructionContent>
        </InstructionItem>

        {segments.map((segment, index) => (
          <InstructionItem
            key={index}
            $type={segment.segment_type}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <StepNumber $type={segment.segment_type}>
              {index + 1}
            </StepNumber>
            <InstructionIcon $type={segment.segment_type}>
              {getInstructionIcon(segment.segment_type)}
            </InstructionIcon>
            <InstructionContent>
              <InstructionTitle>{getInstructionText(segment, index)}</InstructionTitle>
              <InstructionDetails>
                {/* Show location for stops (not driving) */}
                {segment.segment_type !== 'driving' && (
                  <DetailItem>
                    <MapPin size={14} /> {getLocationText(segment)}
                  </DetailItem>
                )}
                {segment.distance_miles > 0 && (
                  <DetailItem>📏 {segment.distance_miles.toFixed(0)} miles</DetailItem>
                )}
                {segment.duration_hours > 0 && (
                  <DetailItem>⏱️ {formatDuration(segment.duration_hours)}</DetailItem>
                )}
                {segment.start_time && (
                  <DetailItem>🕐 {formatTime(segment.start_time)}</DetailItem>
                )}
                <Badge $status={segment.duty_status}>
                  {segment.duty_status?.replace('_', ' ') || 'N/A'}
                </Badge>
              </InstructionDetails>
            </InstructionContent>
          </InstructionItem>
        ))}
      </InstructionsList>

      {/* List of All Stops */}
      {totalStops > 0 && (
        <StopsListSection>
          <StopsListTitle>
            <MapPin size={18} />
            All Stops ({totalStops})
          </StopsListTitle>
          {actualStops.map((stop, index) => (
            <StopItem key={index} $type={stop.segment_type}>
              <StopIcon $type={stop.segment_type}>
                {getStopIcon(stop.segment_type)}
              </StopIcon>
              <StopDetails>
                <StopName>{getStopTypeLabel(stop.segment_type)}</StopName>
                <StopLocation>
                  <MapPin size={12} />
                  {getLocationText(stop)}
                  {stop.start_time && ` • ${formatTime(stop.start_time)}`}
                </StopLocation>
              </StopDetails>
            </StopItem>
          ))}
        </StopsListSection>
      )}

      <SummaryBox>
        <SummaryItem>
          <SummaryLabel>Total Distance</SummaryLabel>
          <SummaryValue>{totalDistance.toFixed(0)} mi</SummaryValue>
        </SummaryItem>
        <SummaryItem>
          <SummaryLabel>Total Duration</SummaryLabel>
          <SummaryValue>{formatDuration(totalDuration)}</SummaryValue>
        </SummaryItem>
        <SummaryItem>
          <SummaryLabel>Driving Time</SummaryLabel>
          <SummaryValue>{formatDuration(totalDrivingHours)}</SummaryValue>
        </SummaryItem>
        <SummaryItem>
          <SummaryLabel>Total Stops</SummaryLabel>
          <SummaryValue>{totalStops}</SummaryValue>
        </SummaryItem>
      </SummaryBox>
    </InstructionsContainer>
  );
};

export default RouteInstructions;

