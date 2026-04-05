import mongoose from "mongoose";
import Record from "../models/record.js";

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

const validateRecord = (data) => {
  const errors = [];

  if (data.amount !== undefined) {
    if (typeof data.amount !== "number") {
      errors.push("Amount must be a number");
    } else if (data.amount <= 0) {
      errors.push("Amount must be greater than 0");
    }
  }

  if (data.type !== undefined) {
    if (!["income", "expense"].includes(data.type)) {
      errors.push("Type must be either 'income' or 'expense'");
    }
  }

  if (data.category !== undefined) {
    if (typeof data.category !== "string") {
      errors.push("Category must be a string");
    } else if (data.category.trim().length === 0) {
      errors.push("Category cannot be empty");
    }
  }

  if (data.date !== undefined) {
    const dateObj = new Date(data.date);
    if (isNaN(dateObj.getTime())) {
      errors.push("Invalid date format");
    }
  }

  if (data.note !== undefined) {
    if (typeof data.note !== "string") {
      errors.push("Note must be a string");
    }
  }

  return errors;
};

export const createRecord = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "Request body cannot be empty" });
    }

    if (!req.body.amount || !req.body.type || !req.body.category) {
      return res.status(400).json({
        message: "Amount, type, and category are required"
      });
    }

    const errors = validateRecord(req.body);
    if (errors.length > 0) {
      return res.status(400).json({
        message: "Validation failed",
        errors
      });
    }

    const record = await Record.create({
      amount: req.body.amount,
      type: req.body.type,
      category: req.body.category.trim(),
      note: req.body.note || "",
      date: req.body.date || new Date(),
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
    if (!["admin", "analyst"].includes(req.user.role)) {
      return res.status(403).json({
        message: "Access denied - only admin and analyst can view records"
      });
    }

    const { type, category, startDate, endDate } = req.query;

    const filter = {};

    if (type) {
      filter.type = type;
    }

    if (category) {
      filter.category = category;
    }
    if (startDate || endDate) {
      filter.date = {};

      if (startDate) {
        filter.date.$gte = new Date(startDate);
      }

      if (endDate) {
        filter.date.$lte = new Date(endDate);
      }
    }

    const records = await Record.find(filter)
      .populate("createdBy", "name email")
      .sort({ date: -1 });

    res.status(200).json({
      message: "Records retrieved successfully",
      count: records.length,
      records
    });

  } catch (error) {
    console.error("Error fetching records:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteRecord = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid record ID format" });
    }

    const record = await Record.findById(id);

    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }

    if (
      record.createdBy.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized to delete this record" });
    }

    await Record.findByIdAndDelete(id);

    res.status(200).json({ message: "Record deleted successfully" });
  } catch (error) {
    console.error("Error deleting record:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const patchRecord = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid record ID format" });
    }

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "Request body cannot be empty" });
    }

    const errors = validateRecord(req.body);
    if (errors.length > 0) {
      return res.status(400).json({
        message: "Validation failed",
        errors
      });
    }

    const record = await Record.findById(id);

    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }

    if (
      record.createdBy.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized to update this record" });
    }

    const allowedFields = ["amount", "type", "category", "note", "date"];
    const updates = {};

    for (let key of allowedFields) {
      if (req.body[key] !== undefined) {
        updates[key] = key === "category" ? req.body[key].trim() : req.body[key];
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