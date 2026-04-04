import Record from "../models/record.js";

export const createRecord = async (req, res) => {
  const record = await Record.create({
    ...req.body,
    createdBy: req.user.id,
  });
  res.json(record);
};

export const getRecords = async (req, res) => {
  const records = await Record.find();
  res.json(records);
};

export const deleteRecord = async (req, res) => {
  await Record.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};


export const patchRecord = async (req, res) => {
  const { id } = req.params;

  const record = await Record.findById(id);

  if (!record) {
    return res.status(404).json({ message: "Record not found" });
  }

  if (
    record.createdBy.toString() !== req.user.id &&
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

  res.json(updatedRecord);
};