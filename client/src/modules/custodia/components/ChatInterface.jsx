import { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  IconButton,
  CircularProgress,
  Chip,
  Tooltip,
  Divider,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import SourceIcon from '@mui/icons-material/Article';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import custodiaService from '../services/custodiaService';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMessage = {
      role: 'user',
      content: trimmed,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const response = await custodiaService.sendMessage(trimmed, conversationId);
      if (response.data?.conversationId) {
        setConversationId(response.data.conversationId);
      }
      const assistantMessage = {
        role: 'assistant',
        content: response.data?.answer || 'No se pudo obtener respuesta.',
        sources: response.data?.sources || [],
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Error sending message:', err);
      setError('El backend de Custodia Digital aún no está implementado. Esta es una vista previa de la interfaz.');
      const errorMessage = {
        role: 'assistant',
        content: 'Lo siento, no pude procesar tu consulta. El servicio de Custodia Digital aún no está conectado al backend.',
        sources: [],
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    setConversationId(null);
    setError(null);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 340px)', minHeight: 400 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SmartToyIcon sx={{ color: 'primary.main' }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Asistente de Custodia Digital
          </Typography>
        </Box>
        {messages.length > 0 && (
          <Tooltip title="Limpiar conversación">
            <IconButton size="small" onClick={handleClearChat} sx={{ color: 'text.secondary' }}>
              <DeleteSweepIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {/* Messages Area */}
      <Paper
        elevation={0}
        sx={{
          flex: 1,
          overflow: 'auto',
          border: 1,
          borderColor: 'divider',
          borderRadius: 2,
          p: 2,
          mb: 2,
          bgcolor: 'grey.50',
        }}
      >
        {messages.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              gap: 2,
              opacity: 0.7,
            }}
          >
            <SmartToyIcon sx={{ fontSize: 64, color: 'grey.300' }} />
            <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 600 }}>
              Consulte sus documentos
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', maxWidth: 400 }}>
              Haga preguntas en lenguaje natural sobre los documentos subidos a su empresa.
              La IA buscará entre sus archivos y le dará respuestas precisas.
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center', mt: 1 }}>
              {[
                '¿Cuántos contratos nuevos hubo en agosto 2025?',
                '¿Cuál es la política de retención documental?',
                'Resume el informe de gestión del último trimestre',
              ].map((suggestion, i) => (
                <Chip
                  key={i}
                  label={suggestion}
                  variant="outlined"
                  size="small"
                  onClick={() => setInput(suggestion)}
                  sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'primary.50', borderColor: 'primary.main' } }}
                />
              ))}
            </Box>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {messages.map((msg, idx) => (
              <Box
                key={idx}
                sx={{
                  display: 'flex',
                  gap: 1.5,
                  flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                }}
              >
                {/* Avatar */}
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: msg.role === 'user' ? 'primary.main' : 'grey.200',
                    color: msg.role === 'user' ? 'white' : 'text.primary',
                    flexShrink: 0,
                  }}
                >
                  {msg.role === 'user' ? <PersonIcon fontSize="small" /> : <SmartToyIcon fontSize="small" />}
                </Box>

                {/* Message Bubble */}
                <Box sx={{ maxWidth: '75%' }}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: msg.role === 'user' ? 'primary.main' : 'background.paper',
                      color: msg.role === 'user' ? 'white' : 'text.primary',
                      border: msg.role === 'assistant' ? 1 : 0,
                      borderColor: 'divider',
                    }}
                  >
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                      {msg.content}
                    </Typography>
                  </Paper>

                  {/* Sources */}
                  {msg.sources && msg.sources.length > 0 && (
                    <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {msg.sources.map((src, srcIdx) => (
                        <Tooltip key={srcIdx} title={src.chunkContent?.substring(0, 200) || ''}>
                          <Chip
                            icon={<SourceIcon sx={{ fontSize: '14px !important' }} />}
                            label={src.fileName || `Fuente ${srcIdx + 1}`}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: '0.7rem', height: 24 }}
                          />
                        </Tooltip>
                      ))}
                    </Box>
                  )}

                  <Typography variant="caption" color={msg.role === 'user' ? 'primary.100' : 'text.disabled'} sx={{ mt: 0.5, display: 'block' }}>
                    {new Date(msg.createdAt).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                  </Typography>
                </Box>
              </Box>
            ))}

            {loading && (
              <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'grey.200',
                    flexShrink: 0,
                  }}
                >
                  <SmartToyIcon fontSize="small" />
                </Box>
                <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: 1, borderColor: 'divider' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={16} />
                    <Typography variant="body2" color="text.secondary">
                      Buscando en sus documentos...
                    </Typography>
                  </Box>
                </Paper>
              </Box>
            )}

            <div ref={messagesEndRef} />
          </Box>
        )}
      </Paper>

      {/* Input Area */}
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
        <TextField
          fullWidth
          multiline
          maxRows={3}
          size="small"
          placeholder="Escriba su pregunta sobre los documentos..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          disabled={loading}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
            },
          }}
        />
        <IconButton
          onClick={handleSend}
          disabled={!input.trim() || loading}
          sx={{
            bgcolor: 'primary.main',
            color: 'white',
            '&:hover': { bgcolor: 'primary.dark' },
            '&.Mui-disabled': { bgcolor: 'grey.200', color: 'grey.400' },
            width: 40,
            height: 40,
          }}
        >
          <SendIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
};

export default ChatInterface;
