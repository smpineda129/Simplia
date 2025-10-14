import { reportsService } from './reports.service.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

export const reportsController = {
  getSummary: asyncHandler(async (req, res) => {
    const summary = await reportsService.getSummary();

    res.status(200).json({
      success: true,
      data: summary,
    });
  }),

  getUsersReport: asyncHandler(async (req, res) => {
    const report = await reportsService.getUsersReport();

    res.status(200).json({
      success: true,
      data: report,
    });
  }),

  getInventoryReport: asyncHandler(async (req, res) => {
    const report = await reportsService.getInventoryReport();

    res.status(200).json({
      success: true,
      data: report,
    });
  }),
};
