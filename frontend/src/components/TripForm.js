import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Truck, MapPin, Clock, Loader, Navigation } from 'lucide-react';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 700;
  color: #0f172a;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.25rem;
`;

const Input = styled.input`
  padding: 1rem 1.25rem;
  border: 2px solid rgba(226, 232, 240, 0.8);
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: rgba(255, 255, 255, 0.9);
  color: #0f172a;
  font-weight: 500;
  box-shadow: 
    0 1px 3px rgba(0, 0, 0, 0.05),
    inset 0 1px 2px rgba(255, 255, 255, 0.8);

  &:focus {
    outline: none;
    border-color: #f97316;
    background: white;
    box-shadow: 
      0 0 0 4px rgba(249, 115, 22, 0.12),
      0 4px 12px rgba(249, 115, 22, 0.15),
      inset 0 1px 0 white;
    transform: translateY(-1px);
  }

  &::placeholder {
    color: #94a3b8;
    font-weight: 400;
  }

  &:hover {
    border-color: #cbd5e1;
    box-shadow: 
      0 4px 8px rgba(0, 0, 0, 0.08),
      inset 0 1px 0 white;
  }
`;

const NumberInput = styled(Input).attrs({ type: 'number' })`
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const SubmitButton = styled(motion.button)`
  background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
  color: white;
  border: none;
  padding: 1.125rem 2.5rem;
  border-radius: 14px;
  font-size: 1.0625rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.625rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 
    0 10px 25px rgba(249, 115, 22, 0.4),
    0 4px 12px rgba(249, 115, 22, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  position: relative;
  overflow: hidden;
  letter-spacing: 0.025em;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
    transition: left 0.5s;
  }
  
  &:hover:not(:disabled)::before {
    left: 100%;
  }

  &:hover:not(:disabled) {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 
      0 15px 35px rgba(249, 115, 22, 0.5),
      0 6px 18px rgba(249, 115, 22, 0.35),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const InfoText = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
  background: #f8fafc;
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid #f97316;
  margin: 0;
  line-height: 1.5;
`;

const TripForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    current_location: '',
    pickup_location: '',
    dropoff_location: '',
    current_cycle_used: 0
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>
            <Truck size={16} />
            Current Location
          </Label>
        <Input
          type="text"
          name="current_location"
          value={formData.current_location}
          onChange={handleChange}
          placeholder="e.g., New York, NY"
          required
        />
      </FormGroup>

        <FormGroup>
          <Label>
            <Navigation size={16} />
            Pickup Location
          </Label>
        <Input
          type="text"
          name="pickup_location"
          value={formData.pickup_location}
          onChange={handleChange}
          placeholder="e.g., Chicago, IL"
          required
        />
      </FormGroup>

      <FormGroup>
        <Label>
          <MapPin size={16} />
          Dropoff Location
        </Label>
        <Input
          type="text"
          name="dropoff_location"
          value={formData.dropoff_location}
          onChange={handleChange}
          placeholder="e.g., Los Angeles, CA"
          required
        />
      </FormGroup>

      <FormGroup>
        <Label>
          <Clock size={16} />
          Current Cycle Used (Hours)
        </Label>
        <NumberInput
          name="current_cycle_used"
          value={formData.current_cycle_used}
          onChange={handleChange}
          placeholder="0"
          min="0"
          max="70"
          step="0.1"
          required
        />
      </FormGroup>

        <InfoText>
          <Truck size={16} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '0.5rem' }} />
          <strong>HOS Rules:</strong> Property-carrying driver, 70hrs/8days limit. 
          Fuel stops every 1,000 miles. 1 hour for pickup/dropoff.
        </InfoText>

      <SubmitButton
        type="submit"
        disabled={loading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
          {loading ? (
            <>
              <Loader size={20} className="animate-spin" />
              Calculating Route...
            </>
          ) : (
            <>
              <Truck size={20} />
              Calculate Trip
            </>
          )}
      </SubmitButton>
    </Form>
  );
};

export default TripForm;
