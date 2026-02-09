import axiosInstance from '../../../api/axiosConfig.js';

const impersonateService = {
    /**
     * Inicia la personificación de un usuario
     * @param {number} userId - ID del usuario a personificar
     * @returns {Promise} - Respuesta con token y datos del usuario
     */
    impersonateUser: async (userId) => {
        const response = await axiosInstance.post(`/users/${userId}/impersonate`);
        return response.data;
    },

    /**
     * Termina la sesión de personificación
     * @returns {Promise} - Respuesta con token y datos del usuario original
     */
    leaveImpersonation: async () => {
        const response = await axiosInstance.post('/auth/leave-impersonation');
        return response.data;
    },

    /**
     * Verifica si se puede personificar a un usuario
     * @param {number} userId - ID del usuario a verificar
     * @returns {Promise} - Respuesta con información de si se puede personificar
     */
    canImpersonate: async (userId) => {
        const response = await axiosInstance.get(`/users/${userId}/can-impersonate`);
        return response.data;
    },
};

export default impersonateService;
