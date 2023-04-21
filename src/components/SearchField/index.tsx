import React, {Dispatch, SetStateAction} from 'react';
import {InputSearch, SearchTitle} from './styles';

interface Props {
    setSearchTerm: Dispatch<SetStateAction<string>>;
}

const SearchField: React.FC<Props> = ({setSearchTerm}) => {
    return (
        <React.Fragment>
            <SearchTitle>Search by name</SearchTitle>
            <InputSearch
                id="search-input"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setSearchTerm(e.target.value);
                }}
            />
        </React.Fragment>
    );
};

export default SearchField;
