import Record from "../models/record.js";

export const createRecord = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "Request body cannot be empty" });
    }

    const record = await Record.create({
      ...req.body,
      createdBy: req.user.id,
    });
    res.status(201).json({
      message: "Record created successfully",
      record
    });
  } catch (error) {
    console.error("Error creating record:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getRecords = async (req, res) => {
  try {
    const records = await Record.find();
    res.status(200).json({
      message: "Records retrieved successfully",
      records
    });
  } catch (error) {
    console.error("Error fetching records:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteRecord = async (req, res) => {
  try {
    const record = await Record.findByIdAndDelete(req.params.id);
    
    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }

    res.status(200).json({ message: "Record deleted successfully" });
  } catch (error) {
    console.error("Error deleting record:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const patchRecord = async (req, res) => {
  try {
    const { id } = req.params;

    const record = await Record.findById(id);

    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }

    if (
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const allowedFields = ["amount", "type", "category", "note", "date"];
    const updates = {};

    for (let key of allowedFields) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    const updatedRecord = await Record.findByIdAndUpdate(
      id,
      updates,
      { new: true }
    );

    res.status(200).json({
      message: "Record updated successfully",
      record: updatedRecord
    });
  } catch (error) {
    console.error("Error updating record:", error);
    res.status(500).json({ message: "Server error" });
  }
};