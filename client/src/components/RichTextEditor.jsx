import { useMemo } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Box } from '@mui/material';

const RichTextEditor = ({ value, onChange, placeholder, height = '300px', helpers = [] }) => {
  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'font': [] }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'align': [] }],
      ['blockquote', 'code-block'],
      ['link', 'image'],
      ['clean']
    ],
  }), []);

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'script',
    'list', 'bullet', 'indent',
    'align',
    'blockquote', 'code-block',
    'link', 'image'
  ];

  const handleHelperClick = (helper) => {
    const currentValue = value || '';
    const newValue = currentValue + ` ${helper}`;
    onChange(newValue);
  };

  return (
    <Box>
      <ReactQuill
        theme="snow"
        value={value || ''}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        style={{ height, marginBottom: helpers.length > 0 ? '60px' : '50px' }}
      />
      {helpers.length > 0 && (
        <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {helpers.map((helper, index) => (
            <Box
              key={index}
              onClick={() => handleHelperClick(helper)}
              sx={{
                px: 1.5,
                py: 0.5,
                bgcolor: 'primary.light',
                color: 'primary.contrastText',
                borderRadius: 1,
                cursor: 'pointer',
                fontSize: '0.875rem',
                '&:hover': {
                  bgcolor: 'primary.main',
                },
              }}
            >
              {helper}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default RichTextEditor;
