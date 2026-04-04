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