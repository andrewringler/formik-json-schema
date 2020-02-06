import _ from 'lodash';
import React, { useEffect, useCallback, useState } from 'react';
import { Formik } from 'formik';
import messages from './messages';
import Element from './Element';
import { SchemaProvider } from './withFormConfig';
import { prepareValidationSchema } from './utils';
import Rules from '@flipbyte/yup-schema';

const FormikForm = ({ onUpdate, schema, ...formik }) => {
    /**
     * Callback if provided will be called when form values change
     */
    useEffect(() => {
        if(typeof onUpdate === 'function') {
            onUpdate(formik);
        }
    }, [ formik.values ]);

    return <Element config={ schema } />;
};

const Form = React.forwardRef(({ schema, onUpdate = () => {}, initialValues = {}, prepareValidationSchemaFromValidationProps = true, ...rest }, ref) => {
    const [ validationSchema, setValidationSchema ] = useState(null);
    const formProps = { ...rest, initialValues };

    const initValidationSchema = useCallback(() => {
      if(prepareValidationSchemaFromValidationProps) {
        /**
         * Initialize validation schema.
         *
         * Convert the validation schema rules from yup-schema array to yup object
         */
         const yupSchema = prepareValidationSchema(schema);
         const validationSchema = !_.isEmpty(yupSchema) ? new Rules([[ 'object', yupSchema ]]).toYup() : null;
         setValidationSchema(validationSchema);
      }
    }, [ schema ]);

    /**
     * Everytime the schema changes re-initialize validationSchema
     *
     * This is has to be done everytime schema changes because,
     * certain cases may involve dynamically changing form fields based on
     * certain conditions, routes etc.
     */
    useEffect(() => {
      if(prepareValidationSchemaFromValidationProps) {
        initValidationSchema();
      }
    }, [ schema ]);

    if (prepareValidationSchemaFromValidationProps && null !== validationSchema) {
      formProps.validationSchema = validationSchema;
    }
    
    return (
        <SchemaProvider value={{ validationSchema, schema }}>
            <Formik
                { ...formProps }
                ref={ ref }
                render={(props) => (
                    <FormikForm
                        onUpdate={ onUpdate }
                        schema={ schema }
                        { ...props }
                    />
                )}
            />
        </SchemaProvider>
    );
});

export default Form;
