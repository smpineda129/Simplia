import { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid, Alert,
  MenuItem, Box, Typography, Checkbox, FormControlLabel, Accordion, AccordionSummary,
  AccordionDetails, Chip, CircularProgress,
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import * as Yup from 'yup';
import permissionService from '../../permissions/services/permissionService';
import { companyService } from '../../companies';

const roleSchema = Yup.object().shape({
  name: Yup.string().required('El nombre es requerido').min(3, 'Mínimo 3 caracteres'),
  roleLevel: Yup.number().nullable().min(1, 'El nivel debe ser al menos 1'),
  companyId: Yup.number().nullable(),
});

const RoleModalForm = ({ open, onClose, onSave, role }) => {
  const [error, setError] = useState('');
  const [companies, setCompanies] = useState([]);
  const [groupedPermissions, setGroupedPermissions] = useState({});
  const [loadingPermissions, setLoadingPermissions] = useState(true);

  useEffect(() => {
    if (open) {
      loadCompanies();
      loadPermissions();
    }
  }, [open]);

  const loadCompanies = async () => {
    try {
      const result = await companyService.getAll({ limit: 100 });
      setCompanies(result.data || []);
    } catch (error) {
      console.error('Error loading companies:', error);
    }
  };

  const loadPermissions = async () => {
    try {
      setLoadingPermissions(true);
      const grouped = await permissionService.getGrouped();
      setGroupedPermissions(grouped);
    } catch (error) {
      console.error('Error loading permissions:', error);
    } finally {
      setLoadingPermissions(false);
    }
  };

  const initialValues = {
    name: role?.name || '',
    roleLevel: role?.roleLevel || '',
    companyId: role?.companyId || '',
    permissions: role?.roleHasPermissions?.map(rp => rp.permission.id) || [],
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setError('');
      await onSave(values);
    } catch (error) {
      setError(error.response?.data?.error || 'Error al guardar el rol');
    } finally {
      setSubmitting(false);
    }
  };

  const getCategoryLabel = (category) => {
    const labels = {
      proceeding: 'Expedientes',
      correspondence: 'Correspondencia',
      document: 'Documentos',
      form: 'Formularios',
      submission: 'Respuestas',
      user: 'Usuarios',
      role: 'Roles',
      permission: 'Permisos',
      company: 'Empresas',
      area: 'Áreas',
      warehouse: 'Bodegas',
      box: 'Cajas',
      entity: 'Entidades',
      retention: 'Tablas de Retención',
      template: 'Plantillas',
      all: 'General',
    };
    return labels[category] || category;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{role ? 'Editar Rol' : 'Crear Rol'}</DialogTitle>
      <Formik
        initialValues={initialValues}
        validationSchema={roleSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, errors, touched, isSubmitting, setFieldValue }) => {
          const isSystemRole = role && !role.companyId;
          return (
            <Form>
              <DialogContent>
                {error && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                  </Alert>
                )}

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      name="name"
                      label="Nombre *"
                      fullWidth
                      error={touched.name && Boolean(errors.name)}
                      helperText={touched.name && errors.name}
                      disabled={isSystemRole}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Field
                      as={TextField}
                      name="roleLevel"
                      label="Nivel de rol *"
                      type="number"
                      fullWidth
                      error={touched.roleLevel && Boolean(errors.roleLevel)}
                      helperText={
                        (touched.roleLevel && errors.roleLevel) ||
                        'El nivel determina la jerarquía. Usa 2 para el nivel más alto.'
                      }
                      disabled={isSystemRole}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Field
                      as={TextField}
                      select
                      name="companyId"
                      label="Empresa"
                      fullWidth
                      error={touched.companyId && Boolean(errors.companyId)}
                      helperText={touched.companyId && errors.companyId}
                      disabled={isSystemRole}
                    >
                      <MenuItem value="">Todas las empresas</MenuItem>
                      {companies.map((company) => (
                        <MenuItem key={company.id} value={company.id}>
                          {company.name} ({company.short})
                        </MenuItem>
                      ))}
                    </Field>
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                      Permisos
                    </Typography>

                    {loadingPermissions ? (
                      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                        <CircularProgress />
                      </Box>
                    ) : (
                      <Box>
                        {Object.keys(groupedPermissions).length === 0 ? (
                          <Alert severity="info">No hay permisos disponibles</Alert>
                        ) : (
                          Object.entries(groupedPermissions).map(([category, permissions]) => (
                            <Accordion key={category} defaultExpanded={category === 'proceeding'}>
                              <AccordionSummary expandIcon={<ExpandMore />}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Typography>{getCategoryLabel(category)}</Typography>
                                  <Chip
                                    label={permissions.filter(p => values.permissions.includes(p.id)).length}
                                    size="small"
                                    color="primary"
                                  />
                                </Box>
                              </AccordionSummary>
                              <AccordionDetails>
                                <Grid container spacing={1}>
                                  {permissions.map((permission) => (
                                    <Grid item xs={12} sm={6} md={4} key={permission.id}>
                                      <FormControlLabel
                                        control={
                                          <Checkbox
                                            checked={values.permissions.includes(permission.id)}
                                            onChange={(e) => {
                                              const newPermissions = e.target.checked
                                                ? [...values.permissions, permission.id]
                                                : values.permissions.filter(id => id !== permission.id);
                                              setFieldValue('permissions', newPermissions);
                                            }}
                                            disabled={isSystemRole}
                                          />
                                        }
                                        label={
                                          <Box>
                                            <Typography variant="body2">
                                              {permission.name.split('.').pop()}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                              {permission.name}
                                            </Typography>
                                          </Box>
                                        }
                                      />
                                    </Grid>
                                  ))}
                                </Grid>
                              </AccordionDetails>
                            </Accordion>
                          ))
                        )}
                      </Box>
                    )}
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={onClose}>Cancelar</Button>
                <Button type="submit" variant="contained" disabled={isSubmitting || isSystemRole}>
                  {isSubmitting ? 'Guardando...' : 'Guardar'}
                </Button>
              </DialogActions>
            </Form>
          );
        }}
      </Formik>
    </Dialog>
  );
};

export default RoleModalForm;
