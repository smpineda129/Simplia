import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  CardActionArea,
  Grid,
  Chip,
} from '@mui/material';
import { Folder, ArrowBack } from '@mui/icons-material';

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
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#f5f5f5',
        p: 2,
      }}
    >
      <Paper sx={{ maxWidth: 700, width: '100%', p: 4 }}>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Portal de Expedientes
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {/* Step 1: Email */}
        {step === 'email' && (
          <Box>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
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
              onClick={requestOtp}
              disabled={loading || !email}
            >
              {loading ? <CircularProgress size={22} /> : 'Enviar código'}
            </Button>
          </Box>
        )}

        {/* Step 2: OTP */}
        {step === 'otp' && (
          <Box>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Ingresa el código de 6 dígitos enviado a <strong>{email}</strong>.
            </Typography>
            <TextField
              label="Código de acceso"
              fullWidth
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && verifyOtp()}
              inputProps={{ maxLength: 6 }}
              sx={{ mb: 2 }}
            />
            <Button variant="contained" fullWidth onClick={verifyOtp} disabled={loading || otp.length < 6}>
              {loading ? <CircularProgress size={22} /> : 'Verificar'}
            </Button>
            <Button fullWidth sx={{ mt: 1 }} onClick={() => { setStep('email'); setError(''); }}>
              Volver
            </Button>
          </Box>
        )}

        {/* Step 3: Proceedings list */}
        {step === 'list' && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Expedientes compartidos contigo
            </Typography>
            {proceedings.length === 0 ? (
              <Typography color="text.secondary">No tienes expedientes compartidos.</Typography>
            ) : (
              <Grid container spacing={2}>
                {proceedings.map((p) => (
                  <Grid item xs={12} sm={6} key={p.id}>
                    <Card variant="outlined">
                      <CardActionArea onClick={() => loadDetail(p.id)}>
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Folder color="primary" />
                            <Typography fontWeight={600} noWrap>{p.name}</Typography>
                          </Box>
                          <Typography variant="body2" color="text.secondary">{p.code}</Typography>
                          <Typography variant="caption" color="text.secondary">{p.company?.name}</Typography>
                          <Box sx={{ mt: 1 }}>
                            <Chip
                              label={loanLabel[p.loan] || p.loan}
                              size="small"
                              color={p.loan === 'loaned' ? 'warning' : 'default'}
                            />
                          </Box>
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
              sx={{ mb: 2 }}
            >
              Volver
            </Button>
            <Typography variant="h6" gutterBottom>{selected.name}</Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Código: {selected.code} · {selected.company?.name}
            </Typography>
            {loading ? (
              <CircularProgress />
            ) : (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Documentos
                </Typography>
                {!selected.documents || selected.documents.length === 0 ? (
                  <Typography color="text.secondary">Sin documentos</Typography>
                ) : (
                  selected.documents.map((doc) => (
                    <Box
                      key={doc.id}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        p: 1.5,
                        border: '1px solid #e0e0e0',
                        borderRadius: 1,
                        mb: 1,
                      }}
                    >
                      <Typography variant="body2">{doc.file_original_name || doc.name}</Typography>
                      {doc.url && (
                        <Button
                          size="small"
                          variant="outlined"
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Descargar
                        </Button>
                      )}
                    </Box>
                  ))
                )}
              </Box>
            )}
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default ExternalPortal;
