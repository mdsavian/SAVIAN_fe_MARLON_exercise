import {UserData} from 'types';

export const mapUserColumns = (user: UserData) => {
    return [
        {
            key: 'Name:',
            value: `${user.firstName} ${user.lastName}`,
        },
        {
            key: 'Display Name:',
            value: user.displayName,
        },
        {
            key: 'Location:',
            value: user.location,
        },
    ];
};
