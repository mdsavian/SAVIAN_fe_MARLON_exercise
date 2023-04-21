import * as React from 'react';
import {ListItem, Teams as TeamsList} from 'types';
import {getTeams as fetchTeams} from '../api';
import Header from '../components/Header';
import List from '../components/List';
import {Container} from '../components/GlobalComponents';
import SearchField from '../components/SearchField';
import {WarningMessage} from './styles';

const MapTeamsList = (teams: TeamsList[]): ListItem[] => {
    return teams.map(team => {
        const columns = [
            {
                key: 'Name:',
                value: team.name,
            },
        ];
        return {
            id: team.id,
            url: `/team/${team.id}`,
            columns,
            navigationProps: team,
        } as ListItem;
    });
};

const Teams: React.FC = () => {
    const [teams, setTeams] = React.useState<TeamsList[]>([]);
    const [hasError, setHasError] = React.useState<boolean>(false);
    const [isLoading, setIsLoading] = React.useState<boolean>(true);

    const [searchTerm, setSearchTerm] = React.useState<string>('');

    const filteredTeams = !searchTerm
        ? teams
        : teams.filter(team => team.name.toLowerCase().includes(searchTerm.toLowerCase()));

    React.useEffect(() => {
        const getTeams = async () => {
            setIsLoading(true);

            fetchTeams()
                .then(response => {
                    setHasError(false);
                    setTeams(response);
                })
                .catch(() => {
                    setHasError(true);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        };
        getTeams();
    }, []);

    return (
        <Container>
            <Header title="Teams" showBackButton={false} />

            <SearchField setSearchTerm={setSearchTerm} />
            {hasError && <WarningMessage>Some error occurred</WarningMessage>}

            <List
                items={MapTeamsList(filteredTeams)}
                isLoading={isLoading}
                emptyMessage="No teams found"
            />
        </Container>
    );
};

export default Teams;
