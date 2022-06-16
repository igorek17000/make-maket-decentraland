import { useEffect, useState } from "react";
import axios from "axios";
import { Spin } from "antd";
import { Vertical } from "./Vertical";
import moment from "moment";
//
export default function Volumn() {
  const [metricVolumn, setMetricVolumn] = useState<any[]>([]);
  const fetchData = async () => {
    const rawData = await axios
      .post(
        "https://api.thegraph.com/subgraphs/name/ianlapham/uniswap-v3-subgraph",
        {
          query: `
            {
                uniswapDayDatas(
                    first: 1000
                    skip: 0
                    subgraphError: allow
                    where: {date_gt: 1619170975}
                    orderBy: date
                    orderDirection: asc
                  ) {
                    id
                    date
                    volumeUSD
                    tvlUSD
                    __typename
                  }
            }
          
          `,
        }
      )
      .then((res) => res.data);

    const data = rawData.data;

    setMetricVolumn(data.uniswapDayDatas);
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div>
      {metricVolumn.length > 0 ? (
        <Vertical
          title="Volume OHM-DAI"
          data={metricVolumn.map((item) => Number(item.volumeUSD))}
          labels={metricVolumn.map((metric) => {
            return moment(metric.date * 1000).format("DD/MM/YYYY");
          })}
        />
      ) : (
        <Spin />
      )}
    </div>
  );
}
