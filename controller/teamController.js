import TeamMember from '../models/teamModel.js';

export const getAllTeamMembers = async (req, res) => {
  try {
    const teamMembers = await TeamMember.find({ isActive: true }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: teamMembers,
    });
  } catch (error) {
    console.error('Get team members error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch team members',
    });
  }
};

export const createTeamMember = async (req, res) => {
  try {
    const { name, role, email, phone, image, bio, socialLinks } = req.body;

    const teamMember = new TeamMember({
      name,
      role,
      email,
      phone,
      image,
      bio,
      socialLinks,
    });

    await teamMember.save();

    res.status(201).json({
      success: true,
      data: teamMember,
    });
  } catch (error) {
    console.error('Create team member error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create team member',
    });
  }
};

export const updateTeamMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role, email, phone, image, bio, socialLinks } = req.body;

    const teamMember = await TeamMember.findByIdAndUpdate(
      id,
      { name, role, email, phone, image, bio, socialLinks },
      { new: true, runValidators: true }
    );

    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found',
      });
    }

    res.status(200).json({
      success: true,
      data: teamMember,
    });
  } catch (error) {
    console.error('Update team member error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update team member',
    });
  }
};

export const deleteTeamMember = async (req, res) => {
  try {
    const { id } = req.params;

    const teamMember = await TeamMember.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Team member deleted successfully',
    });
  } catch (error) {
    console.error('Delete team member error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete team member',
    });
  }
};

export const getTeamMember = async (req, res) => {
  try {
    const { id } = req.params;

    const teamMember = await TeamMember.findById(id);

    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found',
      });
    }

    res.status(200).json({
      success: true,
      data: teamMember,
    });
  } catch (error) {
    console.error('Get team member error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch team member',
    });
  }
};