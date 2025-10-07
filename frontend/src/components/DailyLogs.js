import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, FileText, Download, Printer, Image as ImageIcon, Truck } from 'lucide-react';

const LogsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const LogNavigation = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const NavButton = styled(motion.button)`
  background: #f97316;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(249, 115, 22, 0.2);

  &:hover:not(:disabled) {
    background: #ea580c;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(249, 115, 22, 0.3);
  }

  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const LogTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #1f2937;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ELDLogSheet = styled.div`
  background: white;
  border: 2px solid #374151;
  border-radius: 8px;
  padding: 1.5rem;
  font-family: 'Courier New', monospace;
  font-size: 0.75rem;
  line-height: 1.3;
  overflow-x: auto;
  max-width: 100%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const LogHeader = styled.div`
  text-align: center;
  margin-bottom: 1rem;
  border-bottom: 2px solid #374151;
  padding-bottom: 0.5rem;
`;

const LogTitleMain = styled.h2`
  font-size: 1.1rem;
  font-weight: bold;
  text-transform: uppercase;
  margin-bottom: 0.25rem;
  letter-spacing: 1px;
`;

const LogSubtitle = styled.p`
  font-size: 0.8rem;
  color: #666;
  margin: 0;
`;

const LogInfo = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 0.75rem;
  border: 1px solid #ccc;
  padding: 0.75rem;
  background: #f9f9f9;
`;

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const InfoLabel = styled.span`
  font-weight: bold;
  text-decoration: underline;
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  font-size: 0.75rem;
`;

const DateSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: bold;
`;

const Instructions = styled.div`
  font-size: 0.7rem;
  text-align: right;
  color: #666;
  line-height: 1.2;
`;

const CarrierInfo = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 0.75rem;
`;

const AddressSection = styled.div`
  border: 1px solid #ccc;
  padding: 0.5rem;
  background: #f9f9f9;
`;

const VehicleSection = styled.div`
  border: 1px solid #ccc;
  padding: 0.5rem;
  background: #f9f9f9;
`;

const SectionTitle = styled.div`
  font-weight: bold;
  text-decoration: underline;
  margin-bottom: 0.25rem;
`;

const LogGrid = styled.div`
  border: 2px solid #374151;
  margin-bottom: 1rem;
  background: white;
`;

const GridHeader = styled.div`
  display: grid;
  grid-template-columns: 80px 1fr;
  border-bottom: 1px solid #374151;
`;

const DutyLabels = styled.div`
  display: flex;
  flex-direction: column;
  background: #f9f9f9;
  border-right: 1px solid #374151;
`;

const DutyLabel = styled.div`
  padding: 0.75rem 0.5rem;
  border-bottom: 1px solid #374151;
  min-height: 40px;
  display: flex;
  align-items: center;
  font-size: 0.75rem;
  font-weight: bold;
  background: white;

  &:last-child {
    border-bottom: none;
  }
`;

const TimelineContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const HourHeader = styled.div`
  display: grid;
  grid-template-columns: repeat(24, 1fr);
  background: #374151;
  color: white;
  border-bottom: 1px solid #374151;
`;

const HourLabel = styled.div`
  padding: 0.5rem 0.25rem;
  text-align: center;
  font-size: 0.7rem;
  font-weight: bold;
  border-right: 1px solid #555;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 30px;

  &:last-child {
    border-right: none;
  }
`;

const DutyRows = styled.div`
  display: flex;
  flex-direction: column;
`;

const DutyRow = styled.div`
  display: grid;
  grid-template-columns: repeat(24, 1fr);
  min-height: 40px;
  border-bottom: 1px solid #374151;
  position: relative;
`;

const DutyCell = styled.div`
  border-right: 1px solid #374151;
  position: relative;
  background: white;

  &:last-child {
    border-right: none;
  }
`;

const DutyLine = styled.div`
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 4px;
  background: ${props => {
    switch (props.status) {
      case 'driving': return '#fbbf24';
      case 'on_duty': return '#f59e0b';
      case 'off_duty': return '#dbeafe';
      case 'sleeper_berth': return '#93c5fd';
      default: return '#f3f4f6';
    }
  }};
  transform: translateY(-50%);
  z-index: 1;
  
  /* Add connectors at the ends */
  &::before {
    content: '';
    position: absolute;
    left: -2px;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 4px;
    background: inherit;
    border-radius: 50%;
    z-index: 2;
  }
  
  &::after {
    content: '';
    position: absolute;
    right: -2px;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 4px;
    background: inherit;
    border-radius: 50%;
    z-index: 2;
  }
`;

const ConnectedDutyLine = styled.div`
  position: absolute;
  top: 50%;
  left: ${props => props.$isStart ? '0' : '-2px'};
  right: ${props => props.$isEnd ? '0' : '-2px'};
  height: 4px;
  background: ${props => {
    switch (props.$status) {
      case 'driving': return '#fbbf24';
      case 'on_duty': return '#f59e0b';
      case 'off_duty': return '#dbeafe';
      case 'sleeper_berth': return '#93c5fd';
      default: return '#f3f4f6';
    }
  }};
  transform: translateY(-50%);
  z-index: 1;
`;

const VerticalConnector = styled.div`
  position: absolute;
  left: 50%;
  top: ${props => props.$top}px;
  width: 2px;
  height: ${props => props.$height}px;
  background: ${props => props.$color};
  transform: translateX(-50%);
  z-index: 2;
`;

const ConnectingDot = styled.div`
  position: absolute;
  left: ${props => props.$side === 'left' ? '-2px' : 'auto'};
  right: ${props => props.$side === 'right' ? '-2px' : 'auto'};
  top: 50%;
  width: 4px;
  height: 4px;
  background: ${props => props.$color};
  border-radius: 50%;
  transform: translateY(-50%);
  z-index: 2;
`;

// React component for connected duty lines
const ConnectedDutyLineComponent = ({ status, isStart, isEnd, hour, timeline, rowIndex }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'driving': return '#fbbf24';
      case 'on_duty': return '#f59e0b';
      case 'off_duty': return '#dbeafe';
      case 'sleeper_berth': return '#93c5fd';
      default: return '#f3f4f6';
    }
  };

  const color = getStatusColor(status);
  
  // Check for vertical connectors needed
  const currentHour = timeline.find(t => t.hour === hour);
  const prevHour = hour > 0 ? timeline.find(t => t.hour === hour - 1) : null;
  
  let verticalConnector = null;
  
  if (currentHour && prevHour && currentHour.duty_status !== prevHour.duty_status) {
    const statusOrder = ['off_duty', 'sleeper_berth', 'driving', 'on_duty'];
    const currentRowIndex = statusOrder.indexOf(currentHour.duty_status);
    const prevRowIndex = statusOrder.indexOf(prevHour.duty_status);
    
    if (Math.abs(currentRowIndex - prevRowIndex) === 1) {
      // Adjacent rows - add vertical connector
      const connectorHeight = Math.abs(currentRowIndex - prevRowIndex) * 40; // 40px per row
      const connectorTop = currentRowIndex > prevRowIndex ? -20 : 20;
      
      verticalConnector = (
        <VerticalConnector
          $top={connectorTop}
          $height={connectorHeight}
          $color={color}
        />
      );
    }
  }

  return (
    <>
      <ConnectedDutyLine 
        $status={status} 
        $isStart={isStart}
        $isEnd={isEnd}
      />
      {isStart && <ConnectingDot $side="left" $color={color} />}
      {isEnd && <ConnectingDot $side="right" $color={color} />}
      {verticalConnector}
    </>
  );
};

const TotalsColumn = styled.div`
  display: grid;
  grid-template-columns: 80px 1fr;
  border: 2px solid #374151;
  border-top: none;
`;

const TotalsLabels = styled.div`
  display: flex;
  flex-direction: column;
  background: #f9f9f9;
  border-right: 1px solid #374151;
`;

const TotalsValues = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  min-height: 40px;
  padding: 0.75rem;
  border-bottom: 1px solid #374151;
  background: white;

  &:last-child {
    border-bottom: none;
    font-weight: bold;
    background: #e5e7eb;
  }
`;


const RemarksSection = styled.div`
  margin-top: 1rem;
  border: 1px solid #374151;
  background: white;
`;

const RemarksTitle = styled.div`
  background: #f9f9f9;
  padding: 0.5rem;
  font-weight: bold;
  text-decoration: underline;
  border-bottom: 1px solid #ccc;
  font-size: 0.75rem;
`;

const RemarksContent = styled.div`
  padding: 0.75rem;
  min-height: 80px;
  font-size: 0.7rem;
  line-height: 1.4;
`;

const BottomSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-top: 1rem;
`;

const ShippingSection = styled.div`
  border: 1px solid #374151;
  background: white;
`;

const ShippingTitle = styled.div`
  background: #f9f9f9;
  padding: 0.5rem;
  font-weight: bold;
  text-decoration: underline;
  border-bottom: 1px solid #ccc;
  font-size: 0.75rem;
`;

const ShippingContent = styled.div`
  padding: 0.75rem;
  min-height: 60px;
  font-size: 0.7rem;
`;

const SignatureSection = styled.div`
  border: 1px solid #374151;
  background: white;
`;

const SignatureTitle = styled.div`
  background: #f9f9f9;
  padding: 0.5rem;
  font-weight: bold;
  text-decoration: underline;
  border-bottom: 1px solid #ccc;
  font-size: 0.75rem;
`;

const SignatureContent = styled.div`
  padding: 0.75rem;
  min-height: 60px;
  font-size: 0.7rem;
`;

const RecapSection = styled.div`
  margin-top: 1rem;
  border: 1px solid #374151;
  background: white;
`;

const RecapTitle = styled.div`
  background: #f9f9f9;
  padding: 0.5rem;
  font-weight: bold;
  text-decoration: underline;
  border-bottom: 1px solid #ccc;
  font-size: 0.75rem;
`;

const RecapContent = styled.div`
  padding: 0.75rem;
  font-size: 0.7rem;
`;

const RecapGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;

const RecapColumn = styled.div`
  border: 1px solid #ccc;
  padding: 0.5rem;
  background: #f9f9f9;
`;

const RecapSubtitle = styled.div`
  font-weight: bold;
  margin-bottom: 0.5rem;
  text-align: center;
  font-size: 0.7rem;
`;

const RecapItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.25rem;
  font-size: 0.65rem;
`;

const ExportButton = styled(motion.button)`
  background: #059669;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(5, 150, 105, 0.2);

  &:hover {
    background: #047857;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(5, 150, 105, 0.3);
  }
`;

const ExportActions = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  flex-wrap: wrap;
`;

const PrintButton = styled(motion.button)`
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);

  &:hover {
    background: #2563eb;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
  }
`;

const ImageButton = styled(motion.button)`
  background: #8b5cf6;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(139, 92, 246, 0.2);

  &:hover {
    background: #7c3aed;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(139, 92, 246, 0.3);
  }
`;

const DailyLogs = ({ dailyLogs }) => {
  const [currentLogIndex, setCurrentLogIndex] = useState(0);
  const logSheetRef = useRef(null);

  if (!dailyLogs || dailyLogs.length === 0) {
    return (
      <div style={{ 
        textAlign: 'center', 
        color: '#6b7280', 
        padding: '2rem',
        fontStyle: 'italic'
      }}>
        No daily logs available
      </div>
    );
  }

  const currentLog = dailyLogs[currentLogIndex];
  const canGoPrevious = currentLogIndex > 0;
  const canGoNext = currentLogIndex < dailyLogs.length - 1;

  const formatDateLong = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatHour = (hour) => {
    if (hour === 0) return 'M';
    if (hour === 12) return 'N';
    if (hour < 12) return hour.toString();
    return (hour - 12).toString();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: '2-digit',
      day: '2-digit', 
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const generateRemarks = (log) => {
    const remarks = [];
    if (log.remarks && log.remarks.length > 0) {
      remarks.push(...log.remarks);
    } else {
      // Generate default remarks based on timeline
      const statusChanges = [];
      let lastStatus = null;
      
      log.timeline.forEach((entry, index) => {
        if (entry.duty_status !== lastStatus) {
          statusChanges.push({
            time: `${formatHour(entry.hour)}:00`,
            status: entry.duty_status,
            location: entry.location || 'Unknown Location'
          });
          lastStatus = entry.duty_status;
        }
      });

      statusChanges.forEach(change => {
        const statusText = change.status.replace('_', ' ').toUpperCase();
        remarks.push(`${change.time} - ${statusText} - ${change.location}`);
      });
    }
    return remarks;
  };

  const calculateWeeklyHours = (log, allLogs) => {
    const currentDate = new Date(log.date);
    const sevenDaysAgo = new Date(currentDate);
    sevenDaysAgo.setDate(currentDate.getDate() - 7);
    
    const eightDaysAgo = new Date(currentDate);
    eightDaysAgo.setDate(currentDate.getDate() - 8);

    const last7Days = allLogs.filter(l => {
      const logDate = new Date(l.date);
      return logDate >= sevenDaysAgo && logDate <= currentDate;
    });

    const last8Days = allLogs.filter(l => {
      const logDate = new Date(l.date);
      return logDate >= eightDaysAgo && logDate <= currentDate;
    });

    const hours7Days = last7Days.reduce((sum, l) => 
      sum + l.totals.on_duty_hours + l.totals.driving_hours, 0);
    
    const hours8Days = last8Days.reduce((sum, l) => 
      sum + l.totals.on_duty_hours + l.totals.driving_hours, 0);

    return {
      hours7Days: hours7Days.toFixed(1),
      hours8Days: hours8Days.toFixed(1),
      available60: Math.max(0, 60 - hours7Days).toFixed(1),
      available70: Math.max(0, 70 - hours8Days).toFixed(1)
    };
  };

  // Export as JSON
  const handleExportJSON = () => {
    const dataStr = JSON.stringify(currentLog, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `eld-log-${currentLog.date}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Export as CSV
  const handleExportCSV = () => {
    const csv = [
      ['ELD Daily Log', formatDate(currentLog.date)],
      [''],
      ['Driver', currentLog.driver_name],
      ['Carrier', currentLog.carrier_name],
      ['Vehicle', currentLog.vehicle_numbers],
      ['Total Miles', currentLog.total_miles.toFixed(0)],
      [''],
      ['Hour', 'Duty Status'],
      ...currentLog.timeline.map(t => [t.hour, t.duty_status]),
      [''],
      ['Totals'],
      ['Off Duty Hours', currentLog.totals.off_duty_hours.toFixed(2)],
      ['Sleeper Berth Hours', currentLog.totals.sleeper_berth_hours.toFixed(2)],
      ['Driving Hours', currentLog.totals.driving_hours.toFixed(2)],
      ['On Duty Hours', currentLog.totals.on_duty_hours.toFixed(2)]
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `eld-log-${currentLog.date}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Print log sheet
  const handlePrint = () => {
    window.print();
  };

  // Export as image (using html2canvas would be ideal, but we'll use a simpler approach)
  const handleExportImage = async () => {
    try {
      // Create a canvas-based export
      const logElement = logSheetRef.current;
      if (!logElement) return;

      // Use modern browser API if available
      if (typeof html2canvas === 'undefined') {
        // Fallback: Open print dialog
        alert('For best results, use Print (Ctrl+P) and save as PDF, or use the CSV/JSON export options.');
        window.print();
      }
    } catch (error) {
      console.error('Export error:', error);
      alert('Please use Print (Ctrl+P) to save as PDF, or export as CSV/JSON.');
    }
  };

  // Export all logs as JSON
  const handleExportAllLogs = () => {
    const dataStr = JSON.stringify(dailyLogs, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `all-eld-logs-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <LogsContainer>
      <LogNavigation>
        <NavButton
          onClick={() => setCurrentLogIndex(currentLogIndex - 1)}
          disabled={!canGoPrevious}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronLeft size={16} />
          Previous
        </NavButton>
        
        <LogTitle>
          <Truck size={20} />
          ELD Daily Log - {formatDateLong(currentLog.date)}
        </LogTitle>
        
        <NavButton
          onClick={() => setCurrentLogIndex(currentLogIndex + 1)}
          disabled={!canGoNext}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Next
          <ChevronRight size={16} />
        </NavButton>
      </LogNavigation>

      <motion.div
        key={currentLogIndex}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
      >
        <ELDLogSheet ref={logSheetRef}>
          <LogHeader>
            <LogTitleMain>U.S. DEPARTMENT OF TRANSPORTATION</LogTitleMain>
            <LogTitleMain>DRIVER'S DAILY LOG</LogTitleMain>
            <LogSubtitle>(ONE CALENDAR DAY — 24 HOURS)</LogSubtitle>
            <LogSubtitle>ORIGINAL — Submit to carrier within 13 days</LogSubtitle>
            <LogSubtitle>DUPLICATE — Driver retains possession for eight days</LogSubtitle>
          </LogHeader>

          <HeaderRow>
            <DateSection>
              <span>Date:</span>
              <span>({formatDate(currentLog.date).split('/')[0]})</span>
              <span>({formatDate(currentLog.date).split('/')[1]})</span>
              <span>({formatDate(currentLog.date).split('/')[2]})</span>
              <span>Total Miles Driving Today:</span>
              <span>({currentLog.total_miles.toFixed(0)})</span>
            </DateSection>
            <Instructions>
              <div>Original - File at home terminal.</div>
              <div>Duplicate - Driver retains in his/her possession for 8 days.</div>
            </Instructions>
          </HeaderRow>

          <CarrierInfo>
            <AddressSection>
              <SectionTitle>Name of Carrier or Carriers:</SectionTitle>
              <div>{currentLog.carrier_name}</div>
              <SectionTitle>Main Office Address:</SectionTitle>
              <div>ELD Logistics, Washington, DC</div>
              <SectionTitle>Home Terminal Address:</SectionTitle>
              <div>ELD Logistics Terminal, Washington, DC</div>
              <SectionTitle>Driver's Signature in Full:</SectionTitle>
              <div>{currentLog.driver_name}</div>
              <SectionTitle>Name of Co-Driver:</SectionTitle>
              <div>_________________</div>
              <div style={{ fontSize: '0.7rem', marginTop: '0.5rem' }}>
                I certify that these entries are true and correct
              </div>
            </AddressSection>
            <VehicleSection>
              <SectionTitle>Truck/Tractor and Trailer Numbers or License Plate(s)/State:</SectionTitle>
              <div>(show each unit)</div>
              <div>{currentLog.vehicle_numbers}</div>
              <SectionTitle>Total Miles Driving Today:</SectionTitle>
              <div>{currentLog.total_miles.toFixed(0)}</div>
              <SectionTitle>24-Hour Period Starting Time:</SectionTitle>
              <div>Midnight</div>
            </VehicleSection>
          </CarrierInfo>

          <LogGrid>
            <GridHeader>
              <DutyLabels>
                <DutyLabel>Off Duty</DutyLabel>
                <DutyLabel>Sleeper Berth</DutyLabel>
                <DutyLabel>Driving</DutyLabel>
                <DutyLabel>On Duty (Not Driving)</DutyLabel>
              </DutyLabels>

              <TimelineContainer>
                <HourHeader>
                  {Array.from({ length: 24 }, (_, i) => (
                    <HourLabel key={`header-${i}`}>
                      {formatHour(i)}
                    </HourLabel>
                  ))}
                </HourHeader>

                <DutyRows>
                  {['off_duty', 'sleeper_berth', 'driving', 'on_duty'].map((status, rowIndex) => (
                    <DutyRow key={status}>
                      {Array.from({ length: 24 }, (_, hour) => {
                        const timelineHour = currentLog.timeline.find(t => t.hour === hour);
                        const isActive = timelineHour && timelineHour.duty_status === status;
                        
                        // Check if this is the start of a continuous period
                        const prevHour = hour > 0 ? currentLog.timeline.find(t => t.hour === hour - 1) : null;
                        const isStartOfPeriod = isActive && (!prevHour || prevHour.duty_status !== status);
                        
                        // Check if this is the end of a continuous period
                        const nextHour = hour < 23 ? currentLog.timeline.find(t => t.hour === hour + 1) : null;
                        const isEndOfPeriod = isActive && (!nextHour || nextHour.duty_status !== status);
                        
                        return (
                          <DutyCell key={`${status}-${hour}`}>
                            {isActive && (
                              <ConnectedDutyLineComponent 
                                status={status} 
                                isStart={isStartOfPeriod}
                                isEnd={isEndOfPeriod}
                                hour={hour}
                                timeline={currentLog.timeline}
                                rowIndex={rowIndex}
                              />
                            )}
                          </DutyCell>
                        );
                      })}
                    </DutyRow>
                  ))}
                </DutyRows>
              </TimelineContainer>
            </GridHeader>
          </LogGrid>

          <TotalsColumn>
            <TotalsLabels>
              <div>Off Duty</div>
              <div>Sleeper Berth</div>
              <div>Driving</div>
              <div>On Duty (Not Driving)</div>
              <div><strong>TOTAL HOURS</strong></div>
            </TotalsLabels>
            <div>
              <TotalsValues>
                {currentLog.totals.off_duty_hours.toFixed(2)}
              </TotalsValues>
              <TotalsValues>
                {currentLog.totals.sleeper_berth_hours.toFixed(2)}
              </TotalsValues>
              <TotalsValues>
                {currentLog.totals.driving_hours.toFixed(2)}
              </TotalsValues>
              <TotalsValues>
                {currentLog.totals.on_duty_hours.toFixed(2)}
              </TotalsValues>
              <TotalsValues>
                {(currentLog.totals.off_duty_hours + 
                  currentLog.totals.sleeper_berth_hours + 
                  currentLog.totals.driving_hours + 
                  currentLog.totals.on_duty_hours).toFixed(2)}
              </TotalsValues>
            </div>
          </TotalsColumn>


          <RemarksSection>
            <RemarksTitle>REMARKS</RemarksTitle>
            <RemarksContent>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <strong>FROM:</strong> _________________
                </div>
                <div>
                  <strong>TO:</strong> _________________
                </div>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <strong>Shipping Document Number(s) or Name of Shipper and Commodity:</strong>
                <div style={{ marginTop: '0.5rem' }}>_________________</div>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <strong>Enter name of place you reported and where released from work and when and where each change of duty occurred. Use time standard of home terminal:</strong>
              </div>
              {generateRemarks(currentLog).map((remark, index) => (
                <div key={index} style={{ marginBottom: '0.25rem' }}>{remark}</div>
              ))}
            </RemarksContent>
          </RemarksSection>


          <RecapSection>
            <RecapTitle>RECAP: Complete at end of day</RecapTitle>
            <RecapContent>
              <div style={{ marginBottom: '0.5rem' }}>
                <strong>On duty hours today, Total lines 3 & 4:</strong> {(currentLog.totals.on_duty_hours + currentLog.totals.driving_hours).toFixed(2)} hours
              </div>
              <RecapGrid>
                <RecapColumn>
                  <RecapSubtitle>70 Hour/8 Day Drivers</RecapSubtitle>
                  <RecapItem>
                    <span>A. Total hours on duty last 7 days including today.</span>
                    <span>{calculateWeeklyHours(currentLog, dailyLogs).hours7Days}</span>
                  </RecapItem>
                  <RecapItem>
                    <span>B. Total hours available tomorrow 70 hr. minus A*</span>
                    <span>{calculateWeeklyHours(currentLog, dailyLogs).available70}</span>
                  </RecapItem>
                  <RecapItem>
                    <span>C. Total hours on duty last 5 days including today.</span>
                    <span>{calculateWeeklyHours(currentLog, dailyLogs).hours7Days}</span>
                  </RecapItem>
                </RecapColumn>
                <RecapColumn>
                  <RecapSubtitle>60 Hour/7 Day Drivers</RecapSubtitle>
                  <RecapItem>
                    <span>A. Total hours on duty last 7 days including today.</span>
                    <span>{calculateWeeklyHours(currentLog, dailyLogs).hours7Days}</span>
                  </RecapItem>
                  <RecapItem>
                    <span>B. Total hours available tomorrow 60 hr. minus A*</span>
                    <span>{calculateWeeklyHours(currentLog, dailyLogs).available60}</span>
                  </RecapItem>
                  <RecapItem>
                    <span>C. Total hours on duty last 5 days including today.</span>
                    <span>{calculateWeeklyHours(currentLog, dailyLogs).hours7Days}</span>
                  </RecapItem>
                </RecapColumn>
              </RecapGrid>
              <div style={{ marginTop: '0.5rem', fontSize: '0.65rem', textAlign: 'right' }}>
                *If you took 34 consecutive hours off duty you have 60/70 hours available
              </div>
            </RecapContent>
          </RecapSection>
        </ELDLogSheet>
      </motion.div>

      <ExportActions>
        <ExportButton
          onClick={handleExportJSON}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Download size={16} />
          Export as JSON
        </ExportButton>

        <ExportButton
          onClick={handleExportCSV}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Download size={16} />
          Export as CSV
        </ExportButton>

        <PrintButton
          onClick={handlePrint}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Printer size={16} />
          Print Log
        </PrintButton>

        {dailyLogs.length > 1 && (
          <ImageButton
            onClick={handleExportAllLogs}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FileText size={16} />
            Export All Logs
          </ImageButton>
        )}
      </ExportActions>
    </LogsContainer>
  );
};

export default DailyLogs;
