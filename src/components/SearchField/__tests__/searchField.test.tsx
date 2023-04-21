import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import SearchField from '..';

describe('Search FIeld', () => {
    it('should render search field', () => {
        render(<SearchField setSearchTerm={jest.fn()} />);

        expect(screen.getByText('Search by name')).toBeInTheDocument();
    });

    it('should call setSearchTerm when type text', () => {
        const mockSetSearchTerm = jest.fn();
        render(<SearchField setSearchTerm={mockSetSearchTerm} />);

        const input = screen.getByRole('textbox');
        fireEvent.change(input, {target: {value: 'some text'}});

        expect(mockSetSearchTerm).toHaveBeenCalledWith('some text');
    });
});
