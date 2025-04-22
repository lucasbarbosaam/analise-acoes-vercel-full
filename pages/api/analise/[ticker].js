export default async function handler(req, res) {
  const { ticker } = req.query;
  const API_KEY = "cce595effe8b28f6a4cd6f2b490d441a";

  const profileUrl = `https://financialmodelingprep.com/api/v3/profile/${ticker}?apikey=${API_KEY}`;
  const ratiosUrl = `https://financialmodelingprep.com/api/v3/ratios-ttm/${ticker}?apikey=${API_KEY}`;

  try {
    const [profileRes, ratiosRes] = await Promise.all([
      fetch(profileUrl),
      fetch(ratiosUrl),
    ]);

    const profileData = await profileRes.json();
    const ratiosData = await ratiosRes.json();

    if (!profileData[0] || !ratiosData[0]) {
      return res.status(404).json({ erro: "Ação não encontrada ou erro na API" });
    }

    const pl = ratiosData[0].peRatioTTM;
    const roe = ratiosData[0].returnOnEquityTTM;
    const dy = profileData[0].lastDiv && profileData[0].price
      ? (profileData[0].lastDiv / profileData[0].price) * 100
      : null;

    const resultados = {
      "1": pl !== undefined && pl < 10 ? "Aprovado" : "Reprovado",
      "4": roe !== undefined && roe > 10 ? "Aprovado" : "Reprovado",
      "6": dy !== undefined && dy > 5 ? "Aprovado" : "Reprovado",
    };

    const historico = {
      "1": pl ? Array(5).fill(pl) : [],
      "4": roe ? Array(5).fill(roe) : [],
      "6": dy ? Array(5).fill(dy) : [],
    };

    res.status(200).json({ resultados, historico });
  } catch (error) {
    res.status(500).json({ erro: "Erro ao buscar dados" });
  }
}
