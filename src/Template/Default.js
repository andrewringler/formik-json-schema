import React from 'react';
import Label from '../Field/Label';
import ErrorMessage from '../Field/ErrorMessage';

const styles = ( disabled ) => disabled ? { pointerEvents: 'none', opacity: 0.6 } : {};

const Default = ({
    disabled = false,
    name,
    label,
    error,
    labelClass = '',
    formGroupClass = 'form-group',
    children
}) => (
    <div className={ formGroupClass } style={ styles(disabled) }>
        { label && <Label htmlFor={ name } className={ labelClass }>{ label }</Label> }
        { children }
        <ErrorMessage name={ name } error={ error } />
    </div>
);

export default Default;
