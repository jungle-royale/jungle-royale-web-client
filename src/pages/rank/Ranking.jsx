import { useEffect, useState } from "react";
import { fetchRank } from "../../api";
import tierImages from "../../utils/TierImages";
import LoadingSpinner from "../../components/LoadingSpinner";
import log from "loglevel";

const Ranking = () => {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadRank = async () => {
    try {
      const data = await fetchRank();
      setRankings(data);
    } catch (error) {
      log.error("Failed to fetch rankings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRank();
  }, []);

  return (
    <div className="container pt-16 mx-auto px-4 py-6">
      <h1 className="text-2xl text-white font-bold text-center mb-6">Top 50 Rankings</h1>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="overflow-x-auto ">
          <table className="table-auto w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 border border-gray-200">Rank</th>
                <th className="px-4 py-2 border border-gray-200">Name</th>
                <th className="px-4 py-2 border border-gray-200">Score</th>
              </tr>
            </thead>
            <tbody>
              {rankings.map((rank, index) => (
                <tr key={index} className={`text-center ${index % 2 === 0 ? "bg-white bg-opacity-80" : "bg-gray-50 bg-opacity-80"}`}>
                  <td className={`px-4 py-2 border border-gray-200 ${index < 3 ? "rank-highlight" : ""}`}>{index + 1}</td>
                  <td className={`px-4 py-2 border border-gray-200 flex items-center justify-center ${index < 3 ? "rank-highlight" : ""}`}>
                    <span className="mr-2">{rank.username}</span>
                    {rank.tier && (
                      <img
                        src={tierImages[rank.tier] || "/assets/bronze.png"} // 티어에 따른 이미지 표시
                        alt={`${rank.tier} Tier`}
                        className="w-6 h-6"
                        title={`Tier: ${rank.tier}`}
                      />
                    )}
                  </td>
                  <td className={`px-4 py-2 border border-gray-200 ${index < 3 ? "rank-highlight" : ""}`}>{rank.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Ranking;
