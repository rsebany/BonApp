import { BrowserRouter as Router } from 'react-router-dom';
import { ReactNode } from 'react';

interface RouterProps {
  children: ReactNode;
}

export const AppRouter = ({ children }: RouterProps) => {
  return <Router>{children}</Router>;
};