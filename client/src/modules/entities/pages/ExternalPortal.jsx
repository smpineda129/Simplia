import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  CardActionArea,
  Chip,
  Grid,
} from '@mui/material';
import { Folder, ArrowBack, Email, Lock, Visibility, VisibilityOff, Download, Description } from '@mui/icons-material';
import PublicNavbar from '../../../components/public/PublicNavbar';

const API_URL = import.meta.env.VITE_API_URL || '/api';
const externalApi = axios.create({ baseURL: API_URL });

const ExternalPortal = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState('email'); // 'email' | 'otp' | 'list' | 'detail'
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [token, setToken] = useState('');
  const [proceedings, setProceedings] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const requestOtp = async () => {
    if (!email) return;
    setLoading(true);
    setError('');
    try {
      await externalApi.post('/external/request-otp', { email });
      setStep('otp');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al enviar código');
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp) return;
    setLoading(true);
    setError('');
    try {
      const res = await externalApi.post('/external/verify-otp', { email, code: otp });
      const t = res.data.token;
      setToken(t);
      // Load proceedings
      const procRes = await externalApi.get('/external/proceedings', {
        headers: { Authorization: `Bearer ${t}` },
      });
      setProceedings(procRes.data.data || []);
      setStep('list');
    } catch (err) {
      setError(err.response?.data?.message || 'Código incorrecto o expirado');
    } finally {
      setLoading(false);
    }
  };

  const loadDetail = async (id) => {
    setLoading(true);
    setError('');
    try {
      const res = await externalApi.get(`/external/proceedings/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelected(res.data.data);
      setStep('detail');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar expediente');
    } finally {
      setLoading(false);
    }
  };

  const loanLabel = { custody: 'En custodia', loaned: 'Prestado', returned: 'Devuelto' };

  return (
    <>
      <PublicNavbar />
      <Box sx={{ minHeight: '100vh', bgcolor: '#F8FAFC' }}>
        {/* Header azul decorativo */}
      <Box
        sx={{
          background: 'linear-gradient(155deg, #0F172A 0%, #1a3054 45%, #1D4ED8 100%)',
          py: 4,
          px: 3,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative circles */}
        <Box
          sx={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: 200,
            height: 200,
            borderRadius: '50%',
            bgcolor: 'rgba(255,255,255,0.05)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -30,
            left: -30,
            width: 150,
            height: 150,
            borderRadius: '50%',
            bgcolor: 'rgba(255,255,255,0.03)',
          }}
        />
        
        <Box sx={{ maxWidth: 900, mx: 'auto', position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: 2,
                bgcolor: 'rgba(255,255,255,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Folder sx={{ fontSize: 32, color: '#fff' }} />
            </Box>
            <Box>
              <Typography variant="h4" fontWeight={700} sx={{ color: '#fff', letterSpacing: '-0.02em' }}>
                Portal de Expedientes
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9375rem' }}>
                Acceso seguro a tus documentos
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Content */}
      <Box sx={{ maxWidth: 900, mx: 'auto', px: 3, py: 4 }}>
        <Paper 
          elevation={0}
          sx={{ 
            p: 4,
            borderRadius: 2,
            background: '#ffffff',
            border: '1px solid #E2E8F0',
          }}
        >

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {/* Step 1: Email */}
        {step === 'email' && (
          <Box>
            <Typography sx={{ color: '#64748B', fontSize: '0.9375rem', mb: 3 }}>
              Ingresa tu correo electrónico para recibir un código de acceso.
            </Typography>
            <TextField
              label="Correo electrónico"
              type="email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && requestOtp()}
              sx={{ mb: 2 }}
            />
            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={requestOtp}
              disabled={loading || !email}
              sx={{ py: 1.5, fontWeight: 600 }}
            >
              {loading ? <CircularProgress size={22} color="inherit" /> : 'Enviar código'}
            </Button>
          </Box>
        )}

        {/* Step 2: OTP */}
        {step === 'otp' && (
          <Box>
            <Typography sx={{ color: '#64748B', fontSize: '0.9375rem', mb: 1 }}>
              Ingresa el código de 6 dígitos enviado a
            </Typography>
            <Typography sx={{ mb: 3, fontWeight: 600, color: '#0F172A' }}>
              {email}
            </Typography>
            <TextField
              label="Código de acceso"
              fullWidth
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && verifyOtp()}
              inputProps={{ 
                maxLength: 6,
                style: { textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.5rem', fontWeight: 600 }
              }}
              sx={{ mb: 2 }}
            />
            <Button 
              variant="contained" 
              fullWidth 
              size="large"
              onClick={verifyOtp} 
              disabled={loading || otp.length < 6}
              sx={{ py: 1.5, fontWeight: 600, mb: 1 }}
            >
              {loading ? <CircularProgress size={22} color="inherit" /> : 'Verificar'}
            </Button>
            <Button fullWidth onClick={() => { setStep('email'); setError(''); }}>
              Volver
            </Button>
          </Box>
        )}

        {/* Step 3: Proceedings list */}
        {step === 'list' && (
          <Box>
            <Typography variant="h6" fontWeight={700} sx={{ color: '#0F172A', mb: 0.5 }}>
              Expedientes compartidos
            </Typography>
            <Typography sx={{ color: '#64748B', fontSize: '0.9375rem', mb: 3 }}>
              Selecciona un expediente para ver sus documentos
            </Typography>
            {proceedings.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Folder sx={{ fontSize: 64, color: '#CBD5E1', mb: 2 }} />
                <Typography sx={{ color: '#64748B', fontSize: '1rem' }}>No tienes expedientes compartidos.</Typography>
              </Box>
            ) : (
              <Grid container spacing={2}>
                {proceedings.map((p) => (
                  <Grid item xs={12} sm={6} key={p.id}>
                    <Card 
                      variant="outlined"
                      sx={{
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        height: '100%',
                        '&:hover': {
                          borderColor: 'primary.main',
                          bgcolor: '#F8FAFC',
                          transform: 'translateY(-2px)',
                          boxShadow: 1,
                        },
                      }}
                    >
                      <CardActionArea onClick={() => loadDetail(p.id)} sx={{ height: '100%' }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 2 }}>
                            <Box
                              sx={{
                                width: 44,
                                height: 44,
                                borderRadius: 2,
                                bgcolor: '#EEF2FF',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                              }}
                            >
                              <Folder sx={{ fontSize: 24, color: '#6366F1' }} />
                            </Box>
                            <Box flex={1} sx={{ minWidth: 0 }}>
                              <Typography fontWeight={600} sx={{ color: '#0F172A', fontSize: '1rem', mb: 0.5 }}>
                                {p.name}
                              </Typography>
                              <Typography variant="body2" sx={{ color: '#64748B', mb: 0.5 }}>
                                {p.code}
                              </Typography>
                              <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                                {p.company?.name}
                              </Typography>
                            </Box>
                          </Box>
                          <Chip
                            label={loanLabel[p.loan] || p.loan}
                            size="small"
                            color={p.loan === 'loaned' ? 'warning' : 'default'}
                            sx={{ fontWeight: 500 }}
                          />
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        )}

        {/* Step 4: Proceeding detail */}
        {step === 'detail' && selected && (
          <Box>
            <Button
              startIcon={<ArrowBack />}
              onClick={() => { setStep('list'); setSelected(null); }}
              sx={{ mb: 3 }}
            >
              Volver
            </Button>
            <Box 
              sx={{ 
                mb: 3, 
                p: 3, 
                borderRadius: 2,
                bgcolor: '#F8FAFC',
                border: '1px solid #E2E8F0',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    bgcolor: '#EEF2FF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Folder sx={{ fontSize: 24, color: '#6366F1' }} />
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight={700} sx={{ color: '#0F172A', mb: 0.5 }}>
                    {selected.name}
                  </Typography>
                  <Typography sx={{ color: '#64748B', fontSize: '0.9375rem' }}>
                    {selected.code} · {selected.company?.name}
                  </Typography>
                </Box>
              </Box>
            </Box>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                <CircularProgress />
              </Box>
            ) : (
              <Box>
                <Typography variant="h6" fontWeight={600} sx={{ color: '#0F172A', mb: 3 }}>
                  Documentos
                </Typography>
                {!selected.documents || selected.documents.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Description sx={{ fontSize: 64, color: '#CBD5E1', mb: 2 }} />
                    <Typography sx={{ color: '#64748B', fontSize: '1rem' }}>Sin documentos disponibles</Typography>
                  </Box>
                ) : (
                  <Grid container spacing={2}>
                    {selected.documents.map((doc) => (
                      <Grid item xs={12} key={doc.id}>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            p: 2.5,
                            border: '1px solid #E2E8F0',
                            borderRadius: 2,
                            transition: 'all 0.2s',
                            '&:hover': {
                              borderColor: '#CBD5E1',
                              bgcolor: '#F8FAFC',
                              boxShadow: 1,
                            },
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, minWidth: 0 }}>
                            <Box
                              sx={{
                                width: 40,
                                height: 40,
                                borderRadius: 1.5,
                                bgcolor: '#EEF2FF',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                              }}
                            >
                              <Description sx={{ color: '#6366F1', fontSize: 20 }} />
                            </Box>
                            <Typography 
                              sx={{ 
                                color: '#0F172A', 
                                fontSize: '0.9375rem', 
                                fontWeight: 500,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {doc.file_original_name || doc.name}
                            </Typography>
                          </Box>
                          {doc.url && (
                            <Button
                              variant="contained"
                              startIcon={<Download />}
                              href={doc.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              sx={{ flexShrink: 0 }}
                            >
                              Descargar
                            </Button>
                          )}
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Box>
            )}
          </Box>
        )}
        </Paper>
      </Box>
      </Box>
    </>
  );
};

export default ExternalPortal;
