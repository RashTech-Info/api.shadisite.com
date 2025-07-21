const siteModel = require("../../model/siteToggle");

exports.getSiteToggle = async (req, res) => {
  try {
    const siteToggle = await siteModel.findOne({});
    res.status(200).json({ siteToggle });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateSiteToggle = async (req, res) => {
  try {
    const { toggle } = req.body;
    const siteToggle = await siteModel.findOneAndUpdate(
      {},
      { toggle },
      { new: true, upsert: true }
    );
    res.status(200).json({ siteToggle });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
