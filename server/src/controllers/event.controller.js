import Event from "../models/event.model.js";
import User from "../models/user.model.js";
import ChatService from "../services/chat.service.js";

// Create a new event
export const createEvent = async (req, res) => {
  try {
    const { title, date, location, image, description } = req.body;
    const userId = req.user.id;

    if (!title || !date || !location) {
      return res.status(400).json({ message: "Title, date, and location are required" });
    }

    const event = new Event({
      title,
      date: new Date(date),
      location,
      image: image || "",
      description: description || "",
      createdBy: userId
    });

    await event.save();

    const populatedEvent = await Event.findById(event._id)
      .populate('createdBy', 'username email profilePicture')
      .populate('invitedUsers', 'username email profilePicture');

    res.status(201).json({
      message: "Event created successfully",
      event: populatedEvent
    });
  } catch (error) {
    console.error("Create event error:", error);
    res.status(500).json({ message: "Error creating event", error: error.message });
  }
};

// Get all events for a user (created or invited to)
export const getUserEvents = async (req, res) => {
  try {
    const userId = req.user.id;

    const events = await Event.find({
      $or: [
        { createdBy: userId },
        { invitedUsers: userId }
      ],
      isActive: true
    })
      .populate('createdBy', 'username email profilePicture')
      .populate('invitedUsers', 'username email profilePicture')
      .sort({ date: -1 });

    res.status(200).json({ events });
  } catch (error) {
    console.error("Get user events error:", error);
    res.status(500).json({ message: "Error fetching events", error: error.message });
  }
};

// Get a single event by ID
export const getEventById = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user.id;

    const event = await Event.findById(eventId)
      .populate('createdBy', 'username email profilePicture')
      .populate('invitedUsers', 'username email profilePicture');

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check if user has access to this event
    const hasAccess = event.createdBy._id.toString() === userId ||
                      event.invitedUsers.some(user => user._id.toString() === userId);

    if (!hasAccess) {
      return res.status(403).json({ message: "You don't have access to this event" });
    }

    res.status(200).json({ event });
  } catch (error) {
    console.error("Get event error:", error);
    res.status(500).json({ message: "Error fetching event", error: error.message });
  }
};

// Get event by share token
export const getEventByShareToken = async (req, res) => {
  try {
    const { shareToken } = req.params;

    const event = await Event.findOne({ shareToken, isActive: true })
      .populate('createdBy', 'username email profilePicture')
      .populate('invitedUsers', 'username email profilePicture');

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json({ event });
  } catch (error) {
    console.error("Get event by token error:", error);
    res.status(500).json({ message: "Error fetching event", error: error.message });
  }
};

// Update an event
export const updateEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { title, date, location, image, description } = req.body;
    const userId = req.user.id;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Only the creator can update the event
    if (event.createdBy.toString() !== userId) {
      return res.status(403).json({ message: "You don't have permission to update this event" });
    }

    // Update fields
    if (title) event.title = title;
    if (date) event.date = new Date(date);
    if (location) event.location = location;
    if (image !== undefined) event.image = image;
    if (description !== undefined) event.description = description;

    await event.save();

    const updatedEvent = await Event.findById(eventId)
      .populate('createdBy', 'username email profilePicture')
      .populate('invitedUsers', 'username email profilePicture');

    res.status(200).json({
      message: "Event updated successfully",
      event: updatedEvent
    });
  } catch (error) {
    console.error("Update event error:", error);
    res.status(500).json({ message: "Error updating event", error: error.message });
  }
};

// Delete an event
export const deleteEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user.id;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Only the creator can delete the event
    if (event.createdBy.toString() !== userId) {
      return res.status(403).json({ message: "You don't have permission to delete this event" });
    }

    event.isActive = false;
    await event.save();

    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Delete event error:", error);
    res.status(500).json({ message: "Error deleting event", error: error.message });
  }
};

// Invite user to event by username
export const inviteUserByUsername = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { username } = req.body;
    const userId = req.user.id;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Only the creator can invite users
    if (event.createdBy.toString() !== userId) {
      return res.status(403).json({ message: "You don't have permission to invite users to this event" });
    }

    // Find user by username
    const userToInvite = await User.findOne({ username });

    if (!userToInvite) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user is already invited
    if (event.invitedUsers.includes(userToInvite._id)) {
      return res.status(400).json({ message: "User already invited" });
    }

    // Check if user is the creator
    if (event.createdBy.toString() === userToInvite._id.toString()) {
      return res.status(400).json({ message: "Cannot invite the event creator" });
    }

    event.invitedUsers.push(userToInvite._id);
    await event.save();

    const updatedEvent = await Event.findById(eventId)
      .populate('createdBy', 'username email profilePicture')
      .populate('invitedUsers', 'username email profilePicture');

    // Send event invitation notification via chat
    try {
      // Get or create direct chat between inviter and invitee
      const chat = await ChatService.getOrCreateDirectChat(userId, userToInvite._id.toString());

      // Format the event date
      const eventDate = new Date(event.date);
      const formattedDate = eventDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      // Send event invitation message
      await ChatService.sendMessage(chat._id, userId, {
        type: 'event',
        content: `📅 You've been invited to "${event.title}"\n📍 ${event.location}\n🕐 ${formattedDate}`,
        eventId: event._id
      });
    } catch (chatError) {
      console.error("Error sending chat notification:", chatError);
      // Don't fail the invitation if chat notification fails
    }

    res.status(200).json({
      message: "User invited successfully",
      event: updatedEvent
    });
  } catch (error) {
    console.error("Invite user error:", error);
    res.status(500).json({ message: "Error inviting user", error: error.message });
  }
};

// Join event via share link
export const joinEventByShareLink = async (req, res) => {
  try {
    const { shareToken } = req.params;
    const userId = req.user.id;

    const event = await Event.findOne({ shareToken, isActive: true });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check if user is already invited or is the creator
    if (event.createdBy.toString() === userId) {
      return res.status(400).json({ message: "You are the creator of this event" });
    }

    if (event.invitedUsers.includes(userId)) {
      return res.status(400).json({ message: "You are already invited to this event" });
    }

    event.invitedUsers.push(userId);
    await event.save();

    const updatedEvent = await Event.findById(event._id)
      .populate('createdBy', 'username email profilePicture')
      .populate('invitedUsers', 'username email profilePicture');

    res.status(200).json({
      message: "Successfully joined the event",
      event: updatedEvent
    });
  } catch (error) {
    console.error("Join event error:", error);
    res.status(500).json({ message: "Error joining event", error: error.message });
  }
};
