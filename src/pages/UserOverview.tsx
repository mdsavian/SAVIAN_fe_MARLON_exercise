import * as React from 'react';
import {useLocation} from 'react-router-dom';
import {UserData} from 'types';
import Card from '../components/Card';
import {Container} from '../components/GlobalComponents';
import Header from '../components/Header';
import {mapUserColumns} from './mapUserColumns';

const UserOverview = () => {
    const location = useLocation();
    const user: UserData = location.state;

    return (
        <Container>
            <Header title={`User ${user.firstName} ${user.lastName}`} />

            <Card columns={mapUserColumns(user)} hasNavigation={false} navigationProps={user} />
        </Container>
    );
};

export default UserOverview;
