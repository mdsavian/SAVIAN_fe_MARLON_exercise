import * as React from 'react';
import {useLocation, useParams} from 'react-router-dom';
import {ListItem, UserData} from 'types';
import {getTeamOverview, getUserData} from '../api';
import Card from '../components/Card';
import {Container} from '../components/GlobalComponents';
import Header from '../components/Header';
import List from '../components/List';
import {mapUserColumns} from './mapUserColumns';
import SearchField from '../components/SearchField';

const mapUsers = (users: UserData[]): ListItem[] => {
    return users.map(user => {
        const columns = mapUserColumns(user);

        return {
            id: user.id,
            url: `/user/${user.id}`,
            columns,
            navigationProps: user,
        };
    }) as ListItem[];
};

const mapTeamLead = (teamLead: UserData): JSX.Element => {
    const columns = [
        {
            key: 'Team Lead',
            value: '',
        },
        ...mapUserColumns(teamLead),
    ];

    return <Card columns={columns} url={`/user/${teamLead.id}`} navigationProps={teamLead} />;
};

interface PageState {
    teamLead?: UserData;
    teamMembers?: UserData[];
}

const TeamOverview = () => {
    const location = useLocation();
    const {teamId} = useParams();
    const [pageData, setPageData] = React.useState<PageState>({});
    const [isLoading, setIsLoading] = React.useState<boolean>(true);

    const [searchTerm, setSearchTerm] = React.useState<string>('');

    const filteredTeamMembers: UserData[] = !searchTerm
        ? pageData.teamMembers
        : pageData.teamMembers.filter(user =>
              `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm)
          );

    React.useEffect(() => {
        const getTeamUsers = async () => {
            const {teamLeadId, teamMemberIds = []} = await getTeamOverview(teamId);

            const teamLead = await getUserData(teamLeadId);

            const newpromises = [];

            for (const teamMemberIdAux of teamMemberIds) {
                newpromises.push(getUserData(teamMemberIdAux));
            }

            const teamMembers = await Promise.all(newpromises);

            setPageData({
                teamLead,
                teamMembers,
            });

            setIsLoading(false);
        };

        getTeamUsers();
    }, [teamId]);

    return (
        <Container>
            <Header title={`Team ${location.state.name}`} />

            <SearchField setSearchTerm={setSearchTerm} />

            {!isLoading && mapTeamLead(pageData.teamLead)}

            <List
                items={mapUsers(filteredTeamMembers ?? [])}
                isLoading={isLoading}
                emptyMessage="No users found"
            />
        </Container>
    );
};

export default TeamOverview;
