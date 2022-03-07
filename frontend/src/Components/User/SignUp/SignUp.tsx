import React from 'react';
import LandingPageCard from '../../../Layouts/LandingPageCard';
import SignUpForm from './SignUpForm';

export default function SignUp() {
  return (
    <LandingPageCard cardTitle='Finished Goods Purchasing' cardSubtitle='Create New User'>
      <SignUpForm />
    </LandingPageCard>
  );
}
