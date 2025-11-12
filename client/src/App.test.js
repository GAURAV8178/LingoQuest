import { render, screen } from '@testing-library/react';
import App from './App';

test('renders LingoQuest app', () => {
  render(<App />);
  const linkElement = screen.getByText(/LingoQuest/i);
  expect(linkElement).toBeInTheDocument();
});