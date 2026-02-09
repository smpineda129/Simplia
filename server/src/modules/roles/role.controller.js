import roleService from './role.service.js';

class RoleController {
  async getAllRoles(req, res) {
    try {
      let { companyId } = req.user;

      // Allow override ONLY if user is global (no companyId)
      if (!companyId && req.query.companyId) {
        companyId = req.query.companyId;
      }

      const result = await roleService.getAllRoles(companyId, req.query);
      res.json(result);
    } catch (error) {
      console.error('Error fetching roles:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async getRoleById(req, res) {
    try {
      const role = await roleService.getRoleById(req.params.id);
      res.json(role);
    } catch (error) {
      console.error('Error fetching role:', error);
      res.status(404).json({ error: error.message });
    }
  }

  async createRole(req, res) {
    try {
      const { companyId } = req.user;
      const roleData = { ...req.body, companyId };
      const role = await roleService.createRole(roleData);
      res.status(201).json(role);
    } catch (error) {
      console.error('Error creating role:', error);
      res.status(400).json({ error: error.message });
    }
  }

  async updateRole(req, res) {
    try {
      const role = await roleService.updateRole(req.params.id, req.body);
      res.json(role);
    } catch (error) {
      console.error('Error updating role:', error);
      res.status(400).json({ error: error.message });
    }
  }

  async deleteRole(req, res) {
    try {
      const result = await roleService.deleteRole(req.params.id);
      res.json(result);
    } catch (error) {
      console.error('Error deleting role:', error);
      res.status(400).json({ error: error.message });
    }
  }

  async getRolePermissions(req, res) {
    try {
      const permissions = await roleService.getRolePermissions(req.params.id);
      res.json(permissions);
    } catch (error) {
      console.error('Error fetching role permissions:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async syncRolePermissions(req, res) {
    try {
      const { permissionIds } = req.body;
      const permissions = await roleService.syncRolePermissions(req.params.id, permissionIds);
      res.json(permissions);
    } catch (error) {
      console.error('Error syncing role permissions:', error);
      res.status(400).json({ error: error.message });
    }
  }
}

export default new RoleController();
