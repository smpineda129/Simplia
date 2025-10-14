import permissionService from './permission.service.js';

class PermissionController {
  async getAllPermissions(req, res) {
    try {
      const result = await permissionService.getAllPermissions(req.query);
      res.json(result);
    } catch (error) {
      console.error('Error fetching permissions:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async getPermissionById(req, res) {
    try {
      const permission = await permissionService.getPermissionById(req.params.id);
      res.json(permission);
    } catch (error) {
      console.error('Error fetching permission:', error);
      res.status(404).json({ error: error.message });
    }
  }

  async createPermission(req, res) {
    try {
      const permission = await permissionService.createPermission(req.body);
      res.status(201).json(permission);
    } catch (error) {
      console.error('Error creating permission:', error);
      res.status(400).json({ error: error.message });
    }
  }

  async updatePermission(req, res) {
    try {
      const permission = await permissionService.updatePermission(req.params.id, req.body);
      res.json(permission);
    } catch (error) {
      console.error('Error updating permission:', error);
      res.status(400).json({ error: error.message });
    }
  }

  async deletePermission(req, res) {
    try {
      const result = await permissionService.deletePermission(req.params.id);
      res.json(result);
    } catch (error) {
      console.error('Error deleting permission:', error);
      res.status(400).json({ error: error.message });
    }
  }

  async getPermissionRoles(req, res) {
    try {
      const roles = await permissionService.getPermissionRoles(req.params.id);
      res.json(roles);
    } catch (error) {
      console.error('Error fetching permission roles:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async getGroupedPermissions(req, res) {
    try {
      const grouped = await permissionService.getGroupedPermissions();
      res.json(grouped);
    } catch (error) {
      console.error('Error fetching grouped permissions:', error);
      res.status(500).json({ error: error.message });
    }
  }
}

export default new PermissionController();
