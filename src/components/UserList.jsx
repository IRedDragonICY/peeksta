import React from 'react';
import styled from 'styled-components';

const SearchInput = styled.input`
  width: 100%;
  padding: 0.8rem;
  margin-bottom: 1rem;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }

  @media (prefers-color-scheme: dark) {
    background-color: #1e1e1e;
    border-color: #333;
    color: #e0e0e0;
  }
`;

const UserListContainer = styled.div`
  max-height: 400px;
  overflow-y: auto;

  ul {
    list-style: none;
    padding: 0;
    margin-top: 1rem;
  }

  li {
    padding: 0.5rem 0;
  }

  a {
    font-size: 1.1rem;
  }
`;

export function UserList({ users, searchTerm, onSearchChange }) {
    const filteredUsers = users.filter((username) =>
        username.includes(searchTerm)
    );

    if (users.length === 0) {
        return <p className="no-users">All users are following you back!</p>;
    }

    return (
        <>
            <SearchInput
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value.toLowerCase())}
            />
            <UserListContainer>
                <ul>
                    {filteredUsers.map((username) => (
                        <li key={username}>
                            <a
                                href={`https://www.instagram.com/${username}/`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {username}
                            </a>
                        </li>
                    ))}
                </ul>
            </UserListContainer>
        </>
    );
}
