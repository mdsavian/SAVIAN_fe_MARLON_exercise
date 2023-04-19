import * as React from 'react';
import {ListItem} from 'types';
import Card from '../Card';
import {Spinner} from '../Spinner';
import {Container, EmptyMessage} from './styles';

interface Props {
    items?: ListItem[];
    hasNavigation?: boolean;
    isLoading: boolean;
    emptyMessage: string;
}

const List: React.FC<Props> = ({items, hasNavigation = true, isLoading, emptyMessage}) => {
    return (
        <Container>
            {isLoading && <Spinner />}

            {!isLoading &&
                !!items.length &&
                items.map(({url, id, columns, navigationProps}, index) => {
                    return (
                        <Card
                            key={`${id}-${index}`}
                            id={id}
                            columns={columns}
                            navigationProps={navigationProps}
                            hasNavigation={hasNavigation}
                            url={url}
                        />
                    );
                })}
            {!isLoading && !items.length && <EmptyMessage>{emptyMessage}</EmptyMessage>}
        </Container>
    );
};

export default List;
