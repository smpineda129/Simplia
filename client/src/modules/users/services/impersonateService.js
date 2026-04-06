import axiosInstance from '../../../api/axiosConfig.js';

const impersonateService = {
    /**
     * Inicia la personificación de un usuario
     * @param {string} email - Email del usuario a personificar
     * @returns {Promise} - Respuesta con token y datos del usuario
     */
    impersonateUser: async (email) => {
        const response = await axiosInstance.post('/users/impersonate', { email });
        return response.data;
    },
};

export default impersonateService;
