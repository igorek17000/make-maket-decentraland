import { Spin, Row, Col, Typography } from "antd";
import { formatNumber } from "./App";
import Donut from "./Donut";
export default function Metric({ metric, data }: any) {
  if (!metric || !data) {
    return <Spin />;
  }
  const {
    balanceHecta,
    balanceBusd,
    price,
    busdBalanceInPool,
    hectaBalanceInPool,
  } = data;
  const hectaFloating =
    Number(metric.hecta.user) +
    Number(metric.gHecta.user) * (Number(metric.currentIndex) / 10 ** 9);
  const a = Number(busdBalanceInPool);
  const x = Number(hectaBalanceInPool);
  const m = Number(balanceBusd);
  const n = Number(balanceHecta);
  const priceWhenFloating = (a * x) / (hectaFloating + x) ** 2;
  const totalHecta =
    Number(metric.hecta.mm) +
    Number(metric.hecta.staking) +
    Number(metric.hecta.pool) +
    Number(metric.hecta.user);
  const totalGhecta =
    Number(metric.gHecta.bd) +
    Number(metric.gHecta.staking) +
    Number(metric.gHecta.mm);
  return (
    <div>
      <Row justify="center" align="middle" gutter={32}>
        <Col xs={8} style={{ textAlign: "center" }}>
          <Typography.Title level={3}>Hecta</Typography.Title>

          <Donut data={metric.hecta} />
          <Typography>
            MM: {formatNumber((Number(metric.hecta.mm) / totalHecta) * 100)} %
          </Typography>
          <Typography>
            Staking:{" "}
            {formatNumber((Number(metric.hecta.staking) / totalHecta) * 100)} %
          </Typography>
          <Typography>
            Pool: {formatNumber((Number(metric.hecta.pool) / totalHecta) * 100)}{" "}
            %
          </Typography>
          <Typography>
            User :{" "}
            {formatNumber((Number(metric.hecta.user) / totalHecta) * 100)} %
          </Typography>
        </Col>

        <Col xs={8} style={{ textAlign: "center" }}>
          <Typography.Title level={3}>Ghecta</Typography.Title>
          <Donut data={metric.gHecta} />
          <Typography>
            Bond Deposit:{" "}
            {formatNumber((Number(metric.gHecta.bd) / totalGhecta) * 100)} %
          </Typography>

          <Typography>
            Staking:{" "}
            {formatNumber((Number(metric.gHecta.staking) / totalGhecta) * 100)}{" "}
            %
          </Typography>
          <Typography>
            MM : {formatNumber((Number(metric.gHecta.mm) / totalGhecta) * 100)}{" "}
            %
          </Typography>
          <Typography>
            User :{" "}
            {formatNumber((Number(metric.gHecta.user) / totalGhecta) * 100)} %
          </Typography>
        </Col>
        <Col>
          {priceWhenFloating && (
            <Typography>
              Khi user xả <b>{formatNumber(hectaFloating)}</b> Hecta
              <i style={{ color: "gray" }}>
                (<b> {formatNumber(metric.hecta.user)}</b> HECTA và{" "}
                <b>{formatNumber(metric.gHecta.user)}</b> Ghecta với
                currentIndex bằng
                <b> {formatNumber(metric.currentIndex / 1e9)}</b> )
              </i>{" "}
              thì giá về :<b> {formatNumber(priceWhenFloating)}</b>
            </Typography>
          )}
        </Col>
      </Row>
      {/* {metric.currentIndex} */}
    </div>
  );
}
