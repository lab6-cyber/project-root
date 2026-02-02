import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';
import Navbar from './components/Navbar';

test('Навигация содержит логотип MODA', () => {
    render(
        <BrowserRouter>
            <Navbar />
        </BrowserRouter>
    );
    const logo = screen.getByText(/MODA/i);
    expect(logo).toBeInTheDocument();
});

test('Навигация содержит ссылки каталога и корзины', () => {
    render(
        <BrowserRouter>
            <Navbar />
        </BrowserRouter>
    );
    expect(screen.getByText(/Каталог/i)).toBeInTheDocument();
    expect(screen.getByText(/Корзина/i)).toBeInTheDocument();
});