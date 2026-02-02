import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './components/Navbar';

test('Навигация содержит логотип MODA', () => {
  render(
    <BrowserRouter>
      <Navbar />
    </BrowserRouter>
  );
  const logoElement = screen.getByText(/MODA/i);
  expect(logoElement).toBeInTheDocument();
});

test('Навигация содержит ссылку на каталог', () => {
  render(
    <BrowserRouter>
      <Navbar />
    </BrowserRouter>
  );
  const catalogLink = screen.getByText(/Каталог/i);
  expect(catalogLink).toBeInTheDocument();
});
