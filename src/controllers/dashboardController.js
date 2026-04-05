import Record from "../models/record.js";

export const getSummary = async (req, res) => {
  try {
    const income = await Record.aggregate([
      { $match: { type: "income" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const expense = await Record.aggregate([
      { $match: { type: "expense" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const categoryWise = await Record.aggregate([
  {
    $group: {
      _id: "$category",
      total: { $sum: "$amount" },
    },
  },
]);
    const recentActivity = await Record.find()
      .sort({ date: -1 }) 
      .limit(5)
      .populate("createdBy", "name email");

    const totalIncome = income[0]?.total || 0;
    const totalExpense = expense[0]?.total || 0;

    res.status(200).json({
      message: "Summary retrieved successfully",
      data: {
        totalIncome,
        totalExpense,
        netBalance: totalIncome - totalExpense,
        categoryWiseExpense: categoryWise,
        recentActivity
      }
    });
  } catch (error) {
    console.error("Error fetching summary:", error);
    res.status(500).json({ message: "Server error" });
  }
};