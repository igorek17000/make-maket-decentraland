import { Spin, Row, Col, Typography } from "antd";
import Donut from "./Donut";
export default function Metric({ metric }: any) {
  if (!metric) {
    return <Spin />;
  }

  return (
    <div>
      <Row justify="center" align="middle">
        <Col xs={8}>
          <Typography>Hecta</Typography>
          <Donut data={metric.hecta} />
        </Col>
        {/* <Col xs={8}>
          <Typography>SHecta</Typography>
          <Donut data={metric.sHecta} />
        </Col> */}
        <Col xs={8}>
          <Typography>Ghecta</Typography>
          <Donut data={metric.gHecta} />
        </Col>
      </Row>
      {metric.currentIndex}
      <Typography>Floating: {/* {} */}</Typography>
    </div>
  );
}
