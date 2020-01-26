import React from 'react';
import {Link} from 'react-router-dom';

export const LinksList = ({ links }) => {
    if(links.length === 0) {
        return <p className="center">Links not found</p>
    }
    return (
        <table>
            <thead>
                <tr>
                    <th>№</th>
                    <th>Original</th>
                    <th>Short</th>
                    <th>Open</th>
                </tr>
            </thead>

            <tbody>
                { links.map(({from, to, _id}, indx) => {
                    return (
                        <tr key={_id}>
                            <td>{indx + 1}</td>
                            <td>{from}</td>
                            <td>{to}</td>
                            <td>
                                <Link to={`/detail/${_id}`}>Open</Link>
                            </td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    )
};