import * as React from 'react';
import {useNavigate} from 'react-router-dom';
import {ListItemColumn, Teams, UserData} from 'types';
import {Container} from './styles';

interface Props {
    id?: string;
    url?: string;
    columns: Array<ListItemColumn>;
    hasNavigation?: boolean;
    navigationProps?: UserData | Teams;
}

const Card = ({
    id,
    columns,
    url,
    hasNavigation = true,
    navigationProps = null,
}: Props): JSX.Element => {
    const navigate = useNavigate();

    const onNavigate = (e: Event) => {
        if (hasNavigation) {
            navigate(url, {
                state: navigationProps,
            });
        }
        e.preventDefault();
    };

    return (
        <Container
            data-testid={`cardContainer-${id}`}
            hasNavigation={hasNavigation}
            onClick={onNavigate}
        >
            {columns.map(({key: columnKey, value}) => (
                <p key={columnKey}>
                    <strong>{columnKey}</strong>&nbsp;{value}
                </p>
            ))}
        </Container>
    );
};

export default Card;
