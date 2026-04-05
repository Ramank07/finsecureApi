import Record from "../models/record.js";

export const getSummary = async (req, res) => {
  try {
    // total income
    const income = await Record.aggregate([
      { $match: { type: "income" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    // total expense
    const expense = await Record.aggregate([
      { $match: { type: "expense" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    // 🔥 category-wise expense
    const categoryWise = await Record.aggregate([
      { $match: { type: "expense" } },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
        },
      },
    ]);

    const totalIncome = income[0]?.total || 0;
    const totalExpense = expense[0]?.total || 0;

    res.status(200).json({
      message: "Summary retrieved successfully",
      data: {
        totalIncome,
        totalExpense,
        netBalance: totalIncome - totalExpense,
        categoryWiseExpense: categoryWise,
      }
    });
  } catch (error) {
    console.error("Error fetching summary:", error);
    res.status(500).json({ message: "Server error" });
  }
};