import * as React from 'react';
import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import * as API from '../../api';
import Teams from '../Teams';

jest.mock('react-router-dom', () => ({
    useLocation: () => ({
        state: {
            firstName: 'Test',
            lastName: 'User',
            displayName: 'userName',
            location: 'location',
        },
    }),
    useNavigate: () => ({}),
}));

describe('Teams', () => {
    it('should render spinner while loading', async () => {
        render(<Teams />);

        expect(screen.getByTestId('spinner')).toBeInTheDocument();
    });

    it('should render error message when API fails', async () => {
        jest.spyOn(API, 'getTeams').mockRejectedValue('error');

        render(<Teams />);

        expect(await screen.findByText('Some error occurred')).toBeInTheDocument();
    });

    it('should render teams list', async () => {
        jest.spyOn(API, 'getTeams').mockResolvedValue([
            {
                id: '1',
                name: 'Team1',
            },
            {
                id: '2',
                name: 'Team2',
            },
        ]);

        render(<Teams />);

        await waitFor(() => {
            expect(screen.getByText('Team1')).toBeInTheDocument();
        });

        expect(screen.getByText('Team2')).toBeInTheDocument();
        expect(screen.getByText('Teams')).toBeInTheDocument();
    });

    it('should not render the back button', async () => {
        jest.spyOn(API, 'getTeams').mockResolvedValue([
            {
                id: '1',
                name: 'Team1',
            },
            {
                id: '2',
                name: 'Team2',
            },
        ]);

        render(<Teams />);

        expect(await screen.findByText('Team1')).toBeInTheDocument();

        expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('should filter teams by name', async () => {
        jest.spyOn(API, 'getTeams').mockResolvedValue([
            {
                id: '1',
                name: 'Team1',
            },
            {
                id: '2',
                name: 'Team2',
            },
        ]);

        render(<Teams />);

        expect(await screen.findByText('Team1')).toBeInTheDocument();
        expect(screen.getByText('Team2')).toBeInTheDocument();

        const input = screen.getByRole('textbox');
        fireEvent.change(input, {target: {value: 'Team1'}});

        expect(screen.queryByText('Team2')).not.toBeInTheDocument();
    });

    it('should render teams not found message when filtering for a nonexistent team', async () => {
        jest.spyOn(API, 'getTeams').mockResolvedValue([
            {
                id: '1',
                name: 'Team1',
            },
            {
                id: '2',
                name: 'Team2',
            },
        ]);

        render(<Teams />);

        expect(await screen.findByText('Team1')).toBeInTheDocument();
        expect(screen.getByText('Team2')).toBeInTheDocument();

        const input = screen.getByRole('textbox');
        fireEvent.change(input, {target: {value: 'Team3'}});

        expect(screen.getByText('No teams found')).toBeInTheDocument();
    });
});
