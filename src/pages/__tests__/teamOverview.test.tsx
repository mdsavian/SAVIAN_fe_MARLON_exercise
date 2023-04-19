import * as React from 'react';
import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import {TeamOverview as TeamOverviewType, UserData} from 'types';
import * as API from '../../api';
import TeamOverview from '../TeamOverview';

jest.mock('react-router-dom', () => ({
    useLocation: () => ({
        state: {
            name: 'Some Team',
        },
    }),
    useNavigate: () => ({}),
    useParams: () => ({
        teamId: '1',
    }),
}));

describe('TeamOverview', () => {
    it('should render team name and back button', async () => {
        render(<TeamOverview />);

        expect(screen.getByText('Team Some Team')).toBeInTheDocument();
        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should render loading spinner', async () => {
        render(<TeamOverview />);

        expect(screen.getByTestId('spinner')).toBeInTheDocument();
    });

    it('should render team overview users and team lead', async () => {
        const mockTeamOverview: TeamOverviewType = {
            id: '1',
            teamLeadId: '2',
            teamMemberIds: ['3', '4', '5'],
        };

        const mockTeamLead: UserData = {
            id: '2',
            firstName: 'John',
            lastName: 'Doe',
            displayName: 'johnDoe',
            location: 'Brazil',
            avatar: '',
        };

        const mockUserDataFirst: UserData = {
            id: '3',
            firstName: 'User',
            lastName: 'First',
            displayName: 'userFirst',
            location: 'Brazil',
            avatar: '',
        };

        const mockUserDataSecond: UserData = {
            id: '4',
            firstName: 'User',
            lastName: 'Second',
            displayName: 'userSecond',
            location: 'Brazil',
            avatar: '',
        };

        const mockUserDataThird: UserData = {
            id: '5',
            firstName: 'User',
            lastName: 'Third',
            displayName: 'userThird',
            location: 'Brazil',
            avatar: '',
        };

        jest.spyOn(API, 'getTeamOverview').mockResolvedValue(mockTeamOverview);

        jest.spyOn(API, 'getUserData').mockImplementation((userid: string) => {
            if (userid === '3') {
                return Promise.resolve(mockUserDataFirst);
            } else if (userid === '4') {
                return Promise.resolve(mockUserDataSecond);
            } else if (userid === '5') {
                return Promise.resolve(mockUserDataThird);
            }

            return Promise.resolve(mockTeamLead);
        });

        render(<TeamOverview />);

        await waitFor(() => {
            expect(screen.getByText('John Doe')).toBeInTheDocument();
        });

        expect(screen.getByText('User First')).toBeInTheDocument();
        expect(screen.getByText('User Second')).toBeInTheDocument();
        expect(screen.getByText('User Third')).toBeInTheDocument();
    });

    it('should filter users by name', async () => {
        const mockTeamOverview: TeamOverviewType = {
            id: '1',
            teamLeadId: '2',
            teamMemberIds: ['3', '4', '5'],
        };

        const mockTeamLead: UserData = {
            id: '2',
            firstName: 'John',
            lastName: 'Doe',
            displayName: 'johnDoe',
            location: 'Brazil',
            avatar: '',
        };

        const mockUserDataFirst: UserData = {
            id: '3',
            firstName: 'User',
            lastName: 'First',
            displayName: 'userFirst',
            location: 'Brazil',
            avatar: '',
        };

        const mockUserDataSecond: UserData = {
            id: '4',
            firstName: 'User',
            lastName: 'Second',
            displayName: 'userSecond',
            location: 'Brazil',
            avatar: '',
        };

        const mockUserDataThird: UserData = {
            id: '5',
            firstName: 'User',
            lastName: 'Third',
            displayName: 'userThird',
            location: 'Brazil',
            avatar: '',
        };

        jest.spyOn(API, 'getTeamOverview').mockResolvedValue(mockTeamOverview);

        jest.spyOn(API, 'getUserData').mockImplementation((userid: string) => {
            if (userid === '3') {
                return Promise.resolve(mockUserDataFirst);
            } else if (userid === '4') {
                return Promise.resolve(mockUserDataSecond);
            } else if (userid === '5') {
                return Promise.resolve(mockUserDataThird);
            }

            return Promise.resolve(mockTeamLead);
        });

        render(<TeamOverview />);

        await waitFor(() => {
            expect(screen.getByText('John Doe')).toBeInTheDocument();
        });

        const input = screen.getByRole('textbox');
        fireEvent.change(input, {target: {value: 'third'}});

        expect(screen.queryByText('User First')).not.toBeInTheDocument();
        expect(screen.queryByText('User Second')).not.toBeInTheDocument();
    });

    it('should render user not found message when filtering for a nonexistent user', async () => {
        const mockTeamOverview: TeamOverviewType = {
            id: '1',
            teamLeadId: '2',
            teamMemberIds: ['3'],
        };

        const mockTeamLead: UserData = {
            id: '2',
            firstName: 'John',
            lastName: 'Doe',
            displayName: 'johnDoe',
            location: 'Brazil',
            avatar: '',
        };

        const mockUserDataFirst: UserData = {
            id: '3',
            firstName: 'User',
            lastName: 'First',
            displayName: 'userFirst',
            location: 'Brazil',
            avatar: '',
        };

        jest.spyOn(API, 'getTeamOverview').mockResolvedValue(mockTeamOverview);

        jest.spyOn(API, 'getUserData').mockImplementation((userid: string) => {
            if (userid === '3') {
                return Promise.resolve(mockUserDataFirst);
            }

            return Promise.resolve(mockTeamLead);
        });

        render(<TeamOverview />);

        await waitFor(() => {
            expect(screen.getByText('John Doe')).toBeInTheDocument();
        });

        const input = screen.getByRole('textbox');
        fireEvent.change(input, {target: {value: 'third'}});

        expect(screen.queryByText('User First')).not.toBeInTheDocument();
        expect(screen.getByText('No users found')).toBeInTheDocument();
    });
});
