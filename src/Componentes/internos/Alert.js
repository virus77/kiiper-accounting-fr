import React from 'react';
import { Alert } from 'react-bootstrap';

export default function AlertDismissible(props) {
    if (props.valor) {
        return (
            <>
                <Alert variant="success"> {props.texto} </Alert>
            </>
        );
    }
    else {
        return (<> </>);
    }
}