import areaService from '../areas/area.service.js';

class UserAreaController {
    async assignArea(req, res) {
        try {
            const { userId } = req.params;
            const { areaId } = req.body;

            const result = await areaService.assignArea(userId, areaId);
            res.json({
                success: true,
                ...result
            });
        } catch (error) {
            console.error('Error assigning area to user:', error);
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    async removeArea(req, res) {
        try {
            const { userId, areaId } = req.params;

            const result = await areaService.removeArea(userId, areaId);
            res.json({
                success: true,
                ...result
            });
        } catch (error) {
            console.error('Error removing area from user:', error);
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
}

export default new UserAreaController();
