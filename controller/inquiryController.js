import Inquiry from "../models/inquiryModel.js";
import asyncHandler from "express-async-handler";

/**
 * @desc    Create a new inquiry
 * @route   POST /api/inquiry
 * @access  Public
 */
export const createInquiry = asyncHandler(async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  // Simple validation
  if (!name || !email || !subject || !message) {
    res.status(400);
    throw new Error("Please fill all required fields");
  }

  const inquiry = await Inquiry.create({
    name,
    email,
    phone,
    subject,
    message,
  });

  res.status(201).json({
    success: true,
    message: "Inquiry submitted successfully",
    inquiry,
  });
});

/**
 * @desc    Get all inquiries (Admin only)
 * @route   GET /api/admin/inquiries
 * @access  Private/Admin
 */
export const getAllInquiries = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    status = "",
    startDate,
    endDate,
  } = req.query;

  // Build filter object
  const filter = {};

  // Search by name, email, or subject
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { subject: { $regex: search, $options: "i" } },
    ];
  }

  // Filter by status
  if (status && ["Pending", "In Progress", "Resolved"].includes(status)) {
    filter.status = status;
  }

  // Filter by date range
  if (startDate || endDate) {
    filter.createdAt = {};
    if (startDate) filter.createdAt.$gte = new Date(startDate);
    if (endDate) filter.createdAt.$lte = new Date(endDate);
  }

  // Calculate skip value for pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Get inquiries with pagination
  const [inquiries, total] = await Promise.all([
    Inquiry.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit)),
    Inquiry.countDocuments(filter),
  ]);

  res.json({
    success: true,
    inquiries,
    pagination: {
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      limit: parseInt(limit),
    },
  });
});

/**
 * @desc    Get single inquiry (Admin only)
 * @route   GET /api/admin/inquiries/:id
 * @access  Private/Admin
 */
export const getInquiryById = asyncHandler(async (req, res) => {
  const inquiry = await Inquiry.findById(req.params.id);

  if (!inquiry) {
    res.status(404);
    throw new Error("Inquiry not found");
  }

  res.json({
    success: true,
    inquiry,
  });
});

/**
 * @desc    Update inquiry status (Admin only)
 * @route   PUT /api/admin/inquiries/:id/status
 * @access  Private/Admin
 */
export const updateInquiryStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  // Validate status
  if (!["Pending", "In Progress", "Resolved"].includes(status)) {
    res.status(400);
    throw new Error("Invalid status provided");
  }

  const inquiry = await Inquiry.findById(req.params.id);

  if (!inquiry) {
    res.status(404);
    throw new Error("Inquiry not found");
  }

  // Update status
  inquiry.status = status;
  const updatedInquiry = await inquiry.save();

  res.json({
    success: true,
    message: "Inquiry status updated successfully",
    inquiry: updatedInquiry,
  });
});

/**
 * @desc    Delete inquiry (Admin only)
 * @route   DELETE /api/admin/inquiries/:id
 * @access  Private/Admin
 */
export const deleteInquiry = asyncHandler(async (req, res) => {
  const inquiry = await Inquiry.findById(req.params.id);

  if (!inquiry) {
    res.status(404);
    throw new Error("Inquiry not found");
  }

  await inquiry.remove();

  res.json({
    success: true,
    message: "Inquiry deleted successfully",
  });
});