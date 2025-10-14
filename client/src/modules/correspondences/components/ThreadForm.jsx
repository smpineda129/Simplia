import { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Alert,
} from '@mui/material';
import * as Yup from 'yup';

const threadSchema = Yup.object().shape({
  message: Yup.string()
    .required('El mensaje es requerido')
    .min(1, 'El mensaje no puede estar vacío')
    .max(2000, 'Máximo 2000 caracteres'),
});

const ThreadForm = ({ open, onClose, onSave, thread }) => {
  const [error, setError] = useState('');

  const initialValues = {
    message: thread?.message || '',
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setError('');
      await onSave(values);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar el hilo');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {thread ? 'Editar Hilo' : 'Nuevo Hilo de Conversación'}
      </DialogTitle>

      <Formik
        initialValues={initialValues}
        validationSchema={threadSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ errors, touched, isSubmitting }) => (
          <Form>
            <DialogContent>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              <Field
                as={TextField}
                name="message"
                label="Mensaje *"
                fullWidth
                multiline
                rows={6}
                error={touched.message && Boolean(errors.message)}
                helperText={touched.message && errors.message}
                placeholder="Escribe tu mensaje aquí..."
              />
            </DialogContent>

            <DialogActions>
              <Button onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" variant="contained" disabled={isSubmitting}>
                {isSubmitting ? 'Guardando...' : 'Guardar'}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default ThreadForm;
