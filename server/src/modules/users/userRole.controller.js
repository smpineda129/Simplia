import userRoleService from './userRole.service.js';

class UserRoleController {
  async assignRole(req, res) {
    try {
      const { userId } = req.params;
      const { roleId } = req.body;

      const result = await userRoleService.assignRole(parseInt(userId), parseInt(roleId));
      res.json(result);
    } catch (error) {
      console.error('Error assigning role:', error);
      res.status(400).json({ error: error.message });
    }
  }

  async removeRole(req, res) {
    try {
      const { userId, roleId } = req.params;

      const result = await userRoleService.removeRole(parseInt(userId), parseInt(roleId));
      res.json(result);
    } catch (error) {
      console.error('Error removing role:', error);
      res.status(400).json({ error: error.message });
    }
  }

  async syncRoles(req, res) {
    try {
      const { userId } = req.params;
      const { roleIds } = req.body;

      const result = await userRoleService.syncRoles(
        parseInt(userId),
        roleIds.map(id => parseInt(id))
      );
      res.json(result);
    } catch (error) {
      console.error('Error syncing roles:', error);
      res.status(400).json({ error: error.message });
    }
  }

  async getUserRoles(req, res) {
    try {
      const { userId } = req.params;

      const roles = await userRoleService.getUserRoles(parseInt(userId));
      res.json(roles);
    } catch (error) {
      console.error('Error getting user roles:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async getUserPermissions(req, res) {
    try {
      const { userId } = req.params;

      const permissions = await userRoleService.getUserPermissions(parseInt(userId));
      res.json(permissions);
    } catch (error) {
      console.error('Error getting user permissions:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async assignPermission(req, res) {
    try {
      const { userId } = req.params;
      const { permissionId } = req.body;

      const result = await userRoleService.assignPermission(parseInt(userId), parseInt(permissionId));
      res.json({
        success: true,
        ...result
      });
    } catch (error) {
      console.error('Error assigning permission:', error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async removePermission(req, res) {
    try {
      const { userId, permissionId } = req.params;

      const result = await userRoleService.removePermission(parseInt(userId), parseInt(permissionId));
      res.json({
        success: true,
        ...result
      });
    } catch (error) {
      console.error('Error removing permission:', error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
}

export default new UserRoleController();
